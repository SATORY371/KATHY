 // --- Efecto de Destellos (Sparkles) ---
        function createSparkle() {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = Math.random() * 100 + 'vw';
            sparkle.style.top = Math.random() * 100 + 'vh';
            sparkle.innerHTML = '✨'; // O cualquier otro emoji o carácter
            sparkle.style.fontSize = Math.random() * 20 + 10 + 'px'; // Tamaño aleatorio
            
            document.body.appendChild(sparkle);
            
            // Eliminar el destello después de su animación
            setTimeout(() => {
                sparkle.remove();
            }, 3000); // Coincide con la duración de la animación
        }
        // Crear un nuevo destello cada 1.5 segundos
        setInterval(createSparkle, 1500);

        // --- Lógica para los Puntos de Navegación (Dots) y Scroll Snap ---
        document.addEventListener('DOMContentLoaded', function() {
            const scrollContainer = document.querySelector('.horizontal-scroll-container');
            const sliderItems = document.querySelectorAll('.horizontal-scroll-container .item');
            const dotsContainer = document.querySelector('.navigations .dots');
            
            if (!scrollContainer || !sliderItems.length || !dotsContainer) return;

            // 1. Crear los puntos de navegación
            sliderItems.forEach((_, index) => {
                const dot = document.createElement('li');
                dot.setAttribute('data-index', index); // Guardar el índice en el data-attribute
                dot.addEventListener('click', () => {
                    // Al hacer clic, desplázate suavemente al item correspondiente
                    scrollContainer.scrollTo({
                        left: sliderItems[index].offsetLeft,
                        behavior: 'smooth'
                    });
                });
                dotsContainer.appendChild(dot);
            });

            const dots = dotsContainer.querySelectorAll('li');

            // Función para actualizar el punto activo
            function updateActiveDot() {
                const scrollLeft = scrollContainer.scrollLeft;
                const containerWidth = scrollContainer.offsetWidth;

                // Calcula qué item está más visible
                let activeIndex = 0;
                for (let i = 0; i < sliderItems.length; i++) {
                    const item = sliderItems[i];
                    // Si el centro del item está dentro de la vista actual
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

            // Escuchar el evento de scroll para actualizar los puntos
            scrollContainer.addEventListener('scroll', updateActiveDot);

            // Inicializar el punto activo al cargar la página
            updateActiveDot();

            // --- Navegación con Teclado (Flechas Izquierda/Derecha) ---
            document.addEventListener('keydown', (e) => {
                if (!scrollContainer) return;

                const scrollAmount = window.innerWidth; // Desplázate por el ancho de la ventana

                if (e.key === 'ArrowRight') {
                    scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                    e.preventDefault(); // Evita el scroll por defecto del navegador
                } else if (e.key === 'ArrowLeft') {
                    scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                    e.preventDefault(); // Evita el scroll por defecto del navegador
                }
            });
        });

        // --- Lógica para la Cuenta Regresiva (Ejemplo) ---
        // Establece la fecha objetivo (30 de agosto del año actual)
        const targetDate = new Date();
        targetDate.setMonth(7); // Agosto es el mes 7 (0-indexado)
        targetDate.setDate(30);
        targetDate.setHours(0, 0, 0, 0); // Medianoche del 30 de agosto

        // Si la fecha ya pasó este año, establece la fecha para el próximo año
        if (targetDate < new Date()) {
            targetDate.setFullYear(targetDate.getFullYear() + 1);
        }

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = targetDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById("days").innerText = String(days).padStart(2, '0');
            document.getElementById("hours").innerText = String(hours).padStart(2, '0');
            document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
            document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');

            if (distance < 0) {
                clearInterval(countdownInterval);
                document.getElementById("countdown").innerHTML = "<div style='font-size: 0.5em;'>¡Es el día! 🎉</div>";
            }
        }

        let countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown(); // Llama una vez inmediatamente para evitar el parpadeo inicial