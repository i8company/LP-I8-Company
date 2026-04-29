document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(3, 5, 12, 0.9)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
            navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        } else {
            navbar.style.background = 'rgba(3, 5, 12, 0.7)';
            navbar.style.boxShadow = 'none';
            navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.08)';
        }
    });

    // 2. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close other items
            faqItems.forEach(i => i.classList.remove('active'));
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 3. Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .fade-in-up, .slide-in-left, .slide-in-right').forEach(el => observer.observe(el));

    // 4. Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if(href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - (navbarHeight + 20);
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 5. Phone Mask
    const telInput = document.getElementById('telefone');
    if (telInput) {
        telInput.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 11) v = v.substring(0, 11);
            if (v.length > 10) {
                v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
            } else if (v.length > 6) {
                v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
            } else if (v.length > 2) {
                v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
            } else if (v.length > 0) {
                v = v.replace(/^(\d{0,2})/, '($1');
            }
            e.target.value = v;
        });
    }

    // 7. Canvas Scroll Scrubbing Logic (High Resolution)
    const canvas = document.getElementById('hero-canvas');
    const context = canvas?.getContext('2d');
    
    if (canvas && context) {
        const frameCount = 39;
        const currentFrame = index => (
            `assets/hero-sequence/frame_${index.toString().padStart(3, '0')}.jpg`
        );

        const images = [];
        const frameData = { frame: 0 };

        // Preload images
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);
        }

        const render = () => {
            const img = images[frameData.frame];
            if (!img || !img.complete) return;

            // Handle aspect ratio (cover effect)
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const imgWidth = img.width;
            const imgHeight = img.height;
            
            const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
            const newWidth = imgWidth * ratio;
            const newHeight = imgHeight * ratio;
            const x = (canvasWidth - newWidth) / 2;
            const y = (canvasHeight - newHeight) / 2;

            context.clearRect(0, 0, canvasWidth, canvasHeight);
            context.drawImage(img, x, y, newWidth, newHeight);
        };

        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render();
        };

        window.addEventListener('resize', updateCanvasSize);
        updateCanvasSize();

        const heroStory = document.querySelector('.hero-story');
        const phrases = document.querySelectorAll('.story-phrase');
        const dots = document.querySelectorAll('.nav-dot');

        const scrubAnimation = () => {
            if (!heroStory) return;
            
            const scrollStart = heroStory.offsetTop;
            const scrollEnd = scrollStart + heroStory.offsetHeight - window.innerHeight;
            const scrollPos = window.scrollY;
            
            let progress = (scrollPos - scrollStart) / (scrollEnd - scrollStart);
            progress = Math.min(Math.max(progress, 0), 1);
            
            // Sync Frame
            const frameIndex = Math.min(
                Math.floor(progress * (frameCount - 1)),
                frameCount - 1
            );
            
            if (frameData.frame !== frameIndex) {
                frameData.frame = frameIndex;
                render();
            }

            // Sync Phrases & Dots
            const phraseIndex = Math.min(Math.floor(progress * phrases.length), phrases.length - 1);
            
            phrases.forEach((phrase, index) => {
                if (index === phraseIndex) {
                    phrase.classList.add('active');
                } else {
                    phrase.classList.remove('active');
                }
            });

            dots.forEach((dot, index) => {
                if (index === phraseIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
            
            requestAnimationFrame(scrubAnimation);
        };

        // Start animation loop
        requestAnimationFrame(scrubAnimation);
        
        // Initial render when first image loads
        images[0].onload = render;
    }
});
