// 1. ГЛОБАЛЬНЫЕ ФУНКЦИИ
window.openTab = function(evt, tabName) {
    const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
    document.querySelectorAll(".tab-content").forEach(c => { 
        c.style.display = "none"; 
        c.classList.remove("active-content"); 
    });
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    
    const selected = document.getElementById(tabName);
    if (selected) {
        selected.style.display = "block";
        const title = selected.querySelector('.typing-title');
        if (title) { 
            title.classList.remove('typing-animation'); 
            void title.offsetWidth; // Магия перезапуска анимации
            title.classList.add('typing-animation'); 
        }
        setTimeout(() => selected.classList.add("active-content"), 10);
        
        // Анимация навыков и круга
        if (tabName === 'skills') {
            document.querySelectorAll('.skill-progress-fill').forEach(bar => {
                const percent = bar.getAttribute('data-percent'); 
                bar.style.transition = 'none'; 
                bar.style.width = '0%'; 
                setTimeout(() => { 
                    bar.style.transition = 'width 1.5s cubic-bezier(0.1, 0.42, 0.41, 1)'; 
                    bar.style.width = percent + '%'; 
                }, 50);
            });

            document.querySelectorAll('.special-skill-center .percent-fill').forEach(circle => {
                const percent = 90;
                const offset = 339.29 - (339.29 * percent) / 100;
                circle.style.transition = 'none';
                circle.style.strokeDashoffset = '339.29';
                setTimeout(() => {
                    circle.style.transition = 'stroke-dashoffset 1.5s ease-out';
                    circle.style.strokeDashoffset = offset;
                }, 100);
            });
        }
    }
    
    if (evt) evt.currentTarget.classList.add("active");
    else document.querySelector(`[data-tab="${tabName}"]`)?.classList.add("active");
};

// Исправленная функция скролла (берет актуальную высоту окна)
window.scrollToPage = function(pageIndex) {
    const scrollContainer = document.querySelector('.scroll-container');
    if (!scrollContainer) return;
    const vh = window.innerHeight;
    scrollContainer.scrollTo({ 
        top: pageIndex * vh, 
        behavior: 'smooth' 
    });
};

// 2. ИНИЦИАЛИЗАЦИЯ
document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.querySelector('.scroll-container');
    const progressBar = document.querySelector('.scroll-progress-bar');
    const dots = document.querySelectorAll('.nav-dot');
    const upArrow = document.getElementById('upArrow');
    const downArrow = document.getElementById('downArrow');
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    let isAnimating = false;

    // 3. УМНАЯ ЛОГИКА СКРОЛЛА (Wheel)
    scrollContainer.addEventListener('wheel', (e) => {
        e.preventDefault(); 
        if (isAnimating) return;
        
        const vh = window.innerHeight;
        const currentPg = Math.round(scrollContainer.scrollTop / vh);
        const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
        const activeBtn = document.querySelector('.tab-btn.active');
        const currentIndex = tabButtons.indexOf(activeBtn);
        
        if (e.deltaY > 0) {
            // Листаем табы на 1-й странице
            if (currentPg === 0 && currentIndex < tabButtons.length - 1) { 
                window.openTab(null, tabButtons[currentIndex + 1].dataset.tab); 
                isAnimating = true; 
                setTimeout(() => isAnimating = false, 500); 
            }
            // Иначе листаем страницы вниз
            else if (currentPg < 4) {
                window.scrollToPage(currentPg + 1);
                isAnimating = true;
                setTimeout(() => isAnimating = false, 800);
            }
        } else {
            // Листаем страницы вверх
            if (currentPg > 0) {
                window.scrollToPage(currentPg - 1);
                isAnimating = true;
                setTimeout(() => isAnimating = false, 800);
            }
            // Листаем табы назад на 1-й странице
            else if (currentPg === 0 && currentIndex > 0) { 
                window.openTab(null, tabButtons[currentIndex - 1].dataset.tab); 
                isAnimating = true; 
                setTimeout(() => isAnimating = false, 500); 
            }
        }
    }, { passive: false });

    // 4. ОБНОВЛЕНИЕ ИНДИКАТОРОВ ПРИ СКРОЛЛЕ
    scrollContainer.addEventListener('scroll', () => {
        const vh = window.innerHeight;
        const scrollTop = scrollContainer.scrollTop;
        const height = scrollContainer.scrollHeight - vh;
        if (progressBar) progressBar.style.width = (scrollTop / height * 100) + "%";
        
        const currentPg = Math.round(scrollTop / vh);
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentPg));
        
        if (upArrow && downArrow) {
            upArrow.style.opacity = currentPg === 0 ? "0" : "1";
            downArrow.style.opacity = currentPg === 4 ? "0" : "1";
        }
    });

    // 5. КАСТОМНЫЙ КУРСОР
    window.addEventListener('mousemove', (e) => {
        if (dot && outline) {
            dot.style.left = outline.style.left = e.clientX + 'px';
            dot.style.top = outline.style.top = e.clientY + 'px';
        }
    });

    // 6. ЭФФЕКТ НАВЕДЕНИЯ
    const hoverElements = 'a, button, .photo-container, .tab-btn, .detail-card, .soft-card, .nav-dot, .nav-arrow, .contact-list li, .scroll-hint-text, .manifesto-card, .hobby-section, .timeline-item';
    document.querySelectorAll(hoverElements).forEach(el => {
        el.addEventListener('mouseenter', () => outline?.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => outline?.classList.remove('cursor-hover'));
    });
});
