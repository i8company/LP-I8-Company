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

    // 6. Supabase Lead Form logic
    const form = document.getElementById('lead-form');
    if (form && window.supabaseClient) {
        const supabaseClient = window.supabaseClient;
        
        const submitBtn = document.getElementById('submit-btn');
        const formSuccess = document.getElementById('form-success');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Enviando...';

            const formData = new FormData(form);
            const data = {
                nome: formData.get('nome'),
                email: formData.get('email'),
                telefone: formData.get('telefone'),
                empresa: formData.get('empresa'),
                mensagem: formData.get('mensagem'),
                solucoes: Array.from(formData.getAll('solucoes')).join(', '),
                criado_em: new Date().toISOString()
            };

            const { error } = await supabaseClient
                .from('leads')
                .insert([data]);

            if (error) {
                console.error('Erro ao enviar lead:', error);
                alert('Erro ao enviar. Tente novamente.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Falar com especialista <i class="ph ph-paper-plane-tilt"></i>';
            } else {
                form.style.display = 'none';
                formSuccess.style.display = 'flex';
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }
    // 7. Video Scroll Scrubbing Logic
    const video = document.getElementById('hero-video');
    
    if (video) {
        let targetTime = 0;
        let currentTime = 0;
        const interpolationFactor = 0.1; // Adjust for smoothness (0.1 = very smooth)

        const handleMetadata = () => {
            const duration = video.duration;
            
        const heroText = document.querySelector('.hero-text.centered');
        const bgLayer = document.querySelector('.bg-asset-layer');
        const heroVisual = document.querySelector('.hero-visual');
        
        const scrubVideo = () => {
            const scrollRange = window.innerHeight * 1.5;
            const scrollFraction = Math.min(Math.max(window.scrollY / scrollRange, 0), 1);
            
            targetTime = scrollFraction * duration;
            
            currentTime += (targetTime - currentTime) * interpolationFactor;
            
            if (Math.abs(currentTime - video.currentTime) > 0.01) {
                video.currentTime = currentTime;
            }

            // --- Reference-inspired Parallax & Motion ---
            if (heroText) {
                const textY = window.scrollY * 0.3;
                const textOpacity = 1 - (window.scrollY / (window.innerHeight * 0.5));
                heroText.style.transform = `translateY(${textY}px)`;
                heroText.style.opacity = Math.max(textOpacity, 0);
            }

            if (heroVisual) {
                const visualScale = 1 + (window.scrollY * 0.0005);
                const visualRotate = window.scrollY * 0.02;
                heroVisual.style.transform = `scale(${visualScale}) rotateX(${visualRotate}deg)`;
            }

            if (bgLayer) {
                const bgY = window.scrollY * 0.1;
                bgLayer.style.transform = `translate(-50%, calc(-50% + ${bgY}px)) scale(1.1)`;
            }
            
            requestAnimationFrame(scrubVideo);
        };

            // Start the scrubbing loop
            requestAnimationFrame(scrubVideo);
        };

        if (video.readyState >= 1) {
            handleMetadata();
        } else {
            video.addEventListener('loadedmetadata', handleMetadata);
        }

        // Fix for some browsers/mobile where video might not auto-play or show first frame
        video.play().then(() => {
            video.pause();
        }).catch(e => {
            // Video might need user interaction to "start" in some contexts
            console.log("Video scrub waiting for interaction or auto-play block");
        });
    }
});
