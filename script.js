      const audio = document.getElementById('audio-engine');
        let currentPlaylist = [];
        let currentIndex = 0;

        // NAVIGATION LOGIC
        function showPage(pageId) {
            // Hide all containers
            document.querySelectorAll('.container').forEach(c => c.classList.remove('active-page'));
            // Remove active from links
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            
            // Show target container
            document.getElementById(pageId).classList.add('active-page');
            // Set link to active
            event.currentTarget.classList.add('active');
            
            // Scroll to top
            window.scrollTo(0, 0);
        }

        function toggleMode() {
            const body = document.body;
            const icon = document.getElementById('mode-icon');
            body.classList.toggle('dark-mode');
            
            if(body.classList.contains('dark-mode')) {
                icon.className = 'fa-solid fa-sun';
            } else {
                icon.className = 'fa-solid fa-moon';
            }
        }

        const originalTracks = {
            'Bollywood': {
                artists: ['Arijit Singh', 'Shreya Ghoshal', 'Badshah', 'A.R. Rahman', 'Pritam'],
                songs: ['Kesariya', 'Tum Hi Ho', 'Gully Boy', 'Raataan Lambiyan', 'Chaiyya Chaiyya', 'Zingat', 'Agar Tum Saath Ho', 'Dil Se', 'Kal Ho Naa Ho', 'Deva Deva']
            },
            'Hollywood': {
                artists: ['The Weeknd', 'Taylor Swift', 'Drake', 'Ed Sheeran', 'Dua Lipa', 'Post Malone'],
                songs: ['Blinding Lights', 'Anti-Hero', 'Gods Plan', 'Shape of You', 'Levitating', 'Sunflower', 'Starboy', 'Cruel Summer', 'Stay', 'Believer']
            },
            'Punjabi': {
                artists: ['Sidhu Moose Wala', 'Diljit Dosanjh', 'Karan Aujla', 'Shubh', 'AP Dhillon'],
                songs: ['295', 'G.O.A.T', 'Softly', 'Elevated', 'Brown Munde', 'Legend', 'Checking Out', 'White Brown Black', 'Levels', 'The Last Ride']
            },
            'Rap': {
                artists: ['Eminem', 'Kendrick Lamar', 'Raftaar', 'Divine', 'Drake', 'Snoop Dogg'],
                songs: ['Godzilla', 'Humble', 'Mirchi', 'Kaam Bhaari', 'Hotline Bling', 'Lose Yourself', 'Stan', 'Moose Drilla', '3:59 AM', 'City Slums']
            },
            'LoFi': {
                artists: ['Lofi Girl', 'ChilledCow', 'Idealism', 'Nujabes', 'Jinsang'],
                songs: ['Midnight Snack', 'Rainy Night', 'Study Session', 'Coffee Breath', 'Snowfall', 'Affection', 'Reminisce', 'Lonesome', 'Daydream', 'I Will Wait']
            },
            'Rock': {
                artists: ['Linkin Park', 'Queen', 'AC/DC', 'Nirvana', 'Coldplay', 'Arctic Monkeys'],
                songs: ['Numb', 'Bohemian Rhapsody', 'Thunderstruck', 'Smells Like Teen Spirit', 'Yellow', 'Do I Wanna Know', 'In the End', 'Believer', 'Bones', 'Demons']
            }
        };

        function filterGenres() {
            let input = document.getElementById('genreSearch').value.toLowerCase();
            let cards = document.getElementsByClassName('genre-card');
            
            for (let i = 0; i < cards.length; i++) {
                let h3 = cards[i].querySelector('h3');
                if (h3) {
                    let genreName = h3.innerText.toLowerCase();
                    cards[i].style.display = genreName.includes(input) ? "" : "none";
                }
            }
        }

        function generateSongs(genre) {
            let songs = [];
            const data = originalTracks[genre];
            for(let i = 1; i <= 100; i++) {
                const songBase = data.songs[i % data.songs.length];
                songs.push({
                    title: `${songBase} (YouTube Version #${i})`,
                    artist: data.artists[i % data.artists.length],
                    url: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(i % 15) + 1}.mp3`,
                    img: `https://picsum.photos/seed/${genre}${i}/400`
                });
            }
            return songs;
        }

        function openGenre(g) {
            currentPlaylist = generateSongs(g);
            currentIndex = 0;
            document.getElementById('player-overlay').style.display = 'block';
            document.body.style.overflow = 'hidden';
            renderList();
            loadSong(0);
        }

        function renderList() {
            const list = document.getElementById('playlist-list');
            list.innerHTML = `<h2 style="margin-bottom:20px; border-bottom: 2px solid var(--accent); padding-bottom:10px;">Queue (100 Original Tracks)</h2>`;
            currentPlaylist.forEach((song, i) => {
                const row = document.createElement('div');
                row.className = `song-row ${i === currentIndex ? 'active' : ''}`;
                row.onclick = () => loadSong(i);
                row.innerHTML = `
                    <span style="margin-right:20px; opacity:0.5; width:30px;">${i+1}</span>
                    <div style="flex:1">
                        <strong>${song.title}</strong><br>
                        <small>${song.artist}</small>
                    </div>
                    <i class="fa-brands fa-youtube" style="color:#ff0000"></i>
                `;
                list.appendChild(row);
            });
        }

        function loadSong(i) {
            currentIndex = i;
            const song = currentPlaylist[i];
            document.getElementById('track-title').innerText = song.title;
            document.getElementById('track-artist').innerText = song.artist;
            document.getElementById('main-art').src = song.img;
            audio.src = song.url;
            
            const rows = document.querySelectorAll('.song-row');
            rows.forEach(r => r.classList.remove('active'));
            if(rows[i]) {
                rows[i].classList.add('active');
                rows[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            togglePlay(true);
        }

        function togglePlay(force = false) {
            const icon = document.getElementById('play-icon');
            if(audio.paused || force) {
                audio.play();
                icon.className = 'fa-solid fa-pause';
            } else {
                audio.pause();
                icon.className = 'fa-solid fa-play';
            }
        }

        function closePlayer() {
            audio.pause();
            document.getElementById('player-overlay').style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        function nextSong() { currentIndex = (currentIndex + 1) % 100; loadSong(currentIndex); }
        function prevSong() { currentIndex = (currentIndex - 1 + 100) % 100; loadSong(currentIndex); }

        audio.ontimeupdate = () => {
            const prog = (audio.currentTime / audio.duration) * 100;
            document.getElementById('progress').value = prog || 0;
        };

        document.getElementById('progress').oninput = function() {
            const seekTime = (this.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        };