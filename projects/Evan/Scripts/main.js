/* ============================================================
   Lens & Light – Main JavaScript
   Author: Alanah Little
   Description: Highlights the current page link in the nav bar
                by adding an "active" class to the matching link.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* Get the current page filename (e.g. "index.html") */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';

  /* Loop through all nav links and mark the matching one as active */
  document.querySelectorAll('nav a').forEach(function (link) {
    var href = link.getAttribute('href').split('/').pop();
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

});