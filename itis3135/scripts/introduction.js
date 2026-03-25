let currentImageSrc = "/images/trip.jpg";
let initialCoursesMarkup = "";
let initialLinksMarkup = "";

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getCourseData() {
  const groups = document.querySelectorAll('input[name="courseGroup[]"]');
  const departments = document.querySelectorAll('input[name="courseDepartment[]"]');
  const numbers = document.querySelectorAll('input[name="courseNumber[]"]');
  const names = document.querySelectorAll('input[name="courseName[]"]');
  const reasons = document.querySelectorAll('textarea[name="courseReason[]"]');

  const courses = [];

  for (let i = 0; i < groups.length; i++) {
    courses.push({
      group: groups[i].value.trim(),
      department: departments[i].value.trim(),
      number: numbers[i].value.trim(),
      name: names[i].value.trim(),
      reason: reasons[i].value.trim()
    });
  }

  return courses;
}

function getLinkData() {
  return [
    {
      label: document.getElementById("linkLabel1").value.trim(),
      url: document.getElementById("linkUrl1").value.trim()
    },
    {
      label: document.getElementById("linkLabel2").value.trim(),
      url: document.getElementById("linkUrl2").value.trim()
    },
    {
      label: document.getElementById("linkLabel3").value.trim(),
      url: document.getElementById("linkUrl3").value.trim()
    },
    {
      label: document.getElementById("linkLabel4").value.trim(),
      url: document.getElementById("linkUrl4").value.trim()
    },
    {
      label: document.getElementById("linkLabel5").value.trim(),
      url: document.getElementById("linkUrl5").value.trim()
    }
  ];
}

function getFormData() {
  return {
    firstName: document.getElementById("firstName").value.trim(),
    middleName: document.getElementById("middleName").value.trim(),
    nickname: document.getElementById("nickname").value.trim(),
    lastName: document.getElementById("lastName").value.trim(),
    acknowledgement: document.getElementById("acknowledgement").value.trim(),
    ackDate: document.getElementById("ackDate").value,
    mascotAdjective: document.getElementById("mascotAdjective").value.trim(),
    mascotAnimal: document.getElementById("mascotAnimal").value.trim(),
    divider: document.getElementById("divider").value.trim(),
    pictureCaption: document.getElementById("pictureCaption").value.trim(),
    personalStatement: document.getElementById("personalStatement").value.trim(),
    personalBackground: document.getElementById("personalBackground").value.trim(),
    professionalBackground: document.getElementById("professionalBackground").value.trim(),
    academicBackground: document.getElementById("academicBackground").value.trim(),
    primaryWorkComputer: document.getElementById("primaryWorkComputer").value.trim(),
    backupWorkComputer: document.getElementById("backupWorkComputer").value.trim(),
    funnyThing: document.getElementById("funnyThing").value.trim(),
    extraShare: document.getElementById("extraShare").value.trim(),
    quote: "The real voyage of discovery consists not in seeking new landscapes, but in having new eyes.",
    quoteAuthor: "Marcel Proust",
    quoteSource: "https://stanphelps.com/the-voyage-of-discovery-is-not-in-seeking-new-landscapes-but-in-having-new-eyes-marcel-proust/",
    courses: getCourseData(),
    links: getLinkData()
  };
}

function buildGroupedCoursesHtml(courses) {
  const grouped = {};

  courses.forEach((course) => {
    const groupName = course.group || "Courses";
    if (!grouped[groupName]) {
      grouped[groupName] = [];
    }
    grouped[groupName].push(course);
  });

  let html = "";

  Object.keys(grouped).forEach((groupName) => {
    html += `
      <li>
        <strong>${escapeHtml(groupName)}</strong>
        <ol>
    `;

    grouped[groupName].forEach((course) => {
      html += `
          <li>${escapeHtml(course.department)} ${escapeHtml(course.number)} - ${escapeHtml(course.name)}: ${escapeHtml(course.reason)}</li>
      `;
    });

    html += `
        </ol>
      </li>
    `;
  });

  return html;
}

