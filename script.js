document.addEventListener('DOMContentLoaded', () => {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const mainPhoto = document.querySelector('.main-photo');
    const pleaMessage = document.getElementById('pleaMessage');
    const heartContainer = document.getElementById('heartContainer');

    // === 1. The "No" Button Evasion Logic ===
    const noTexts = [
        "Are you sure?", "Really sure?", "Think again!", "Last chance!", 
        "Surely not?", "You might regret this!", "Give it another thought!", 
        "Are you absolutely certain?", "This could be a mistake!", "Have a heart!", 
        "Don't be so cold!", "Change of heart?", "Wouldn't you reconsider?", 
        "Is that your final answer?", "You're breaking my heart ;("
    ];

    const noImages = [
        "assets/img1.jpeg", "assets/img2.jpeg", "assets/img3.jpeg", "assets/img4.jpeg"
    ];

    let noClickCount = 0;

    const moveNoButton = () => {
        const maxX = window.innerWidth - noBtn.offsetWidth - 30;
        const maxY = window.innerHeight - noBtn.offsetHeight - 30;
        const x = Math.max(15, Math.random() * maxX);
        const y = Math.max(15, Math.random() * maxY);

        noBtn.style.position = 'fixed';
        noBtn.style.left = `${x}px`;
        noBtn.style.top = `${y}px`;

        if (noClickCount < noTexts.length) {
            pleaMessage.innerText = noTexts[noClickCount];
        } else {
            pleaMessage.innerText = noTexts[Math.floor(Math.random() * noTexts.length)];
        }
        
        const imageIndex = (noClickCount + 1) % noImages.length;
        mainPhoto.src = noImages[imageIndex];

        // Grow the Yes button to make it more tempting
        const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
        if (currentSize < 150) { // Safety cap
            yesBtn.style.fontSize = `${currentSize * 1.15}px`;
            yesBtn.style.padding = `${parseFloat(window.getComputedStyle(yesBtn).paddingTop) * 1.05}px ${parseFloat(window.getComputedStyle(yesBtn).paddingLeft) * 1.05}px`;
        }

        noClickCount++;
    };

    noBtn.addEventListener('mouseover', moveNoButton);
    noBtn.addEventListener('click', moveNoButton);
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton();
    });

    // === 2. The "Yes" Button Romantic Progression (5 Stages) ===
    const yesImages = [
        "assets/img1.jpeg", "assets/img2.jpeg", "assets/img3.jpeg", "assets/img4.jpeg",
        "assets/img5.jpeg"
    ];

    const romanticTexts = [
        "REALLY? 💖", "Are you sure? 🥰", "Please! 🥹", "Yay! ✨", 
        "ALMOST THERE! 🌹"
    ];

    let yesClickCount = 0;
    const totalSteps = yesImages.length;

    yesBtn.addEventListener('click', () => {
        yesClickCount++;

        // Warm up the audio on first click to unlock context
        const song = document.getElementById('loveSong');
        if (yesClickCount === 1 && song) {
            song.play().then(() => {
                song.pause();
                song.currentTime = 0;
            }).catch(() => { /* Silence is expected here */ });
        }

        if (yesClickCount < totalSteps) {
            mainPhoto.src = yesImages[yesClickCount - 1];
            if (yesClickCount <= romanticTexts.length) {
                yesBtn.innerText = romanticTexts[yesClickCount - 1];
            }
            
            yesBtn.style.transform = "scale(1.2)";
            setTimeout(() => { yesBtn.style.transform = "scale(1)"; }, 200);
            createFloatingHeart(true);
        } else {
            triggerMusicPlayer();
        }
    });

    // === 3. Lyrics Data & Sync Logic ===
    const SYNC_OFFSET = -2000; // Shift lyrics 2s forward (earlier)

    const lyricsData = [
        { text: "I should have taken more photos when I had you", delay: 100 + SYNC_OFFSET },
        { text: "I should have given you more kisses and hugs when I could", delay: 4500 + SYNC_OFFSET },
        { text: "Hey, I hope those of mine never move", delay: 9000 + SYNC_OFFSET },
        { text: "And if I get drunk today, let them help me", delay: 13500 + SYNC_OFFSET },
        { text: "I should have taken more photos when I had you", delay: 18000 + SYNC_OFFSET },
        { text: "I should have given you more kisses and hugs when I could", delay: 22500 + SYNC_OFFSET },
        { text: "I hope those of mine never move", delay: 27000 + SYNC_OFFSET },
        { text: "And if I get drunk today, let them help me", delay: 31500 + SYNC_OFFSET }
    ].map(line => ({ ...line, delay: Math.max(0, line.delay) }));

    function triggerMusicPlayer() {
        // Confetti!
        confetti({
            particleCount: 200,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#ff4d6d', '#ff8fa3', '#ffffff', '#c9184a']
        });

        // Hide landing page
        document.querySelector('.container').style.display = 'none';
        
        // Setup Player
        const player = document.getElementById('spotifyPlayer');
        player.classList.add('active');

        const lyricsContainer = document.querySelector('.lyrics-container');
        const lyricsContent = document.getElementById('spotifyLyrics');
        lyricsContent.innerHTML = '';
        lyricsData.forEach((line, index) => {
            const p = document.createElement('p');
            p.classList.add('lyric-line');
            p.innerText = line.text;
            p.id = `lyric-${index}`;
            lyricsContent.appendChild(p);
        });

        const song = document.getElementById('loveSong');
        if (song) {
            console.log("Attempting aggressive autoplay from start...");
            
            // Critical for autoplay: Reset and Play
            song.currentTime = 0;
            song.volume = 1.0;
            
            const startPlayback = () => {
                song.play().then(() => {
                    console.log("Audio playing successfully.");
                }).catch(e => {
                    console.warn("Autoplay blocked:", e);
                    pleaMessage.innerText = "❤️ Tap the Play button below to start our song! ❤️";
                    document.querySelector('.track-details').style.border = "1px solid #ff4d6d";
                });
            };

            startPlayback();

            song.addEventListener('error', (e) => {
                console.error("Audio Load Error:", song.error);
                pleaMessage.innerText = "Audio ready! Please ensure assets/music.mp3 is correct.";
            });

            const progressBar = document.querySelector('.progress-current');
            const currentTimeEl = document.querySelector('.current-time');

            song.ontimeupdate = () => {
                if (!song.duration) return;
                const progress = (song.currentTime / song.duration) * 100;
                progressBar.style.width = `${progress}%`;

                const mins = Math.floor(song.currentTime / 60);
                const secs = Math.floor(song.currentTime % 60);
                currentTimeEl.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

                const currentTimeMs = song.currentTime * 1000;
                lyricsData.forEach((line, index) => {
                    const el = document.getElementById(`lyric-${index}`);
                    if (el && currentTimeMs >= line.delay) {
                        const allLyrics = document.querySelectorAll('.lyric-line');
                        allLyrics.forEach(l => l.classList.remove('active'));
                        el.classList.add('active');
                        
                        // Centering logic
                        const containerHeight = lyricsContainer.offsetHeight;
                        const lineTop = el.offsetTop;
                        const lineOffset = lineTop - (containerHeight / 2) + (el.offsetHeight / 2);
                        lyricsContainer.scrollTo({ top: lineOffset, behavior: 'smooth' });
                    }
                });
            };

            const playPauseBtn = document.getElementById('playPauseBtn');
            const playPauseIcon = document.getElementById('playPauseIcon');
            const albumArt = document.querySelector('.album-art');

            playPauseBtn.addEventListener('click', () => {
                if (song.paused) {
                    song.play();
                    playPauseIcon.innerHTML = `<rect width="4" height="16" x="6" y="4" rx="1"/><rect width="4" height="16" x="14" y="4" rx="1"/>`;
                    albumArt.classList.remove('paused');
                } else {
                    song.pause();
                    playPauseIcon.innerHTML = `<path d="m7 4 12 8-12 8V4z"/>`;
                    albumArt.classList.add('paused');
                }
            });
        }
    }

    // === 3. Visual Effects (Floating Hearts) ===
    function createFloatingHeart(fromButton = false) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤️';
        
        if (fromButton) {
            const rect = yesBtn.getBoundingClientRect();
            heart.style.left = `${rect.left + Math.random() * rect.width}px`;
            heart.style.top = `${rect.top}px`;
        } else {
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.bottom = '-20px';
        }
        
        heart.style.position = 'fixed';
        heart.style.fontSize = `${Math.random() * 1.5 + 1}rem`;
        heart.style.zIndex = '2500';
        heart.style.pointerEvents = 'none';
        heart.style.transition = 'transform 4s ease-out, opacity 4s ease-out';
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            const up = fromButton ? -400 : -110;
            heart.style.transform = `translateY(${up}vh) translateX(${(Math.random() - 0.5) * 200}px) rotate(${Math.random() * 360}deg)`;
            heart.style.opacity = '0';
        }, 50);
        
        setTimeout(() => heart.remove(), 4000);
    }
    
    // === 4. Exclusive Share Protection ===
    const toast = document.getElementById('toast');
    let toastTimeout;

    function showToast() {
        toast.classList.add('visible');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('visible');
        }, 3000);
    }

    // Block Right-Click
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showToast();
    });

    // Block Copy Shortcuts
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C' || e.key === 'u' || e.key === 'U')) {
            e.preventDefault();
            showToast();
        }
    });

    // Share Button Trigger
    // Share Button Trigger
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const shareText = `For my one and only Anu... I love you! ❤️\nhttps://github.com/SrikantShubam/valentines-special`;
            
            navigator.clipboard.writeText(shareText).then(() => {
                const originalText = toast.innerText;
                toast.innerText = "Link copied for Anu! ❤️";
                showToast();
                setTimeout(() => {
                    toast.innerText = originalText;
                }, 3500);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                showToast(); // Fallback to just showing the protection message
            });
        });
    }

    // === 5. Global Audio Unlock (Aggressive Autoplay) ===
    document.body.addEventListener('click', function unlockAudio() {
        const song = document.getElementById('loveSong');
        if (song) {
            // Silently play/pause to unlock the AudioContext
            song.play().then(() => {
                song.pause();
                song.currentTime = 0;
            }).catch(() => {});
        }
        // Remove listener after first interaction
        document.body.removeEventListener('click', unlockAudio);
    }, { once: true });
});
