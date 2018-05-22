'use strict';

require('mocha');
const util = require('util');
const assert = require('assert');
const Templates = require('..');
const handlebars = require('../lib/engines');
const helpers = require('./support/helpers');
let app, render, other, hbs, locals;

describe('app helpers - sync', function() {
  beforeEach(function() {
    app = new Templates({ sync: true });
    app.engine('hbs', handlebars(require('handlebars')));

    const pages = app.create('pages');
    const partials = app.create('partials', { kind: 'partial' });

    partials.set('button.hbs', { contents: Buffer.from('<button>{{text}}</button>') });
    partials.set('button2.hbs', { contents: Buffer.from('<button>Click me!</button>') });

    // this.helper(name, async(val, locals) => await render(this.get(val), locals));
    app.helper('partial', function(val, locals = {}, options = {}) {
      if (locals.hash) {
        options = locals;
        locals = {};
      }

      const hbs = this.engine.instance;
      const view = partials.get(val);
      if (!view) return '';
      view.fn = hbs.compile(view.contents.toString());

      if (view.fn) return view.fn(Object.assign({}, locals, options.hash));

      app.render(view, locals);
      return view.contents.toString();
    });

    render = (str, locals) => {
      const view = pages.set('fixture.hbs', { contents: Buffer.from(str) });
      app.render(view, locals);
      return view.contents.toString();
    };
  });

  it('should precompile partials', () => {
    assert.equal(render('Partial: {{{partial "button" text="Click me!!!"}}}'), 'Partial: <button>Click me!!!</button>');

  });
});
