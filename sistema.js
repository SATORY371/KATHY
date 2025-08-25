// flori.js

// Utility Functions
const Utils = {
    rand: (min, max) => Math.random() * (max - min) + min,
    randInt: (min, max) => Math.floor(Utils.rand(min, max + 1)),
    degToRad: (deg) => deg * Math.PI / 180,
};

// Main Application Class
class BirthdayExperience {
    constructor() {
        this.canvas = document.getElementById('main-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ui = new UIManager();
        this.audio = new AudioManager();
        this.starfield = new Starfield(this.canvas, this.ctx);
        this.effects = new EffectsManager(this.canvas, this.ctx);
        this.lyrics = new LyricManager();
        this.state = 'loading';
        this.animationFrameId = null;

        this.setup();
    }

    async setup() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.ui.bindStart((lang) => this.start(lang));
        this.ui.bindReplay(() => this.replay());

        this.starfield.init();
        this.loop();
        
        await this.audio.load();
        this.state = 'ready';
        this.ui.showScreen('initial');
        this.ui.bindVolumeControl(this.audio.setVolume.bind(this.audio));
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.starfield.resize();
    }

    start(lang) {
        if (this.state !== 'ready') return;
        this.state = 'playing';
        this.lyrics.setLanguage(lang);
        this.ui.showScreen('lyrics');
        this.audio.play(this.lyrics.songStructure, (time, segment) => this.onAudioEvent(time, segment));
    }
    
    replay() {
        this.state = 'ready';
        this.lyrics.reset();
        this.effects.clear();
        this.ui.showScreen('initial');
        this.audio.reset();
    }

    onAudioEvent(time, segment) {
        Tone.Draw.schedule(() => {
            this.lyrics.update(segment);
            this.effects.trigger(segment.type);
        }, time);
    }

    loop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.starfield.draw();
        this.effects.update();
        
        if (this.audio.isPlaying() && !this.audio.isFinished()) {
        } else if (this.state === 'playing' && this.audio.isFinished()) {
            this.state = 'finished';
            this.effects.clear();
            this.ui.showScreen('replay');
        }

        this.animationFrameId = requestAnimationFrame(() => this.loop());
    }
}

// UI Manager Class
class UIManager {
    constructor() {
        this.screens = {
            loading: document.getElementById('loading-screen'),
            initial: document.getElementById('initial-screen'),
            replay: document.getElementById('replay-screen'),
            lyrics: document.getElementById('lyrics-container'),
        };
        this.volumeSlider = document.getElementById('volume-slider');
    }

    showScreen(screenName) {
        Object.values(this.screens).forEach(s => s.classList.add('hidden'));
        if (this.screens[screenName]) {
            this.screens[screenName].classList.remove('hidden');
        }
    }

    bindStart(callback) {
        document.getElementById('start-es').addEventListener('click', () => callback('es'));
        document.getElementById('start-en').addEventListener('click', () => callback('en'));
    }
    
    bindReplay(callback) {
        document.getElementById('replay-button').addEventListener('click', callback);
    }

    bindVolumeControl(setVolumeCallback) {
        if (this.volumeSlider) {
            this.volumeSlider.addEventListener('input', (event) => {
                const volume = parseFloat(event.target.value);
                setVolumeCallback(volume);
            });
        }
    }
}

