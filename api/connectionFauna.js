const faunadb = require("faunadb"),
    q = faunadb.query;

const adminClient = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
});

const saveJigsawData = async function (dataSet) {
    const data = {
        data: JSON.parse(dataSet),
    };

    return adminClient
        .query(q.Create(q.Collection("jigsawData"), data))
        .then(function (response) {
            // Success!
            return {
                statusCode: 200,
                body: JSON.stringify(response),
            };
        })
        .catch(function (error) {
            // Failed
            return {
                statusCode: 400,
                body: JSON.stringify(error),
            };
        });
};

exports.handler = async function (event, context) {
    try {
        const savedResponse = await saveJigsawData(event.body);

        return savedResponse;
    } catch (err) {
        return { statusCode: 500, body: `Error: ${err}` };
    }
};
