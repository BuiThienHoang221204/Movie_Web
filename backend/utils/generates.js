const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const generateKey = () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });

    return { publicKey, privateKey };
};

const { publicKey, privateKey } = generateKey();

const generateAccessToken = (props) => {
    return jwt.sign(
        { ...props },
        privateKey,
        {
            algorithm: "RS256",
        }
    );
};

const generateRefreshToken = (props) => {
    return jwt.sign(
        { ...props },
        privateKey,
        {
            algorithm: "RS384",
        }
    );
};

// Xuất module
module.exports = { generateAccessToken, generateRefreshToken, generateKey, publicKey };