// Lyric Manager Class
class LyricManager {
    constructor() {
        this.container = document.getElementById('lyrics-container');
        this.songStructure = [
            { time: 0, type: 'instrumental', line: '' },
            { time: 20, type: 'chorus', line: "'Cause you're a sky, 'cause you're a sky full of stars" },
            { time: 28, type: 'verse', line: "I'm gonna give you my heart" },
            { time: 35, type: 'chorus', line: "'Cause you're a sky, 'cause you're a sky full of stars" },
            { time: 42, type: 'verse', line: "'Cause you light up the path" },
            { time: 51, type: 'verse', line: "I don't care, go on and tear me apart" },
            { time: 58, type: 'verse', line: "I don't care if you do, ooh-ooh, ooh" },
            { time: 65, type: 'chorus', line: "'Cause in a sky, 'cause in a sky full of stars" },
            { time: 70, type: 'chorus', line: "I think I see you" },
            { time: 77, type: 'instrumental', line: '' },
            { time: 100, type: 'chorus', line: "'Cause you're a sky, 'cause you're a sky full of stars" },
            { time: 110, type: 'verse', line: "I wanna die in your arms, oh, oh-oh" },
            { time: 120, type: 'verse', line: "'Cause you get lighter the more it gets dark" },
            { time: 126, type: 'verse', line: "I'm gonna give you my heart, ooh-ooh, ooh" },
            { time: 134, type: 'chorus', line: "And I don't care, go on and tear me apart" },
            { time: 140, type: 'chorus', line: "And I don't care if you do, ooh-ooh, ooh" },
            { time: 150, type: 'chorus', line: "'Cause in a sky, 'cause in a sky full of stars" },
            { time: 156, type: 'chorus', line: "I think I saw you" },
            { time: 164, type: 'instrumental', line: '' },
            { time: 165, type: 'outro', line: "You're such a heavenly view" },
            { time: 175, type: 'outro', line: "You're such a heavenly view" },
            { time: 185, type: 'outro', line: "¡Feliz Cumpleaños KATHY!" }
        ];
        this.lyricsEs = {
            "'Cause you're a sky, 'cause you're a sky full of stars": "Porque eres un cielo, un cielo lleno de estrellas",
            "I'm gonna give you my heart": "Voy a darte mi corazón",
            "'Cause you light up the path": "Porque iluminas el camino",
            "I don't care, go on and tear me apart": "No me importa, ven y hazme pedazos",
            "I don't care if you do, ooh-ooh, ooh": "No me importa si lo haces, uh-uh, uh",
            "'Cause in a sky, 'cause in a sky full of stars": "Porque en un cielo, un cielo lleno de estrellas",
            "I think I see you": "Creo que te veo",
            "I wanna die in your arms, oh, oh-oh": "Quiero morir en tus brazos, oh, oh-oh",
            "'Cause you get lighter the more it gets dark": "Porque te vuelves más luz mientras más oscuro se pone",
            "I'm gonna give you my heart, ooh-ooh, ooh": "Voy a darte mi corazón, uh-uh, uh",
            "And I don't care, go on and tear me apart": "Y no me importa, ven y hazme pedazos",
            "And I don't care if you do, ooh-ooh, ooh": "Y no me importa si lo haces, uh-uh, uh",
            "I think I saw you": "Creo que te vi",
            "You're such a heavenly view": "Eres una vista tan celestial",
            "¡Feliz Cumpleaños!": "¡Feliz Cumpleaños!"
        };
        this.currentLang = 'en';
    }

    setLanguage(lang) {
        this.currentLang = lang;
    }
    
    reset() {
        this.container.innerHTML = '';
    }

    update(segment) {
        const lineText = this.currentLang === 'es' && this.lyricsEs[segment.line] ? this.lyricsEs[segment.line] : segment.line;
        if (lineText) {
            this.container.innerHTML = `<p class="lyric-line">${lineText}</p>`;
            const lyricElement = this.container.querySelector('.lyric-line');
            void lyricElement.offsetWidth;
            lyricElement.classList.add('visible');
        } else {
            this.container.innerHTML = '';
        }
    }
}

// Audio Manager Class
class AudioManager {
    constructor() {
        this.player = null;
        this.volumeNode = null;
        this.songPart = null;
        this.totalDuration = 190;
        this.isReady = false;
    }

    async load() {
        this.player = new Tone.Player("media/Coldplay - A Sky Full Of Stars (Official Video).mp3", () => {
            console.log("MP3 Loaded!");
            this.isReady = true;
            this.totalDuration = this.player.buffer.duration;
        });

        this.volumeNode = new Tone.Volume(-20).toDestination();

        this.player.connect(this.volumeNode);
        
        await Tone.start();
    }

    play(songStructure, onEventCallback) {
        if (!this.isReady) {
            console.warn("Audio not yet loaded. Please wait.");
            return;
        }
        
        this.player.start(0); 

        this.songPart = new Tone.Part((time, segment) => {
            onEventCallback(time, segment);
        }, songStructure).start(0);

        Tone.Transport.start();
    }

    setVolume(normalizedVolume) {
        if (this.volumeNode) {
            this.volumeNode.volume.value = 20 * Math.log10(normalizedVolume);
        }
    }
    
    isPlaying() {
        return this.player && this.player.state === 'started';
    }
    
    isFinished() {
        return this.player && Tone.Transport.seconds >= this.totalDuration;
    }

    reset() {
        if (this.player) {
            this.player.stop();
            this.player.seek(0);
        }
        if (this.songPart) {
            this.songPart.dispose();
            this.songPart = null;
        }
        Tone.Transport.stop();
        Tone.Transport.cancel(0);
    }
}

