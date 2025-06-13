const jwt = require("jsonwebtoken");

const SECRETKEY = process.env.SECRETKEY ;

const convertPayloadToToken = (payload) => {
  return jwt.sign(payload, SECRETKEY /*{ expiresIn: "3600s" }*/);
};

const convertTokenToPayload = (token) => {
  return jwt.verify(token, SECRETKEY);
};

module.exports = { convertPayloadToToken, convertTokenToPayload };
