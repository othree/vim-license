
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.data !== data)
            text.data = data;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.shift()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            while (render_callbacks.length) {
                const callback = render_callbacks.pop();
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_render);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_render.forEach(add_render_callback);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_render } = component.$$;
        fragment.m(target, anchor);
        // onMount happens after the initial afterUpdate. Because
        // afterUpdate callbacks happen in reverse order (inner first)
        // we schedule onMount callbacks before afterUpdate callbacks
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_render.forEach(add_render_callback);
    }
    function destroy(component, detaching) {
        if (component.$$) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal$$1, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal: not_equal$$1,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_render: [],
            after_render: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, value) => {
                if ($$.ctx && not_equal$$1($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_render);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro && component.$$.fragment.i)
                component.$$.fragment.i();
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy(this, true);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    const LENGTH = 78;

    const TEXT = [
      'VIM LICENSE',
      '',
      {
        indent: '   ',
        prefix: 'I) ',
        text: (project, projecturl, name, email) => `
    There are no restrictions on distributing unmodified copies of ${project} except
    that they must include this license text.  You can also distribute
    unmodified parts of ${project}, likewise unrestricted except that they must
    include this license text.  You are also allowed to include executables
    that you made from the unmodified ${project} sources, plus your own usage
    examples and Vim scripts.
    `
      },
      '',
      {
        indent: '   ',
        prefix: 'II)',
        text: (project, projecturl, name, email) => `
    It is allowed to distribute a modified (or extended) version of Vim,
    including executables and/or source code, when the following four
    conditions are met:
    `
      },
      {
        indent: '      ',
        prefix: '    1)',
        text: (project, projecturl, fullname, email) => `
    This license text must be included unmodified.
    `
      },
      {
        indent: '      ',
        prefix: '    2)',
        text: (project, projecturl, fullname, email) => `
    The modified ${project} must be distributed in one of the following five ways:
    `
      },
      {
        indent: '         ',
        prefix: '       a)',
        text: (project, projecturl, fullname, email) => `
    If you make changes to ${project} yourself, you must clearly describe in
    the distribution how to contact you.  When the maintainer asks you
    (in any way) for a copy of the modified ${project} you distributed, you
    must make your changes, including source code, available to the
    maintainer without fee.  The maintainer reserves the right to
    include your changes in the official version of ${project}.  What the
    maintainer will do with your changes and under what license they
    will be distributed is negotiable.  If there has been no negotiation
    then this license, or a later version, also applies to your changes.
    The current maintainer is ${fullname}.  If this
    changes it will be announced in appropriate places (most likely
    ${projecturl}).  When it is completely
    impossible to contact the maintainer, the obligation to send him
    your changes ceases.  Once the maintainer has confirmed that he has
    received your changes they will not have to be sent again.
    `
      },
      {
        indent: '         ',
        prefix: '       b)',
        text: (project, projecturl, fullname, email) => `
    If you have received a modified ${project} that was distributed as
    mentioned under a) you are allowed to further distribute it
    unmodified, as mentioned at I).  If you make additional changes the
    text under a) applies to those changes.
    `
      },
      {
        indent: '         ',
        prefix: '       c)',
        text: (project, projecturl, fullname, email) => `
    Provide all the changes, including source code, with every copy of
    the modified ${project} you distribute.  This may be done in the form of a
    context diff.  You can choose what license to use for new code you
    add.  The changes and their license must not restrict others from
    making their own changes to the official version of ${project}.
    `
      },
      {
        indent: '         ',
        prefix: '       d)',
        text: (project, projecturl, fullname, email) => `
    When you have a modified ${project} which includes changes as mentioned
    under c), you can distribute it without the source code for the
    changes if the following three conditions are met:
    `
      },
      {
        indent: '           ',
        prefix: '          -',
        text: (project, projecturl, fullname, email) => `
    The license that applies to the changes permits you to distribute
    the changes to the ${project} maintainer without fee or restriction, and
    permits the ${project} maintainer to include the changes in the official
    version of ${project} without fee or restriction.
    `
      },
      {
        indent: '           ',
        prefix: '          -',
        text: (project, projecturl, fullname, email) => `
    You keep the changes for at least three years after last
    distributing the corresponding modified ${project}.  When the maintainer
    or someone who you distributed the modified ${project} to asks you (in
    any way) for the changes within this period, you must make them
    available to him.
    `
      },
      {
        indent: '           ',
        prefix: '          -',
        text: (project, projecturl, fullname, email) => `
    You clearly describe in the distribution how to contact you.  This
    contact information must remain valid for at least three years
    after last distributing the corresponding modified ${project}, or as long
    as possible.
    `
      },
      {
        indent: '         ',
        prefix: '       e)',
        text: (project, projecturl, fullname, email) => `
    When the GNU General Public License (GPL) applies to the changes,
    you can distribute the modified Vim under the GNU GPL version 2 or
    any later version.
    `
      },
      {
        indent: '      ',
        prefix: '    3)',
        text: (project, projecturl, fullname, email) => `
    A message must be added, at least in the output of the ":version"
    command and in the intro screen, such that the user of the modified ${project}
    is able to see that it was modified.  When distributing as mentioned
    under 2)e) adding the message is only required for as far as this does
    not conflict with the license used for the changes.
    `
      },
      {
        indent: '      ',
        prefix: '    4)',
        text: (project, projecturl, fullname, email) => `
    The contact information as required under 2)a) and 2)d) must not be
    removed or changed, except that the person himself can make
    corrections.
    `
      },
      '',
      {
        indent: '    ',
        prefix: 'III)',
        text: (project, projecturl, name, email) => `
    If you distribute a modified version of ${project}, you are encouraged to use
    the Vim license for your changes and make them available to the
    maintainer, including the source code.  The preferred way to do this is
    by e-mail or by uploading the files to a server and e-mailing the URL.
    If the number of changes is small (e.g., a modified Makefile) e-mailing a
    context diff will do.  The e-mail address to be used is
    <${email}>
    `
      },
      '',
      {
        indent: '    ',
        prefix: 'IV) ',
        text: (project, projecturl, name, email) => `
    It is not allowed to remove this license from the distribution of the ${project}
    sources, parts of it or from a modified version.  You may use this
    license for previous ${project} releases instead of the license that they came
    with, at your option.
    `
      },
    ];

    const gen = (project, projecturl, name, email) => TEXT.map(part => {
      if (typeof part === 'string') {
        return part;
      }

      const p = part.text(project, projecturl, name, email).trim();
      const words = p.split(/\s+/g);

      const lines = [part.prefix];
      let row = 0;

      words.forEach(word => {
        if (lines[row].length + word.length + 1 <= LENGTH) {
          lines[row] = `${lines[row]} ${word}`;
        } else {
          row = row + 1;
          lines[row] = `${part.indent} ${word}`;
        }
      });

      console.log(lines);

      return lines.join('\n');
    }).join('\n');

    /* src/App.svelte generated by Svelte v3.5.1 */

    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	var main, h1, t1, div0, fieldset0, label0, t3, input0, t4, fieldset1, label1, t6, input1, t7, fieldset2, label2, t9, input2, t10, fieldset3, label3, t12, input3, t13, div1, button, t15, textarea, t16, pre, t17, t18, footer, a, dispose;

    	return {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Vim License";
    			t1 = space();
    			div0 = element("div");
    			fieldset0 = element("fieldset");
    			label0 = element("label");
    			label0.textContent = "Project Name";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			fieldset1 = element("fieldset");
    			label1 = element("label");
    			label1.textContent = "Project URL";
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			fieldset2 = element("fieldset");
    			label2 = element("label");
    			label2.textContent = "Maintainer";
    			t9 = space();
    			input2 = element("input");
    			t10 = space();
    			fieldset3 = element("fieldset");
    			label3 = element("label");
    			label3.textContent = "Maintainer Email";
    			t12 = space();
    			input3 = element("input");
    			t13 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Copy";
    			t15 = space();
    			textarea = element("textarea");
    			t16 = space();
    			pre = element("pre");
    			t17 = text(ctx.licenseText);
    			t18 = space();
    			footer = element("footer");
    			a = element("a");
    			a.textContent = "GitHub";
    			add_location(h1, file, 90, 0, 1208);
    			label0.htmlFor = "project";
    			label0.className = "svelte-17ol6gt";
    			add_location(label0, file, 94, 2, 1263);
    			input0.id = "project";
    			input0.className = "svelte-17ol6gt";
    			add_location(input0, file, 95, 2, 1307);
    			fieldset0.className = "svelte-17ol6gt";
    			add_location(fieldset0, file, 93, 2, 1250);
    			label1.htmlFor = "projecturl";
    			label1.className = "svelte-17ol6gt";
    			add_location(label1, file, 98, 2, 1380);
    			input1.id = "projecturl";
    			input1.className = "svelte-17ol6gt";
    			add_location(input1, file, 99, 2, 1426);
    			fieldset1.className = "svelte-17ol6gt";
    			add_location(fieldset1, file, 97, 2, 1367);
    			label2.htmlFor = "maintainer";
    			label2.className = "svelte-17ol6gt";
    			add_location(label2, file, 102, 2, 1505);
    			input2.id = "maintainer";
    			input2.className = "svelte-17ol6gt";
    			add_location(input2, file, 103, 2, 1550);
    			fieldset2.className = "svelte-17ol6gt";
    			add_location(fieldset2, file, 101, 2, 1492);
    			label3.htmlFor = "email";
    			label3.className = "svelte-17ol6gt";
    			add_location(label3, file, 106, 2, 1627);
    			input3.id = "email";
    			input3.className = "svelte-17ol6gt";
    			add_location(input3, file, 107, 2, 1673);
    			fieldset3.className = "svelte-17ol6gt";
    			add_location(fieldset3, file, 105, 2, 1614);
    			div0.id = "inputs";
    			div0.className = "svelte-17ol6gt";
    			add_location(div0, file, 92, 0, 1230);
    			button.id = "copy-license";
    			button.className = "svelte-17ol6gt";
    			add_location(button, file, 112, 2, 1756);
    			textarea.id = "license-text";
    			textarea.readOnly = true;
    			textarea.value = ctx.licenseText;
    			textarea.className = "svelte-17ol6gt";
    			add_location(textarea, file, 113, 2, 1814);
    			div1.id = "buttons";
    			div1.className = "svelte-17ol6gt";
    			add_location(div1, file, 111, 0, 1735);
    			pre.id = "license-preview";
    			pre.className = "svelte-17ol6gt";
    			add_location(pre, file, 116, 0, 1884);
    			main.className = "svelte-17ol6gt";
    			add_location(main, file, 88, 0, 1200);
    			a.href = "https://github.com/othree/vim-license";
    			a.target = "_blank";
    			a.className = "svelte-17ol6gt";
    			add_location(a, file, 121, 1, 1950);
    			footer.className = "svelte-17ol6gt";
    			add_location(footer, file, 120, 0, 1940);

    			dispose = [
    				listen(input0, "input", ctx.input0_input_handler),
    				listen(input1, "input", ctx.input1_input_handler),
    				listen(input2, "input", ctx.input2_input_handler),
    				listen(input3, "input", ctx.input3_input_handler),
    				listen(button, "click", ctx.copy)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, main, anchor);
    			append(main, h1);
    			append(main, t1);
    			append(main, div0);
    			append(div0, fieldset0);
    			append(fieldset0, label0);
    			append(fieldset0, t3);
    			append(fieldset0, input0);

    			input0.value = ctx.project;

    			append(div0, t4);
    			append(div0, fieldset1);
    			append(fieldset1, label1);
    			append(fieldset1, t6);
    			append(fieldset1, input1);

    			input1.value = ctx.projecturl;

    			append(div0, t7);
    			append(div0, fieldset2);
    			append(fieldset2, label2);
    			append(fieldset2, t9);
    			append(fieldset2, input2);

    			input2.value = ctx.fullname;

    			append(div0, t10);
    			append(div0, fieldset3);
    			append(fieldset3, label3);
    			append(fieldset3, t12);
    			append(fieldset3, input3);

    			input3.value = ctx.email;

    			append(main, t13);
    			append(main, div1);
    			append(div1, button);
    			append(div1, t15);
    			append(div1, textarea);
    			append(main, t16);
    			append(main, pre);
    			append(pre, t17);
    			insert(target, t18, anchor);
    			insert(target, footer, anchor);
    			append(footer, a);
    		},

    		p: function update(changed, ctx) {
    			if (changed.project && (input0.value !== ctx.project)) input0.value = ctx.project;
    			if (changed.projecturl && (input1.value !== ctx.projecturl)) input1.value = ctx.projecturl;
    			if (changed.fullname && (input2.value !== ctx.fullname)) input2.value = ctx.fullname;
    			if (changed.email && (input3.value !== ctx.email)) input3.value = ctx.email;

    			if (changed.licenseText) {
    				textarea.value = ctx.licenseText;
    				set_data(t17, ctx.licenseText);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(main);
    				detach(t18);
    				detach(footer);
    			}

    			run_all(dispose);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let project = 'Vim';
    let projecturl = 'vim.sf.net, www.vim.org and/or comp.editors';
    let fullname = 'Bram Moolenaar <Bram@vim.org>';
    let email = 'maintainer@vim.org';

    const copy = () => {
      document.querySelector("#license-text").select();
      document.execCommand("copy");
    };

    	function input0_input_handler() {
    		project = this.value;
    		$$invalidate('project', project);
    	}

    	function input1_input_handler() {
    		projecturl = this.value;
    		$$invalidate('projecturl', projecturl);
    	}

    	function input2_input_handler() {
    		fullname = this.value;
    		$$invalidate('fullname', fullname);
    	}

    	function input3_input_handler() {
    		email = this.value;
    		$$invalidate('email', email);
    	}

    	let licenseText;

    	$$self.$$.update = ($$dirty = { project: 1, projecturl: 1, email: 1 }) => {
    		if ($$dirty.project || $$dirty.projecturl || $$dirty.email) { $$invalidate('licenseText', licenseText = gen(project, projecturl, name, email)); }
    	};

    	return {
    		project,
    		projecturl,
    		fullname,
    		email,
    		copy,
    		licenseText,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler
    	};
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, []);
    	}
    }

    var app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
