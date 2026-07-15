// --- BOUNCING BUTTON (DVD Screensaver) ---


// Get the button element
const bouncingBtn = document.getElementById('bouncingBtn');

// Set starting position and speed
let xPos = 0;
let yPos = 0;
let xSpeed = 2.5;
let ySpeed = 2.5;

// Function to move the button
function moveButton() {
    if (!bouncingBtn) return;
    
    // Get container and button dimensions
    const container = bouncingBtn.parentElement;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const btnWidth = bouncingBtn.offsetWidth;
    const btnHeight = bouncingBtn.offsetHeight;
    
    // Update position
    xPos += xSpeed;
    yPos += ySpeed;
    
    // Bounce off walls (with collision detection)
    if (xPos + btnWidth >= containerWidth) {
        xPos = containerWidth - btnWidth;
        xSpeed = -xSpeed;
    }
    if (xPos <= 0) {
        xPos = 0;
        xSpeed = -xSpeed;
    }
    if (yPos + btnHeight >= containerHeight) {
        yPos = containerHeight - btnHeight;
        ySpeed = -ySpeed;
    }
    if (yPos <= 0) {
        yPos = 0;
        ySpeed = -ySpeed;
    }
    
    // Apply position
    bouncingBtn.style.left = xPos + 'px';
    bouncingBtn.style.top = yPos + 'px';
    
    // Keep animation smooth
    requestAnimationFrame(moveButton);
}

// Start the animation when page loads
window.addEventListener('load', function() {
    // Wait a moment for layout to settle
    setTimeout(() => {
        // Center the button initially
        const container = bouncingBtn.parentElement;
        xPos = (container.clientWidth - bouncingBtn.offsetWidth) / 2;
        yPos = (container.clientHeight - bouncingBtn.offsetHeight) / 2;
        moveButton();
    }, 100);
});

// Handle window resize to keep button inside bounds
window.addEventListener('resize', function() {
    const container = bouncingBtn.parentElement;
    const btnWidth = bouncingBtn.offsetWidth;
    const btnHeight = bouncingBtn.offsetHeight;
    
    // Clamp position to new container size
    xPos = Math.min(xPos, container.clientWidth - btnWidth);
    yPos = Math.min(yPos, container.clientHeight - btnHeight);
    xPos = Math.max(xPos, 0);
    yPos = Math.max(yPos, 0);
});

// --- NAVIGATE TO QUOTES PAGE ---
function goToQuotes() {
    window.location.href = 'quotes.html';
}

// --- SCROLL ANIMATIONS (Intersection Observer) ---

// Select all elements with the 'fade-in' class
const fadeElements = document.querySelectorAll('.fade-in');

// Create an observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add a class that triggers the animation
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe each element
fadeElements.forEach(el => observer.observe(el));

// ========================================
// INTERACTIVE QUOTE CAROUSEL
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('carouselTrack');
    const slides = track.querySelectorAll('.carousel-slide');
    const dotsContainer = document.getElementById('carouselDots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const autoplayBtn = document.getElementById('autoplayBtn');
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    let isAutoplay = true;
    let autoplayInterval = null;
    let isTransitioning = false;
    
    // --- Create Dots ---
    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('data-index', i);
            dot.addEventListener('click', function() {
                goToSlide(parseInt(this.getAttribute('data-index')));
            });
            dotsContainer.appendChild(dot);
        }
    }
    
    // --- Go to Slide ---
    function goToSlide(index) {
        if (isTransitioning || index === currentIndex) return;
        isTransitioning = true;
        
        // Loop around
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dots
        document.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
        
        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    }
    
    // --- Next Slide ---
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    // --- Prev Slide ---
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    // --- Toggle Autoplay ---
    function toggleAutoplay() {
        isAutoplay = !isAutoplay;
        if (isAutoplay) {
            autoplayBtn.textContent = '⏸ Pause';
            startAutoplay();
        } else {
            autoplayBtn.textContent = '▶ Play';
            stopAutoplay();
        }
    }
    
    // --- Start Autoplay ---
    function startAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(nextSlide, 4000);
    }
    
    // --- Stop Autoplay ---
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }
    
    // --- Event Listeners ---
    prevBtn.addEventListener('click', function() {
        prevSlide();
        if (isAutoplay) {
            stopAutoplay();
            startAutoplay();
        }
    });
    
    nextBtn.addEventListener('click', function() {
        nextSlide();
        if (isAutoplay) {
            stopAutoplay();
            startAutoplay();
        }
    });
    
    autoplayBtn.addEventListener('click', toggleAutoplay);
    
    // --- Keyboard Navigation ---
    document.addEventListener('keydown', function(e) {
        // Only if carousel is in view
        const container = document.querySelector('.carousel-container');
        const rect = container.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
                if (isAutoplay) {
                    stopAutoplay();
                    startAutoplay();
                }
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
                if (isAutoplay) {
                    stopAutoplay();
                    startAutoplay();
                }
            }
        }
    });
    
    // --- Initialize ---
    createDots();
    startAutoplay();
});

