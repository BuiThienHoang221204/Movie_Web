const cookieOptions = {
    httpOnly: true,
    secure: process.env.CLIENT_URL === 'production',
    sameSite: "None",
    path: "/",
};

module.exports = cookieOptions;