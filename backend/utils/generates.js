const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');

const KEY_DIR = path.join(__dirname, '..', 'keys');
const PRIVATE_KEY_PATH = path.join(KEY_DIR, 'private.pem');
const PUBLIC_KEY_PATH = path.join(KEY_DIR, 'public.pem');

const generateKey = () => {
    // Create keys directory if it doesn't exist
    if (!fs.existsSync(KEY_DIR)) {
        fs.mkdirSync(KEY_DIR);
    }

    // If keys don't exist, generate them
    if (!fs.existsSync(PRIVATE_KEY_PATH) || !fs.existsSync(PUBLIC_KEY_PATH)) {
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

        fs.writeFileSync(PRIVATE_KEY_PATH, privateKey);
        fs.writeFileSync(PUBLIC_KEY_PATH, publicKey);
        
        return { publicKey, privateKey };
    }

    // Read existing keys
    return {
        privateKey: fs.readFileSync(PRIVATE_KEY_PATH, 'utf8'),
        publicKey: fs.readFileSync(PUBLIC_KEY_PATH, 'utf8')
    };
};

// Load or generate keys once when the server starts
const { publicKey, privateKey } = generateKey();

const generateAccessToken = (props) => {
    return jwt.sign(
        { ...props },
        privateKey,
        {
            algorithm: "RS256",
            expiresIn: '10m' // 10 minutes
        }
    );
};

const generateRefreshToken = (props) => {
    return jwt.sign(
        { ...props },
        privateKey,
        {
            algorithm: "RS256",
            expiresIn: '7d' // 7 days
        }
    );
};

// Xuất module
module.exports = { generateAccessToken, generateRefreshToken, generateKey, publicKey };