// ========================================
// IMAGE LIGHTBOX / GALLERY ZOOM
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // --- Elements ---
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    
    // --- Get all floor plan images ---
    const galleryImages = document.querySelectorAll('.floorplan-image img');
    let currentIndex = 0;
    
    // --- Open Lightbox ---
    function openLightbox(index) {
        if (!galleryImages.length) return;
        
        // Get the clicked image
        const img = galleryImages[index];
        const src = img.getAttribute('src');
        const caption = img.getAttribute('data-caption') || '';
        
        // Set the lightbox content
        lightboxImage.src = src;
        lightboxImage.alt = img.alt || '';
        lightboxCaption.textContent = caption;
        
        currentIndex = index;
        
        // Show lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
        
        // Preload next/prev images for smoother navigation
        preloadAdjacent(index);
    }
    
    // --- Close Lightbox ---
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // --- Preload adjacent images ---
    function preloadAdjacent(index) {
        const total = galleryImages.length;
        const nextIndex = (index + 1) % total;
        const prevIndex = (index - 1 + total) % total;
        
        [nextIndex, prevIndex].forEach(i => {
            const img = galleryImages[i];
            if (img) {
                const tempImg = new Image();
                tempImg.src = img.getAttribute('src');
            }
        });
    }
    
    // --- Navigate ---
    function goToPrev() {
        const total = galleryImages.length;
        const newIndex = (currentIndex - 1 + total) % total;
        openLightbox(newIndex);
    }
    
    function goToNext() {
        const total = galleryImages.length;
        const newIndex = (currentIndex + 1) % total;
        openLightbox(newIndex);
    }
    
    // --- Event Listeners: Gallery Images ---
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            openLightbox(index);
        });
    });
    
    // --- Event Listeners: Controls ---
    closeBtn.addEventListener('click', closeLightbox);
    
    prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        goToPrev();
    });
    
    nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        goToNext();
    });
    
    // --- Click on background to close ---
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // --- Keyboard Navigation ---
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                goToPrev();
                break;
            case 'ArrowRight':
                e.preventDefault();
                goToNext();
                break;
        }
    });
    
    // --- Prevent body scroll when lightbox is open ---
    // (handled in open/close functions)
    
});

// ========================================
// RANDOM PAGE LOADER
// ========================================

// --- Random loader configurations ---
const loaderIcons = [
    '✦',    // Gold star
    '🏠',   // House
    '✨',   // Sparkle
    '⭐',   // Star
    '🛠️',   // Tools
    '💡',   // Lightbulb
    '🚀',   // Rocket
];

const loaderMessages = [
    'Loading...',
    'Building vision...',
    'Preparing blueprints...',
    'Designing spaces...',
    'Constructing future...',
    'Laying foundation...',
    'Raising walls...',
    'Adding finishing touches...',
    'Polishing details...',
];

// --- Select random items ---
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// --- Apply random loader content ---
document.addEventListener('DOMContentLoaded', function() {
    const iconEl = document.getElementById('loaderIcon');
    const textEl = document.getElementById('loaderText');
    
    if (iconEl) {
        iconEl.textContent = getRandomItem(loaderIcons);
    }
    if (textEl) {
        textEl.textContent = getRandomItem(loaderMessages);
    }
});

// --- Hide loader after 1.6 seconds ---
window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(function() {
            loader.classList.add('hidden');
        }, 1600);
    }
});

// --- Additional: random accent color (optional) ---
const accentColors = [
    '#f0c040', // Gold
    '#ff6b6b', // Red
    '#4ecdc4', // Teal
    '#45b7d1', // Blue
    '#96ceb4', // Green
    '#dda0dd', // Plum
    '#ffa07a', // Salmon
];

document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Random color for the icon and progress bar
    const color = getRandomItem(accentColors);
    if (iconEl) {
        iconEl.style.color = color;
    }
    const progressEl = document.querySelector('.loader-progress');
    if (progressEl) {
        progressEl.style.background = `linear-gradient(90deg, ${color}, ${color}cc)`;
    }
});
