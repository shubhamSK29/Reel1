document.getElementById("addVideo").addEventListener("click", function() {
    document.getElementById("videoInput").click(); // Opens file selection
});

// Update the file input element to accept multiple files
document.querySelector('#videoInput').setAttribute('multiple', '');

// Modify the upload handling
document.querySelector('#videoInput').addEventListener('change', async function(e) {
    const files = e.target.files;
    const reelsContainer = document.querySelector('.reels-container');
    
    for (let file of files) {
        const videoURL = URL.createObjectURL(file);
        
        const reelDiv = document.createElement('div');
        reelDiv.className = 'reel';
        
        const video = document.createElement('video');
        video.src = videoURL;
        video.loop = true;
        video.muted = false;
        video.volume = 1;
        
        // Create play button with correct symbols
        const playBtn = document.createElement('button');
        playBtn.className = 'play-control';
        playBtn.innerHTML = '⏸';  // Start with pause symbol
        playBtn.onclick = function() {
            if (video.paused) {
                video.play();
                playBtn.innerHTML = '⏸';  // Pause symbol (two vertical lines)
            } else {
                video.pause();
                playBtn.innerHTML = '▶';  // Play symbol (triangle)
            }
        };

        // Create volume button
        const volumeBtn = document.createElement('button');
        volumeBtn.className = 'volume-control';
        volumeBtn.innerHTML = '🔊';
        volumeBtn.onclick = function() {
            if (video.muted || video.volume === 0) {
                video.muted = false;
                video.volume = 1;
                volumeBtn.innerHTML = '🔊';
            } else {
                video.muted = true;
                volumeBtn.innerHTML = '🔈';
            }
        };

        // Create fullscreen button with updated handling
        const fullscreenBtn = document.createElement('button');
        fullscreenBtn.className = 'fullscreen-button';
        fullscreenBtn.innerHTML = '⛶';
        let currentTime = 0;

        fullscreenBtn.onclick = function() {
            if (document.fullscreenElement) {
                currentTime = video.currentTime;
                document.exitFullscreen().then(() => {
                    // Continue playing current video only
                    video.currentTime = currentTime;
                    video.play();
                    video.muted = false;
                    playBtn.innerHTML = '⏸';
                });
            } else {
                currentTime = video.currentTime;
                reelDiv.requestFullscreen().then(() => {
                    video.currentTime = currentTime;
                    video.play();
                    video.muted = false;
                });
            }
        };
        
        // Add fullscreenchange event listener
        reelDiv.addEventListener('fullscreenchange', function() {
            if (!document.fullscreenElement) {
                video.currentTime = currentTime;
                video.play();
                video.muted = false;
                playBtn.innerHTML = '⏸';
            }
        });
        
        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.innerHTML = '×';
        deleteButton.onclick = function() {
            reelDiv.remove();
            handleVideoVisibility();
        };
        
        // Append elements
        reelDiv.appendChild(video);
        reelDiv.appendChild(playBtn);
        reelDiv.appendChild(volumeBtn);
        reelDiv.appendChild(fullscreenBtn);
        reelDiv.appendChild(deleteButton);
        reelsContainer.appendChild(reelDiv);
        
        video.addEventListener('loadedmetadata', () => {
            handleVideoVisibility();
        });
    }
    
    e.target.value = '';
});

// Update handleVideoVisibility function
function handleVideoVisibility() {
    const videos = document.querySelectorAll('.reel video');
    
    videos.forEach(video => {
        const rect = video.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        const isVisible = visibleHeight > rect.height / 2;
        const playBtn = video.parentElement.querySelector('.play-control');

        // Only handle visibility for non-fullscreen videos
        if (!document.fullscreenElement) {
            if (isVisible) {
                const savedTime = video.currentTime;
                video.play().then(() => {
                    if (Math.abs(video.currentTime - savedTime) > 0.1) {
                        video.currentTime = savedTime;
                    }
                });
                video.muted = false;
                playBtn.innerHTML = '⏸';  // Pause symbol when playing
            } else {
                video.pause();
                video.muted = true;
                playBtn.innerHTML = '▶';  // Play symbol when paused
            }
        }
    });
}

