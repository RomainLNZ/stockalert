const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const attempts = {};

function loginLimiter(req, res, next) {
    const ip = req.ip;
    const now = Date.now();

    if (!attempts[ip]) {
        attempts[ip] = {
            count: 1,
            lastAttempt: now
        };
    } else {
        const timeSinceLastAttempt = now - attempts[ip].lastAttempt;

        if (timeSinceLastAttempt > WINDOW_MS) {
            attempts[ip].count = 1;
        } else {
            attempts[ip].count++;
        }

        attempts[ip].lastAttempt = now;
    }

    if (attempts[ip].count > MAX_ATTEMPTS) {
        return res.status(429).json({
            error: 'Trop de tentatives de connexion. Veuillez réessayer plus tard.'
        });
    }

    next();
}

module.exports = loginLimiter;