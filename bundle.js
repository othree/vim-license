var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function o(e){e.forEach(t)}function i(e){return"function"==typeof e}function r(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function a(e,t){e.appendChild(t)}function c(e,t,n){e.insertBefore(t,n||null)}function s(e){e.parentNode.removeChild(e)}function u(e){return document.createElement(e)}function l(e){return document.createTextNode(e)}function d(){return l(" ")}function h(e,t,n,o){return e.addEventListener(t,n,o),()=>e.removeEventListener(t,n,o)}function f(e,t){t=""+t,e.data!==t&&(e.data=t)}let p;function m(e){p=e}const g=[],y=Promise.resolve();let j=!1;const b=[],v=[],w=[];function $(e){v.push(e)}function x(){const e=new Set;do{for(;g.length;){const e=g.shift();m(e),_(e.$$)}for(;b.length;)b.shift()();for(;v.length;){const t=v.pop();e.has(t)||(t(),e.add(t))}}while(g.length);for(;w.length;)w.pop()();j=!1}function _(e){e.fragment&&(e.update(e.dirty),o(e.before_render),e.fragment.p(e.dirty,e.ctx),e.dirty=null,e.after_render.forEach($))}function I(e,t){e.$$.dirty||(g.push(e),j||(j=!0,y.then(x)),e.$$.dirty=n()),e.$$.dirty[t]=!0}function k(r,a,c,s,u,l){const d=p;m(r);const h=a.props||{},f=r.$$={fragment:null,ctx:null,props:l,update:e,not_equal:u,bound:n(),on_mount:[],on_destroy:[],before_render:[],after_render:[],context:new Map(d?d.$$.context:[]),callbacks:n(),dirty:null};let g=!1;var y;f.ctx=c?c(r,h,(e,t)=>{f.ctx&&u(f.ctx[e],f.ctx[e]=t)&&(f.bound[e]&&f.bound[e](t),g&&I(r,e))}):h,f.update(),g=!0,o(f.before_render),f.fragment=s(f.ctx),a.target&&(a.hydrate?f.fragment.l((y=a.target,Array.from(y.childNodes))):f.fragment.c(),a.intro&&r.$$.fragment.i&&r.$$.fragment.i(),function(e,n,r){const{fragment:a,on_mount:c,on_destroy:s,after_render:u}=e.$$;a.m(n,r),$(()=>{const n=c.map(t).filter(i);s?s.push(...n):o(n),e.$$.on_mount=[]}),u.forEach($)}(r,a.target,a.anchor),x()),m(d)}class T{$destroy(){var t,n;n=!0,(t=this).$$&&(o(t.$$.on_destroy),t.$$.fragment.d(n),t.$$.on_destroy=t.$$.fragment=null,t.$$.ctx={}),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(){}}function E(t){var n,i,r,p,m,g,y,j,b,v,w,$,x,_,I,k,T,E,L,C,N,P,W,M,V,Y,G,F,U,q,B,O,A,R,S,z,D,H,J,K,Q,X,Z,ee,te,ne,oe,ie,re,ae,ce,se,ue,le,de,he,fe,pe,me,ge,ye,je,be,ve,we,$e,xe,_e,Ie,ke,Te,Ee,Le,Ce,Ne,Pe,We;return{c(){(n=u("h1")).textContent="Vim License",i=d(),r=u("fieldset"),(p=u("label")).textContent="Maintainer",m=d(),g=u("input"),y=d(),j=u("fieldset"),(b=u("label")).textContent="Project Name",v=d(),w=u("input"),$=d(),x=u("fieldset"),(_=u("label")).textContent="Project URL",I=d(),k=u("input"),T=d(),E=u("fieldset"),(L=u("label")).textContent="Maintainer Email",C=d(),N=u("input"),P=d(),W=u("pre"),M=l("VIM LICENSE\n\nI)  There are no restrictions on distributing unmodified copies of "),V=l(t.project),Y=l(" except\n    that they must include this license text.  You can also distribute\n    unmodified parts of "),G=l(t.project),F=l(", likewise unrestricted except that they must\n    include this license text.  You are also allowed to include executables\n    that you made from the unmodified "),U=l(t.project),q=l(" sources, plus your own usage\n    examples and Vim scripts.\n\nII) It is allowed to distribute a modified (or extended) version of "),B=l(t.project),O=l(",\n    including executables and/or source code, when the following four\n    conditions are met:\n    1) This license text must be included unmodified.\n    2) The modified "),A=l(t.project),R=l(" must be distributed in one of the following five ways:\n       a) If you make changes to "),S=l(t.project),z=l(" yourself, you must clearly describe in\n\t  the distribution how to contact you.  When the maintainer asks you\n\t  (in any way) for a copy of the modified "),D=l(t.project),H=l(" you distributed, you\n\t  must make your changes, including source code, available to the\n\t  maintainer without fee.  The maintainer reserves the right to\n\t  include your changes in the official version of "),J=l(t.project),K=l(".  What the\n\t  maintainer will do with your changes and under what license they\n\t  will be distributed is negotiable.  If there has been no negotiation\n\t  then this license, or a later version, also applies to your changes.\n\t  The current maintainer is "),Q=l(t.fullname),X=l(".  If this\n\t  changes it will be announced in appropriate places (most likely\n\t  "),Z=l(t.projecturl),ee=l(").  When it is completely\n\t  impossible to contact the maintainer, the obligation to send him\n\t  your changes ceases.  Once the maintainer has confirmed that he has\n\t  received your changes they will not have to be sent again.\n       b) If you have received a modified "),te=l(t.project),ne=l(" that was distributed as\n\t  mentioned under a) you are allowed to further distribute it\n\t  unmodified, as mentioned at I).  If you make additional changes the\n\t  text under a) applies to those changes.\n       c) Provide all the changes, including source code, with every copy of\n\t  the modified "),oe=l(t.project),ie=l(" you distribute.  This may be done in the form of a\n\t  context diff.  You can choose what license to use for new code you\n\t  add.  The changes and their license must not restrict others from\n\t  making their own changes to the official version of "),re=l(t.project),ae=l(".\n       d) When you have a modified "),ce=l(t.project),se=l(" which includes changes as mentioned\n\t  under c), you can distribute it without the source code for the\n\t  changes if the following three conditions are met:\n\t  - The license that applies to the changes permits you to distribute\n\t    the changes to the "),ue=l(t.project),le=l(" maintainer without fee or restriction, and\n\t    permits the "),de=l(t.project),he=l(" maintainer to include the changes in the official\n\t    version of "),fe=l(t.project),pe=l(" without fee or restriction.\n\t  - You keep the changes for at least three years after last\n\t    distributing the corresponding modified "),me=l(t.project),ge=l(".  When the maintainer\n\t    or someone who you distributed the modified "),ye=l(t.project),je=l(" to asks you (in\n\t    any way) for the changes within this period, you must make them\n\t    available to him.\n\t  - You clearly describe in the distribution how to contact you.  This\n\t    contact information must remain valid for at least three years\n\t    after last distributing the corresponding modified "),be=l(t.project),ve=l(", or as long\n\t    as possible.\n       e) When the GNU General Public License (GPL) applies to the changes,\n\t  you can distribute the modified "),we=l(t.project),$e=l(' under the GNU GPL version 2 or\n\t  any later version.\n    3) A message must be added, at least in the output of the ":version"\n       command and in the intro screen, such that the user of the modified '),xe=l(t.project),_e=l("\n       is able to see that it was modified.  When distributing as mentioned\n       under 2)e) adding the message is only required for as far as this does\n       not conflict with the license used for the changes.\n    4) The contact information as required under 2)a) and 2)d) must not be\n       removed or changed, except that the person himself can make\n       corrections.\n\nIII) If you distribute a modified version of "),Ie=l(t.project),ke=l(", you are encouraged to use\n     the Vim license for your changes and make them available to the\n     maintainer, including the source code.  The preferred way to do this is\n     by e-mail or by uploading the files to a server and e-mailing the URL.\n     If the number of changes is small (e.g., a modified Makefile) e-mailing a\n     context diff will do.  The e-mail address to be used is\n     <"),Te=l(t.email),Ee=l(">\n\nIV)  It is not allowed to remove this license from the distribution of the "),Le=l(t.project),Ce=l("\n     sources, parts of it or from a modified version.  You may use this\n     license for previous "),Ne=l(t.project),Pe=l(" releases instead of the license that they came\n     with, at your option."),p.htmlFor="maintainer",g.id="maintainer",b.htmlFor="project",w.id="project",_.htmlFor="projecturl",k.id="projecturl",L.htmlFor="email",N.id="email",We=[h(g,"input",t.input0_input_handler),h(w,"input",t.input1_input_handler),h(k,"input",t.input2_input_handler),h(N,"input",t.input3_input_handler)]},m(e,o){c(e,n,o),c(e,i,o),c(e,r,o),a(r,p),a(r,m),a(r,g),g.value=t.fullname,c(e,y,o),c(e,j,o),a(j,b),a(j,v),a(j,w),w.value=t.project,c(e,$,o),c(e,x,o),a(x,_),a(x,I),a(x,k),k.value=t.projecturl,c(e,T,o),c(e,E,o),a(E,L),a(E,C),a(E,N),N.value=t.email,c(e,P,o),c(e,W,o),a(W,M),a(W,V),a(W,Y),a(W,G),a(W,F),a(W,U),a(W,q),a(W,B),a(W,O),a(W,A),a(W,R),a(W,S),a(W,z),a(W,D),a(W,H),a(W,J),a(W,K),a(W,Q),a(W,X),a(W,Z),a(W,ee),a(W,te),a(W,ne),a(W,oe),a(W,ie),a(W,re),a(W,ae),a(W,ce),a(W,se),a(W,ue),a(W,le),a(W,de),a(W,he),a(W,fe),a(W,pe),a(W,me),a(W,ge),a(W,ye),a(W,je),a(W,be),a(W,ve),a(W,we),a(W,$e),a(W,xe),a(W,_e),a(W,Ie),a(W,ke),a(W,Te),a(W,Ee),a(W,Le),a(W,Ce),a(W,Ne),a(W,Pe)},p(e,t){e.fullname&&g.value!==t.fullname&&(g.value=t.fullname),e.project&&w.value!==t.project&&(w.value=t.project),e.projecturl&&k.value!==t.projecturl&&(k.value=t.projecturl),e.email&&N.value!==t.email&&(N.value=t.email),e.project&&(f(V,t.project),f(G,t.project),f(U,t.project),f(B,t.project),f(A,t.project),f(S,t.project),f(D,t.project),f(J,t.project)),e.fullname&&f(Q,t.fullname),e.projecturl&&f(Z,t.projecturl),e.project&&(f(te,t.project),f(oe,t.project),f(re,t.project),f(ce,t.project),f(ue,t.project),f(de,t.project),f(fe,t.project),f(me,t.project),f(ye,t.project),f(be,t.project),f(we,t.project),f(xe,t.project),f(Ie,t.project)),e.email&&f(Te,t.email),e.project&&(f(Le,t.project),f(Ne,t.project))},i:e,o:e,d(e){e&&(s(n),s(i),s(r),s(y),s(j),s($),s(x),s(T),s(E),s(P),s(W)),o(We)}}}function L(e,t,n){let o="Bram Moolenaar <Bram@vim.org>",i="Vim",r="vim.sf.net, www.vim.org and/or comp.editors",a="maintainer@vim.org";return{fullname:o,project:i,projecturl:r,email:a,input0_input_handler:function(){o=this.value,n("fullname",o)},input1_input_handler:function(){i=this.value,n("project",i)},input2_input_handler:function(){r=this.value,n("projecturl",r)},input3_input_handler:function(){a=this.value,n("email",a)}}}return new class extends T{constructor(e){super(),k(this,e,L,E,r,[])}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
