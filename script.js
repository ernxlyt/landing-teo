// Global variables
let formSubmitted = false

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeAnimations()
  initializeParallax()
  initializeFormHandling()
  initializeScrollEffects()
  initializeLoadingScreen()
})

// Loading Screen
function initializeLoadingScreen() {
  window.addEventListener("load", () => {
    const loadingScreen = document.querySelector(".loading-screen")
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.classList.add("fade-out")
        setTimeout(() => {
          loadingScreen.remove()
        }, 500)
      }, 1000)
    }

    document.body.classList.remove("loading")
    triggerInitialAnimations()
  })
}

// Initial animations trigger
function triggerInitialAnimations() {
  const heroElements = document.querySelectorAll("[data-aos]")
  heroElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add("aos-animate")
    }, index * 100)
  })
}

// Smooth scrolling function
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}

// Parallax effects
function initializeParallax() {
  let ticking = false

  function updateParallax() {
    const scrolled = window.pageYOffset
    const hero = document.querySelector(".hero")
    const particles = document.querySelectorAll(".particle")

    if (hero) {
      const rate = scrolled * -0.3
      hero.style.transform = `translateY(${rate}px)`
    }

    // Animate particles based on scroll
    particles.forEach((particle, index) => {
      const rate = scrolled * (0.1 + index * 0.02)
      particle.style.transform = `translateY(${rate}px) translateX(${Math.sin(scrolled * 0.01 + index) * 10}px)`
    })

    ticking = false
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax)
      ticking = true
    }
  }

  window.addEventListener("scroll", requestTick)
}

// Intersection Observer for animations
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -100px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("aos-animate")

        // Special animations for specific elements
        if (entry.target.classList.contains("roi-percentage")) {
          animateCounter(entry.target.querySelector(".percentage-number"), 15, 2000)
        }

        if (entry.target.classList.contains("stat-number")) {
          const finalValue = entry.target.textContent.replace(/[^\d]/g, "")
          animateCounter(entry.target, Number.parseInt(finalValue), 1500)
        }

        // Stagger animation for grid items
        if (entry.target.classList.contains("questions-grid")) {
          const cards = entry.target.querySelectorAll(".question-card")
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add("aos-animate")
            }, index * 200)
          })
        }

        if (entry.target.classList.contains("footer-grid")) {
          const cards = entry.target.querySelectorAll(".footer-card")
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add("aos-animate")
            }, index * 300)
          })
        }

        if (entry.target.classList.contains("logos-container")) {
          const logos = entry.target.querySelectorAll(".logo-item")
          logos.forEach((logo, index) => {
            setTimeout(() => {
              logo.classList.add("aos-animate")
            }, index * 150)
          })
        }
      }
    })
  }, observerOptions)

  // Observe elements with data-aos attributes
  const animateElements = document.querySelectorAll("[data-aos]")
  animateElements.forEach((el) => {
    observer.observe(el)
  })

  // Observe special counter elements
  const counterElements = document.querySelectorAll(".roi-percentage, .stat-number")
  counterElements.forEach((el) => {
    observer.observe(el)
  })

  // Observe grid containers for staggered animations
  const gridContainers = document.querySelectorAll(".questions-grid, .footer-grid, .logos-container")
  gridContainers.forEach((container) => {
    observer.observe(container)
  })

  // Add scroll-triggered animations to all major sections
  const sections = document.querySelectorAll(".questions-section, .roi-section, .footer")
  sections.forEach((section) => {
    observer.observe(section)
  })
}

// Enhanced scroll animations
function initializeScrollAnimations() {
  // Add initial hidden state to elements
  const elementsToAnimate = document.querySelectorAll(`
    .question-card,
    .footer-card,
    .logo-item,
    .roi-text,
    .roi-visual,
    .section-header,
    .calc-row,
    .contact-item
  `)

  elementsToAnimate.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(50px)"
    el.style.transition = "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
  })

  // Create a more sensitive observer for scroll animations
  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target

          // Add a small delay based on element position
          const delay = Array.from(element.parentNode.children).indexOf(element) * 100

          setTimeout(() => {
            element.style.opacity = "1"
            element.style.transform = "translateY(0)"
          }, delay)
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  )

  elementsToAnimate.forEach((el) => {
    scrollObserver.observe(el)
  })
}

// Counter animation
function animateCounter(element, target, duration) {
  let start = 0
  const increment = target / (duration / 16)

  function updateCounter() {
    start += increment
    if (start < target) {
      element.textContent = Math.floor(start)
      requestAnimationFrame(updateCounter)
    } else {
      element.textContent = target
    }
  }

  updateCounter()
}

// Form handling
function initializeFormHandling() {
  const form = document.getElementById("heroLeadForm")

  if (form) {
    form.addEventListener("submit", handleHeroFormSubmit)

    // Add real-time validation
    const inputs = form.querySelectorAll("input, select")
    inputs.forEach((input) => {
      input.addEventListener("blur", validateField)
      input.addEventListener("input", clearFieldError)
    })

    // Close modal on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModal()
      }
    })

    // Close modal on overlay click
    const modalOverlay = document.getElementById("modalOverlay")
    if (modalOverlay) {
      modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
          closeModal()
        }
      })
    }
  }
}

