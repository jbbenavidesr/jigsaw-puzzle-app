//
// Variables
//
const container = document.querySelector("[data-app='unsplash']");

//
// Functions
//
function photoTemplate(photo) {
    const { id, description, urls } = photo;

    return `
        <label for="${id}" class="grid-third">
            <input type="radio" value="${urls.raw}" name="imageUrl" id="${id}" required>
            <img src="${urls.thumb}" alt="${description}">
        </label>`;
}

function renderPhotos(photos) {
    container.innerHTML = photos.map((photo) => photoTemplate(photo)).join("");
}

function getRandomPictures() {
    fetch("/.netlify/functions/connectionUnsplash")
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response);
        })
        .then((data) => {
            renderPhotos(data);
        })
        .catch((error) => {
            console.error(error);
        });
}

//
// Inits
//
if (container) {
    getRandomPictures();
}