// Add global scroll handling
document.addEventListener('wheel', function(e) {
    e.preventDefault();
    const reelsContainer = document.querySelector('.reels-container');
    const videos = document.querySelectorAll('.reel video');
    
    const currentVideo = Array.from(videos).find(video => {
        const rect = video.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        return visibleHeight > rect.height / 2;
    });

    if (currentVideo) {
        const reelDiv = currentVideo.closest('.reel');
        if (e.deltaY > 0) {
            // Scroll down
            const nextVideo = reelDiv.nextElementSibling;
            if (nextVideo) {
                nextVideo.scrollIntoView({ behavior: 'smooth' });
                setTimeout(handleVideoVisibility, 500);
            }
        } else {
            // Scroll up
            const previousVideo = reelDiv.previousElementSibling;
            if (previousVideo) {
                previousVideo.scrollIntoView({ behavior: 'smooth' });
                setTimeout(handleVideoVisibility, 500);
            }
        }
    }
}, { passive: false });

// Update keydown event listener
document.addEventListener('keydown', (e) => {
    const reelsContainer = document.querySelector('.reels-container');
    const videos = document.querySelectorAll('.reel video');
    
    const currentVideo = Array.from(videos).find(video => {
        const rect = video.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        return visibleHeight > rect.height / 2;
    });

    switch (e.code) {
        case 'ArrowUp':
        case 'PageUp':
            e.preventDefault();
            if (currentVideo) {
                const previousVideo = currentVideo.closest('.reel').previousElementSibling;
                if (previousVideo) {
                    previousVideo.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(handleVideoVisibility, 500);
                }
            }
            break;

        case 'ArrowDown':
        case 'PageDown':
            e.preventDefault();
            if (currentVideo) {
                const nextVideo = currentVideo.closest('.reel').nextElementSibling;
                if (nextVideo) {
                    nextVideo.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(handleVideoVisibility, 500);
                }
            }
            break;

        case 'ArrowRight':
            e.preventDefault();
            if (currentVideo) {
                currentVideo.volume = Math.min(1, currentVideo.volume + 0.1);
                const volumeBtn = currentVideo.parentElement.querySelector('.volume-control');
                if (volumeBtn) {
                    volumeBtn.innerHTML = currentVideo.volume > 0 ? '🔊' : '🔈';
                }
            }
            break;

        case 'ArrowLeft':
            e.preventDefault();
            if (currentVideo) {
                currentVideo.volume = Math.max(0, currentVideo.volume - 0.1);
                const volumeBtn = currentVideo.parentElement.querySelector('.volume-control');
                if (volumeBtn) {
                    volumeBtn.innerHTML = currentVideo.volume > 0 ? '🔊' : '🔈';
                }
            }
            break;

        case 'Escape':
            e.preventDefault();
            if (!document.fullscreenElement) {
                // Go back to previous page if not in fullscreen
                window.history.back();
            }
            break;

        case 'Space':
            e.preventDefault();
            if (currentVideo) {
                const playBtn = currentVideo.parentElement.querySelector('.play-control');
                if (currentVideo.paused) {
                    currentVideo.play();
                    if (playBtn) playBtn.innerHTML = '⏸';  // Pause symbol
                } else {
                    currentVideo.pause();
                    if (playBtn) playBtn.innerHTML = '▶';  // Play symbol
                }
            }
            break;

        case 'KeyF':  // F key for fullscreen
            e.preventDefault();
            if (currentVideo) {
                const reelDiv = currentVideo.closest('.reel');
                if (document.fullscreenElement) {
                    document.exitFullscreen().then(() => {
                        // Continue playing current video
                        currentVideo.play();
                        currentVideo.muted = false;
                        const playBtn = reelDiv.querySelector('.play-control');
                        if (playBtn) playBtn.innerHTML = '⏸';
                    });
                } else {
                    reelDiv.requestFullscreen().then(() => {
                        currentVideo.play();
                        currentVideo.muted = false;
                    });
                }
            }
            break;

        case 'KeyM':  // M key for mute/unmute
            e.preventDefault();
            if (currentVideo) {
                const volumeBtn = currentVideo.parentElement.querySelector('.volume-control');
                if (currentVideo.muted || currentVideo.volume === 0) {
                    currentVideo.muted = false;
                    currentVideo.volume = 1;
                    if (volumeBtn) volumeBtn.innerHTML = '🔊';
                } else {
                    currentVideo.muted = true;
                    if (volumeBtn) volumeBtn.innerHTML = '🔈';
                }
            }
            break;
    }
});

