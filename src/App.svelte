<script>

import license from './license';

const createFileURL = string => window.URL.createObjectURL(new Blob([string], {type: 'text/plain'}));

let project = 'Vim';
let projecturl = 'vim.sf.net, www.vim.org and/or comp.editors';
let fullname = 'Bram Moolenaar <Bram@vim.org>';
let email = 'maintainer@vim.org';

$: licenseText = license(project, projecturl, fullname, email);
$: blobURL = createFileURL(licenseText);

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
	padding: 1em 1.5em 0.5em;
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

#buttons .button {
	position: relative;
	border: 1px solid #666;
	border-radius: 4px;
	padding: 6px 24px;
	color: #000;
	background: #fff;
}

#buttons .button:hover {
	text-decoration: none;
	box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.5);
}
#buttons .button:active {
	top: 2px;
	left: 1px;
	box-shadow: none;
}

</style>

<main>

<h1>Vim License</h1>

<p>A web app to help generate Vim License text for your project.</p>

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
  <button id="copy-license" on:click={copy} class="button">Copy</button>
  <textarea id="license-text" readonly>{licenseText}</textarea>
	<a href={blobURL} download="LICENSE" class="button">Download</a>
</div>

<pre id="license-preview">{licenseText}</pre>

</main>

<footer>
	<a href="https://github.com/othree/vim-license" target="_blank">GitHub</a>
</footer>