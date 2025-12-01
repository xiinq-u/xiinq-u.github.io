/* =========================
   1. TYPING EFFECT
========================= */
const typingElement = document.querySelector('.text5 h4'); // Elemen teks yang akan diketik
const words = ['Arief', 'a Developer', 'a Student'];       // Kata-kata yang akan diketik
const typingSpeed = 150;   // Kecepatan mengetik (ms per karakter)
const deletingSpeed = 90;  // Kecepatan menghapus
const pauseTime = 1000;    // Waktu jeda sebelum hapus/ketik kata berikutnya
let wordIndex = 0;
let charIndex = 0;

function type() {
    const currentWord = words[wordIndex];
    if (charIndex < currentWord.length) {
        typingElement.textContent += currentWord.charAt(charIndex);
        charIndex++;
        setTimeout(type, typingSpeed);
    } else {
        setTimeout(del, pauseTime);
    }
}

function del() {
    const currentWord = words[wordIndex];
    if (charIndex > 0) {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        setTimeout(del, deletingSpeed);
    } else {
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 500);
    }
}

// Mulai efek typing
type();



/* =========================
   2. NAVBAR INDICATOR
========================= */
const links = document.querySelectorAll(".nav-isi a");
const indicator = document.querySelector(".glass-indicator");

// Fungsi untuk memindahkan indikator ke link yang aktif
function moveIndicator(el) {
    const rect = el.getBoundingClientRect();
    const parentRect = el.parentElement.getBoundingClientRect();
    const left = rect.left - parentRect.left;
    const width = rect.width;

    indicator.style.opacity = "1";
    indicator.style.transform = `translateX(${left}px)`;
    indicator.style.width = `${width}px`;
}

// Hover effect & klik link
links.forEach(link => {
    link.addEventListener("mouseenter", () => moveIndicator(link));

    link.addEventListener("click", (e) => {
        e.preventDefault();

        // Hapus class active-link sebelumnya
        document.querySelector(".nav-isi a.active-link")?.classList.remove("active-link");

        // Tambahkan class active-link ke link yang diklik
        link.classList.add("active-link");

        // Pindahkan indikator ke link tersebut
        moveIndicator(link);

        // Scroll smooth ke section
        const targetId = link.getAttribute("href").substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
            gsap.to(window, {
                duration: 1.7,
                scrollTo: targetEl,
                ease: "power3.out"
            });
        }
    });
});

// Hover-out → kembali ke link aktif
document.querySelector(".nav-isi").addEventListener("mouseleave", () => {
    const active = document.querySelector(".nav-isi a.active-link");
    if (active) moveIndicator(active);
});

// Posisi awal saat load
window.onload = () => {
    const active = document.querySelector(".nav-isi a.active-link");
    if (active) moveIndicator(active);
};



/* =========================
   3. MODAL WINDOW
========================= */
const openModal = document.getElementById("openModal");
const modal = document.getElementById("modal");
const closeModal = document.querySelector(".close");

// Buka modal
openModal.onclick = () => {
    modal.style.display = "flex";
    document.body.classList.add("no-scroll");
};

// Tutup modal lewat tombol X
closeModal.onclick = () => {
    modal.style.display = "none";
    document.body.classList.remove("no-scroll");
};

// Tutup modal kalau klik overlay
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
        document.body.classList.remove("no-scroll");
    }
});



/* =========================
   4. GSAP ANIMATIONS & SCROLL
========================= */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Animasi judul saat scroll
gsap.to(".title", {
    opacity: 1,
    y: 0,
    ease: "power4.out",
    scrollTrigger: {
        trigger: ".section1",
        start: "top 85%",
        end: "top 20%",
        scrub: 1.5,
        markers: false
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.querySelectorAll('#about .chat-message');
    console.log(chatMessages);
    
    const chatBody = document.getElementById('chatBody');
    console.log(chatBody)

    const animateChatMessages = (messages) => {
        messages.forEach(message => {
            const delay = parseInt(message.getAttribute('data-delay') || '0', 10);
            setTimeout(() => {
                message.classList.add('visible');
                chatBody.scrollTop = chatBody.scrollHeight;
            }, delay);
        });
    };

    const hideChatMessages = (messages) => {
        messages.forEach(message => {
            message.classList.remove('visible');
        });
    };

    const chatObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateChatMessages(chatMessages);
            } else {
                hideChatMessages(chatMessages);
            }
        });
    }, { threshold: 0.1 });

    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        chatObserver.observe(aboutSection);
    }
});


