function buildJsonData(data) {
  return {
    first_name: data.firstName,
    preferred_name: data.nickname,
    middle_initial: data.middleName,
    last_name: data.lastName,
    acknowledgement_statement: data.acknowledgement,
    acknowledgement_date: data.ackDate,
    divider: data.divider,
    mascot_adjective: data.mascotAdjective,
    mascot_animal: data.mascotAnimal,
    image: data.image,
    image_caption: data.imageCaption,
    personal_statement: data.personalStatement,
    personal_background: data.personalBackground,
    professional_background: data.professionalBackground,
    academic_background: data.academicBackground,
    subject_background: data.subjectBackground,
    primary_computer: data.primaryComputer,
    courses_background: data.coursesBackground,
    quote: data.quote,
    quote_author: data.quoteAuthor,
    funny_thing: data.funnyThing,
    something_to_share: data.extraShare,
    courses: data.courses,
    links: data.links
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const jsonButton = document.getElementById("generateJsonBtn");

  jsonButton.addEventListener("click", () => {
    const form = document.getElementById("form");
    const result = document.getElementById("result");
    const pageTitle = document.getElementById("page-title");

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = window.getFormData();
    const jsonText = JSON.stringify(buildJsonData(data), null, 2);

    pageTitle.textContent = "Introduction JSON";
    form.style.display = "none";

    result.innerHTML = `
      <section>
        <pre><code class="language-json">${window.escapeHtml(jsonText)}</code></pre>
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