<script>
  import license from "./license";

  const createFileURL = string =>
    window.URL.createObjectURL(new Blob([string], { type: "text/plain" }));

  let project =
    (function() {
      const found = document.location.search
        .split(/[?&]/)
        .map(pair => {
          return pair.split("=");
        })
        .find(entry => {
          return entry[0] === "project";
        });

      if (found) {
        return decodeURIComponent(found[1]);
      }
    })() || "Vim";

  $: licenseText = license(project);
  $: blobURL = createFileURL(licenseText);
  $: link = `${document.location.protocol}//${document.location.host}${document.location.pathname}?project=${project}`;
  $: licenseeDetectable = project.length <= 22;

  const copy = () => {
    document.querySelector("#license-text").select();
    document.execCommand("copy");
  };
</script>

<style>
  main,
  footer {
    margin: 0 auto;
    width: 90%;
    max-width: 800px;
  }

  h1 {
    color: #007f00;
  }

  h2 a {
    color: #333;
    text-decoration: underline;
  }

  footer {
    display: flex;
    justify-content: space-between;
    margin: 2em auto 2em;
  }

  footer a,
  footer a:hover,
  footer a:visited {
    margin: 0 48px;
    width: 6em;
    color: #333;
    text-align: center;
    text-decoration: none;
    font-weight: 500;
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
    border-radius: 2px;
    padding: 2em 1em;
    overflow-x: auto;
    background-color: #fff;
  }

  #inputs {
    margin: 2em auto;
    border: 1px solid #666;
    border-radius: 2px;
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

  .error {
    color: red;
  }

  fieldset input:invalid {
    border-color: red;
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

  <h1>Vim License Gen</h1>

  <p>A web app to help generate Vim License text for your project.</p>

  <div id="inputs">
    <fieldset>
      <label for="project">Project Name</label>
      <input id="project" bind:value={project} required maxlength="35" />
      {#if licenseeDetectable === false}
        <span class="error">Too long for Github</span>
      {/if}
      <br />
      Link:
      <a href="?{project}">{link}</a>
    </fieldset>
  </div>

  <div id="buttons">
    <button id="copy-license" on:click={copy} class="button">Copy</button>
    <textarea id="license-text" readonly>{licenseText}</textarea>
    <a href={blobURL} download="LICENSE" class="button">Download</a>
  </div>

  <h2>
    <a href="{link}#license-preview">Preview</a>
  </h2>
  <pre id="license-preview">{licenseText}</pre>

</main>

<footer>
  <a
    href="https://github.com/othree/vim-license/blob/master/LICENSE"
    target="_blank">
    Vim License
  </a>
  <a href="https://github.com/othree/vim-license" target="_blank">GitHub</a>
</footer>
