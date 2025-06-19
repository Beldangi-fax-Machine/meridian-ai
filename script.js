// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initSmoothScrolling();
    initFormHandling();
    initParallaxEffects();
    initInteractiveElements();
    initAboutAnimations();
    initLiveData();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active navigation link highlighting
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100; // Add offset for better detection
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            // Check if current scroll position is within this section
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .about-text, .contact-form, .tech-item');
    animatedElements.forEach(el => observer.observe(el));
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form handling
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Show success message
                showNotification('Thank you! Your message has been sent successfully.', 'success');
                
                // Reset form
                this.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Parallax effects
function initParallaxEffects() {
    const gradientOrbs = document.querySelectorAll('.gradient-orb');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        gradientOrbs.forEach((orb, index) => {
            const speed = 0.5 + (index * 0.1);
            orb.style.transform = `translateY(${rate * speed}px) rotate(${rate * 0.1}deg)`;
        });
    });
}

// Interactive elements
function initInteractiveElements() {
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Feature card interactions
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Tech stack items interaction
    const techItems = document.querySelectorAll('.tech-item');
    
    techItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Smooth scroll for Get Started button
    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const featuresSection = document.getElementById('features');
            if (featuresSection) {
                const offsetTop = featuresSection.offsetTop - 70; // Adjust for navbar height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #28a745, #20c997)' : 'linear-gradient(135deg, #DC143C, #B22222)'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 15px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Typing animation for hero title
function initTypingAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const titleLines = heroTitle.querySelectorAll('.title-line');
    
    titleLines.forEach((line, index) => {
        const text = line.textContent;
        line.textContent = '';
        line.style.opacity = '1';
        
        let charIndex = 0;
        const typeInterval = setInterval(() => {
            if (charIndex < text.length) {
                line.textContent += text.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(typeInterval);
            }
        }, 100 + (index * 50));
    });
}

// Particle system for background
function initParticleSystem() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    // Create particle container
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
    `;
    
    heroSection.appendChild(particleContainer);
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        createParticle(particleContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 3 + 1;
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(220, 20, 60, ${Math.random() * 0.5 + 0.2});
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        animation: particleFloat ${duration}s linear infinite;
        animation-delay: ${delay}s;
    `;
    
    container.appendChild(particle);
    
    // Remove and recreate particle when animation ends
    setTimeout(() => {
        particle.remove();
        createParticle(container);
    }, (duration + delay) * 1000);
}

// Add particle animation to CSS
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    // Scroll-based animations and effects
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// Initialize additional features after page load
window.addEventListener('load', function() {
    initTypingAnimation();
    initParticleSystem();
    
    // Add loading animation completion
    document.body.classList.add('loaded');
});

