const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;

exports.handler = async function (event, context) {
    try {
        const response = await fetch(
            `https://api.unsplash.com/photos/random?client_id=${unsplashAccessKey}&count=12`
        );

        if (!response.ok) throw new Error(response);

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: error.toString(),
        };
    }
};
