const test = require("ava");
const Template = require(".");

const styles = {
	javascript: new Template({ prefix: "${", suffix: "}" }),
	mustache: new Template({ prefix: "{{", suffix: "}}" }),
	windows: new Template({ prefix: "%", suffix: "%" }),
};

for (const [style, template] of Object.entries(styles)) {
	const { prefix, suffix } = template;
	const place = (name) => `${prefix}${name}${suffix}`;

	const testRender = (t, input, output, options) => {
		// uncompiled version
		t.is(output, template.render(input, options));

		// compiled version
		const compiled = template.compile(input);
		t.is(output, compiled(options));
	};

	const description = `a ${style} style template`;

	test(`${description} that is a regular string will render unchanged`, (t) => {
		const regular = "this is just a regular string";

		testRender(t, regular, regular, { bogus: true });
	});

	test(`${description} will render unchanged if no options are passed`, (t) => {
		const input = `Hello, ${place("name")}!`;

		testRender(t, input, input);
	});

	test(`${description} will render unchanged if options don't match placeholders`, (t) => {
		const input = `Hello, ${place("name")}!`;

		testRender(t, input, input, { bogus: true });
	});

	test(`${description} will treat null and undefined as missing`, (t) => {
		const input = `Hello, ${place("name")}!`;

		for (const value of [null, undefined]) {
			testRender(t, input, input, { name: value });
		}
	});

	test(`${description} will substitute multiple placeholders`, (t) => {
		const name = "Jane";
		const color = "maroon";
		const input = `Hello, ${place("name")}! My favorite color is ${place("color")}.`;
		const output = `Hello, ${name}! My favorite color is ${color}.`;

		testRender(t, input, output, { name, color });
	});

	test(`${description} will only substitute placeholders that exist in options`, (t) => {
		const name = "Jane";
		const input = `Hello, ${place("name")}! My favorite color is ${place("color")}.`;
		const output = `Hello, ${name}! My favorite color is ${place("color")}.`;

		testRender(t, input, output, { name });
	});

	test(`${description} will substitute multiple occurrences of a placeholder`, (t) => {
		const name = "John";
		const input = `Hello, ${place("name")}! Your name is ${place("name")}.`;
		const output = `Hello, ${name}! Your name is ${name}.`;

		testRender(t, input, output, { name });
	});

	test(`${description} with default values will use those if missing from options`, (t) => {
		const name = "dude";
		const color = "cyan";
		const input = `Hello, ${place(`name=${name}`)}! My favorite color is ${place("color")}.`;
		const output = `Hello, ${name}! My favorite color is ${color}.`;

		testRender(t, input, output, { color });
	});

	test(`${description} with default values will not use those if present in options`, (t) => {
		const name = "Jane";
		const color = "cyan";
		const input = `Hello, ${place(`name=dude`)}! My favorite color is ${place("color")}.`;
		const output = `Hello, ${name}! My favorite color is ${color}.`;

		testRender(t, input, output, { name, color });
	});
}
