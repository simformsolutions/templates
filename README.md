# templates [![NPM version](https://badge.fury.io/js/templates.svg)](http://badge.fury.io/js/templates)  [![Build Status](https://travis-ci.org/jonschlinkert/templates.svg)](https://travis-ci.org/jonschlinkert/templates)  [![Coverage Status](https://img.shields.io/coveralls/jonschlinkert/templates.svg)](https://coveralls.io/r/jonschlinkert/templates)

> System for creating and managing template collections, and rendering templates with any node.js template engine. Can be used as the basis for creating a static site generator or blog framework.

**Features**

* create custom view collections using `app.create('foo')`
* register any template engine for rendering views
* register helpers
* partial support
* plugins and middleware

**Example**

This is just a very small glimpse at the `templates` API!

```js
var templates = require('templates');
var app = templates();

// create a collection
app.create('pages');

// add views to the collection
app.page('a.html', {content: 'this is <%= foo %>'});
app.page('b.html', {content: 'this is <%= bar %>'});
app.page('c.html', {content: 'this is <%= baz %>'});

app.pages.getView('a.html')
  .render({foo: 'home'}, function (err, view) {
    //=> 'this is home'
  });
```

## Table of contents

- [Install](#install)
- [Usage](#usage)
- [API](#api)
  * [Common](#common)
    + [.option](#option)
    + [.use](#use)
  * [Application](#application)
  * [Engines](#engines)
  * [Helpers](#helpers)
  * [View](#view)
    + [data](#data)
  * [Item](#item)
    + [data](#data)
  * [Collections](#collections)
    + [Data](#data)
  * [List](#list)
  * [Group](#group)
  * [Lookups](#lookups)
  * [Rendering](#rendering)
  * [Context](#context)
  * [Routes and middleware](#routes-and-middleware)
- [Related projects](#related-projects)
- [Running tests](#running-tests)
- [Code coverage](#code-coverage)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i templates --save
```

## Usage

```js
var templates = require('templates');
var app = templates();
```

## API

### Common

This section describes API features that are shared by all Templates classes.

#### .option

Set or get an option value.

**Params**

* `key` **{String|Object}**: Pass a key-value pair or an object to set.
* `val` **{any}**: Any value when a key-value pair is passed. This can also be options if a glob pattern is passed as the first value.
* `returns` **{Object}**: Returns the instance for chaining.

**Example**

```js
app.option('a', 'b');
app.option({c: 'd'});
console.log(app.options);
//=> {a: 'b', c: 'd'}
```

#### .use

Run a plugin on the given instance. Plugins are invoked immediately upon instantiating in the order in which they were defined.

**Example**

The simplest plugin looks something like the following:

```js
app.use(function(inst) {
  // do something to `inst`
});
```

Note that `inst` is the instance of the class you're instantiating. So if you create an instance of `Collection`, inst is the collection instance.

**Params**

* `fn` **{Function}**: Plugin function. If the plugin returns a function it will be passed to the `use` method of each item created on the instance.
* `returns` **{Object}**: Returns the instance for chaining.

**Usage**

```js
collection.use(function(items) {
  // `items` is the instance, as is `this`

  // optionally return a function to be passed to
  // the `.use` method of each item created on the
  // instance
  return function(item) {
    // do stuff to each `item`
  };
});
```

### Application

This section describes the methods and features available on the main `Templates` class.

### [Templates](index.js#L45)

This function is the main export of the templates module. Initialize an instance of `templates` to create your application.

**Params**

* `options` **{Object}**

**Example**

```js
var templates = require('templates');
var app = templates();
```

### [.list](index.js#L152)

Create a new list. See the [list docs](docs/lists.md) for more information about lists.

**Params**

* `opts` **{Object}**: List options
* `returns` **{Object}**: Returns the `list` instance for chaining.

**Example**

```js
var list = app.list();
list.addItem('abc', {content: '...'});

// or, create list from a collection
app.create('pages');
var list = app.list(app.pages);
```

### [.collection](index.js#L192)

Create a new collection. Collections are decorated with special methods for getting and setting items from the collection. Note that, unlike the [create](#create) method, collections created with `.collection()` are not cached.

See the [collection docs](docs/collections.md) for more
information about collections.

**Params**

* `opts` **{Object}**: Collection options
* `returns` **{Object}**: Returns the `collection` instance for chaining.

### [.create](index.js#L230)

Create a new view collection to be stored on the `app.views` object. See
the [create docs](docs/collections.md#create) for more details.

**Params**

* `name` **{String}**: The name of the collection to create. Plural or singular form may be used, as the inflections are automatically resolved when the collection is created.
* `opts` **{Object}**: Collection options
* `returns` **{Object}**: Returns the `collection` instance for chaining.

***

### Engines

### [.engine](lib/plugins/engine.js#L32)

Register a view engine callback `fn` as `ext`.

**Params**

* `exts` **{String|Array}**: String or array of file extensions.
* `fn` **{Function|Object}**: or `settings`
* `settings` **{Object}**: Optionally pass engine options as the last argument.

**Example**

```js
app.engine('hbs', require('engine-handlebars'));

// using consolidate.js
var engine = require('consolidate');
app.engine('jade', engine.jade);
app.engine('swig', engine.swig);

// get a registered engine
var swig = app.engine('swig');
```

***

### Helpers

### [.helper](lib/plugins/helpers.js#L23)

Register a template helper.

**Params**

* `name` **{String}**: Helper name
* `fn` **{Function}**: Helper function.

**Example**

```js
app.helper('upper', function(str) {
  return str.toUpperCase();
});
```

### [.helpers](lib/plugins/helpers.js#L43)

Register multiple template helpers.

**Params**

* `helpers` **{Object|Array}**: Object, array of objects, or glob patterns.

**Example**

```js
app.helpers({
  foo: function() {},
  bar: function() {},
  baz: function() {}
});
```

### [.asyncHelper](lib/plugins/helpers.js#L63)

Get or set an async helper. If only the name is passed, the helper is returned.

**Params**

* `name` **{String}**: Helper name.
* `fn` **{Function}**: Helper function

**Example**

```js
app.asyncHelper('upper', function(str, next) {
  next(null, str.toUpperCase());
});
```

### [.asyncHelpers](lib/plugins/helpers.js#L83)

Register multiple async template helpers.

**Params**

* `helpers` **{Object|Array}**: Object, array of objects, or glob patterns.

**Example**

```js
app.asyncHelpers({
  foo: function() {},
  bar: function() {},
  baz: function() {}
});
```

### [.helperGroup](lib/plugins/helpers.js#L107)

Register a namespaced helper group.

**Params**

* `helpers` **{Object|Array}**: Object, array of objects, or glob patterns.

**Example**

```js
// markdown-utils
app.helperGroup('mdu', {
  foo: function() {},
  bar: function() {},
});

// Usage:
// <%= mdu.foo() %>
// <%= mdu.bar() %>
```

***

### View

API for the `View` class.

### [View](lib/view.js#L26)

Create an instance of `View`. Optionally pass a default object to use.

**Params**

* `view` **{Object}**

**Example**

```js
var view = new View({
  path: 'foo.html',
  content: '...'
});
```

### [.compile](lib/view.js#L54)

Synchronously compile a view.

**Params**

* `locals` **{Object}**: Optionally pass locals to the engine.
* `returns` **{Object}** `View`: instance, for chaining.

**Example**

```js
var view = page.compile();
view.fn({title: 'A'});
view.fn({title: 'B'});
view.fn({title: 'C'});
```

### [.render](lib/view.js#L72)

Asynchronously render a view.

**Params**

* `locals` **{Object}**: Optionally pass locals to the engine.
* `returns` **{Object}** `View`: instance, for chaining.

**Example**

```js
view.render({title: 'Home'}, function(err, res) {
  //=> view object with rendered `content`
});
```

#### data

### [.data](lib/plugins/context.js#L30)

Set, get and load data to be passed to templates as context at render-time.

**Params**

* `key` **{String|Object}**: Pass a key-value pair or an object to set.
* `val` **{any}**: Any value when a key-value pair is passed. This can also be options if a glob pattern is passed as the first value.
* `returns` **{Object}**: Returns an instance of `Templates` for chaining.

**Example**

```js
view.data('a', 'b');
view.data({c: 'd'});
console.log(view.cache.data);
//=> {a: 'b', c: 'd'}
```

### [.mergePartials](lib/plugins/context.js#L112)

Merge "partials" view types. This is necessary for template
engines have no support for partials or only support one
type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `returns` **{Object}**: Merged partials

***

### Item

API for the `Item` class.

### [Item](lib/item.js#L29)

Create an instance of `Item`. Optionally pass a default object to use.

**Params**

* `item` **{Object}**

**Example**

```js
var item = new Item({
  path: 'foo.html',
  content: '...'
});
```

### [.clone](lib/item.js#L85)

Re-decorate Item methods after calling vinyl's `.clone()` method.

**Params**

* `options` **{Object}**
* `returns` **{Object}** `item`: Cloned instance

**Example**

```js
item.clone({deep: true}); // false by default
```

#### data

### [.data](lib/plugins/context.js#L30)

Set, get and load data to be passed to templates as context at render-time.

**Params**

* `key` **{String|Object}**: Pass a key-value pair or an object to set.
* `val` **{any}**: Any value when a key-value pair is passed. This can also be options if a glob pattern is passed as the first value.
* `returns` **{Object}**: Returns an instance of `Templates` for chaining.

**Example**

```js
item.data('a', 'b');
item.data({c: 'd'});
console.log(item.cache.data);
//=> {a: 'b', c: 'd'}
```

### [.mergePartials](lib/plugins/context.js#L112)

Merge "partials" view types. This is necessary for template
engines have no support for partials or only support one
type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `returns` **{Object}**: Merged partials

***

### Collections

API for the `Collections` class.

### [Collection](lib/collection.js#L24)

Create an instance of `Collection` with the given `options`.

**Params**

* `options` **{Object}**

**Example**

```js
var collection = new Collection();
collection.addItem('foo', {content: 'bar'});
```

### [.setItem](lib/collection.js#L86)

Set an item on the collection. This is identical to [addItem](#addItem) except `setItem` does not emit an event for each item and does not iterate over the item `queue`.

**Params**

* `key` **{String|Object}**: Item key or object
* `value` **{Object}**: If key is a string, value is the item object.
* `returns` **{Object}**: returns the `item` instance.

**Example**

```js
collection.setItem('foo', {content: 'bar'});
```

### [.addItem](lib/collection.js#L108)

Similar to `setItem`, adds an item to the collection but also fires an event and iterates over the item `queue` to load items from the `addItem` event listener.  An item may be an instance of `Item`, if not, the item is converted to an instance of `Item`.

**Params**

* `key` **{String}**
* `value` **{Object}**

**Example**

```js
var list = new List(...);
list.addItem('a.html', {path: 'a.html', contents: '...'});
```

### [.addItems](lib/collection.js#L134)

Load multiple items onto the collection.

**Params**

* `items` **{Object|Array}**
* `returns` **{Object}**: returns the instance for chaining

**Example**

```js
collection.addItems({
  'a.html': {content: '...'},
  'b.html': {content: '...'},
  'c.html': {content: '...'}
});
```

### [.addList](lib/collection.js#L161)

Load an array of items onto the collection.

**Params**

* `items` **{Array}**: or an instance of `List`
* `fn` **{Function}**: Optional sync callback function that is called on each item.
* `returns` **{Object}**: returns the Collection instance for chaining

**Example**

```js
collection.addList([
  {path: 'a.html', content: '...'},
  {path: 'b.html', content: '...'},
  {path: 'c.html', content: '...'}
]);
```

### [.getItem](lib/collection.js#L192)

Get an item from the collection.

**Params**

* `key` **{String}**: Key of the item to get.
* `returns` **{Object}**

**Example**

```js
collection.getItem('a.html');
```

#### Data

### [.data](lib/plugins/context.js#L30)

Set, get and load data to be passed to templates as context at render-time.

**Params**

* `key` **{String|Object}**: Pass a key-value pair or an object to set.
* `val` **{any}**: Any value when a key-value pair is passed. This can also be options if a glob pattern is passed as the first value.
* `returns` **{Object}**: Returns an instance of `Templates` for chaining.

**Example**

```js
collection.data('a', 'b');
collection.data({c: 'd'});
console.log(collection.cache.data);
//=> {a: 'b', c: 'd'}
```

### [.mergePartials](lib/plugins/context.js#L112)

Merge "partials" view types. This is necessary for template
engines have no support for partials or only support one
type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `returns` **{Object}**: Merged partials

***

### List

API for the `List` class.

### [List](lib/list.js#L28)

Create an instance of `List` with the given `options`. Lists differ from collections in that items are stored as an array, allowing items to be paginated, sorted, and grouped.

**Params**

* `options` **{Object}**

**Example**

```js
var list = new List();
list.addItem('foo', {content: 'bar'});
```

### [.setItem](lib/list.js#L105)

Set an item on the collection. This is identical to [addItem](#addItem) except `setItem` does not emit an event for each item and does not iterate over the item `queue`.

**Params**

* `key` **{String|Object}**: Item key or object
* `value` **{Object}**: If key is a string, value is the item object.
* `returns` **{Object}**: returns the `item` instance.

**Example**

```js
collection.setItem('foo', {content: 'bar'});
```

### [.addItem](lib/list.js#L136)

Similar to [setItem](#setItem), adds an item to the list but also fires an event and iterates over the item `queue` to load items from the `addItem` event listener. If the given item is not already an instance of `Item`, it will be converted to one before being added to the `items` object.

**Params**

* `key` **{String}**
* `value` **{Object}**
* `returns` **{Object}**: Returns the instance of the created `Item` to allow chaining item methods.

**Example**

```js
var items = new Items(...);
items.addItem('a.html', {path: 'a.html', contents: '...'});
```

### [.addItems](lib/list.js#L163)

Load multiple items onto the collection.

**Params**

* `items` **{Object|Array}**
* `returns` **{Object}**: returns the instance for chaining

**Example**

```js
collection.addItems({
  'a.html': {content: '...'},
  'b.html': {content: '...'},
  'c.html': {content: '...'}
});
```

### [.addList](lib/list.js#L192)

Load an array of items or the items from another instance of `List`.

**Params**

* `items` **{Array}**: or an instance of `List`
* `fn` **{Function}**: Optional sync callback function that is called on each item.
* `returns` **{Object}**: returns the List instance for chaining

**Example**

```js
var foo = new List(...);
var bar = new List(...);
bar.addList(foo);
```

### [.hasItem](lib/list.js#L229)

Return true if the list has the given item (name).

**Params**

* `key` **{String}**
* `returns` **{Object}**

**Example**

```js
list.addItem('foo.html', {content: '...'});
list.hasItem('foo.html');
//=> true
```

### [.getIndex](lib/list.js#L245)

Get a the index of a specific item from the list by `key`.

**Params**

* `key` **{String}**
* `returns` **{Object}**

**Example**

```js
list.getIndex('foo.html');
//=> 1
```

### [.getItem](lib/list.js#L261)

Get a specific item from the list by `key`.

**Params**

* `key` **{String}**
* `returns` **{Object}**

**Example**

```js
list.getItem('foo.html');
//=> '<View <foo.html>>'
```

### [.removeItem](lib/list.js#L278)

Remove an item from the list.

**Params**

* `items` **{Object}**: Object of views

**Example**

```js
var list = new List(...);
list.addItems({
  'a.html': {path: 'a.html', contents: '...'}
});
```

### [.extendItem](lib/list.js#L298)

Decorate each item on the list with additional methods
and properties. This provides a way of easily overriding
defaults.

**Params**

* `item` **{Object}**
* `returns` **{Object}**: Instance of item for chaining

### [.groupBy](lib/list.js#L316)

Group all list `items` using the given property, properties or compare functions. See [group-array](https://github.com/doowb/group-array) for the full range of available features and options.

* `returns` **{Object}**: Returns the grouped items.

**Example**

```js
var list = new List();
list.addItems(...);
var groups = list.groupBy('data.date', 'data.slug');
```

### [.sortBy](lib/list.js#L342)

Sort all list `items` using the given property, properties or compare functions. See [array-sort](https://github.com/jonschlinkert/array-sort) for the full range of available features and options.

* `returns` **{Object}**: Returns a new `List` instance with sorted items.

**Example**

```js
var list = new List();
list.addItems(...);
var result = list.sortBy('data.date');
//=> new sorted list
```

### [.paginate](lib/list.js#L376)

Paginate all `items` in the list with the given options, See [paginationator](https://github.com/doowb/paginationator) for the full range of available features and options.

* `returns` **{Object}**: Returns the paginated items.

**Example**

```js
var list = new List(items);
var pages = list.paginate({limit: 5});
```

***

### Group

API for the `Group` class.

### [Group](lib/group.js#L24)

Create an instance of `Group` with the given `options`.

**Params**

* `options` **{Object}**

**Example**

```js
var group = new Group({
  'foo': { items: [1,2,3] }
});
```

***

### Lookups

### [.find](lib/plugins/lookup.js#L25)

Find a view by `name`, optionally passing a `collection` to limit the search. If no collection is passed all `renderable` collections will be searched.

**Params**

* `name` **{String}**: The name/key of the view to find
* `colleciton` **{String}**: Optionally pass a collection name (e.g. pages)
* `returns` **{Object|undefined}**: Returns the view if found, or `undefined` if not.

**Example**

```js
var page = app.find('my-page.hbs');

// optionally pass a collection name as the second argument
var page = app.find('my-page.hbs', 'pages');
```

### [.getView](lib/plugins/lookup.js#L66)

Get view `key` from the specified `collection`.

**Params**

* `collection` **{String}**: Collection name, e.g. `pages`
* `key` **{String}**: Template name
* `fn` **{Function}**: Optionally pass a `renameKey` function
* `returns` **{Object}**

**Example**

```js
var view = app.getView('pages', 'a/b/c.hbs');

// optionally pass a `renameKey` function to modify the lookup
var view = app.getView('pages', 'a/b/c.hbs', function(fp) {
  return path.basename(fp);
});
```

### [.getViews](lib/plugins/lookup.js#L102)

Get all views from a `collection` using the collection's singular or plural name.

**Params**

* `name` **{String}**: The collection name, e.g. `pages` or `page`
* `returns` **{Object}**

**Example**

```js
var pages = app.getViews('pages');
//=> { pages: {'home.hbs': { ... }}

var posts = app.getViews('posts');
//=> { posts: {'2015-10-10.md': { ... }}
```

***

### Rendering

### [.compile](lib/plugins/render.js#L49)

Compile `content` with the given `locals`.

**Params**

* `view` **{Object|String}**: View object.
* `locals` **{Object}**
* `isAsync` **{Boolean}**: Load async helpers
* `returns` **{Object}**: View object with `fn` property with the compiled function.

**Example**

```js
var indexPage = app.page('some-index-page.hbs');
var view = app.compile(indexPage);
// view.fn => [function]

// you can call the compiled function more than once
// to render the view with different data
view.fn({title: 'Foo'});
view.fn({title: 'Bar'});
view.fn({title: 'Baz'});
```

### [.render](lib/plugins/render.js#L122)

Render a view with the given `locals` and `callback`.

**Params**

* `view` **{Object|String}**: Instance of `View`
* `locals` **{Object}**: Locals to pass to template engine.
* `callback` **{Function}**

**Example**

```js
var blogPost = app.post.getView('2015-09-01-foo-bar');
app.render(blogPost, {title: 'Foo'}, function(err, view) {
  // `view` is an object with a rendered `content` property
});
```

***

### Context

### [.data](lib/plugins/context.js#L30)

Set, get and load data to be passed to templates as context at render-time.

**Params**

* `key` **{String|Object}**: Pass a key-value pair or an object to set.
* `val` **{any}**: Any value when a key-value pair is passed. This can also be options if a glob pattern is passed as the first value.
* `returns` **{Object}**: Returns an instance of `Templates` for chaining.

**Example**

```js
app.data('a', 'b');
app.data({c: 'd'});
console.log(app.cache.data);
//=> {a: 'b', c: 'd'}
```

### [.mergePartials](lib/plugins/context.js#L112)

Merge "partials" view types. This is necessary for template
engines have no support for partials or only support one
type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `returns` **{Object}**: Merged partials

***

### Routes and middleware

### [.handle](lib/plugins/routes.js#L44)

Handle a middleware `method` for `view`.

**Params**

* `method` **{String}**: Name of the router method to handle. See [router methods](./docs/router.md)
* `view` **{Object}**: View object
* `callback` **{Function}**: Callback function
* `returns` **{Object}**

**Example**

```js
app.handle('customMethod', view, callback);
```

### [.route](lib/plugins/routes.js#L128)

Create a new Route for the given path. Each route contains a separate middleware stack.

See the [route API documentation][route-api] for details on
adding handlers and middleware to routes.

**Params**

* `path` **{String}**
* `returns` **{Object}** `Route`: for chaining

**Example**

```js
app.create('posts');
app.route(/blog/)
  .all(function(view, next) {
    // do something with view
    next();
  });

app.post('whatever', {path: 'blog/foo.bar', content: 'bar baz'});
```

### [.all](lib/plugins/routes.js#L150)

Special route method that works just like the `router.METHOD()` methods, except that it matches all verbs.

**Params**

* `path` **{String}**
* `callback` **{Function}**
* `returns` **{Object}** `this`: for chaining

**Example**

```js
app.all(/\.hbs$/, function(view, next) {
  // do stuff to view
  next();
});
```

### [.param](lib/plugins/routes.js#L179)

Add callback triggers to route parameters, where `name` is the name of the parameter and `fn` is the callback function.

**Params**

* `name` **{String}**
* `fn` **{Function}**
* `returns` **{Object}**: Returns the instance of `Templates` for chaining.

**Example**

```js
app.param('title', function (view, next, title) {
  //=> title === 'foo.js'
  next();
});

app.onLoad('/blog/:title', function (view, next) {
  //=> view.path === '/blog/foo.js'
  next();
});
```

***

## Related projects

* [assemble](https://www.npmjs.com/package/assemble): Static site generator for Grunt.js, Yeoman and Node.js. Used by Zurb Foundation, Zurb Ink, H5BP/Effeckt,… [more](https://www.npmjs.com/package/assemble) | [homepage](http://assemble.io)
* [en-route](https://www.npmjs.com/package/en-route): Routing for static site generators, build systems and task runners, heavily based on express.js routes… [more](https://www.npmjs.com/package/en-route) | [homepage](https://github.com/jonschlinkert/en-route)
* [engine](https://www.npmjs.com/package/engine): Template engine based on Lo-Dash template, but adds features like the ability to register helpers… [more](https://www.npmjs.com/package/engine) | [homepage](https://github.com/jonschlinkert/engine)
* [layouts](https://www.npmjs.com/package/layouts): Wraps templates with layouts. Layouts can use other layouts and be nested to any depth.… [more](https://www.npmjs.com/package/layouts) | [homepage](https://github.com/doowb/layouts)
* [verb](https://www.npmjs.com/package/verb): Documentation generator for GitHub projects. Verb is extremely powerful, easy to use, and is used… [more](https://www.npmjs.com/package/verb) | [homepage](https://github.com/verbose/verb)

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Code coverage

As of October 24, 2015, code coverage is 100%.

```sh
Statements   : 100% (1162/1162)
Branches     : 100% (475/475)
Functions    : 100% (160/160)
Lines        : 100% (1141/1141)
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/templates/issues/new).

If this project doesn't do what you need, [please let us know](https://github.com/jonschlinkert/templates/issues).

## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2015 Jon Schlinkert
Released under the MIT license.

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on October 24, 2015._