// Scroll ke section saat tombol diklik
const scrollTo = (btnId, target) => {
    const btn = document.getElementById(btnId);
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        gsap.to(window, {
            duration: 1.7,
            scrollTo: target,
            ease: "power3.out"
        });
    });
};

scrollTo("btnAbout", "#about");
scrollTo("home-link", "#home");
scrollTo("edukasi", "#education");
scrollTo("pekerjaan", "#Work");
scrollTo("btnPelatihan", "#Pelatihan");
scrollTo("kontak1", "#contact");



/* =========================
   5. APPLE-STYLE EDUCATION SLIDER
========================= */
document.addEventListener('DOMContentLoaded', () => {
    const slidesContainer = document.getElementById('slidesContainer');
    const dotNavigation = document.getElementById('dotNavigation');
    const appleSection = document.getElementById('education');
    const appleNav = document.querySelector('.apple-nav');
    const slides = document.querySelectorAll('#education .slide');
    const totalSlides = slides.length;
    let currentIndex = 0;

    // --- Generate dots ---
    const generateDots = () => {
        dotNavigation.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.dataset.slide = i;
            dot.addEventListener('click', () => moveToSlide(i)); // Klik dot langsung ke slide i
            dotNavigation.appendChild(dot);
        }
    };

    // --- Hitung offset tengah slide ---
    const calculateOffset = (index) => {
        const slideWidth = slides[0].offsetWidth;
        const gap = 50;
        const galleryWidth = document.querySelector('.apple-gallery').offsetWidth;
        const centerShift = (galleryWidth / 2) - (slideWidth / 2);
        return index * (slideWidth + gap) - centerShift;
    };

    // --- Move slide ---
    const moveToSlide = (index) => {
        index = Math.max(0, Math.min(index, totalSlides - 1));
        currentIndex = index;

        const offset = Math.max(0, calculateOffset(currentIndex));
        slidesContainer.style.transform = `translateX(-${offset}px)`;

        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentIndex);
            slide.style.transform = i < currentIndex ? 'scale(0.85) rotateY(20deg)' :
                                  i > currentIndex ? 'scale(0.85) rotateY(-20deg)' :
                                  'scale(1) rotateY(0deg)';
        });

        // Update active dot
        const dots = document.querySelectorAll('#education .dots div');
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    };

    // --- IntersectionObserver untuk show/hide dots dengan animasi ---
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const dots = document.querySelectorAll('#education .dots div');
            if(entry.isIntersecting){
                appleNav.classList.add('show');
                dots.forEach(dot => dot.style.transform = 'scale(0)');
                dots.forEach((dot, i) => setTimeout(() => dot.style.transform = 'scale(1)', i * 100));
            } else {
                dots.forEach((dot, i) => setTimeout(() => dot.style.transform = 'scale(0)', i * 50));
                appleNav.classList.remove('show');
            }
        });
    }, { threshold: 0.3 });

    navObserver.observe(appleSection);

    // --- Keyboard navigation ---
    document.addEventListener('keydown', (e) => {
        if(e.key === 'ArrowRight') moveToSlide(currentIndex + 1);
        if(e.key === 'ArrowLeft') moveToSlide(currentIndex - 1);
    });

    // --- Inisialisasi slider ---
    generateDots();
    moveToSlide(0);
});

const workSection = document.getElementById('Work');
const panel = document.getElementById('notificationPanel');

// IntersectionObserver untuk munculkan panel saat scroll
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
            // tutup semua card saat panel hilang
            document.querySelectorAll('.notification-card').forEach(c => {
                c.classList.remove('active');
            });
        }
    });
}, { threshold: 0.5 });

observer.observe(workSection);

// JAM DAN TANGGAL DINAMIS
const clock = document.getElementById('clock');
const date = document.getElementById('date');

