// Regular expression to find characters that are special to regular expressions.
const special = new RegExp(String.raw`[\[\\\^\$\.\|\?\*\+\(\)]`, "g");

// Function to escape said special characters for use in a regular expression.

function escape(string) {
	return string.replace(special, (match) => `\\${match}`);
}

function coalesce(...values) {
	return values.find(isDefined);
}

function isDefined(value) {
	return value !== null && typeof value !== "undefined";
}

class Template {
	constructor({ prefix, suffix }) {
		this.prefix = prefix;
		this.suffix = suffix;

		// Regular expression to find placeholders in template strings.
		this.placeholder = new RegExp(`(${escape(prefix)}.*?${escape(suffix)})`);
	}

	compile(text) {
		// Turn the template string into an array of placeholders and everything else.
		// A template string like: "Hello, ${name}! How are you?"
		// Will produce: ["Hello, ", "${name}", "! How are you?"];
		const tokens = text.split(this.placeholder);

		// This will map placeholder names to indexes in array above.
		// The above template string will produce a single entry that maps "name" to 1.
		const indexes = new Map();

		const defaults = new Map();

		for (let index = 0; index < tokens.length; index++) {
			const token = tokens[index];

			if (token.startsWith(this.prefix) && token.endsWith(this.suffix)) {
				const place = token.slice(this.prefix.length, token.length - this.suffix.length).trim();

				const [key, value] = place.split("=");

				if (key) {
					if (!indexes.has(key)) indexes.set(key, []);
					indexes.get(key).push(index);
				}

				if (isDefined(value)) defaults.set(key, value);
			}
		}

		// If the template string had no placeholders, then it's not necessary to do any work.
		if (indexes.size === 0) return () => text;

		return (options = {}) => {
			const parts = tokens.slice();

			for (const key of indexes.keys()) {
				const value = coalesce(options[key], defaults.get(key));

				if (isDefined(value)) {
					for (const index of indexes.get(key)) {
						parts[index] = value;
					}
				}
			}

			return parts.join("");
		};
	}

	render(text, options) {
		return this.compile(text)(options);
	}
}

module.exports = Template;
