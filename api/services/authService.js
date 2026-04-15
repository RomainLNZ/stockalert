const { db } = require('../database/init');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
const SALT_ROUNDS = 10;

async function createUser(email, password) {

    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
        throw new Error('EMAIL_ALREADY_EXISTS');
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const insert = db.prepare(`
        INSERT INTO users (email, password_hash) 
        VALUES (?, ?)
    `);

    const result = insert.run(email, password_hash);

    const newUser = {
        id: result.lastInsertRowid,
        email
    };

    const token = generateToken(newUser);

    return { user: newUser, token };

}

async function loginUser(email, password) {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const token = generateToken(user);

    return { user, token };

}

module.exports = { createUser, loginUser };