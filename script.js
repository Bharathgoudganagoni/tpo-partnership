/**
 * KeeZ Campus - TPO Partnership Landing Page JS File
 * Functions: Scroll handlers, responsive mobile menu, stats counters, skill-bar animations, 
 *            TPO Registration Validation, LocalStorage operations, and Popup modals.
 * Author: Antigravity AI
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. STICKY HEADER & ACTIVE NAV LINKS
     ========================================================================== */
  const header = document.getElementById('main-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    // Toggle header styling
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Toggle active link on scroll
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 160;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger initial check

  /* ==========================================================================
     2. MOBILE MENU / HAMBURGER BAR
     ========================================================================== */
  const hamburger = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when a navigation link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  /* ==========================================================================
     3. REVEAL ANIMATIONS (Intersection Observer)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-up');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(elem => {
    revealObserver.observe(elem);
  });

  /* ==========================================================================
     4. NUMERICAL STATISTICS COUNTER ANIMATIONS
     ========================================================================== */
  const statsSection = document.getElementById('placement');
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  const animateCounters = () => {
    statNumbers.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const isPercent = target === 95; // Custom suffix for engagement
      let current = 0;
      const duration = 1500; // 1.5s animation
      const interval = 20; // 20ms steps
      const step = target / (duration / interval);

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          clearInterval(timer);
          counter.textContent = target + (isPercent ? '%' : '+');
        } else {
          counter.textContent = Math.floor(current) + (isPercent ? '%' : '+');
        }
      }, interval);
    });
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        animateCounters();
        countersAnimated = true;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  /* ==========================================================================
     5. STUDENT SKILL PROGRESS FILL ANIMATIONS
     ========================================================================== */
  const skillsSection = document.getElementById('skills');
  const progressBars = document.querySelectorAll('.skill-progress');
  let skillsAnimated = false;

  const animateSkills = () => {
    progressBars.forEach(bar => {
      const percentage = bar.getAttribute('data-progress');
      bar.style.width = percentage;
    });
  };

  const skillsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !skillsAnimated) {
        animateSkills();
        skillsAnimated = true;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  /* ==========================================================================
     6. FORM VALIDATION & LOCAL STORAGE
     ========================================================================== */
  const form = document.getElementById('tpo-enquiry-form');
  const successPopup = document.getElementById('success-popup');
  const closePopupBtn = document.getElementById('close-popup-btn');

  // Input Field References
  const fields = {
    collegeName: {
      input: document.getElementById('college-name'),
      group: document.getElementById('group-college-name'),
      validator: value => value.trim().length >= 2,
      errorMsg: 'College Name must be at least 2 characters long.'
    },
    tpoName: {
      input: document.getElementById('tpo-name'),
      group: document.getElementById('group-tpo-name'),
      validator: value => value.trim().length >= 2,
      errorMsg: 'TPO Name must be at least 2 characters long.'
    },
    email: {
      input: document.getElementById('email-address'),
      group: document.getElementById('group-email'),
      validator: value => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value.trim());
      },
      errorMsg: 'Please enter a valid email address (e.g., name@college.edu).'
    },
    phone: {
      input: document.getElementById('phone-number'),
      group: document.getElementById('group-phone'),
      validator: value => {
        const cleanVal = value.replace(/\s+/g, '').replace(/-/g, '');
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(cleanVal);
      },
      errorMsg: 'Please enter an exact 10-digit phone number.'
    },
    program: {
      input: document.getElementById('interested-program'),
      group: document.getElementById('group-program'),
      validator: value => value !== '',
      errorMsg: 'Please choose one of the program tracks.'
    },
    message: {
      input: document.getElementById('message'),
      group: document.getElementById('group-message'),
      validator: value => value.trim().length >= 10,
      errorMsg: 'Message must be at least 10 characters long to help us serve you better.'
    }
  };

  // Check validation state for a specific field
  const validateField = (fieldName) => {
    const field = fields[fieldName];
    const value = field.input.value;
    const isValid = field.validator(value);

    if (isValid) {
      field.group.classList.remove('error');
    } else {
      field.group.classList.add('error');
      // Update error text dynamically if needed
      const errorTextSpan = field.group.querySelector('.error-message span');
      if (errorTextSpan) {
        errorTextSpan.textContent = field.errorMsg;
      }
    }
    return isValid;
  };

  // Add real-time validation triggers as the user inputs values
  Object.keys(fields).forEach(key => {
    const field = fields[key];
    
    // Validate on input / typing
    field.input.addEventListener('input', () => {
      validateField(key);
    });

    // Validate on change (specifically useful for select dropdown)
    field.input.addEventListener('change', () => {
      validateField(key);
    });

    // Validate on focusout / blur
    field.input.addEventListener('blur', () => {
      validateField(key);
    });
  });

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let formIsValid = true;

      // Validate all fields
      Object.keys(fields).forEach(key => {
        const isFieldValid = validateField(key);
        if (!isFieldValid) {
          formIsValid = false;
        }
      });

      if (formIsValid) {
        // Collect form data
        const formData = {
          collegeName: fields.collegeName.input.value.trim(),
          tpoName: fields.tpoName.input.value.trim(),
          email: fields.email.input.value.trim(),
          phone: fields.phone.input.value.replace(/\s+/g, '').replace(/-/g, '').trim(),
          program: fields.program.input.value,
          message: fields.message.input.value.trim(),
          timestamp: new Date().toISOString()
        };

        // Print submitted data in browser console
        console.log('--- KEEZ CAMPUS TPO REGISTRATION ---');
        console.log('Form Submitted Successfully!');
        console.log('Submission Payload (JSON):', JSON.stringify(formData, null, 2));
        console.log('------------------------------------');

        // Store data in browser localStorage
        try {
          // Fetch existing submissions array or initialize
          const existingDataJSON = localStorage.getItem('keez_campus_tpo_registrations');
          const submissionsList = existingDataJSON ? JSON.parse(existingDataJSON) : [];
          
          // Add new submission
          submissionsList.push(formData);
          
          // Write back to localStorage
          localStorage.setItem('keez_campus_tpo_registrations', JSON.stringify(submissionsList));
        } catch (error) {
          console.error('Error writing submission to localStorage:', error);
        }

        // Reset the form fields and remove validation classes
        form.reset();
        Object.keys(fields).forEach(key => {
          fields[key].group.classList.remove('error');
        });

        // Trigger visual success modal popup
        if (successPopup) {
          successPopup.classList.add('active');
        }
      } else {
        // Scroll first error field into view smoothly
        const firstErrorGroup = document.querySelector('.form-group.error');
        if (firstErrorGroup) {
          firstErrorGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  // Handle closing success popup
  if (closePopupBtn && successPopup) {
    closePopupBtn.addEventListener('click', () => {
      successPopup.classList.remove('active');
    });

    // Close when clicking outside of the popup card
    successPopup.addEventListener('click', (e) => {
      if (e.target === successPopup) {
        successPopup.classList.remove('active');
      }
    });
  }

});
