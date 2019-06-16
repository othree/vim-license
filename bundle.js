
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

    /* src/App.svelte generated by Svelte v3.5.1 */

    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	var main, h1, t1, div0, fieldset0, label0, t3, input0, t4, fieldset1, label1, t6, input1, t7, fieldset2, label2, t9, input2, t10, fieldset3, label3, t12, input3, t13, div1, button, t15, textarea, textarea_value_value, t16, pre, t17, t18, t19, t20, t21, t22, t23, t24, t25, t26, t27, t28, t29, t30, t31, t32, t33, t34, t35, t36, t37, t38, t39, t40, t41, t42, t43, t44, t45, t46, t47, t48, t49, t50, t51, t52, t53, t54, t55, t56, t57, t58, t59, t60, t61, t62, t63, t64, t65, t66, t67, t68, t69, t70, footer, a, dispose;

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
    			t17 = text("VIM LICENSE\n\nI)  There are no restrictions on distributing unmodified copies of ");
    			t18 = text(ctx.project);
    			t19 = text(" except\n    that they must include this license text.  You can also distribute\n    unmodified parts of ");
    			t20 = text(ctx.project);
    			t21 = text(", likewise unrestricted except that they must\n    include this license text.  You are also allowed to include executables\n    that you made from the unmodified ");
    			t22 = text(ctx.project);
    			t23 = text(" sources, plus your own usage\n    examples and Vim scripts.\n\nII) It is allowed to distribute a modified (or extended) version of ");
    			t24 = text(ctx.project);
    			t25 = text(",\n    including executables and/or source code, when the following four\n    conditions are met:\n    1) This license text must be included unmodified.\n    2) The modified ");
    			t26 = text(ctx.project);
    			t27 = text(" must be distributed in one of the following five ways:\n       a) If you make changes to ");
    			t28 = text(ctx.project);
    			t29 = text(" yourself, you must clearly describe in\n\t  the distribution how to contact you.  When the maintainer asks you\n\t  (in any way) for a copy of the modified ");
    			t30 = text(ctx.project);
    			t31 = text(" you distributed, you\n\t  must make your changes, including source code, available to the\n\t  maintainer without fee.  The maintainer reserves the right to\n\t  include your changes in the official version of ");
    			t32 = text(ctx.project);
    			t33 = text(".  What the\n\t  maintainer will do with your changes and under what license they\n\t  will be distributed is negotiable.  If there has been no negotiation\n\t  then this license, or a later version, also applies to your changes.\n\t  The current maintainer is ");
    			t34 = text(ctx.fullname);
    			t35 = text(".  If this\n\t  changes it will be announced in appropriate places (most likely\n\t  ");
    			t36 = text(ctx.projecturl);
    			t37 = text(").  When it is completely\n\t  impossible to contact the maintainer, the obligation to send him\n\t  your changes ceases.  Once the maintainer has confirmed that he has\n\t  received your changes they will not have to be sent again.\n       b) If you have received a modified ");
    			t38 = text(ctx.project);
    			t39 = text(" that was distributed as\n\t  mentioned under a) you are allowed to further distribute it\n\t  unmodified, as mentioned at I).  If you make additional changes the\n\t  text under a) applies to those changes.\n       c) Provide all the changes, including source code, with every copy of\n\t  the modified ");
    			t40 = text(ctx.project);
    			t41 = text(" you distribute.  This may be done in the form of a\n\t  context diff.  You can choose what license to use for new code you\n\t  add.  The changes and their license must not restrict others from\n\t  making their own changes to the official version of ");
    			t42 = text(ctx.project);
    			t43 = text(".\n       d) When you have a modified ");
    			t44 = text(ctx.project);
    			t45 = text(" which includes changes as mentioned\n\t  under c), you can distribute it without the source code for the\n\t  changes if the following three conditions are met:\n\t  - The license that applies to the changes permits you to distribute\n\t    the changes to the ");
    			t46 = text(ctx.project);
    			t47 = text(" maintainer without fee or restriction, and\n\t    permits the ");
    			t48 = text(ctx.project);
    			t49 = text(" maintainer to include the changes in the official\n\t    version of ");
    			t50 = text(ctx.project);
    			t51 = text(" without fee or restriction.\n\t  - You keep the changes for at least three years after last\n\t    distributing the corresponding modified ");
    			t52 = text(ctx.project);
    			t53 = text(".  When the maintainer\n\t    or someone who you distributed the modified ");
    			t54 = text(ctx.project);
    			t55 = text(" to asks you (in\n\t    any way) for the changes within this period, you must make them\n\t    available to him.\n\t  - You clearly describe in the distribution how to contact you.  This\n\t    contact information must remain valid for at least three years\n\t    after last distributing the corresponding modified ");
    			t56 = text(ctx.project);
    			t57 = text(", or as long\n\t    as possible.\n       e) When the GNU General Public License (GPL) applies to the changes,\n\t  you can distribute the modified ");
    			t58 = text(ctx.project);
    			t59 = text(" under the GNU GPL version 2 or\n\t  any later version.\n    3) A message must be added, at least in the output of the \":version\"\n       command and in the intro screen, such that the user of the modified ");
    			t60 = text(ctx.project);
    			t61 = text("\n       is able to see that it was modified.  When distributing as mentioned\n       under 2)e) adding the message is only required for as far as this does\n       not conflict with the license used for the changes.\n    4) The contact information as required under 2)a) and 2)d) must not be\n       removed or changed, except that the person himself can make\n       corrections.\n\nIII) If you distribute a modified version of ");
    			t62 = text(ctx.project);
    			t63 = text(", you are encouraged to use\n     the Vim license for your changes and make them available to the\n     maintainer, including the source code.  The preferred way to do this is\n     by e-mail or by uploading the files to a server and e-mailing the URL.\n     If the number of changes is small (e.g., a modified Makefile) e-mailing a\n     context diff will do.  The e-mail address to be used is\n     <");
    			t64 = text(ctx.email);
    			t65 = text(">\n\nIV)  It is not allowed to remove this license from the distribution of the ");
    			t66 = text(ctx.project);
    			t67 = text("\n     sources, parts of it or from a modified version.  You may use this\n     license for previous ");
    			t68 = text(ctx.project);
    			t69 = text(" releases instead of the license that they came\n     with, at your option.");
    			t70 = space();
    			footer = element("footer");
    			a = element("a");
    			a.textContent = "GitHub";
    			add_location(h1, file, 86, 0, 1113);
    			label0.htmlFor = "project";
    			label0.className = "svelte-17ol6gt";
    			add_location(label0, file, 90, 2, 1168);
    			input0.id = "project";
    			input0.className = "svelte-17ol6gt";
    			add_location(input0, file, 91, 2, 1212);
    			fieldset0.className = "svelte-17ol6gt";
    			add_location(fieldset0, file, 89, 2, 1155);
    			label1.htmlFor = "projecturl";
    			label1.className = "svelte-17ol6gt";
    			add_location(label1, file, 94, 2, 1285);
    			input1.id = "projecturl";
    			input1.className = "svelte-17ol6gt";
    			add_location(input1, file, 95, 2, 1331);
    			fieldset1.className = "svelte-17ol6gt";
    			add_location(fieldset1, file, 93, 2, 1272);
    			label2.htmlFor = "maintainer";
    			label2.className = "svelte-17ol6gt";
    			add_location(label2, file, 98, 2, 1410);
    			input2.id = "maintainer";
    			input2.className = "svelte-17ol6gt";
    			add_location(input2, file, 99, 2, 1455);
    			fieldset2.className = "svelte-17ol6gt";
    			add_location(fieldset2, file, 97, 2, 1397);
    			label3.htmlFor = "email";
    			label3.className = "svelte-17ol6gt";
    			add_location(label3, file, 102, 2, 1532);
    			input3.id = "email";
    			input3.className = "svelte-17ol6gt";
    			add_location(input3, file, 103, 2, 1578);
    			fieldset3.className = "svelte-17ol6gt";
    			add_location(fieldset3, file, 101, 2, 1519);
    			div0.id = "inputs";
    			div0.className = "svelte-17ol6gt";
    			add_location(div0, file, 88, 0, 1135);
    			button.id = "copy-license";
    			button.className = "svelte-17ol6gt";
    			add_location(button, file, 108, 2, 1661);
    			textarea.id = "license-text";
    			textarea.readOnly = true;
    			textarea.value = textarea_value_value = "VIM LICENSE\n\nI)  There are no restrictions on distributing unmodified copies of " + ctx.project + " except\n    that they must include this license text.  You can also distribute\n    unmodified parts of " + ctx.project + ", likewise unrestricted except that they must\n    include this license text.  You are also allowed to include executables\n    that you made from the unmodified " + ctx.project + " sources, plus your own usage\n    examples and Vim scripts.\n\nII) It is allowed to distribute a modified (or extended) version of " + ctx.project + ",\n    including executables and/or source code, when the following four\n    conditions are met:\n    1) This license text must be included unmodified.\n    2) The modified " + ctx.project + " must be distributed in one of the following five ways:\n       a) If you make changes to " + ctx.project + " yourself, you must clearly describe in\n\t  the distribution how to contact you.  When the maintainer asks you\n\t  (in any way) for a copy of the modified " + ctx.project + " you distributed, you\n\t  must make your changes, including source code, available to the\n\t  maintainer without fee.  The maintainer reserves the right to\n\t  include your changes in the official version of " + ctx.project + ".  What the\n\t  maintainer will do with your changes and under what license they\n\t  will be distributed is negotiable.  If there has been no negotiation\n\t  then this license, or a later version, also applies to your changes.\n\t  The current maintainer is " + ctx.fullname + ".  If this\n\t  changes it will be announced in appropriate places (most likely\n\t  " + ctx.projecturl + ").  When it is completely\n\t  impossible to contact the maintainer, the obligation to send him\n\t  your changes ceases.  Once the maintainer has confirmed that he has\n\t  received your changes they will not have to be sent again.\n       b) If you have received a modified " + ctx.project + " that was distributed as\n\t  mentioned under a) you are allowed to further distribute it\n\t  unmodified, as mentioned at I).  If you make additional changes the\n\t  text under a) applies to those changes.\n       c) Provide all the changes, including source code, with every copy of\n\t  the modified " + ctx.project + " you distribute.  This may be done in the form of a\n\t  context diff.  You can choose what license to use for new code you\n\t  add.  The changes and their license must not restrict others from\n\t  making their own changes to the official version of " + ctx.project + ".\n       d) When you have a modified " + ctx.project + " which includes changes as mentioned\n\t  under c), you can distribute it without the source code for the\n\t  changes if the following three conditions are met:\n\t  - The license that applies to the changes permits you to distribute\n\t    the changes to the " + ctx.project + " maintainer without fee or restriction, and\n\t    permits the " + ctx.project + " maintainer to include the changes in the official\n\t    version of " + ctx.project + " without fee or restriction.\n\t  - You keep the changes for at least three years after last\n\t    distributing the corresponding modified " + ctx.project + ".  When the maintainer\n\t    or someone who you distributed the modified " + ctx.project + " to asks you (in\n\t    any way) for the changes within this period, you must make them\n\t    available to him.\n\t  - You clearly describe in the distribution how to contact you.  This\n\t    contact information must remain valid for at least three years\n\t    after last distributing the corresponding modified " + ctx.project + ", or as long\n\t    as possible.\n       e) When the GNU General Public License (GPL) applies to the changes,\n\t  you can distribute the modified " + ctx.project + " under the GNU GPL version 2 or\n\t  any later version.\n    3) A message must be added, at least in the output of the \":version\"\n       command and in the intro screen, such that the user of the modified " + ctx.project + "\n       is able to see that it was modified.  When distributing as mentioned\n       under 2)e) adding the message is only required for as far as this does\n       not conflict with the license used for the changes.\n    4) The contact information as required under 2)a) and 2)d) must not be\n       removed or changed, except that the person himself can make\n       corrections.\n\nIII) If you distribute a modified version of " + ctx.project + ", you are encouraged to use\n     the Vim license for your changes and make them available to the\n     maintainer, including the source code.  The preferred way to do this is\n     by e-mail or by uploading the files to a server and e-mailing the URL.\n     If the number of changes is small (e.g., a modified Makefile) e-mailing a\n     context diff will do.  The e-mail address to be used is\n     <" + ctx.email + ">\n\nIV)  It is not allowed to remove this license from the distribution of the " + ctx.project + "\n     sources, parts of it or from a modified version.  You may use this\n     license for previous " + ctx.project + " releases instead of the license that they came\n     with, at your option.";
    			textarea.className = "svelte-17ol6gt";
    			add_location(textarea, file, 109, 2, 1719);
    			div1.id = "buttons";
    			div1.className = "svelte-17ol6gt";
    			add_location(div1, file, 107, 0, 1640);
    			pre.id = "license-preview";
    			pre.className = "svelte-17ol6gt";
    			add_location(pre, file, 189, 0, 6595);
    			main.className = "svelte-17ol6gt";
    			add_location(main, file, 84, 0, 1105);
    			a.href = "https://github.com/othree/vim-license";
    			a.target = "_blank";
    			a.className = "svelte-17ol6gt";
    			add_location(a, file, 271, 1, 11467);
    			footer.className = "svelte-17ol6gt";
    			add_location(footer, file, 270, 0, 11457);

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
    			append(pre, t18);
    			append(pre, t19);
    			append(pre, t20);
    			append(pre, t21);
    			append(pre, t22);
    			append(pre, t23);
    			append(pre, t24);
    			append(pre, t25);
    			append(pre, t26);
    			append(pre, t27);
    			append(pre, t28);
    			append(pre, t29);
    			append(pre, t30);
    			append(pre, t31);
    			append(pre, t32);
    			append(pre, t33);
    			append(pre, t34);
    			append(pre, t35);
    			append(pre, t36);
    			append(pre, t37);
    			append(pre, t38);
    			append(pre, t39);
    			append(pre, t40);
    			append(pre, t41);
    			append(pre, t42);
    			append(pre, t43);
    			append(pre, t44);
    			append(pre, t45);
    			append(pre, t46);
    			append(pre, t47);
    			append(pre, t48);
    			append(pre, t49);
    			append(pre, t50);
    			append(pre, t51);
    			append(pre, t52);
    			append(pre, t53);
    			append(pre, t54);
    			append(pre, t55);
    			append(pre, t56);
    			append(pre, t57);
    			append(pre, t58);
    			append(pre, t59);
    			append(pre, t60);
    			append(pre, t61);
    			append(pre, t62);
    			append(pre, t63);
    			append(pre, t64);
    			append(pre, t65);
    			append(pre, t66);
    			append(pre, t67);
    			append(pre, t68);
    			append(pre, t69);
    			insert(target, t70, anchor);
    			insert(target, footer, anchor);
    			append(footer, a);
    		},

    		p: function update(changed, ctx) {
    			if (changed.project && (input0.value !== ctx.project)) input0.value = ctx.project;
    			if (changed.projecturl && (input1.value !== ctx.projecturl)) input1.value = ctx.projecturl;
    			if (changed.fullname && (input2.value !== ctx.fullname)) input2.value = ctx.fullname;
    			if (changed.email && (input3.value !== ctx.email)) input3.value = ctx.email;

    			if ((changed.project || changed.fullname || changed.projecturl || changed.email) && textarea_value_value !== (textarea_value_value = "VIM LICENSE\n\nI)  There are no restrictions on distributing unmodified copies of " + ctx.project + " except\n    that they must include this license text.  You can also distribute\n    unmodified parts of " + ctx.project + ", likewise unrestricted except that they must\n    include this license text.  You are also allowed to include executables\n    that you made from the unmodified " + ctx.project + " sources, plus your own usage\n    examples and Vim scripts.\n\nII) It is allowed to distribute a modified (or extended) version of " + ctx.project + ",\n    including executables and/or source code, when the following four\n    conditions are met:\n    1) This license text must be included unmodified.\n    2) The modified " + ctx.project + " must be distributed in one of the following five ways:\n       a) If you make changes to " + ctx.project + " yourself, you must clearly describe in\n\t  the distribution how to contact you.  When the maintainer asks you\n\t  (in any way) for a copy of the modified " + ctx.project + " you distributed, you\n\t  must make your changes, including source code, available to the\n\t  maintainer without fee.  The maintainer reserves the right to\n\t  include your changes in the official version of " + ctx.project + ".  What the\n\t  maintainer will do with your changes and under what license they\n\t  will be distributed is negotiable.  If there has been no negotiation\n\t  then this license, or a later version, also applies to your changes.\n\t  The current maintainer is " + ctx.fullname + ".  If this\n\t  changes it will be announced in appropriate places (most likely\n\t  " + ctx.projecturl + ").  When it is completely\n\t  impossible to contact the maintainer, the obligation to send him\n\t  your changes ceases.  Once the maintainer has confirmed that he has\n\t  received your changes they will not have to be sent again.\n       b) If you have received a modified " + ctx.project + " that was distributed as\n\t  mentioned under a) you are allowed to further distribute it\n\t  unmodified, as mentioned at I).  If you make additional changes the\n\t  text under a) applies to those changes.\n       c) Provide all the changes, including source code, with every copy of\n\t  the modified " + ctx.project + " you distribute.  This may be done in the form of a\n\t  context diff.  You can choose what license to use for new code you\n\t  add.  The changes and their license must not restrict others from\n\t  making their own changes to the official version of " + ctx.project + ".\n       d) When you have a modified " + ctx.project + " which includes changes as mentioned\n\t  under c), you can distribute it without the source code for the\n\t  changes if the following three conditions are met:\n\t  - The license that applies to the changes permits you to distribute\n\t    the changes to the " + ctx.project + " maintainer without fee or restriction, and\n\t    permits the " + ctx.project + " maintainer to include the changes in the official\n\t    version of " + ctx.project + " without fee or restriction.\n\t  - You keep the changes for at least three years after last\n\t    distributing the corresponding modified " + ctx.project + ".  When the maintainer\n\t    or someone who you distributed the modified " + ctx.project + " to asks you (in\n\t    any way) for the changes within this period, you must make them\n\t    available to him.\n\t  - You clearly describe in the distribution how to contact you.  This\n\t    contact information must remain valid for at least three years\n\t    after last distributing the corresponding modified " + ctx.project + ", or as long\n\t    as possible.\n       e) When the GNU General Public License (GPL) applies to the changes,\n\t  you can distribute the modified " + ctx.project + " under the GNU GPL version 2 or\n\t  any later version.\n    3) A message must be added, at least in the output of the \":version\"\n       command and in the intro screen, such that the user of the modified " + ctx.project + "\n       is able to see that it was modified.  When distributing as mentioned\n       under 2)e) adding the message is only required for as far as this does\n       not conflict with the license used for the changes.\n    4) The contact information as required under 2)a) and 2)d) must not be\n       removed or changed, except that the person himself can make\n       corrections.\n\nIII) If you distribute a modified version of " + ctx.project + ", you are encouraged to use\n     the Vim license for your changes and make them available to the\n     maintainer, including the source code.  The preferred way to do this is\n     by e-mail or by uploading the files to a server and e-mailing the URL.\n     If the number of changes is small (e.g., a modified Makefile) e-mailing a\n     context diff will do.  The e-mail address to be used is\n     <" + ctx.email + ">\n\nIV)  It is not allowed to remove this license from the distribution of the " + ctx.project + "\n     sources, parts of it or from a modified version.  You may use this\n     license for previous " + ctx.project + " releases instead of the license that they came\n     with, at your option.")) {
    				textarea.value = textarea_value_value;
    			}

    			if (changed.project) {
    				set_data(t18, ctx.project);
    				set_data(t20, ctx.project);
    				set_data(t22, ctx.project);
    				set_data(t24, ctx.project);
    				set_data(t26, ctx.project);
    				set_data(t28, ctx.project);
    				set_data(t30, ctx.project);
    				set_data(t32, ctx.project);
    			}

    			if (changed.fullname) {
    				set_data(t34, ctx.fullname);
    			}

    			if (changed.projecturl) {
    				set_data(t36, ctx.projecturl);
    			}

    			if (changed.project) {
    				set_data(t38, ctx.project);
    				set_data(t40, ctx.project);
    				set_data(t42, ctx.project);
    				set_data(t44, ctx.project);
    				set_data(t46, ctx.project);
    				set_data(t48, ctx.project);
    				set_data(t50, ctx.project);
    				set_data(t52, ctx.project);
    				set_data(t54, ctx.project);
    				set_data(t56, ctx.project);
    				set_data(t58, ctx.project);
    				set_data(t60, ctx.project);
    				set_data(t62, ctx.project);
    			}

    			if (changed.email) {
    				set_data(t64, ctx.email);
    			}

    			if (changed.project) {
    				set_data(t66, ctx.project);
    				set_data(t68, ctx.project);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(main);
    				detach(t70);
    				detach(footer);
    			}

    			run_all(dispose);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let fullname = 'Bram Moolenaar <Bram@vim.org>';
    let project = 'Vim';
    let projecturl = 'vim.sf.net, www.vim.org and/or comp.editors';
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

    	return {
    		fullname,
    		project,
    		projecturl,
    		email,
    		copy,
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
