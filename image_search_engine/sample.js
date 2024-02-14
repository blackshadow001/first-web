const API_KEY = "1p9K61a7WpSukh1JFvWcAMVAKOMSitfWV1nuVfWnHp8iWNvgVXXErtua";
        const videosContainer = document.getElementById('videos-container');
        const searchInput = document.getElementById('search-input');
        let currentPage = 1;

        const fetchVideos = (query = '') => {
            const endpoint = query
                ? `https://api.pexels.com/videos/search?query=${query}&page=${currentPage}`
                : 'https://api.pexels.com/videos/popular';

            // Make the API request
            fetch(endpoint, {
                    headers: {
                        'Authorization': API_KEY,
                    },
                })
                .then(response => response.json())
                .then(data => {
                    // Parse the response
                    const videos = data.videos || [];

                    // Display information about each video
                //     videos.forEach(video => {
                //         const videoElement = document.createElement('div');
                //         videoElement.innerHTML = `
                //             <h2>Video Name: ${video.name}</h2>
                //             <p>Video Duration: ${video.duration} seconds</p>
                //             <video width="640" height="360" controls>
                //                 <source src="${video.video_files[0].link}" type="video/mp4">
                //                 Your browser does not support the video tag.
                //             </video>
                //             <hr>
                //         `;
                //         videosContainer.appendChild(videoElement);
                //     });
                // })
                videos.forEach(video => {
                    const videoElement = document.createElement('div');
                    videoElement.innerHTML = `
                        <h2>Video Name: ${video.name}</h2>
                        <p>Video Duration: ${video.duration} seconds</p>
                        <video width="640" height="360" controls onclick="openVideoModal('${video.video_files[0].link}')">
                            <source src="${video.video_files[0].link}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                        <hr>
                    `;
                    videosContainer.appendChild(videoElement);
                });
            })
                .catch(error => console.error('Error fetching videos:', error));
        };

        // Fetch default popular videos when the page loads
        fetchVideos();

        // Handle search input
        searchInput.addEventListener('input', (event) => {
            const query = event.target.value.trim();
            currentPage = 1;
            videosContainer.innerHTML = ''; // Clear previous results
            fetchVideos(query);
        });

        const openVideoModal = (videoSrc) => {
            const modalContainer = document.createElement('div');
            modalContainer.className = 'video-modal';
    
            const closeModalBtn = document.createElement('button');
            closeModalBtn.innerText = 'Close';
            closeModalBtn.addEventListener('click', () => {
                modalContainer.remove();
            });
    
            const videoElement = document.createElement('video');
            videoElement.src = videoSrc;
            videoElement.controls = true;
    
            modalContainer.appendChild(closeModalBtn);
            modalContainer.appendChild(videoElement);
    
            document.body.appendChild(modalContainer);
        };
    
    