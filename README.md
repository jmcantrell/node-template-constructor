# template-constructor

A generic class for rendering compiled (and uncompiled) template strings.

## Getting started

### Install

```bash
$ npm install template-constructor
```

### Example

```js
const Template = require("template-constructor");

const template = new Template({ prefix: "${", suffix: "}" });

const greeting = template.compile("Hello, ${name}!");

console.log(greeting({ name: "you" }));  // outputs: "Hello, you!"
```

## Behavior

For this section, `template` is assumed to have the following
definition:

```js
const template = new Template({ prefix: "${", suffix: "}" });
```

The `template` dialect above will render strings containing
placeholders that look like `${name}`:

```js
const size = template.compile("${width}x${height}");
console.log(size(800, 600)); // outputs: "800x600"
```

Template strings with no placeholders will compile to a function that
simply returns the string unchanged.

For example:

```js
const greeting = template.compile("Hello!");
```

Is equivalent to:

```js
const greeting = () => "Hello!";
```

As you might expect, multiple instances of the same placeholder will
all be replaced:

```js
const thrice = template.compile("${value} ${value} ${value}");
console.log(thrice({ value: "yeah!" })); // outputs: "yeah! yeah! yeah!"
```

When passing options to templates, any missing options will render
those placeholders unchanged:

```js
const greeting = template.compile("Hello, ${name}!");
console.log(greeting()); // outputs: "Hello, ${name}!"
```

Similarly, if any passed options don't have a corresponding
placeholder, they will be ignored:

```js
const greeting = template.compile("Hello, ${name}!");
console.log(greeting({ bogus: "foo" })); // outputs: "Hello, ${name}!"
```

You can give any placeholder a default value that will be used if no
value is provided:

```js
const greeting = template.compile("Hello, ${name=you}!");
console.log(greeting()); // outputs: "Hello, you!"
```

## API

### Creating a template dialect

```js
const template = new Template({ prefix, suffix });
```

The template constructor takes one argument that's expected to be an
object with two properties, `prefix` and `suffix`.

The `prefix` property should be a string that will be the left side of
a placeholder.

The `suffix` property should be a string that will be the right side
of a placeholder.

For example, passing an object like `{ prefix: "{", suffix: "}" }`
will mean that placeholders in the template strings will be expected
to look like `{whatever}`.

### Compiling a template string

```js
const compiled = template.compile(string);
```

Once a template dialect is created, the typical usage is compiling one
or more template strings, and using those compiled templates to
quickly render output many times over the life of your program.
Compiling a template string means that all the hard work involved is
only done once so that rendering is as quick as possible.

The returned compiled template is simply a function that accepts an
object expected to contain placeholder values.

### Rendering a template string without compilation

```js
const rendered = template.render(string, options);
```

If you're testing a template string or know that it will only be used
once, you can render a string directly, skipping the compile step.

For example, the following two pieces of code produce the same output
string:

```js
const greeting = template.compile("Hello, ${name}!");
console.log(greeting({ name: "you" }));
```

```js
console.log(template.render("Hello, ${name}!", { name: "you" }));
```

## Contributing

### Testing

```bash
$ npm test
```
