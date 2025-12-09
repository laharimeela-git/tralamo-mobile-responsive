// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Track scrolling for styling the header and show/hide back to top button
    const header = document.querySelector('header');
    const backToTopButton = document.querySelector('.back-to-top');
    
    const handleScroll = () => {
        // Header styling
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Back to top button visibility
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (document.body.classList.contains('menu-open')) {
                    document.body.classList.remove('menu-open');
                    document.querySelector('.mobile-menu').classList.remove('active');
                    updateMobileMenuIcon(false);
                }
            }
        });
    });
    
    // Add animation classes on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .service-card, .package-card, .value');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        elements.forEach(element => {
            observer.observe(element);
        });
    };
    
    animateOnScroll();
    
    // Form submission handling
    const setupFormHandling = () => {
        const contactForms = document.querySelectorAll('.contact-form form');
        
        contactForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // In a real implementation, you would send the form data to a server
                // For now, just show a success message
                const formData = new FormData(form);
                const formValues = Object.fromEntries(formData.entries());
                
                console.log('Form submitted with values:', formValues);
                
                // Show success message
                form.innerHTML = '<div class="success-message"><h3>Thank you for your message!</h3><p>We will get back to you shortly.</p></div>';
            });
        });
    };
    
    setupFormHandling();
    
    // Package inquire button handlers
    const setupPackageInquiryButtons = () => {
        const inquireButtons = document.querySelectorAll('.inquire-button');
        const inquiryDialog = document.getElementById('inquiry-dialog-container');
        const packageNameDisplay = document.getElementById('package-name-display');
        const packageNameInput = document.getElementById('inquiry-package-name');
        const inquiryForm = document.getElementById('inquiry-form');
        const closeButton = document.querySelector('.close-inquiry-dialog');
        
        // Open dialog when clicking inquire button
        inquireButtons.forEach(button => {
            button.addEventListener('click', function() {
                const packageCard = this.closest('.package-card');
                const packageName = packageCard.querySelector('h3').textContent;
                const packageId = packageCard.dataset.id;
                
                // Set package name in the form
                packageNameDisplay.textContent = packageName;
                packageNameInput.value = packageName;
                
                // Show the dialog
                inquiryDialog.style.display = 'flex';
            });
        });
        
        // Close dialog when clicking the close button
        closeButton.addEventListener('click', function() {
            inquiryDialog.style.display = 'none';
            inquiryForm.reset();
        });
        
        // Close dialog when clicking outside
        inquiryDialog.addEventListener('click', function(e) {
            if (e.target === inquiryDialog) {
                inquiryDialog.style.display = 'none';
                inquiryForm.reset();
            }
        });
        
        // Handle form submission
        inquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('inquiry-name').value;
            const phone = document.getElementById('inquiry-phone').value;
            const email = document.getElementById('inquiry-email').value;
            const message = document.getElementById('inquiry-message').value;
            const packageName = packageNameInput.value;
            
            // Prepare WhatsApp message
            let whatsappMessage = `Hello Tralamo! I would like to inquire about the *${packageName}*.\n\n`;
            whatsappMessage += `Name: ${name}\n`;
            whatsappMessage += `Phone: ${phone}\n`;
            
            if (email) {
                whatsappMessage += `Email: ${email}\n`;
            }
            
            if (message) {
                whatsappMessage += `\nMessage: ${message}\n`;
            }
            
            whatsappMessage += `\nPlease provide more details about this package. Thank you!`;
            
            // Encode the message for URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            
            // Close the dialog
            inquiryDialog.style.display = 'none';
            
            // Reset the form
            inquiryForm.reset();
            
            // Open WhatsApp with the message
            window.open(`https://wa.me/919700135300?text=${encodedMessage}`, '_blank');
        });
    };
    
    setupPackageInquiryButtons();
    
    // Mobile menu functionality
    const setupMobileMenu = () => {
        const mobileMenuButton = document.createElement('button');
        mobileMenuButton.className = 'mobile-menu-button';
        updateMobileMenuIcon(false);
        
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        
        const nav = document.querySelector('nav');
        const navLinks = document.querySelector('.nav-links');
        
        // Function to update menu icon
        function updateMobileMenuIcon(isOpen) {
            if (isOpen) {
                mobileMenuButton.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
            } else {
                mobileMenuButton.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
            }
        }
        
        // Only add mobile menu components on small screens
        const setupMobileMenuByScreenSize = () => {
            if (window.innerWidth <= 768) {
                if (!document.querySelector('.mobile-menu-button')) {
                    nav.appendChild(mobileMenuButton);
                    document.body.appendChild(mobileMenu);
                    
                    // Clone navigation links for mobile menu
                    const mobileNavLinks = navLinks.cloneNode(true);
                    mobileMenu.appendChild(mobileNavLinks);
                    
                    // Setup event listeners
                    mobileMenuButton.addEventListener('click', () => {
                        const isMenuOpen = mobileMenu.classList.toggle('active');
                        document.body.classList.toggle('menu-open');
                        updateMobileMenuIcon(isMenuOpen);
                    });
                    
                    // Add click event listeners to mobile menu links for closing menu
                    mobileMenu.querySelectorAll('a').forEach(link => {
                        link.addEventListener('click', () => {
                            mobileMenu.classList.remove('active');
                            document.body.classList.remove('menu-open');
                            updateMobileMenuIcon(false);
                        });
                    });
                }
            } else {
                // Remove mobile menu components if screen is large
                const existingButton = document.querySelector('.mobile-menu-button');
                const existingMenu = document.querySelector('.mobile-menu');
                
                if (existingButton) {
                    existingButton.remove();
                }
                
                if (existingMenu) {
                    existingMenu.remove();
                }
                
                document.body.classList.remove('menu-open');
            }
        };
        
        // Initial setup and update on window resize
        setupMobileMenuByScreenSize();
        window.addEventListener('resize', setupMobileMenuByScreenSize);
    };
    
    setupMobileMenu();

    // Handle destination dropdown for mobile
    const setupMobileDropdowns = () => {
        if (window.innerWidth <= 768) {
            const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
            
            dropdownTriggers.forEach(trigger => {
                trigger.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const parent = this.closest('.destinations-dropdown');
                    const content = parent.querySelector('.dropdown-content');
                    
                    // Toggle visibility
                    if (content.style.display === 'block') {
                        content.style.display = 'none';
                    } else {
                        content.style.display = 'block';
                    }
                });
            });
            
            // Close dropdowns when clicking outside
            document.addEventListener('click', function() {
                const openDropdowns = document.querySelectorAll('.dropdown-content');
                openDropdowns.forEach(dropdown => {
                    if (dropdown.style.display === 'block') {
                        dropdown.style.display = 'none';
                    }
                });
            });
        }
    };
    
    setupMobileDropdowns();
    window.addEventListener('resize', setupMobileDropdowns);
    
    // Contact buttons functionality
    const setupContactButtons = () => {
        // WhatsApp Button
        const whatsappButton = document.querySelector('.whatsapp-button');
        if (whatsappButton) {
            whatsappButton.addEventListener('click', function() {
                const message = "Hello Tralamo! I'm interested in learning more about your travel packages. Could you provide me with more information?";
                const encodedMessage = encodeURIComponent(message);
                window.open(`https://wa.me/919700135300?text=${encodedMessage}`, '_blank');
            });
        }
        
        // Email Button
        const emailButton = document.querySelector('.email-button');
        if (emailButton) {
            emailButton.addEventListener('click', function() {
                const subject = encodeURIComponent("Travel Package Inquiry");
                const body = encodeURIComponent("Hello Tralamo,\n\nI'm interested in learning more about your travel packages. Could you provide me with more information?\n\nThank you,\n[Your Name]");
                window.location.href = `mailto:info@tralamo.com?subject=${subject}&body=${body}`;
            });
        }
    };
    
    setupContactButtons();
    
    // Legal buttons functionality
    const setupLegalDialogs = () => {
        const legalButtons = document.querySelectorAll('.legal-link');
        const legalDialogContainer = document.getElementById('legal-dialog-container');
        const closeButtons = document.querySelectorAll('.close-dialog');
        
        legalButtons.forEach(button => {
            button.addEventListener('click', () => {
                const dialogId = `dialog-${button.dataset.dialog}`;
                const dialog = document.getElementById(dialogId);
                
                // Hide all dialogs first
                document.querySelectorAll('.legal-dialog').forEach(d => {
                    d.style.display = 'none';
                });
                
                // Show the container and the specific dialog
                legalDialogContainer.style.display = 'flex';
                dialog.style.display = 'block';
            });
        });
        
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                legalDialogContainer.style.display = 'none';
            });
        });
        
        // Close dialog when clicking outside
        legalDialogContainer.addEventListener('click', (e) => {
            if (e.target === legalDialogContainer) {
                legalDialogContainer.style.display = 'none';
            }
        });
    };
    
    setupLegalDialogs();
    
    // Package details toggle
    const setupPackageDetails = () => {
        const packageCards = document.querySelectorAll('.package-card');
        
        packageCards.forEach(card => {
            const detailsSection = card.querySelector('.package-details');
            const viewDetailsBtn = card.querySelector('.view-details-button');
            
            // Initially hide details
            if (detailsSection) {
                detailsSection.style.display = 'none';
            }
            
            // Setup toggle functionality
            if (viewDetailsBtn && detailsSection) {
                viewDetailsBtn.addEventListener('click', function() {
                    // Close all other package details first
                    packageCards.forEach(otherCard => {
                        if (otherCard !== card) {
                            const otherDetailsSection = otherCard.querySelector('.package-details');
                            const otherViewDetailsBtn = otherCard.querySelector('.view-details-button');
                            
                            if (otherDetailsSection && otherDetailsSection.style.display === 'block') {
                                otherDetailsSection.style.display = 'none';
                                if (otherViewDetailsBtn) {
                                    otherViewDetailsBtn.textContent = 'View Full Details';
                                }
                            }
                        }
                    });
                    
                    // Toggle the current package details
                    const isHidden = detailsSection.style.display === 'none';
                    
                    // Toggle display
                    detailsSection.style.display = isHidden ? 'block' : 'none';
                    
                    // Update button text
                    viewDetailsBtn.textContent = isHidden ? 'Hide Details' : 'View Full Details';
                });
            }
        });
    };
    
    setupPackageDetails();
    
    // Image Carousel functionality
    const setupImageCarousels = () => {
        const carousels = document.querySelectorAll('.image-carousel');
        
        carousels.forEach(carousel => {
            const images = carousel.querySelectorAll('.carousel-image');
            const dots = carousel.querySelectorAll('.dot');
            let currentSlide = 0;
            let slideInterval;
            let isUserInteracting = false;
            
            // Function to show specific slide
            const showSlide = (index) => {
                // Remove active class from all images and dots
                images.forEach(img => img.classList.remove('active'));
                dots.forEach(dot => dot.classList.remove('active'));
                
                // Add active class to current slide
                if (images[index]) {
                    images[index].classList.add('active');
                }
                if (dots[index]) {
                    dots[index].classList.add('active');
                }
                
                currentSlide = index;
            };
            
            // Function to go to next slide
            const nextSlide = () => {
                const next = (currentSlide + 1) % images.length;
                showSlide(next);
            };
            
            // Auto-slide functionality
            const startAutoSlide = () => {
                if (!isUserInteracting && images.length > 1) {
                    slideInterval = setInterval(nextSlide, 5000); // 5 seconds
                }
            };
            
            const stopAutoSlide = () => {
                if (slideInterval) {
                    clearInterval(slideInterval);
                    slideInterval = null;
                }
            };
            
            // Manual navigation via dots
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    isUserInteracting = true;
                    stopAutoSlide();
                    showSlide(index);
                    
                    // Resume auto-slide after 3 seconds of no interaction
                    setTimeout(() => {
                        isUserInteracting = false;
                        startAutoSlide();
                    }, 3000);
                });
            });
            
            // Pause auto-slide on hover
            carousel.addEventListener('mouseenter', () => {
                stopAutoSlide();
            });
            
            carousel.addEventListener('mouseleave', () => {
                if (!isUserInteracting) {
                    startAutoSlide();
                }
            });
            
            // Touch/swipe support for mobile
            let touchStartX = 0;
            let touchEndX = 0;
            
            carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                isUserInteracting = true;
                stopAutoSlide();
            }, { passive: true });
            
            carousel.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                
                // Resume auto-slide after 3 seconds
                setTimeout(() => {
                    isUserInteracting = false;
                    startAutoSlide();
                }, 3000);
            }, { passive: true });
            
            const handleSwipe = () => {
                const swipeThreshold = 50;
                const diff = touchStartX - touchEndX;
                
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        // Swipe left - next slide
                        nextSlide();
                    } else {
                        // Swipe right - previous slide
                        const prev = currentSlide === 0 ? images.length - 1 : currentSlide - 1;
                        showSlide(prev);
                    }
                }
            };
            
            // Keyboard navigation
            carousel.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prev = currentSlide === 0 ? images.length - 1 : currentSlide - 1;
                    isUserInteracting = true;
                    stopAutoSlide();
                    showSlide(prev);
                    setTimeout(() => {
                        isUserInteracting = false;
                        startAutoSlide();
                    }, 3000);
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    isUserInteracting = true;
                    stopAutoSlide();
                    nextSlide();
                    setTimeout(() => {
                        isUserInteracting = false;
                        startAutoSlide();
                    }, 3000);
                }
            });
            
            // Make carousel focusable for keyboard navigation
            carousel.setAttribute('tabindex', '0');
            
            // Start auto-slide
            startAutoSlide();
            
            // Handle visibility change (pause when tab is not active)
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    stopAutoSlide();
                } else if (!isUserInteracting) {
                    startAutoSlide();
                }
            });
        });
    };
    
    setupImageCarousels();
}); 