function handleHeroFormSubmit(e) {
  e.preventDefault()

  const form = e.target
  const formData = new FormData(form)
  const submitBtn = form.querySelector(".hero-submit-btn")

  // Validate form
  if (!validateForm(form)) {
    return
  }

  // Show loading state
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...'
  submitBtn.disabled = true

  // Simulate API call
  setTimeout(() => {
    // Store form data (in real app, send to server)
    const userData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      investment: formData.get("investment"),
      timestamp: new Date().toISOString(),
    }

    localStorage.setItem("leadData", JSON.stringify(userData))

    // Show modal
    openModal()
    formSubmitted = true

    // Track form submission
    trackEvent("hero_form_submitted", "conversion", userData.investment)

    // Reset button
    submitBtn.innerHTML = '<span>Quiero Unirme</span><i class="fas fa-rocket"></i>'
    submitBtn.disabled = false

    // Show success notification
    showNotification("¡Registro exitoso! Ahora puedes unirte al Zoom.", "success")
  }, 2000)
}

function openModal() {
  const modal = document.getElementById("modalOverlay")
  const body = document.body

  if (modal) {
    modal.classList.add("active")
    body.style.overflow = "hidden"

    // Focus on close button for accessibility
    setTimeout(() => {
      const closeBtn = modal.querySelector(".close-modal")
      if (closeBtn) closeBtn.focus()
    }, 300)

    // Track modal open event
    trackEvent("success_modal_opened", "engagement")
  }
}

function closeModal() {
  const modal = document.getElementById("modalOverlay")
  const body = document.body

  if (modal) {
    modal.classList.remove("active")
    body.style.overflow = ""

    // Track modal close event
    trackEvent("success_modal_closed", "engagement")
  }
}

// PDF Download function
function downloadPDF() {
  // In a real application, this would download an actual PDF
  const link = document.createElement("a")
  link.href = "data:application/pdf;base64," // This would be your actual PDF data
  link.download = "Guia-Inversion-Inmobiliaria-Miami.pdf"

  // For demo purposes, we'll simulate the download
  const loadingText = "Preparando descarga..."
  const downloadBtn = document.querySelector(".download-btn")
  const originalText = downloadBtn.innerHTML

  downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + loadingText
  downloadBtn.disabled = true

  setTimeout(() => {
    // Simulate successful download
    downloadBtn.innerHTML = '<i class="fas fa-check"></i> ¡Descarga Completada!'
    downloadBtn.style.background = "var(--success-green)"

    // Track download event
    trackEvent("pdf_downloaded", "conversion")

    // Show success message
    showNotification("¡PDF descargado exitosamente! Revisa tu carpeta de descargas.", "success")

    setTimeout(() => {
      downloadBtn.innerHTML = originalText
      downloadBtn.disabled = false
      downloadBtn.style.background = ""
    }, 3000)
  }, 2000)
}

function validateForm(form) {
  const requiredFields = form.querySelectorAll("[required]")
  let isValid = true

  requiredFields.forEach((field) => {
    if (!validateField({ target: field })) {
      isValid = false
    }
  })

  return isValid
}

function validateField(e) {
  const field = e.target
  const value = field.value.trim()
  let isValid = true
  let errorMessage = ""

  // Remove existing error
  clearFieldError(e)

  // Required field validation
  if (field.hasAttribute("required") && !value) {
    errorMessage = "Este campo es obligatorio"
    isValid = false
  }

  // Email validation
  if (field.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      errorMessage = "Ingresa un email válido"
      isValid = false
    }
  }

  // Phone validation
  if (field.type === "tel" && value) {
    const phoneRegex = /^[+]?[\d\s\-$$$$]{10,}$/
    if (!phoneRegex.test(value)) {
      errorMessage = "Ingresa un teléfono válido"
      isValid = false
    }
  }

  // Show error if invalid
  if (!isValid) {
    showFieldError(field, errorMessage)
  }

  return isValid
}

function showFieldError(field, message) {
  field.classList.add("error")

  let errorElement = field.parentNode.querySelector(".field-error")
  if (!errorElement) {
    errorElement = document.createElement("div")
    errorElement.className = "field-error"
    field.parentNode.appendChild(errorElement)
  }

  errorElement.textContent = message
}

function clearFieldError(e) {
  const field = e.target
  field.classList.remove("error")

  const errorElement = field.parentNode.querySelector(".field-error")
  if (errorElement) {
    errorElement.remove()
  }
}

// Scroll effects
function initializeScrollEffects() {
  let lastScrollTop = 0

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    // Add scroll class to body for styling
    if (scrollTop > 100) {
      document.body.classList.add("scrolled")
    } else {
      document.body.classList.remove("scrolled")
    }

    lastScrollTop = scrollTop
  })
}

// Notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "var(--success-green)" : "var(--primary-blue)"};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        font-size: 0.9rem;
        font-weight: 500;
    `

  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease forwards"
    setTimeout(() => {
      notification.remove()
    }, 300)
  }, 4000)
}

// Analytics tracking (placeholder)
function trackEvent(eventName, category, value = null) {
  // In a real application, this would send data to your analytics service
  console.log("Event tracked:", {
    event: eventName,
    category: category,
    value: value,
    timestamp: new Date().toISOString(),
    page: window.location.pathname,
  })

  // Example: Google Analytics 4
  // gtag('event', eventName, {
  //     event_category: category,
  //     event_label: value,
  //     value: 1
  // });
}

// Smooth scroll for internal links
document.addEventListener("DOMContentLoaded", () => {
  const internalLinks = document.querySelectorAll('a[href^="#"]')

  internalLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })

        // Track internal navigation
        trackEvent("internal_navigation", "engagement", targetId)
      }
    })
  })
})

// Enhanced hover effects
document.addEventListener("DOMContentLoaded", () => {
  // Question cards enhanced hover
  const questionCards = document.querySelectorAll(".question-card")
  questionCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-15px) scale(1.02)"
      card.style.boxShadow = "0 25px 50px rgba(0, 212, 255, 0.4)"
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = ""
      card.style.boxShadow = ""
    })
  })

  // Footer cards enhanced hover
  const footerCards = document.querySelectorAll(".footer-card")
  footerCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-10px) scale(1.02)"
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = ""
    })
  })
})

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  // Tab navigation enhancement
  if (e.key === "Tab") {
    document.body.classList.add("keyboard-navigation")
  }
})

document.addEventListener("mousedown", () => {
  document.body.classList.remove("keyboard-navigation")
})

// Performance optimization
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
  // Scroll-based animations and effects
  const scrollTop = window.pageYOffset

  // Update progress indicators if any
  const progressElements = document.querySelectorAll(".scroll-progress")
  progressElements.forEach((el) => {
    const progress = Math.min(scrollTop / (document.body.scrollHeight - window.innerHeight), 1)
    el.style.width = `${progress * 100}%`
  })
}, 10)

window.addEventListener("scroll", optimizedScrollHandler)

// Initialize everything when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp)
} else {
  initializeApp()
}

function initializeApp() {
  console.log("🚀 Landing page initialized successfully!")

  // Initialize scroll animations
  initializeScrollAnimations()

  // Track page load
  trackEvent("page_loaded", "engagement")
}

// Additional notification animations
const style = document.createElement("style")
style.textContent = `
@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(100px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideOutRight {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(100px);
    }
}

.keyboard-navigation *:focus {
    outline: 2px solid var(--primary-blue) !important;
    outline-offset: 2px;
}
`
document.head.appendChild(style)

// Mobile menu functionality
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const navMenu = document.querySelector(".nav-menu")

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      navMenu.classList.toggle("active")
    })
  }

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Header scroll effect
  const header = document.querySelector(".header")
  let lastScrollY = window.scrollY

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY

    if (currentScrollY > 100) {
      header.style.background = "rgba(255, 255, 255, 0.98)"
      header.style.boxShadow = "0 1px 3px 0 rgb(0 0 0 / 0.1)"
    } else {
      header.style.background = "rgba(255, 255, 255, 0.95)"
      header.style.boxShadow = "none"
    }

    lastScrollY = currentScrollY
  })

  // Button click handlers
  const buttons = document.querySelectorAll(".btn")
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Add click animation
      this.style.transform = "scale(0.98)"
      setTimeout(() => {
        this.style.transform = "scale(1)"
      }, 150)

      // Handle specific button actions
      const buttonText = this.textContent.trim()

      if (buttonText.includes("Start Free Trial")) {
        console.log("Starting free trial...")
        // Add your trial signup logic here
      } else if (buttonText.includes("Watch Demo")) {
        console.log("Opening demo...")
        // Add your demo logic here
      } else if (buttonText.includes("Schedule Demo")) {
        console.log("Scheduling demo...")
        // Add your demo scheduling logic here
      } else if (buttonText.includes("Contact Sales")) {
        console.log("Contacting sales...")
        // Add your contact sales logic here
      }
    })
  })

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animateElements = document.querySelectorAll(".feature-card, .testimonial-card, .pricing-card")
  animateElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(20px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })

  // Form validation (if forms are added later)
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  // Utility function for showing notifications
  function showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6"};
            color: white;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `

    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease"
      setTimeout(() => {
        notification.remove()
      }, 300)
    }, 3000)
  }

  // Add CSS for notifications
  const style = document.createElement("style")
  style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOut {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
        
        @media (max-width: 767px) {
            .nav-menu.active {
                display: flex;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                flex-direction: column;
                padding: 1rem;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                border-top: 1px solid var(--border-color);
            }
        }
    `
  document.head.appendChild(style)

  // Performance optimization: Debounce scroll events
  function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // Optimized scroll handler
  const optimizedScrollHandler = debounce(() => {
    // Add any scroll-based functionality here
  }, 10)

  window.addEventListener("scroll", optimizedScrollHandler)

  console.log("StreamLine landing page loaded successfully! 🚀")
})
