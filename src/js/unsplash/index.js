//
// Functions
//
function getRandomPictures() {
    fetch("/.netlify/functions/connectionUnsplash")
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response);
        })
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.error(error);
        });
}

//
// Inits
//
getRandomPictures();
