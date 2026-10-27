// ==========================================================================
// Omnacare — main.js (vanilla JS, no dependencies)
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Mobile nav toggle ---- */
  var navToggle = document.querySelector('.nav__toggle');
  var navLinks = document.querySelector('.nav__links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Scroll-to-top button ---- */
  var scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    window.addEventListener('scroll', function () {
      scrollTop.classList.toggle('is-active', window.scrollY > 400);
    });
    scrollTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---- Placeholder for photos that haven't been uploaded yet ---- */
  document.querySelectorAll('.card__media img').forEach(function (img) {
    function markEmpty() { img.parentElement.classList.add('card__media--empty'); }
    if (img.complete && img.naturalWidth === 0) markEmpty();
    else img.addEventListener('error', markEmpty);
  });

  /* ---- Contact form validation ---- */
  var form = document.getElementById('contact-form');
  if (form) {
    var statusBox = document.getElementById('form-status');

    form.addEventListener('submit', function (e) {
      var required = form.querySelectorAll('[required]');
      var missing = [];

      required.forEach(function (field) {
        if (!field.value.trim()) {
          missing.push(field.previousElementSibling ? field.previousElementSibling.textContent.replace('*', '').trim() : field.name);
          field.style.borderColor = '#b3261e';
        } else {
          field.style.borderColor = '';
        }
      });

      var emailField = form.querySelector('input[type="email"]');
      var emailValid = emailField ? /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(emailField.value.trim()) : true;
      if (emailField && !emailValid) {
        missing.push('a valid E-mail address');
        emailField.style.borderColor = '#b3261e';
      }

      e.preventDefault();
      if (missing.length) {
        statusBox.textContent = 'Please check the following: ' + missing.join(', ') + '.';
        statusBox.className = 'form-status is-visible form-status--error';
        statusBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // No backend on this static site, so hand the enquiry to WhatsApp.
      var f = form.elements;
      var text = 'Hi Omnacare, my name is ' + f.full_name.value.trim() +
        '.\nE-mail: ' + f.email.value.trim() +
        '\nPhone: ' + f.phone.value.trim() +
        '\nSubject: ' + f.subject.value.trim() +
        '\n\n' + f.message.value.trim();
      window.open('https://wa.me/27760344131?text=' + encodeURIComponent(text), '_blank', 'noopener');
      statusBox.textContent = 'WhatsApp has opened with your enquiry \u2014 just press send. You can also e-mail info@omnacare.co.za.';
      statusBox.className = 'form-status is-visible form-status--success';
      form.reset();
    });
  }

});
