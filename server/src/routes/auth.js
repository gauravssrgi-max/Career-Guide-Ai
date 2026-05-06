const express = require('express');
const router = express.Router();

const {
    register,
    login,
    googleAuth,
    githubAuth,
    getProfile,
    updateProfile
} = require('../controllers/authController');

const { auth } = require('../middleware/auth');

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

/* ─────────────── NORMAL AUTH ─────────────── */
router.post('/register', register);
router.post('/login', login);

/* ─────────────── GOOGLE AUTH ─────────────── */
router.post('/google', googleAuth);

/* ─────────────── GITHUB OAUTH START ─────────────── */
router.get('/github', (req, res) => {
    const redirectUri = `${BASE_URL}/api/auth/github/callback`;

    const githubAuthURL =
        `https://github.com/login/oauth/authorize` +
        `?client_id=${process.env.GITHUB_CLIENT_ID}` +
        `&redirect_uri=${redirectUri}` +
        `&scope=user:email`;

    res.redirect(githubAuthURL);
});

/* ─────────────── GITHUB CALLBACK ─────────────── */
router.get('/github/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: 'No code provided' });
    }

    try {
        // Exchange code for access token
        const tokenResponse = await fetch(
            `https://github.com/login/oauth/access_token`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    client_id: process.env.GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    code,
                }),
            }
        );

        const tokenData = await tokenResponse.json();

        // Here you would normally fetch GitHub user info
        // and create/login user in DB

        return res.redirect(`${CLIENT_URL}/dashboard`);
    } catch (error) {
        console.error(error);
        return res.redirect(`${CLIENT_URL}/login`);
    }
});

/* ─────────────── USER PROFILE ─────────────── */
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

module.exports = router;
