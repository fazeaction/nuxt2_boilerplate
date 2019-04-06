//
// middleware/server.js

export default function(req, res, next) {
    console.log("Hi from server! "); // eslint-disable-line

    next();
};
