document.addEventListener('DOMContentLoaded', () => {
            const themeToggle = document.getElementById('theme-toggle');
            const body = document.body;

            // Función para aplicar el tema guardado
            const applyTheme = (theme) => {
                if (theme === 'dark') {
                    body.classList.add('dark-mode');
                    themeToggle.textContent = '☀️';
                } else {
                    body.classList.remove('dark-mode');
                    themeToggle.textContent = '🌙';
                }
            };

            // Cargar el tema guardado en localStorage
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                applyTheme(savedTheme);
            }

            // Event listener para el botón de cambio de tema
            themeToggle.addEventListener('click', () => {
                const isDarkMode = body.classList.toggle('dark-mode');
                
                // Guardar la preferencia del usuario
                if (isDarkMode) {
                    localStorage.setItem('theme', 'dark');
                    themeToggle.textContent = '☀️';
                } else {
                    localStorage.setItem('theme', 'light');
                    themeToggle.textContent = '🌙';
                }
            });
        });