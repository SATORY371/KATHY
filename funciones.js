// --- Efecto de Destellos (Sparkles) ---
function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * 100 + 'vw';
    sparkle.style.top = Math.random() * 100 + 'vh';
    sparkle.innerHTML = '✨';
    sparkle.style.fontSize = Math.random() * 20 + 10 + 'px';

    document.body.appendChild(sparkle);

    setTimeout(() => {
        sparkle.remove();
    }, 3000);
}
// Solo crear destellos si la pantalla no está bloqueada
let sparkleInterval;

// --- DYNAMIC SNOWFALL ---
function createSnowflakes() {
    const snowContainer = document.body;
    const snowflakeCount = 50; // Number of snowflakes

    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.innerHTML = ['❄', '❅', '❆'][Math.floor(Math.random() * 3)];

        // Random positioning and animation properties
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.fontSize = (Math.random() * 1.5 + 0.5) + 'rem'; // 0.5rem to 2rem
        snowflake.style.animationDuration = (Math.random() * 5 + 5) + 's'; // 5s to 10s
        snowflake.style.animationDelay = (Math.random() * 5) + 's';
        snowflake.style.opacity = Math.random() * 0.7 + 0.3;

        snowContainer.appendChild(snowflake);
    }
}
document.addEventListener('DOMContentLoaded', createSnowflakes);



// --- Lógica para los Puntos de Navegación (Dots) y Scroll Snap ---
document.addEventListener('DOMContentLoaded', function () {
    const scrollContainer = document.querySelector('.horizontal-scroll-container');
    const sliderItems = document.querySelectorAll('.horizontal-scroll-container .item');
    const dotsContainer = document.querySelector('.navigations .dots');

    if (!scrollContainer || !sliderItems.length || !dotsContainer) return;

    sliderItems.forEach((_, index) => {
        const dot = document.createElement('li');
        dot.setAttribute('data-index', index);
        dot.addEventListener('click', () => {
            scrollContainer.scrollTo({
                left: sliderItems[index].offsetLeft,
                behavior: 'smooth'
            });
        });
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('li');

    function updateActiveDot() {
        const scrollLeft = scrollContainer.scrollLeft;
        const containerWidth = scrollContainer.offsetWidth;
        let activeIndex = 0;
        for (let i = 0; i < sliderItems.length; i++) {
            const item = sliderItems[i];
            if (item.offsetLeft <= scrollLeft + containerWidth / 2 &&
                item.offsetLeft + item.offsetWidth > scrollLeft + containerWidth / 2) {
                activeIndex = i;
                break;
            }
        }
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    scrollContainer.addEventListener('scroll', updateActiveDot);
    updateActiveDot();

    document.addEventListener('keydown', (e) => {
        if (!scrollContainer) return;
        const scrollAmount = window.innerWidth;
        if (e.key === 'ArrowRight') {
            scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
            scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            e.preventDefault();
        }
    });
});


// --- Lógica para la Cuenta Regresiva y PANTALLA DE BLOQUEO ---
const lockScreen = document.getElementById('lock-screen');

// Formato: "Mes Dia, Año HH:MM:SS" -> "Aug 30, 2025 00:00:00"
const targetDate = new Date("Dec 24, 2025 07:00:00").getTime();


function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    // Si el tiempo ha terminado
    if (distance < 0) {
        clearInterval(countdownInterval);

        // Oculta la pantalla de bloqueo
        if (lockScreen) {
            lockScreen.classList.add('unlocked');
        }

        // Activa los destellos una vez desbloqueado
        if (!sparkleInterval) {
            sparkleInterval = setInterval(createSparkle, 1500);
        }

        // Opcional: Actualiza el contador a cero por si acaso.
        document.getElementById("days").innerText = "00";
        document.getElementById("hours").innerText = "00";
        document.getElementById("minutes").innerText = "00";
        document.getElementById("seconds").innerText = "00";
        return;
    }

    // Si el tiempo aún no ha terminado
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = String(days).padStart(2, '0');
    document.getElementById("hours").innerText = String(hours).padStart(2, '0');
    document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
    document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
}

let countdownInterval = setInterval(updateCountdown, 1000);
// Llama una vez inmediatamente para que no haya un segundo de retraso al cargar la página
updateCountdown();

// --- Background Music Control ---
document.addEventListener('DOMContentLoaded', function () {
    const bgMusic = document.getElementById('bg-music');
    const musicControl = document.getElementById('music-control');

    // Only proceed if elements exist
    if (bgMusic && musicControl) {
        const musicIcon = musicControl.querySelector('span');
        bgMusic.volume = 0.1; // Set volume to 10%

        // Try to play automatically
        bgMusic.play().then(() => {
            musicIcon.textContent = '🔊';
        }).catch(error => {
            console.log("Autoplay prevented:", error);
            musicIcon.textContent = '🔇';
        });

        musicControl.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play();
                musicIcon.textContent = '🔊';
            } else {
                bgMusic.pause();
                musicIcon.textContent = '🔇';
            }
        });
    }
});