// public/script.js
// This code runs in the browser, so it's not CommonJS or ESM, just plain JavaScript.

document.addEventListener('DOMContentLoaded', async () => {
    const photoTitleElement = document.getElementById('photo-title');
    const photoImageElement = document.getElementById('photo-image');
    const averageRatingElement = document.getElementById('average-rating'); // New
    const totalRatingsElement = document.getElementById('total-ratings');   // New
    const submitButton = document.getElementById('submit-button');
    const commentInput = document.getElementById('comment-input');
    const ratingInput = document.getElementById('rating-input');
    const nextPhotoButton = document.getElementById('next-photo');
    
    let currentPhotoId = 1;
    let totalPhotos = 1;

    async function fetchTotalPhotos() {
        const response = await fetch('/api/photos/count');
        const data = await response.json();
        totalPhotos = data.total_photos;
    }

    async function loadRatingInfo(id) {
        const response = await fetch(`/api/calcinfo/${id}`);
        if (response.ok) {
            const data = await response.json();
            // Displaying the rating info. Using toFixed(2) for a cleaner look.
            averageRatingElement.textContent = `Average Rating: ${Number(data.average_rating).toFixed(2) || 'N/A'}`;
            totalRatingsElement.textContent = `Total Ratings: ${data.total_ratings || 0}`;
        } else {
            averageRatingElement.textContent = 'Average Rating: N/A';
            totalRatingsElement.textContent = 'Total Ratings: 0';
        }
    }

    async function loadPhoto(id) {
        const response = await fetch(`/api/photos/${id}`);
        if (response.ok) {
            const photo = await response.json();
            photoTitleElement.textContent = photo.title;
            photoImageElement.src = photo.url;
            currentPhotoId = photo.photo_id;
            await loadRatingInfo(currentPhotoId); // Call the new function here
        } else {
            photoTitleElement.textContent = 'Photo not found';
            photoImageElement.src = '';
        }
    }

    submitButton.addEventListener('click', async () => {
        const newComment = {
            photo_id: currentPhotoId,
            comment: commentInput.value,
            rating: ratingInput.value
        };

        const response = await fetch('/api/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newComment),
        });

        const result = await response.json();
        alert(result.message);
        commentInput.value = '';
        ratingInput.value = '';
        await loadRatingInfo(currentPhotoId); // Refresh rating info after submitting
    });

    nextPhotoButton.addEventListener('click', async () => {
        let nextId = currentPhotoId + 1;
        if (nextId > totalPhotos) {
            nextId = 1;
        }
        await loadPhoto(nextId);
    });

    await fetchTotalPhotos();
    await loadPhoto(currentPhotoId);
});