// Starfield Class (Canvas)
class Starfield {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.stars = [];
        this.numStars = 500;
    }

    init() {
        for (let i = 0; i < this.numStars; i++) {
            this.stars.push({
                x: Utils.rand(0, this.canvas.width),
                y: Utils.rand(0, this.canvas.height),
                radius: Utils.rand(0.2, 1.5),
                alpha: Utils.rand(0.3, 1),
                twinkleSpeed: Utils.rand(0.01, 0.03),
                twinklePhase: Utils.rand(0, Math.PI * 2),
            });
        }
    }
    
    resize() {
        this.stars = [];
        this.init();
    }

    draw() {
        this.stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            const alpha = star.alpha * (Math.sin(star.twinklePhase) * 0.4 + 0.6);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            this.ctx.fill();
            star.twinklePhase += star.twinkleSpeed;
        });
    }
}

// Effects Manager Class
class EffectsManager {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.fireworks = [];
        this.heartContainer = document.getElementById('effects-field');
        this.effectsInterval = null;
    }

    trigger(type) {
        this.clearScheduledEffects();
        document.body.classList.remove('instrumental');

        if (type === 'chorus' || type === 'outro') {
            this.effectsInterval = setInterval(() => this.createHeart(), 400);
        } else if (type === 'instrumental') {
            document.body.style.transition = 'background-color 1.5s ease-in-out';
            document.body.style.backgroundColor = 'var(--dark-purple)';
            this.effectsInterval = setInterval(() => this.createFirework(), 800);
        }
        if (type !== 'instrumental') {
            document.body.style.backgroundColor = 'var(--deep-space)';
        }
    }

    createHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '♥';
        heart.style.left = `${Utils.rand(0, 100)}vw`;
        heart.style.bottom = `-30px`;
        heart.style.animationDuration = `${Utils.rand(3, 6)}s`;
        this.heartContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 6000);
    }

    createFirework() {
        const startX = Utils.rand(this.canvas.width * 0.2, this.canvas.width * 0.8);
        const startY = this.canvas.height;
        const endX = startX + Utils.rand(-100, 100);
        const endY = Utils.rand(this.canvas.height * 0.1, this.canvas.height * 0.4);
        this.fireworks.push(new Firework(startX, startY, endX, endY, this.ctx));
    }
    
    clearScheduledEffects() {
        clearInterval(this.effectsInterval);
        this.effectsInterval = null;
    }

    clear() {
        this.clearScheduledEffects();
        this.fireworks = [];
        this.heartContainer.innerHTML = '';
        document.body.style.backgroundColor = 'var(--deep-space)';
    }

    update() {
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            this.fireworks[i].update();
            this.fireworks[i].draw();
            if (this.fireworks[i].isDone) {
                this.fireworks.splice(i, 1);
            }
        }
    }
}

// Firework & Particle Classes
class Particle {
    constructor(x, y, hue, ctx) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.angle = Utils.rand(0, Math.PI * 2);
        this.speed = Utils.rand(1, 10);
        this.friction = 0.96;
        this.gravity = 1.2;
        this.hue = hue;
        this.brightness = Utils.rand(50, 80);
        this.alpha = 1;
        this.decay = Utils.rand(0.015, 0.03);
        this.coords = [[this.x, this.y]];
        this.coordCount = 5;
    }

    update() {
        this.coords.pop();
        this.coords.unshift([this.x, this.y]);
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.coords[this.coords.length - 1][0], this.coords[this.coords.length - 1][1]);
        this.ctx.lineTo(this.x, this.y);
        this.ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        this.ctx.lineWidth = Utils.rand(1, 3);
        this.ctx.stroke();
    }
}

class Firework {
    constructor(startX, startY, endX, endY, ctx) {
        this.x = startX;
        this.y = startY;
        this.endX = endX;
        this.endY = endY;
        this.ctx = ctx;
        this.speed = 8;
        this.angle = Math.atan2(endY - startY, endX - startX);
        this.hue = Utils.rand(0, 360);
        this.particles = [];
        this.state = 'flying';
        this.isDone = false;
    }

    update() {
        if (this.state === 'flying') {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            if (this.y <= this.endY) {
                this.explode();
            }
        } else {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                this.particles[i].update();
                if (this.particles[i].alpha <= 0) {
                    this.particles.splice(i, 1);
                }
            }
            if (this.particles.length === 0) {
                this.isDone = true;
            }
        }
    }

    draw() {
        if (this.state === 'flying') {
            this.ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            this.particles.forEach(p => p.draw());
        }
    }

    explode() {
        this.state = 'exploded';
        const particleCount = 100 + Utils.randInt(0, 100);
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.x, this.y, this.hue, this.ctx));
        }
    }
}
    
// Initialize the application
window.addEventListener('load', () => {
    new BirthdayExperience();
});