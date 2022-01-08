function minute_to_milisecond(min) {
    return Math.ceil(min * 60 * 1000);
}

let session_conf = {
    secret: 'no secret',
    cookie: {
        secure: false,
        maxAge: minute_to_milisecond(10),
    },
};

module.exports = {
    session_conf,
};
