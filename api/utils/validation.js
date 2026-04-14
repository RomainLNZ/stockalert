const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;


function normalizeEmail(email) {
    return email?.toLowerCase().trim();
}

function isValidEmail(email) {
    return !!email && emailRegex.test(email);
}

function isValidPassword(password) {
    return !!password && passwordRegex.test(password);
}

module.exports = { normalizeEmail, isValidEmail, isValidPassword };