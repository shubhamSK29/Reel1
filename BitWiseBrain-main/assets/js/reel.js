// Your complete provided JavaScript code here
document.getElementById("addVideo").addEventListener("click", function() {
    document.getElementById("videoInput").click();
});

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
        
        // Create play button
        const playBtn = document.createElement('button');
        playBtn.className = 'play-control';
        playBtn.innerHTML = '⏸';
        playBtn.onclick = function() {
            if (video.paused) {
                video.play();
                playBtn.innerHTML = '⏸';
            } else {
                video.pause();
                playBtn.innerHTML = '▶';
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

        // Create fullscreen button
        const fullscreenBtn = document.createElement('button');
        fullscreenBtn.className = 'fullscreen-button';
        fullscreenBtn.innerHTML = '⛶';
        fullscreenBtn.onclick = function() {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                reelDiv.requestFullscreen();
            }
        };

        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-button';
        deleteBtn.innerHTML = '×';
        deleteBtn.onclick = function() {
            reelDiv.remove();
        };

        reelDiv.appendChild(video);
        reelDiv.appendChild(playBtn);
        reelDiv.appendChild(volumeBtn);
        reelDiv.appendChild(fullscreenBtn);
        reelDiv.appendChild(deleteBtn);
        reelsContainer.appendChild(reelDiv);
    }
    
    e.target.value = '';
});

// Handle video visibility
function handleVideoVisibility() {
    const videos = document.querySelectorAll('.reel video');
    videos.forEach(video => {
        const rect = video.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        
        if (isVisible) {
            video.play();
        } else {
            video.pause();
        }
    });
}

// Listen for scroll events
document.querySelector('.reels-container').addEventListener('scroll', handleVideoVisibility);

// ... rest of your JavaScript code ... 