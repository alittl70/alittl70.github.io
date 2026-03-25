document.addEventListener("DOMContentLoaded", () => {
  const generateHTMLBtn = document.getElementById("generateHTMLBtn");
  const form = document.getElementById("form");
  const output = document.getElementById("output");

  generateHTMLBtn.addEventListener("click", () => {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = getFormData();
    const htmlCode = buildHtmlCode(data);

    output.innerHTML = `
      <h2>Introduction HTML</h2>
      <pre><code class="language-html">${escapeHtml(htmlCode)}</code></pre>
      <p><a href="intro_form.html">Reset Form</a></p>
    `;

    form.style.display = "none";

    if (window.hljs) {
      hljs.highlightAll();
    }
  });
});