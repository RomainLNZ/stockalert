function errorHandler(err, req, res, next) {
    const status = err.status || 500;
    const message = err.message || 'Erreur interne du serveur';

    res.status(status).json({ error: message });
}

module.exports = errorHandler;