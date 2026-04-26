/* ============================================================
   Lens & Light – Evan Capitain Photography
   interactions.js
   Author: Alanah Little
   Description: Implements three dynamic JS interactions:
                1. Lightbox modal with keyboard navigation
                   (index.html, portfolio.html)
                2. Scroll-reveal using IntersectionObserver
                   (sitewide)
                3. Contact form live validation
                   (contact.html)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     INTERACTION 1 – LIGHTBOX MODAL
     Opens a full-screen image overlay when a .featured-card or
     .gallery-item is clicked. Supports prev/next navigation and
     keyboard controls (ArrowLeft, ArrowRight, Escape).
  ============================================================ */

  /* --- Build the lightbox HTML once and inject into <body> --- */
  var lbHTML = [
    '<div id="lightbox-overlay" role="dialog" aria-modal="true" aria-label="Image lightbox">',
    '  <div id="lightbox-counter" aria-live="polite"></div>',
    '  <button id="lightbox-prev" class="lb-arrow" aria-label="Previous image">&#8592;</button>',
    '  <div id="lightbox-inner">',
    '    <button id="lightbox-close" aria-label="Close lightbox">&times;</button>',
    '    <img id="lightbox-img" src="" alt="" />',
    '    <div id="lightbox-caption"><strong></strong><span></span></div>',
    '  </div>',
    '  <button id="lightbox-next" class="lb-arrow" aria-label="Next image">&#8594;</button>',
    '</div>'
  ].join('');

  document.body.insertAdjacentHTML('beforeend', lbHTML);

  var overlay    = document.getElementById('lightbox-overlay');
  var lbImg      = document.getElementById('lightbox-img');
  var lbTitle    = overlay.querySelector('#lightbox-caption strong');
  var lbCategory = overlay.querySelector('#lightbox-caption span');
  var lbCounter  = document.getElementById('lightbox-counter');
  var lbClose    = document.getElementById('lightbox-close');
  var lbPrev     = document.getElementById('lightbox-prev');
  var lbNext     = document.getElementById('lightbox-next');

  /* Gather all lightbox-eligible cards on the current page */
  var lbItems = Array.from(
    document.querySelectorAll('.featured-card, .gallery-item')
  );

  var currentIndex = 0;

  /* Extract data from a card element */
  function getCardData(card) {
    var img      = card.querySelector('img');
    var titleEl  = card.querySelector('h4');
    var catEl    = card.querySelector('span');
    return {
      src:      img ? img.src : '',
      alt:      img ? img.alt : '',
      title:    titleEl ? titleEl.textContent : '',
      category: catEl  ? catEl.textContent  : ''
    };
  }

  /* Open the lightbox at a given index */
  function openLightbox(index) {
    if (lbItems.length === 0) { return; }
    currentIndex = index;
    var data = getCardData(lbItems[currentIndex]);

    lbImg.src          = data.src;
    lbImg.alt          = data.alt;
    lbTitle.textContent    = data.title;
    lbCategory.textContent = data.category;
    lbCounter.textContent  = (currentIndex + 1) + ' / ' + lbItems.length;

    overlay.classList.add('lb-active');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  /* Close the lightbox */
  function closeLightbox() {
    overlay.classList.remove('lb-active');
    document.body.style.overflow = '';
  }

  /* Navigate with a brief fade so the image swap feels smooth */
  function navigate(direction) {
    lbImg.classList.add('lb-fade');

    setTimeout(function () {
      currentIndex = (currentIndex + direction + lbItems.length) % lbItems.length;
      var data = getCardData(lbItems[currentIndex]);

      lbImg.src              = data.src;
      lbImg.alt              = data.alt;
      lbTitle.textContent    = data.title;
      lbCategory.textContent = data.category;
      lbCounter.textContent  = (currentIndex + 1) + ' / ' + lbItems.length;

      lbImg.classList.remove('lb-fade');
    }, 200);
  }

  /* Attach click listeners to every eligible card */
  lbItems.forEach(function (card, idx) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function () {
      openLightbox(idx);
    });
  });

  /* Lightbox controls */
  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click',  function () { navigate(-1); });
  lbNext.addEventListener('click',  function () { navigate(1); });

  /* Close when clicking outside the inner panel */
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) { closeLightbox(); }
  });

  /* Keyboard navigation */
  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('lb-active')) { return; }
    if (e.key === 'Escape')      { closeLightbox(); }
    if (e.key === 'ArrowLeft')   { navigate(-1); }
    if (e.key === 'ArrowRight')  { navigate(1); }
  });


  /* ============================================================
     INTERACTION 2 – SCROLL-REVEAL (IntersectionObserver)
     Adds .visible to .reveal and .reveal-group elements as they
     enter the viewport, triggering CSS fade-in transitions.
     Targets: sections, headings, cards, stat blocks.
  ============================================================ */

  /* Mark elements that should animate in */
  var revealTargets = [
    '#intro',
    '#intro-img',
    '#intro-text',
    '.page-hero h1',
    '.page-hero p',
    '#stats .stats-grid > div',
    'footer'
  ];

  /* Apply .reveal to individual targets */
  revealTargets.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.classList.add('reveal');
    });
  });

  /* Apply .reveal-group to containers whose children should stagger */
  var groupTargets = [
    '.featured-grid',
    '.gallery-grid',
    '.services-grid',
    '.stats-grid',
    '.team-grid'
  ];

  groupTargets.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.classList.add('reveal-group');
    });
  });

  /* Create the observer */
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          /* Stop observing once revealed — no re-animation on scroll up */
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }   /* Trigger when 12% of the element is visible */
  );

  /* Observe all marked elements */
  document.querySelectorAll('.reveal, .reveal-group').forEach(function (el) {
    revealObserver.observe(el);
  });


  /* ============================================================
     INTERACTION 3 – CONTACT FORM LIVE VALIDATION
     Validates each field on blur and on input, providing instant
     inline feedback. Prevents submission if any field is invalid.
     Shows a success state after a valid submit.
     Only runs on pages that have #contact-form.
  ============================================================ */

  var contactForm = document.getElementById('contact-form');
  if (!contactForm) { return; }   /* Exit if not on contact page */

  /* --- Helper: get or create the message span below a field --- */
  function getMsgEl(field) {
    var group = field.closest('.form-group');
    if (!group) { return null; }
    var msg = group.querySelector('.field-msg');
    if (!msg) {
      msg = document.createElement('span');
      msg.className = 'field-msg';
      group.appendChild(msg);
    }
    return msg;
  }

  /* --- Show an error state on a field --- */
  function showError(field, message) {
    field.classList.remove('field-valid');
    field.classList.add('field-error');
    var msg = getMsgEl(field);
    if (msg) {
      msg.textContent = message;
      msg.className   = 'field-msg msg-error';
    }
  }

  /* --- Show a valid state on a field --- */
  function showValid(field, message) {
    field.classList.remove('field-error');
    field.classList.add('field-valid');
    var msg = getMsgEl(field);
    if (msg) {
      msg.textContent = message || '';
      msg.className   = 'field-msg msg-valid';
    }
  }

  /* --- Clear validation state (e.g. on focus) --- */
  function clearState(field) {
    field.classList.remove('field-valid', 'field-error');
    var msg = getMsgEl(field);
    if (msg) { msg.textContent = ''; msg.className = 'field-msg'; }
  }

  /* --- Validate a single field, return true if valid --- */
  function validateField(field) {
    var val  = field.value.trim();
    var type = field.type || field.tagName.toLowerCase();
    var name = field.name || field.id;

    /* Required check */
    if (field.required && val === '') {
      showError(field, 'This field is required.');
      return false;
    }

    /* Email format check */
    if (type === 'email' && val !== '') {
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(val)) {
        showError(field, 'Please enter a valid email address.');
        return false;
      }
    }

    /* Phone: digits/spaces/dashes/parens only, min 7 digits */
    if ((type === 'tel' || name === 'phone') && val !== '') {
      var digits = val.replace(/\D/g, '');
      if (digits.length < 7) {
        showError(field, 'Please enter a valid phone number.');
        return false;
      }
    }

    /* Minimum length for message textarea */
    if (field.tagName === 'TEXTAREA' && field.minLength > 0) {
      if (val.length < field.minLength) {
        showError(field, 'Please write at least ' + field.minLength + ' characters.');
        return false;
      }
    }

    /* All checks passed */
    if (val !== '') {
      showValid(field, '');
    }
    return true;
  }

  /* --- Character counter for the message textarea --- */
  var messageField = contactForm.querySelector('textarea[name="message"], #message');
  if (messageField) {
    var maxLen = messageField.maxLength > 0 ? messageField.maxLength : 600;

    /* Create and insert the counter element */
    var counterEl = document.createElement('span');
    counterEl.className = 'char-counter';
    counterEl.setAttribute('aria-live', 'polite');

    var group = messageField.closest('.form-group');
    if (group) {
      group.style.position = 'relative';
      group.appendChild(counterEl);
    }

    /* Update counter on every keystroke */
    messageField.addEventListener('input', function () {
      var remaining = maxLen - messageField.value.length;
      counterEl.textContent = remaining + ' characters remaining';

      counterEl.classList.remove('counter-warn', 'counter-limit');
      if (remaining <= 50)  { counterEl.classList.add('counter-warn'); }
      if (remaining <= 10)  { counterEl.classList.add('counter-limit'); }
    });

    /* Trigger once on load to set initial count */
    messageField.dispatchEvent(new Event('input'));
  }

  /* --- Attach live validation events to all form fields --- */
  var allFields = contactForm.querySelectorAll('input, textarea, select');

  allFields.forEach(function (field) {
    /* Validate on blur (when user leaves the field) */
    field.addEventListener('blur', function () {
      validateField(field);
    });

    /* Clear error state when user starts typing again */
    field.addEventListener('input', function () {
      if (field.classList.contains('field-error')) {
        clearState(field);
      }
    });

    /* Clear on focus so the field feels fresh */
    field.addEventListener('focus', function () {
      if (!field.classList.contains('field-error')) {
        clearState(field);
      }
    });
  });

  /* --- Form submit: validate all fields before allowing submit --- */
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();   /* Always prevent default; handle manually */

    var isValid = true;

    allFields.forEach(function (field) {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      /* Scroll to the first error field */
      var firstError = contactForm.querySelector('.field-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    /* All valid — show success state */
    contactForm.style.display = 'none';

    var successEl = document.getElementById('form-success');
    if (successEl) {
      successEl.classList.add('show');
    }
  });

});  /* end DOMContentLoaded */