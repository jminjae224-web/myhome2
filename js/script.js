document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================
       1. 다크/라이트 테마 토글 (Dark/Light Theme Toggle)
       ========================================== */
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // 로컬 스토리지 또는 시스템 설정에서 테마 불러오기
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('dark-theme');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
    
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        
        if (isDark) {
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    });

    /* ==========================================
       2. 모바일 햄버거 메뉴 토글 (Mobile Nav Menu Toggle)
       ========================================== */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    const toggleMobileMenu = () => {
        mobileMenuBtn.classList.toggle('active');
        mobileNav.style.display = mobileMenuBtn.classList.contains('active') ? 'block' : 'none';
    };
    
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuBtn.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    /* ==========================================
       3. 부드러운 스크롤 & 활성 네비게이션 감지 (Smooth Scroll & Nav Highlight)
       ========================================== */
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    // 스크롤 시 헤더 쉐도우 및 네비게이션 하이라이트
    window.addEventListener('scroll', () => {
        // 헤더 쉐도우
        if (window.scrollY > 50) {
            header.style.boxShadow = 'var(--shadow-md)';
            header.style.padding = '5px 0';
        } else {
            header.style.boxShadow = 'none';
            header.style.padding = '0';
        }
        
        // 현재 위치한 섹션 하이라이트
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 120) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    // 네비게이션 클릭 시 부드러운 스크롤 보정
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 90;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ==========================================
       4. 스크롤 릴리즈 애니메이션 (Scroll Reveal Observer)
       ========================================== */
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // 한 번 등장하면 감시 해제
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* ==========================================
       5. 통계 숫자 카운트 애니메이션 (Hero Stats Counter)
       ========================================== */
    const statsNumElements = document.querySelectorAll('.stat-num');
    
    const countUp = (element) => {
        const target = +element.getAttribute('data-target');
        const duration = 2000; // 2초 동안 진행
        const stepTime = Math.max(Math.floor(duration / target), 15);
        let current = 0;
        
        const timer = setInterval(() => {
            current += Math.ceil(target / (duration / stepTime));
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = current.toLocaleString();
            }
        }, stepTime);
    };
    
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsNumElements.forEach(num => statsObserver.observe(num));

    /* ==========================================
       6. 메뉴 필터링 기능 (Menu Filtering)
       ========================================== */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const menuCards = document.querySelectorAll('.menu-card');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // 버튼 액티브 클래스 변경
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            menuCards.forEach(card => {
                // 페이드 아웃 후 필터링 및 페이드 인 효과
                card.style.opacity = '0';
                card.style.transform = 'translateY(15px)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    /* ==========================================
       7. 고객 후기 슬라이더 (Reviews Slider/Carousel)
       ========================================== */
    const track = document.getElementById('sliderTrack');
    const slides = Array.from(track.children);
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dotsContainer = document.getElementById('sliderDots');
    
    let currentIndex = 0;
    let slideInterval;
    
    // 점 생성 및 활성화
    slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(idx);
            resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
    });
    
    const dots = Array.from(dotsContainer.children);
    
    const updateDots = (index) => {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
    };
    
    const goToSlide = (index) => {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots(currentIndex);
    };
    
    nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        resetAutoPlay();
    });
    
    prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        resetAutoPlay();
    });
    
    // 자동 넘김 설정 (5초마다)
    const startAutoPlay = () => {
        slideInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
    };
    
    const resetAutoPlay = () => {
        clearInterval(slideInterval);
        startAutoPlay();
    };
    
    startAutoPlay();

    /* ==========================================
       8. FAQ 아코디언 (FAQ Accordion)
       ========================================== */
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');
        
        trigger.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // 모든 아코디언 닫기 (선택사항)
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-content').style.maxHeight = '0';
            });
            
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    /* ==========================================
       9. 문의하기 폼 검증 & 전송 시뮬레이션
       ========================================== */
    const form = document.getElementById('enhancedContactForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const type = document.getElementById('inquiryType');
            const typeText = type.options[type.selectedIndex].text;
            const quantity = document.getElementById('quantity').value || '미정';
            
            // 동의 여부 체크 확인 (HTML5 required가 있지만 더블 체크)
            const agree = document.getElementById('privacyAgree').checked;
            if (!agree) {
                alert('개인정보 수집 및 이용에 동의해 주세요.');
                return;
            }
            
            // 아름답게 포맷팅된 알림 출력
            alert(
                `🎉 그린테이블 상담 예약 접수 완료!\n\n` +
                `• 예약자명: ${name} 님\n` +
                `• 문의유형: ${typeText}\n` +
                `• 예상 인원: ${quantity} 명\n` +
                `• 연락처: ${phone}\n` +
                `• 이메일: ${email}\n\n` +
                `작성해주신 메일 및 연락처로 2시간 이내에 전담 플래너가 신속하게 연락드리겠습니다. 감사합니다!`
            );
            
            form.reset();
        });
    }
});
