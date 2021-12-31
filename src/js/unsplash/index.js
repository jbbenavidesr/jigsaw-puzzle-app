//
// Variables
//
const container = document.querySelector("[data-app='unsplash']");

//
// Functions
//
function photoTemplate(photo) {
    const { id, alt_description, urls } = photo;

    return `
        <label for="${id}" class="grid-third">
            <input type="radio" value="${id}" name="imageId" id="${id}" required>
            <img src="${urls.thumb}" alt="${alt_description}">
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
getRandomPictures();
