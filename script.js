document.addEventListener('DOMContentLoaded', function() {
    // Инициализация
    initApp();
    
    function initApp() {
        // Загрузка
        initLoader();
        
        // Тема
        initTheme();
        
        // Навигация
        initNavigation();
        
        // Канвас анимация
        initCanvas();
        
        // Анимации при скролле
        initScrollAnimations();
        
        // Форма
        initForm();
        
        // Статистика счетчиков
        initCounters();
        
        // Параллакс эффекты
        initParallax();
    }
    
    // Загрузка
    function initLoader() {
        const loader = document.querySelector('.loader');
        const progressBar = document.querySelector('.progress-bar');
        
        // Анимация прогресс-бара
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress > 100) {
                progress = 100;
                clearInterval(interval);
                
                // Скрываем загрузку
                setTimeout(() => {
                    loader.classList.add('hidden');
                    // Активируем анимации после загрузки
                    activateAnimations();
                }, 500);
            }
            progressBar.style.width = `${progress}%`;
        }, 50);
    }
    
    // Тема
    function initTheme() {
        const themeSwitch = document.getElementById('themeSwitch');
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        themeSwitch.addEventListener('click', function() {
            const theme = document.documentElement.getAttribute('data-theme');
            const newTheme = theme === 'light' ? 'dark' : 'light';
            
            // Анимация переключения
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                document.documentElement.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                this.style.transform = '';
            }, 150);
        });
    }
    
    // Навигация
    function initNavigation() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        const navbar = document.querySelector('.navbar');
        
        // Мобильное меню
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Закрытие меню при клике на ссылку
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Изменение шапки при скролле
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        // Плавная прокрутка
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Закрываем меню если открыто
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                    
                    const headerHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Канвас анимация для героя
    function initCanvas() {
        const canvas = document.getElementById('heroCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        // Частицы
        const particles = [];
        const particleCount = Math.min(100, Math.floor(width / 10));
        
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.color = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
                this.alpha = Math.random() * 0.3 + 0.1;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x > width) this.x = 0;
                else if (this.x < 0) this.x = width;
                
                if (this.y > height) this.y = 0;
                else if (this.y < 0) this.y = height;
            }
            
            draw() {
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Инициализация частиц
        function initParticles() {
            particles.length = 0;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        
        // Соединения между частицами
        function drawConnections() {
            const maxDistance = 150;
            
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < maxDistance) {
                        const opacity = 1 - (distance / maxDistance);
                        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
                        ctx.globalAlpha = opacity * 0.2;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Анимация
        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            drawConnections();
            requestAnimationFrame(animate);
        }
        
        // Ресайз
        function handleResize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        }
        
        // Инициализация
        initParticles();
        animate();
        
        window.addEventListener('resize', handleResize);
        
        // Обновление цвета при смене темы
        const observer = new MutationObserver(() => {
            particles.forEach(p => {
                p.color = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
            });
        });
        
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }
    
    // Анимации при скролле
    function initScrollAnimations() {
        // Простая реализация AOS (Animate On Scroll)
        const animatedElements = document.querySelectorAll('[data-aos]');
        
        function checkScroll() {
            animatedElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                if (rect.top < windowHeight * 0.85 && rect.bottom > 0) {
                    const delay = el.getAttribute('data-aos-delay') || 0;
                    
                    setTimeout(() => {
                        el.classList.add('aos-animate');
                        
                        // Специфичные анимации
                        const animation = el.getAttribute('data-aos');
                        switch(animation) {
                            case 'fade-up':
                                el.style.transform = 'translateY(0)';
                                el.style.opacity = '1';
                                break;
                            case 'fade-right':
                                el.style.transform = 'translateX(0)';
                                el.style.opacity = '1';
                                break;
                            case 'zoom-in':
                                el.style.transform = 'scale(1)';
                                el.style.opacity = '1';
                                break;
                        }
                    }, parseInt(delay));
                }
            });
        }
        
        // Инициализация анимаций
        animatedElements.forEach(el => {
            const animation = el.getAttribute('data-aos');
            switch(animation) {
                case 'fade-up':
                    el.style.transform = 'translateY(30px)';
                    break;
                case 'fade-right':
                    el.style.transform = 'translateX(-30px)';
                    break;
                case 'zoom-in':
                    el.style.transform = 'scale(0.95)';
                    break;
            }
            el.style.opacity = '0';
            el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        // Проверка при загрузке и скролле
        window.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);
        window.addEventListener('load', checkScroll);
        
        // Первоначальная проверка
        setTimeout(checkScroll, 100);
    }
    
    // Форма
    function initForm() {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;
        
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        
        // Анимация фокуса
        formInputs.forEach(input => {
            const label = input.previousElementSibling;
            
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            // Автоматическое увеличение textarea
            if (input.tagName === 'TEXTAREA') {
                input.addEventListener('input', function() {
                    this.style.height = 'auto';
                    this.style.height = (this.scrollHeight) + 'px';
                });
            }
        });
        
        // Отправка формы
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (submitBtn.disabled) return;
            
            // Валидация
            let isValid = true;
            formInputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'var(--error-color)';
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                submitBtn.innerHTML = '<span>Заполните все поля</span>';
                submitBtn.style.background = 'var(--error-color)';
                
                setTimeout(() => {
                    submitBtn.innerHTML = '<span>Отправить заявку</span><i class="fas fa-paper-plane"></i>';
                    submitBtn.style.background = '';
                }, 2000);
                return;
            }
            
            // Анимация отправки
            const originalHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Отправка...</span>';
            submitBtn.style.opacity = '0.8';
            
            // Имитация отправки
            setTimeout(() => {
                submitBtn.innerHTML = '<span>Успешно отправлено!</span><i class="fas fa-check"></i>';
                submitBtn.style.background = 'var(--success-color)';
                
                // Сброс формы
                setTimeout(() => {
                    contactForm.reset();
                    formInputs.forEach(input => {
                        if (input.tagName === 'TEXTAREA') {
                            input.style.height = 'auto';
                        }
                        input.parentElement.classList.remove('focused');
                    });
                    
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.style.background = '';
                    submitBtn.style.opacity = '1';
                    submitBtn.disabled = false;
                }, 2000);
            }, 1500);
        });
    }
    
    // Счетчики статистики
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        function startCounter(counter) {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000; // 2 секунды
            const step = target / (duration / 16); // 60fps
            
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current);
            }, 16);
        }
        
        // Запуск счетчиков при появлении в viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    // Параллакс эффекты
    function initParallax() {
        const floatingCards = document.querySelectorAll('.floating-card');
        
        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            floatingCards.forEach((card, index) => {
                const speed = 0.05 + (index * 0.02);
                const x = (mouseX - 0.5) * 40 * speed;
                const y = (mouseY - 0.5) * 40 * speed;
                
                card.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }
    
    // Активация анимаций после загрузки
    function activateAnimations() {
        // Запускаем начальные анимации
        const titleLines = document.querySelectorAll('.title-line');
        titleLines.forEach((line, index) => {
            line.style.animation = `fadeInUp 0.8s ease forwards ${index * 0.3 + 0.3}s`;
        });
        
        document.querySelector('.hero-subtitle').style.animation = 'fadeInUp 0.8s ease forwards 0.9s';
        document.querySelector('.hero-buttons').style.animation = 'fadeInUp 0.8s ease forwards 1.2s';
        document.querySelector('.scroll-indicator').style.animation = 'fadeIn 1s ease forwards 2.5s';
        
        // Статистика
        const stats = document.querySelectorAll('.stat');
        stats.forEach((stat, index) => {
            stat.style.animation = `fadeInUp 0.8s ease forwards ${index * 0.2 + 1.5}s`;
        });
        
        // Начальная проверка скролл-анимаций
        setTimeout(() => {
            const event = new Event('scroll');
            window.dispatchEvent(event);
        }, 500);
    }
    
    // Дополнительные эффекты
    // Эффект печатающего текста для заголовка
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        // Анимация букв уже реализована через CSS
        // Просто убедимся что все на месте
    }
    
    // Эффект волны для кнопок
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - this.getBoundingClientRect().left;
            const y = e.clientY - this.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Добавляем стили для ripple эффекта
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .ripple {
            position: absolute;
            background: rgba(255, 255, 255, 0.7);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
});