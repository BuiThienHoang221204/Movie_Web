const cookieOptions = {
    httpOnly: true,
    secure: process.env.CLIENT_URL === 'production',
    sameSite: process.env.CLIENT_URL === 'production' ? 'strict' : 'lax',
    path: "/",
};

module.exports = cookieOptions;