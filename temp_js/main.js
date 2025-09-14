// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Theme toggling functionality
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const currentTheme = localStorage.getItem('theme');

// Check for saved theme preference
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Update icon if in light mode
    if (currentTheme === 'light') {
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Theme toggle button click handler
themeToggleBtn.addEventListener('click', function() {
    let theme = 'dark';

    // If it's currently dark, switch to light
    if (!document.documentElement.hasAttribute('data-theme') ||
        document.documentElement.getAttribute('data-theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        theme = 'light';
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        document.documentElement.removeAttribute('data-theme');
        theme = 'dark';
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Save preference to localStorage
    localStorage.setItem('theme', theme);
});

// Hamburger menu for mobile
// Hamburger menu for mobile
const addHamburgerMenu = () => {
    // Check if hamburger already exists
    if (document.querySelector('.hamburger')) {
        return; // Exit if hamburger already exists
    }

    // Create hamburger button
    const hamburger = document.createElement('div');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '<span class="hamburger-inner"></span>';

    // Get nav element
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');

    // Insert hamburger at the beginning of nav
    if (nav) {
        nav.insertBefore(hamburger, nav.firstChild);

        // Toggle menu on click
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            document.body.classList.toggle('blur');

            // Update hamburger appearance
            if (navLinks.classList.contains('open')) {
                hamburger.classList.add('active');
            } else {
                hamburger.classList.remove('active');
            }
        });

        // Close menu when clicking on links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                hamburger.classList.remove('active');
                document.body.classList.remove('blur');
            });
        });

        // Handle clicking outside to close menu
        document.addEventListener('click', (e) => {
            const isOutside = !e.target.closest('.nav-links') &&
                !e.target.closest('.hamburger');

            if (isOutside && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                hamburger.classList.remove('active');
                document.body.classList.remove('blur');
            }
        });

        // Show/hide hamburger based on screen size
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                hamburger.style.display = 'block';
            } else {
                hamburger.style.display = 'none';
                navLinks.classList.remove('open');
                hamburger.classList.remove('active');
                document.body.classList.remove('blur');
            }
        };

        // Initial check and event listener
        handleResize();
        window.addEventListener('resize', handleResize);
    }
};


// Call the hamburger function when DOM is loaded
document.addEventListener('DOMContentLoaded', addHamburgerMenu);

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


/*****************************************************
 // Achievements Carousel
 *****************************************************/

$(function () {
    $("#team-members").owlCarousel({
        items: 3,
        autoplay: true,
        smartSpeed: 700,
        loop: true,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            },
            480: {
                items: 2
            },
            768: {
                items: 3
            }
        }
    });
});
$(function () {
    $("#team-members2").owlCarousel({
        items: 3,
        autoplay: true,
        smartSpeed: 700,
        loop: true,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            },
            480: {
                items: 2
            },
            768: {
                items: 3
            }
        }
    });
});

$(function () {
    $("#team-members, #team-members2").owlCarousel({
        items: 3,
        autoplay: true,
        smartSpeed: 700,
        loop: true,
        autoplayHoverPause: true,
        margin: 10,
        nav: true,
        dots: true,
        responsive: {
            0: {
                items: 1,
                nav: false
            },
            480: {
                items: 2,
                nav: false
            },
            768: {
                items: 3
            }
        }
    });

    // Handle window resize to fix carousel issues
    $(window).on('resize', function() {
        // Force refresh of carousel on window resize
        $("#team-members, #team-members2").trigger('refresh.owl.carousel');
    });
});


$(document).ready(function() {
    // Initialize both carousels with better responsive settings
    $("#team-members, #team-members2").each(function() {
        $(this).owlCarousel({
            items: 3,
            autoplay: true,
            smartSpeed: 700,
            loop: true,
            autoplayHoverPause: true,
            margin: 15,
            stagePadding: 0,
            nav: true,
            dots: true,
            lazyLoad: true,
            autoWidth: false,
            responsive: {
                0: {
                    items: 1,
                    nav: false
                },
                480: {
                    items: 1,
                    nav: false
                },
                768: {
                    items: 2,
                    nav: true
                },
                992: {
                    items: 3,
                    nav: true
                }
            },
            onInitialized: fixOwlCarousel,
            onResized: fixOwlCarousel
        });
    });

    // Function to fix carousel layout issues
    function fixOwlCarousel() {
        setTimeout(function() {
            $('.owl-carousel').each(function() {
                $(this).trigger('refresh.owl.carousel');
            });
        }, 100);
    }

    // Handle window resize events with debounce
    let resizeTimer;
    $(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            fixOwlCarousel();
        }, 250);
    });
});