// Add volume bar to each reel when created
function createVolumeBar(reelDiv) {
    const volumeBarContainer = document.createElement('div');
    volumeBarContainer.className = 'volume-bar-container';
    volumeBarContainer.innerHTML = `
        <span class="volume-icon">🔊</span>
        <div class="volume-bar">
            <div class="volume-bar-fill"></div>
        </div>
        <span class="volume-level">100%</span>
    `;
    reelDiv.appendChild(volumeBarContainer);
    return volumeBarContainer;
}

// Add this to your existing scroll handler
let isScrolling = false;
document.addEventListener('wheel', function(e) {
    e.preventDefault();
    if (isScrolling) return;
    
    const videos = document.querySelectorAll('.reel video');
    const currentVideo = Array.from(videos).find(video => {
        const rect = video.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        return visibleHeight > rect.height / 2;
    });

    if (currentVideo) {
        isScrolling = true;
        const reelDiv = currentVideo.closest('.reel');
        const targetReel = e.deltaY > 0 ? 
            reelDiv.nextElementSibling : 
            reelDiv.previousElementSibling;

        if (targetReel) {
            targetReel.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                handleVideoVisibility();
                isScrolling = false;
            }, 500);
        } else {
            isScrolling = false;
        }
    }
}, { passive: false });

// Update your volume control in the keydown event listener
let volumeBarTimeout;
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
        e.preventDefault();
        const currentVideo = Array.from(document.querySelectorAll('.reel video')).find(video => {
            const rect = video.getBoundingClientRect();
            const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
            return visibleHeight > rect.height / 2;
        });

        if (currentVideo) {
            const reelDiv = currentVideo.closest('.reel');
            let volumeBarContainer = reelDiv.querySelector('.volume-bar-container');
            if (!volumeBarContainer) {
                volumeBarContainer = createVolumeBar(reelDiv);
            }

            // Update volume
            const volumeChange = e.code === 'ArrowRight' ? 0.1 : -0.1;
            currentVideo.volume = Math.max(0, Math.min(1, currentVideo.volume + volumeChange));
            
            // Update volume bar
            const volumeBarFill = volumeBarContainer.querySelector('.volume-bar-fill');
            const volumeLevel = volumeBarContainer.querySelector('.volume-level');
            const volumeIcon = volumeBarContainer.querySelector('.volume-icon');
            
            volumeBarFill.style.width = `${currentVideo.volume * 100}%`;
            volumeLevel.textContent = `${Math.round(currentVideo.volume * 100)}%`;
            volumeIcon.textContent = currentVideo.volume > 0 ? '🔊' : '🔈';

            // Show volume bar
            volumeBarContainer.classList.add('visible');
            
            // Hide volume bar after delay
            clearTimeout(volumeBarTimeout);
            volumeBarTimeout = setTimeout(() => {
                volumeBarContainer.classList.remove('visible');
            }, 2000);
        }
    }
});

// after going outside of full screen, the next reel is shown on the screen and being paused but the audio of the previous reel, which was originally fullscreened, that audio is played. also the volume bar works good and all but i want the volume bar to be at the bottom, between the volume button and fullscreen button, also dont change the container size after fullscreen.