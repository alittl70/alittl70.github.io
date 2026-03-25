let currentImageSrc = "/images/trip.jpg";
let initialFormMarkup = "";
let initialTitle = "Introduction Form";

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDisplayName(data) {
  let fullName = data.firstName;

  if (data.middleName) {
    fullName += ` ${data.middleName}`;
  }

  if (data.nickname) {
    fullName += ` "${data.nickname}"`;
  }

  fullName += ` ${data.lastName}`;

  return fullName;
}

function getCourses() {
  const departments = document.querySelectorAll('input[name="courseDepartment[]"]');
  const numbers = document.querySelectorAll('input[name="courseNumber[]"]');
  const names = document.querySelectorAll('input[name="courseName[]"]');
  const reasons = document.querySelectorAll('textarea[name="courseReason[]"]');

  const courses = [];

  for (let i = 0; i < departments.length; i++) {
    courses.push({
      department: departments[i].value.trim(),
      number: numbers[i].value.trim(),
      name: names[i].value.trim(),
      reason: reasons[i].value.trim()
    });
  }

  return courses;
}

function getLinks() {
  return [
    {
      name: document.getElementById("linkName1").value.trim(),
      href: document.getElementById("linkHref1").value.trim()
    },
    {
      name: document.getElementById("linkName2").value.trim(),
      href: document.getElementById("linkHref2").value.trim()
    },
    {
      name: document.getElementById("linkName3").value.trim(),
      href: document.getElementById("linkHref3").value.trim()
    },
    {
      name: document.getElementById("linkName4").value.trim(),
      href: document.getElementById("linkHref4").value.trim()
    },
    {
      name: document.getElementById("linkName5").value.trim(),
      href: document.getElementById("linkHref5").value.trim()
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
    image: currentImageSrc,
    imageCaption: document.getElementById("pictureCaption").value.trim(),
    personalStatement: document.getElementById("personalStatement").value.trim(),
    personalBackground: document.getElementById("personalBackground").value.trim(),
    professionalBackground: document.getElementById("professionalBackground").value.trim(),
    academicBackground: document.getElementById("academicBackground").value.trim(),
    subjectBackground: document.getElementById("subjectBackground").value.trim(),
    primaryComputer: document.getElementById("primaryComputer").value.trim(),
    coursesBackground: document.getElementById("coursesBackground").value.trim(),
    funnyThing: document.getElementById("funnyThing").value.trim(),
    extraShare: document.getElementById("extraShare").value.trim(),
    quote: document.getElementById("quote").value.trim(),
    quoteAuthor: document.getElementById("quoteAuthor").value.trim(),
    courses: getCourses(),
    links: getLinks()
  };
}

function buildIntroHtml(data) {
  const nameLine = `${escapeHtml(formatDisplayName(data))} ${escapeHtml(data.divider)} ${escapeHtml(data.mascotAdjective)} ${escapeHtml(data.mascotAnimal)}`;

  const coursesHtml = data.courses
    .map((course) => `
      <li>
        <strong>${escapeHtml(course.department)} ${escapeHtml(course.number)} - ${escapeHtml(course.name)}</strong>:
        ${escapeHtml(course.reason)}
      </li>
    `)
    .join("");

  const linksHtml = data.links
    .map((link) => `
      <li>
        <a href="${escapeHtml(link.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.name)}</a>
      </li>
    `)
    .join("");

  return `
    <h3>${nameLine}</h3>

    <figure>
      <img src="${escapeHtml(data.image)}" alt="Picture of ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}">
      <figcaption>${escapeHtml(data.imageCaption)}</figcaption>
    </figure>

    <p>${escapeHtml(data.personalStatement)}</p>

    <ul>
      <li><strong>Personal Background:</strong> ${escapeHtml(data.personalBackground)}</li>
      <li><strong>Professional Background:</strong> ${escapeHtml(data.professionalBackground)}</li>
      <li><strong>Academic Background:</strong> ${escapeHtml(data.academicBackground)}</li>
      <li><strong>Background in this Subject:</strong> ${escapeHtml(data.subjectBackground)}</li>
      <li><strong>Primary Computer Platform:</strong> ${escapeHtml(data.primaryComputer)}</li>
      <li><strong>Courses I’m Taking & Why:</strong> ${escapeHtml(data.coursesBackground)}</li>
      <li><strong>Acknowledgement:</strong> ${escapeHtml(data.acknowledgement)} (${escapeHtml(data.ackDate)})</li>
      ${data.funnyThing ? `<li><strong>Funny Thing:</strong> ${escapeHtml(data.funnyThing)}</li>` : ""}
      ${data.extraShare ? `<li><strong>Something I Would Like to Share:</strong> ${escapeHtml(data.extraShare)}</li>` : ""}
    </ul>

    <h3>Courses</h3>
    <ul>
      ${coursesHtml}
    </ul>

    <p>
      <strong>Quote:</strong> “${escapeHtml(data.quote)}”
      <br>
      <em>— ${escapeHtml(data.quoteAuthor)}</em>
    </p>

    <h3>Links</h3>
    <ul>
      ${linksHtml}
    </ul>

    <div class="reset-link-wrap">
      <a href="#" id="resetProgressLink">Reset and start again</a>
    </div>
  `;
}

function showIntroduction() {
  const form = document.getElementById("form");
  const result = document.getElementById("result");
  const pageTitle = document.getElementById("page-title");

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = getFormData();

  pageTitle.textContent = "Introduction";
  form.style.display = "none";
  result.innerHTML = buildIntroHtml(data);
  attachResetProgressHandler();
}

function clearFormFields() {
  const form = document.getElementById("form");
  const elements = Array.from(form.querySelectorAll("input, textarea"));

  elements.forEach((element) => {
    if (element.type === "button" || element.type === "submit" || element.type === "reset" || element.type === "file") {
      if (element.type === "file") {
        element.value = "";
      }
      return;
    }

    element.value = "";
  });

  currentImageSrc = "images/trip.jpg";
  const picturePreview = document.getElementById("picturePreview");
  if (picturePreview) {
    picturePreview.src = currentImageSrc;
  }
}

function attachResetProgressHandler() {
  const resetLink = document.getElementById("resetProgressLink");
  if (!resetLink) {
    return;
  }

  resetLink.addEventListener("click", (event) => {
    event.preventDefault();
    restoreFormToDefaults();
  });
}

function restoreFormToDefaults() {
  const form = document.getElementById("form");
  const result = document.getElementById("result");
  const pageTitle = document.getElementById("page-title");

  form.innerHTML = initialFormMarkup;
  form.style.display = "block";
  result.innerHTML = "";
  pageTitle.textContent = initialTitle;
  currentImageSrc = "images/trip.jpg";

  initializeFormFeatures();
}

function addCourse() {
  const coursesContainer = document.getElementById("coursesContainer");
  const newCourse = document.createElement("div");
  newCourse.className = "course-entry";

  newCourse.innerHTML = `
    <label>Department</label>
    <input
      type="text"
      name="courseDepartment[]"
      placeholder="Enter department"
      required
    >

    <label>Number</label>
    <input
      type="text"
      name="courseNumber[]"
      placeholder="Enter course number"
      required
    >

    <label>Name</label>
    <input
      type="text"
      name="courseName[]"
      placeholder="Enter course name"
      required
    >

    <label>Reason</label>
    <textarea
      name="courseReason[]"
      placeholder="Enter reason for taking this course"
      required
    ></textarea>

    <button type="button" class="course-delete-btn">Delete Course</button>
  `;

  coursesContainer.appendChild(newCourse);
}

function initializeFormFeatures() {
  const form = document.getElementById("form");
  const clearBtn = document.getElementById("clearBtn");
  const addCourseBtn = document.getElementById("addCourseBtn");
  const pictureInput = document.getElementById("picture");
  const picturePreview = document.getElementById("picturePreview");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    showIntroduction();
  });

  form.addEventListener("reset", () => {
    setTimeout(() => {
      currentImageSrc = "images/trip.jpg";
      const updatedPreview = document.getElementById("picturePreview");
      if (updatedPreview) {
        updatedPreview.src = currentImageSrc;
      }
    }, 0);
  });

  clearBtn.addEventListener("click", () => {
    clearFormFields();
  });

  addCourseBtn.addEventListener("click", () => {
    addCourse();
  });

  form.addEventListener("click", (event) => {
    if (event.target.classList.contains("course-delete-btn")) {
      event.target.closest(".course-entry").remove();
    }
  });

  if (pictureInput && picturePreview) {
    pictureInput.addEventListener("change", () => {
      const file = pictureInput.files[0];

      if (!file) {
        currentImageSrc = "images/trip.jpg";
        picturePreview.src = currentImageSrc;
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        currentImageSrc = e.target.result;
        picturePreview.src = currentImageSrc;
      };
      reader.readAsDataURL(file);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  initialFormMarkup = form.innerHTML;
  initializeFormFeatures();
});

window.getFormData = getFormData;
window.escapeHtml = escapeHtml;
window.buildIntroHtml = buildIntroHtml;
window.restoreFormToDefaults = restoreFormToDefaults;