function renderIntroductionPage(data, headingText) {
  const groupedCoursesHtml = buildGroupedCoursesHtml(data.courses);

  const funnyFactItem = data.funnyThing
    ? `<li><strong>Funny / Interesting Fact:</strong> ${escapeHtml(data.funnyThing)}</li>`
    : "";

  const extraShareItem = data.extraShare
    ? `<li><strong>I’d also like to share:</strong> ${escapeHtml(data.extraShare)}</li>`
    : "";

  return `
    <h2>${escapeHtml(headingText)}</h2>

    <figure>
      <img src="${escapeHtml(currentImageSrc)}" alt="Photo of ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}" width="400">
      <figcaption>${escapeHtml(data.pictureCaption)}</figcaption>
    </figure>

    <p>
      ${escapeHtml(data.personalStatement)}
    </p>

    <h3>Fun Facts About Me</h3>
    <ul>
      <li><strong>Personal Background:</strong> ${escapeHtml(data.personalBackground)}</li>
      <li><strong>Professional Background:</strong> ${escapeHtml(data.professionalBackground)}</li>
      <li><strong>Academic Background:</strong> ${escapeHtml(data.academicBackground)}</li>
      <li><strong>Primary Work Computer:</strong> ${escapeHtml(data.primaryWorkComputer)}</li>
      <li><strong>Backup Work Computer / Location Plan:</strong> ${escapeHtml(data.backupWorkComputer)}</li>
      ${funnyFactItem}
      ${extraShareItem}
    </ul>

    <h3>Courses I’m Taking &amp; Why</h3>
    <ol>
      ${groupedCoursesHtml}
    </ol>

    <h3>Favorite Quote</h3>
    <blockquote>
      “${escapeHtml(data.quote)}”
      <cite>
        — ${escapeHtml(data.quoteAuthor)}
        (<a href="${escapeHtml(data.quoteSource)}" target="_blank" rel="noopener">source</a>)
      </cite>
    </blockquote>

    <p>
      <a href="intro_form.html">Reset Form</a>
    </p>
  `;
}