// Add CSS for loading state
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded) .hero-content {
        opacity: 0;
    }
    
    body.loaded .hero-content {
        opacity: 1;
        transition: opacity 0.5s ease;
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: rgba(10, 10, 10, 0.95);
        backdrop-filter: blur(20px);
        border-top: 1px solid var(--border-color);
        padding: 20px;
        gap: 20px;
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .navbar.scrolled {
        background: rgba(5, 5, 5, 0.98);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
    }
    
    .nav-menu a.active {
        color: #DC143C;
    }
    
    .nav-menu a.active::after {
        width: 100%;
    }
`;
document.head.appendChild(loadingStyle);

// About section animations and live data
function initAboutAnimations() {
    const aboutSection = document.querySelector('#about');
    let animated = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateAboutSection();
            }
        });
    }, { threshold: 0.3 });
    
    if (aboutSection) {
        observer.observe(aboutSection);
    }
}

function animateAboutSection() {
    // Animate stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const liveStats = document.querySelector('.live-stats');
    
    if (liveStats) {
        liveStats.classList.add('animate-stats');
    }
    
    // Animate progress rings
    const progressRings = document.querySelectorAll('.progress-ring-fill');
    const analyticsCards = document.querySelectorAll('.analytics-card');
    
    analyticsCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animate-charts');
        }, index * 200);
    });
    
    // Initialize performance chart
    initPerformanceChart();
    
    // Update live data
    updateLiveData();
}

function initPerformanceChart() {
    const canvas = document.getElementById('performanceChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Sample performance data
    const data = {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
        datasets: [{
            label: 'Response Time (ms)',
            data: [45, 52, 38, 65, 42, 58, 48],
            borderColor: '#DC143C',
            backgroundColor: 'rgba(220, 20, 60, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
        }]
    };
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(220, 20, 60, 0.3)');
    gradient.addColorStop(1, 'rgba(220, 20, 60, 0.05)');
    
    data.datasets[0].backgroundColor = gradient;
    
    // Chart configuration
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#B0B0B0'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#B0B0B0'
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    };
    
    // Create chart
    new Chart(ctx, config);
}

function updateLiveData() {
    // Fetch real data from Supabase
    fetchRealData().then(() => {
        // Update progress rings
        setTimeout(() => {
            const responseRing = document.querySelector('.progress-ring-fill:not(.uptime-ring)');
            const uptimeRing = document.querySelector('.uptime-ring');
            
            if (responseRing) {
                const responsePercent = (45 / 100) * 100; // 45ms out of 100ms max
                const offset = 314 - (314 * responsePercent / 100);
                responseRing.style.setProperty('--target-offset', offset);
            }
            
            if (uptimeRing) {
                const uptimePercent = 99.9;
                const offset = 314 - (314 * uptimePercent / 100);
                uptimeRing.style.setProperty('--target-offset', offset);
            }
        }, 500);
    });
}

async function fetchRealData() {
    try {
        // Initialize Supabase if not already done
        if (!window.supabase) {
            console.log('Supabase not available, using fallback data');
            useFallbackData();
            return;
        }

        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // Fetch system status data for operational services
        const { data: systemStatus, error: statusError } = await supabase
            .from('system_status')
            .select('*')
            .eq('status', 'operational');

        // Fetch uptime stats for total checks and average uptime
        const { data: uptimeStats, error: uptimeError } = await supabase
            .from('uptime_stats')
            .select('*');

        // Calculate real metrics
        let operationalServices = 0;
        let totalChecks = 0;
        let averageUptime = 0;

        if (systemStatus && !statusError) {
            // Count operational services
            operationalServices = systemStatus.length;
            
            // Calculate total checks from uptime stats
            if (uptimeStats && !uptimeError) {
                totalChecks = uptimeStats.reduce((total, stat) => total + (stat.total_checks || 0), 0);
                averageUptime = uptimeStats.reduce((total, stat) => total + (stat.uptime_percentage || 0), 0) / uptimeStats.length;
            } else {
                // Fallback calculations
                totalChecks = operationalServices * 1000;
                averageUptime = 99.7;
            }
        } else {
            // If no data available, use fallback
            useFallbackData();
            return;
        }

        // Update the UI with real data
        const operationalServicesEl = document.getElementById('operational-services');
        const totalChecksEl = document.getElementById('total-checks');
        const accuracyRateEl = document.getElementById('accuracy-rate');
        const responseTimeValueEl = document.getElementById('response-time-value');
        const uptimeValueEl = document.getElementById('uptime-value');

        // Animate numbers with real data
        if (operationalServicesEl) animateNumber(operationalServicesEl, 0, operationalServices, 2000);
        if (totalChecksEl) animateNumber(totalChecksEl, 0, totalChecks, 2500);
        if (accuracyRateEl) animateNumber(accuracyRateEl, 0, averageUptime, 1500);
        
        // Get average response time from system status
        if (systemStatus && systemStatus.length > 0) {
            const avgResponseTime = Math.round(systemStatus.reduce((sum, service) => sum + (service.response_time || 0), 0) / systemStatus.length);
            if (responseTimeValueEl) animateNumber(responseTimeValueEl, 0, avgResponseTime, 1000);
        } else {
            if (responseTimeValueEl) animateNumber(responseTimeValueEl, 0, 45, 1000);
        }

        // Get average uptime
        if (uptimeStats && uptimeStats.length > 0) {
            const avgUptime = (uptimeStats.reduce((sum, stat) => sum + (stat.uptime_percentage || 0), 0) / uptimeStats.length).toFixed(1);
            if (uptimeValueEl) animateNumber(uptimeValueEl, 0, parseFloat(avgUptime), 1800);
        } else {
            if (uptimeValueEl) animateNumber(uptimeValueEl, 0, 99.9, 1800);
        }

        console.log('Real data loaded:', { operationalServices, totalChecks, averageUptime });

    } catch (error) {
        console.error('Error fetching real data:', error);
        useFallbackData();
    }
}

function useFallbackData() {
    // Fallback data when Supabase is not available
    const operationalServicesEl = document.getElementById('operational-services');
    const totalChecksEl = document.getElementById('total-checks');
    const accuracyRateEl = document.getElementById('accuracy-rate');
    const responseTimeValueEl = document.getElementById('response-time-value');
    const uptimeValueEl = document.getElementById('uptime-value');
    
    if (operationalServicesEl) animateNumber(operationalServicesEl, 0, 6, 2000);
    if (totalChecksEl) animateNumber(totalChecksEl, 0, 6000, 2500);
    if (accuracyRateEl) animateNumber(accuracyRateEl, 0, 99.7, 1500);
    if (responseTimeValueEl) animateNumber(responseTimeValueEl, 0, 45, 1000);
    if (uptimeValueEl) animateNumber(uptimeValueEl, 0, 99.9, 1800);
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const difference = end - start;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (difference * easeOutQuart));
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

function initLiveData() {
    // Add SVG gradients for progress rings
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.width = '0';
    svg.style.height = '0';
    
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Ruby gradient
    const rubyGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    rubyGradient.setAttribute('id', 'rubyGradient');
    rubyGradient.setAttribute('x1', '0%');
    rubyGradient.setAttribute('y1', '0%');
    rubyGradient.setAttribute('x2', '100%');
    rubyGradient.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#DC143C');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#B22222');
    
    rubyGradient.appendChild(stop1);
    rubyGradient.appendChild(stop2);
    
    // Uptime gradient
    const uptimeGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    uptimeGradient.setAttribute('id', 'uptimeGradient');
    uptimeGradient.setAttribute('x1', '0%');
    uptimeGradient.setAttribute('y1', '0%');
    uptimeGradient.setAttribute('x2', '100%');
    uptimeGradient.setAttribute('y2', '100%');
    
    const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop3.setAttribute('offset', '0%');
    stop3.setAttribute('stop-color', '#DC143C');
    
    const stop4 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop4.setAttribute('offset', '100%');
    stop4.setAttribute('stop-color', '#B22222');
    
    uptimeGradient.appendChild(stop3);
    uptimeGradient.appendChild(stop4);
    
    defs.appendChild(rubyGradient);
    defs.appendChild(uptimeGradient);
    svg.appendChild(defs);
    document.body.appendChild(svg);
} 