function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2,'0');
    const minutes = now.getMinutes().toString().padStart(2,'0');
    clock.textContent = `${hours}:${minutes}`;

    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    date.textContent = now.toLocaleDateString('en-US', options);
}
updateTime();
setInterval(updateTime, 60000);

// Klik notification card → tampilkan drop-down detail di bawah card
document.querySelectorAll('.notification-card').forEach(card => {
    const detailDiv = document.createElement('div');
    detailDiv.classList.add('card-detail');
    card.appendChild(detailDiv);

    card.addEventListener('click', () => {
        const isActive = card.classList.contains('active');

        // tutup semua card lain
        document.querySelectorAll('.notification-card').forEach(c => {
            c.classList.remove('active');
            c.querySelector('.card-detail').textContent = '';
        });

        if(!isActive){
            card.classList.add('active');
            detailDiv.textContent = card.dataset.detail;
        }
    });
});

// FUNGSI INTI UNTUK MENGISI BAR
    function animateProgressBars() {
        // 1. Ambil semua elemen dengan class 'progress-bar'
        const progressBars = document.querySelectorAll('.progress-bar');
        
        // 2. Loop melalui setiap progress bar
        progressBars.forEach(bar => {
            // Ambil nilai persentase dari atribut data-value (misalnya: '80')
            const value = bar.getAttribute('data-value');
            
            // Atur lebar style CSS
            // Ini akan memicu transisi (animasi) dari 0% ke nilai yang ditentukan.
            bar.style.width = value + '%';
        });
    }

  /* ================================
   SKILLS PROGRESS BAR - OPEN & CLOSE
================================ */

// Mengisi bar sesuai data-value
function fillProgressBars() {
    document.querySelectorAll('.progress-bar').forEach(bar => {
        const value = bar.getAttribute('data-value');
        bar.style.width = value + '%';
    });
}

// Reset bar menjadi 0%
function resetProgressBars() {
    document.querySelectorAll('.progress-bar').forEach(bar => {
        bar.style.width = '0%';
    });
}

const skillsSection = document.getElementById('Pelatihan');

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Section terlihat → bar berjalan
            fillProgressBars();
        } else {
            // Section keluar layar → bar tutup kembali
            resetProgressBars();
        }
    });
}, { threshold: 0.5 }); // minimal 50% terlihat

skillsObserver.observe(skillsSection);
const contactPanel = document.querySelector('.contact-panel');
const contactSection = document.querySelector('#contact');


// Auto open contact panel when scrolling to section
window.addEventListener('scroll', () => {
const sectionPos = contactSection.getBoundingClientRect().top;
if (sectionPos < window.innerHeight * 0.6) {
contactPanel.classList.add('active');
}
});
// Ambil elemen penting
const card = document.getElementById('contactCard');

// Jika kartu ditemukan
if (card) {

    card.addEventListener('click', function(event) {

        // Cegah flip jika klik terjadi pada link kontak
        if (event.target.closest('.detail-item')) {
            return; 
        }

        // Jika kartu belum terbuka → buka (flip)
        if (!card.classList.contains('is-open')) {
            card.classList.add('is-open');
        } 
        // Jika kartu sudah terbuka dan klik di sisi belakang → tutup
        else {
            if (event.target.closest('.back-face')) {
                card.classList.remove('is-open');
            }
        }
    });
}
/* ==================================
/* ================================
      BACK TO TOP BUTTON LOGIC
=================================== */

// Ambil tombol
const backTopBtn = document.getElementById('backTopBtn');

let lastScroll = 0; // Posisi scroll terakhir

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    // Jika scroll ke bawah → muncul
    if (currentScroll > lastScroll && currentScroll > 200) {
        backTopBtn.classList.add('show');
    } 
    // Jika scroll ke atas → hilang
    else {
        backTopBtn.classList.remove('show');
    }

    lastScroll = currentScroll;
});

// Klik tombol → scroll ke atas (pakai GSAP jika ada)
if (typeof gsap !== 'undefined') {
    backTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        gsap.to(window, {
            duration: 1.2,
            scrollTo: 0,
            ease: "power3.out"
        });
    });
} else {
    backTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
