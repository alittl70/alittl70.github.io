function buildHtmlCode(data) {
  const nameLine = `${data.firstName}${data.middleName ? ` ${data.middleName}` : ""}${data.nickname ? ` "${data.nickname}"` : ""} ${data.lastName} ${data.divider} ${data.mascotAdjective} ${data.mascotAnimal}`;

  const coursesHtml = data.courses
    .map((course) => `    <li><strong>${course.department} ${course.number} - ${course.name}</strong>: ${course.reason}</li>`)
    .join("\n");

  const linksHtml = data.links
    .map((link) => `    <li><a href="${link.href}" target="_blank" rel="noopener noreferrer">${link.name}</a></li>`)
    .join("\n");

  return `<h2>Introduction HTML</h2>
<h3>${nameLine}</h3>
<figure>
  <img src="${data.image}" alt="Picture of ${data.firstName} ${data.lastName}">
  <figcaption>${data.imageCaption}</figcaption>
</figure>
<p>${data.personalStatement}</p>
<ul>
  <li><strong>Personal Background:</strong> ${data.personalBackground}</li>
  <li><strong>Professional Background:</strong> ${data.professionalBackground}</li>
  <li><strong>Academic Background:</strong> ${data.academicBackground}</li>
  <li><strong>Background in this Subject:</strong> ${data.subjectBackground}</li>
  <li><strong>Primary Computer Platform:</strong> ${data.primaryComputer}</li>
  <li><strong>Courses I’m Taking & Why:</strong> ${data.coursesBackground}</li>
  <li><strong>Acknowledgement:</strong> ${data.acknowledgement} (${data.ackDate})</li>${data.funnyThing ? `
  <li><strong>Funny Thing:</strong> ${data.funnyThing}</li>` : ""}${data.extraShare ? `
  <li><strong>Something I Would Like to Share:</strong> ${data.extraShare}</li>` : ""}
</ul>
<h3>Courses</h3>
<ul>
${coursesHtml}
</ul>
<p><strong>Quote:</strong> “${data.quote}”<br><em>— ${data.quoteAuthor}</em></p>
<h3>Links</h3>
<ul>
${linksHtml}
</ul>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const htmlButton = document.getElementById("generateHtmlBtn");

  htmlButton.addEventListener("click", () => {
    const form = document.getElementById("form");
    const result = document.getElementById("result");
    const pageTitle = document.getElementById("page-title");

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = window.getFormData();
    const htmlCode = buildHtmlCode(data);

    pageTitle.textContent = "Introduction HTML";
    form.style.display = "none";

    result.innerHTML = `
      <section>
        <pre><code class="language-html">${window.escapeHtml(htmlCode)}</code></pre>
        <div class="reset-link-wrap">
          <a href="#" id="resetProgressLink">Reset and start again</a>
        </div>
      </section>
    `;

    if (window.hljs) {
      window.hljs.highlightAll();
    }

    const resetLink = document.getElementById("resetProgressLink");
    resetLink.addEventListener("click", (event) => {
      event.preventDefault();
      window.restoreFormToDefaults();
    });
  });
});