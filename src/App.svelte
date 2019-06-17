<script>

import license from './license';

let project = 'Vim';
let projecturl = 'vim.sf.net, www.vim.org and/or comp.editors';
let fullname = 'Bram Moolenaar <Bram@vim.org>';
let email = 'maintainer@vim.org';

$: licenseText = license(project, projecturl, name, email);

const copy = () => {
  document.querySelector("#license-text").select();
  document.execCommand("copy");
};

</script>

<style>

main, footer {
	margin: 0 auto;
	width: 90%;
	max-width: 800px;
}

footer {
	margin: 2em auto 1em;
}

footer a,
footer a:hover,
footer a:visited {
	color: #000;
	text-decoration: none;
}

footer a:hover {
	text-decoration: underline;
}

#license-text {
  opacity: 0;
  width: 1px;
  height: 1px;
  color: transparent;
}

#license-preview {
	margin: 2em auto;
	border: 1px solid #666;
	padding: 2em 1em;
	background-color: #fff;
}

#inputs {
	margin: 2em auto;
	border: 1px solid #666;
	padding: 1em 1em;
	background-color: #fff;
}

fieldset {
	border: none;
	margin: 1em 0;
	padding: 0;
}

fieldset label {
	margin-bottom: 6px;
}

fieldset input {
	width: 80%;
}

#buttons {
	margin: 2em auto 1em;
}

#buttons button {
	border: 1px solid #666;
	border-radius: 4px;
	padding: 6px 24px;
}

</style>

<main>

<h1>Vim License</h1>

<div id="inputs">
  <fieldset>
  <label for="project">Project Name</label>
  <input id="project" bind:value={project} />
  </fieldset>
  <fieldset>
  <label for="projecturl">Project URL</label>
  <input id="projecturl" bind:value={projecturl} />
  </fieldset>
  <fieldset>
  <label for="maintainer">Maintainer</label>
  <input id="maintainer" bind:value={fullname} />
  </fieldset>
  <fieldset>
  <label for="email">Maintainer Email</label>
  <input id="email" bind:value={email} />
  </fieldset>
</div>

<div id="buttons">
  <button id="copy-license" on:click={copy}>Copy</button>
  <textarea id="license-text" readonly>{licenseText}</textarea>
</div>

<pre id="license-preview">{licenseText}</pre>

</main>

<footer>
	<a href="https://github.com/othree/vim-license" target="_blank">GitHub</a>
</footer>