function buildHtmlCode(data) {
  const groupedCoursesHtml = buildGroupedCoursesHtml(data.courses);

  const funnyFactItem = data.funnyThing
    ? `      <li><strong>Funny / Interesting Fact:</strong> ${escapeHtml(data.funnyThing)}</li>\n`
    : "";

  const extraShareItem = data.extraShare
    ? `      <li><strong>I’d also like to share:</strong> ${escapeHtml(data.extraShare)}</li>\n`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="styles/default.css">
  <title>Introduction HTML</title>
</head>
<body>
  <header data-include="components/header.html"></header>

  <main>
    <h2>Introduction HTML</h2>

    <figure>
      <img src="${escapeHtml(currentImageSrc)}" alt="Photo of ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}" width="400">
      <figcaption>${escapeHtml(data.pictureCaption)}</figcaption>
    </figure>

    <p>
      ${escapeHtml(data.personalStatement)}
    </p>

    <h3>Fun Facts About Me</h3>
    <ul>
      <li><strong>Personal Background:</strong> ${escapeHtml(data.personalBackground)}</li>
      <li><strong>Professional Background:</strong> ${escapeHtml(data.professionalBackground)}</li>
      <li><strong>Academic Background:</strong> ${escapeHtml(data.academicBackground)}</li>
      <li><strong>Primary Work Computer:</strong> ${escapeHtml(data.primaryWorkComputer)}</li>
      <li><strong>Backup Work Computer / Location Plan:</strong> ${escapeHtml(data.backupWorkComputer)}</li>
${funnyFactItem}${extraShareItem}    </ul>

    <h3>Courses I’m Taking &amp; Why</h3>
    <ol>
${groupedCoursesHtml}
    </ol>

    <h3>Favorite Quote</h3>
    <blockquote>
      “${escapeHtml(data.quote)}”
      <cite>
        — ${escapeHtml(data.quoteAuthor)}
        (<a href="${escapeHtml(data.quoteSource)}" target="_blank" rel="noopener">source</a>)
      </cite>
    </blockquote>

    <p>
      <a href="intro_form.html">Reset Form</a>
    </p>
  </main>

  <footer data-include="components/footer.html"></footer>
</body>
</html>`;
}

function buildJsonData(data) {
  return {
    first_name: data.firstName,
    middle_name_or_initial: data.middleName,
    preferred_name: data.nickname,
    last_name: data.lastName,
    acknowledgement_statement: data.acknowledgement,
    acknowledgement_date: data.ackDate,
    mascot_adjective: data.mascotAdjective,
    mascot_animal: data.mascotAnimal,
    divider: data.divider,
    image: currentImageSrc,
    image_caption: data.pictureCaption,
    personal_statement: data.personalStatement,
    personal_background: data.personalBackground,
    professional_background: data.professionalBackground,
    academic_background: data.academicBackground,
    primary_work_computer: data.primaryWorkComputer,
    backup_work_computer_or_location_plan: data.backupWorkComputer,
    funny_thing: data.funnyThing,
    something_to_share: data.extraShare,
    quote: data.quote,
    quote_author: data.quoteAuthor,
    quote_source: data.quoteSource,
    courses: data.courses,
    links: data.links
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const output = document.getElementById("output");
  const clearBtn = document.getElementById("clearBtn");
  const addCourseBtn = document.getElementById("addCourseBtn");
  const pictureInput = document.getElementById("picture");
  const picturePreview = document.getElementById("defaultPicturePreview");
  const coursesSection = document.getElementById("coursesSection");
  const linksSection = document.getElementById("linksSection");

  initialCoursesMarkup = coursesSection.innerHTML;
  initialLinksMarkup = linksSection.innerHTML;

  pictureInput.addEventListener("change", () => {
    const file = pictureInput.files[0];
    if (file) {
      currentImageSrc = URL.createObjectURL(file);
      picturePreview.src = currentImageSrc;
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = getFormData();
    output.innerHTML = renderIntroductionPage(data, "Introduction Form");
    form.style.display = "none";
  });

  clearBtn.addEventListener("click", () => {
    const allFields = form.querySelectorAll("input, textarea");

    allFields.forEach((field) => {
      if (field.type === "button" || field.type === "submit" || field.type === "reset") {
        return;
      }
      field.value = "";
    });

    pictureInput.value = "";
    picturePreview.src = "";
    currentImageSrc = "";
  });

  form.addEventListener("reset", () => {
    setTimeout(() => {
      coursesSection.innerHTML = initialCoursesMarkup;
      linksSection.innerHTML = initialLinksMarkup;
      pictureInput.value = "";
      picturePreview.src = "images/trip.jpg";
      currentImageSrc = "images/trip.jpg";
    }, 0);
  });

  addCourseBtn.addEventListener("click", () => {
    const courseEntry = document.createElement("div");
    courseEntry.className = "course-entry";

    courseEntry.innerHTML = `
      <label>Course Group</label>
      <input type="text" name="courseGroup[]" placeholder="Ex: Major Related Courses" required>

      <label>Department</label>
      <input type="text" name="courseDepartment[]" placeholder="Ex: ITIS" required>

      <label>Number</label>
      <input type="text" name="courseNumber[]" placeholder="Ex: 3135" required>

      <label>Name</label>
      <input type="text" name="courseName[]" placeholder="Enter course name" required>

      <label>Reason</label>
      <textarea name="courseReason[]" placeholder="Enter your reason" required></textarea>

      <button type="button" class="deleteCourseBtn">Delete Course</button>
    `;

    coursesSection.appendChild(courseEntry);
  });

  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("deleteCourseBtn")) {
      const courseCard = event.target.closest(".course-entry");
      if (courseCard) {
        courseCard.remove();
      }
    }
  });
});