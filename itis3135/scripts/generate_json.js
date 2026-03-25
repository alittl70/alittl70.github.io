document.addEventListener("DOMContentLoaded", () => {
  const generateJSONBtn = document.getElementById("generateJSONBtn");
  const form = document.getElementById("form");
  const output = document.getElementById("output");

  generateJSONBtn.addEventListener("click", () => {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = getFormData();
    const jsonData = buildJsonData(data);
    const jsonText = JSON.stringify(jsonData, null, 2);

    output.innerHTML = `
      <h2>Introduction JSON</h2>
      <pre><code class="language-json">${escapeHtml(jsonText)}</code></pre>
      <p><a href="intro_form.html">Reset Form</a></p>
    `;

    form.style.display = "none";

    if (window.hljs) {
      hljs.highlightAll();
    }
  });
});