export const setResponse = (data, response) => {
    response.status(200);
    response.json(data);
}

export const setError = (err, response) => {
    response.status(500);
    console.log(err);
    response.json({
        error: {
            code: "InternalServerError",
            message: "Error occurred while processing the request"
        }
    });
}

