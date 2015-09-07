/* deps: mocha */
var path = require('path');
var assert = require('assert');
var should = require('should');
var App = require('../');
var app;

describe('helpers', function () {
  describe('constructor', function () {
    it('should create an instance of Helpers:', function () {
      app = new App();
      assert(app instanceof App);
    });
  });

  describe('prototype methods', function () {
    beforeEach(function() {
      app = new App();
    });
    it('should expose `helper`', function () {
      assert(typeof app.helper ==='function');
    });
    it('should expose `asyncHelper`', function () {
      assert(typeof app.asyncHelper ==='function');
    });
  });

  // describe('instance', function () {
  //   beforeEach(function() {
  //     app = new App();
  //   });

  //   it('should set an arbitrary value on the instance:', function () {
  //     app.set('a', 'b');
  //     assert(app.a ==='b');
  //   });

  //   it('should get an arbitrary value from the instance:', function () {
  //     app.set('a', 'b');
  //     assert(app.get('a') ==='b');
  //   });
  // });

  // describe('helpers', function() {
  //   beforeEach(function() {
  //     app = new App();
  //   });

  //   it('should throw an error when value is invalid:', function () {
  //     (function () {
  //       app.helper('foo', {});
  //     }).should.throw('expected helper fn to be a function.');
  //   });

  //   it('should add a sync helper to the `sync` object:', function () {
  //     app.helper('one', function () {});
  //     assert(typeof app.sync.one === 'function');
  //   });

  //   it('should load a glob of sync helper functions:', function () {
  //     app.helpers('test/fixtures/helpers/[a-c].js');
  //     assert(typeof app.sync.a === 'function');
  //     assert(typeof app.sync.b === 'function');
  //     assert(typeof app.sync.c === 'function');
  //   });

  //   it('should add a glob of sync helper objects:', function () {
  //     app.helpers('test/fixtures/helpers/!([a-c]).js');
  //     assert(typeof app.sync.one === 'function');
  //     assert(typeof app.sync.two === 'function');
  //     assert(typeof app.sync.three === 'function');
  //   });

  //   it('should add a glob with mixed helper objects and functions:', function () {
  //     app.helpers('test/fixtures/helpers/*.js');
  //     assert(typeof app.sync.a === 'function');
  //     assert(typeof app.sync.b === 'function');
  //     assert(typeof app.sync.c === 'function');
  //     assert(typeof app.sync.one === 'function');
  //     assert(typeof app.sync.two === 'function');
  //     assert(typeof app.sync.three === 'function');
  //   });

  //   it('should add an object of sync helpers to the `sync` object:', function () {
  //     app.helpers({
  //       x: function () {},
  //       y: function () {},
  //       z: function () {}
  //     });

  //     assert(typeof app.sync.x === 'function');
  //     assert(typeof app.sync.y === 'function');
  //     assert(typeof app.sync.z === 'function');
  //   });
  // });

  // describe('async helpers', function() {
  //   beforeEach(function() {
  //     app = new App();
  //   });

  //   it('should throw an error when value is invalid:', function () {
  //     (function () {
  //       app.asyncHelper('foo', {});
  //     }).should.throw('expected helper fn to be a function.');
  //   });

  //   it('should add an async helper to the `async` object:', function () {
  //     app.asyncHelper('two', function () {});
  //     assert(typeof app.async.two === 'function');
  //   });

  //   it('should load a glob of async helper functions:', function () {
  //     app.asyncHelpers('test/fixtures/helpers/[a-c].js');
  //     assert(typeof app.async.a === 'function');
  //     assert(typeof app.async.b === 'function');
  //     assert(typeof app.async.c === 'function');
  //   });

  //   it('should add a glob of async helper objects:', function () {
  //     app.asyncHelpers('test/fixtures/helpers/!([a-c]).js');
  //     assert(typeof app.async.one === 'function');
  //     assert(typeof app.async.two === 'function');
  //     assert(typeof app.async.three === 'function');
  //   });

  //   it('should add a glob with mixed helper objects and functions:', function () {
  //     app.asyncHelpers('test/fixtures/helpers/*.js');
  //     assert(typeof app.async.a === 'function');
  //     assert(typeof app.async.b === 'function');
  //     assert(typeof app.async.c === 'function');
  //     assert(typeof app.async.one === 'function');
  //     assert(typeof app.async.two === 'function');
  //     assert(typeof app.async.three === 'function');
  //   });

  //   it('should add an object of async helpers to the `async` object:', function () {
  //     app.asyncHelpers({
  //       x: function () {},
  //       y: function () {},
  //       z: function () {}
  //     });

  //     assert(typeof app.async.x === 'function');
  //     assert(typeof app.async.y === 'function');
  //     assert(typeof app.async.z === 'function');
  //   });
  // });
});

