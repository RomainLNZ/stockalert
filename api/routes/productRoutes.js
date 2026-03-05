const express = require('express');
const { db, initDatabase } = require('../database/init');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
    console.log("📦 GET /api/products - Lecture depuis la BDD");

    try {
        const products = db.prepare('SELECT * FROM products WHERE user_id = ?').all(req.user.id);
        res.json(products);
    } catch (error) {
        console.error("Erreur BDD:", error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.get('/:id', authenticateToken, (req, res) => {
    console.log("📦 GET /api/products/:id - Lecture depuis la BDD");

    const id = req.params.id;

    try {
        const product = db.prepare('SELECT * FROM products WHERE id = ? AND user_id = ?').get(id, req.user.id);
    
        if (!product) {
            return res.status(404).json({ error: 'Produit introuvable' });
        }
    
        res.json(product);
    } catch (error) {
        console.error("Erreur:", error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/', authenticateToken, (req, res) => {
    console.log("➕ POST /api/products - Création d'un produit");

    const { name, stock, minimum } = req.body;

    if (!name || stock === undefined || minimum === undefined) {
        return res.status(400).json({ 
            error: 'Données manquantes (name, stock, minimum requis)' 
        });
    }

    try {
        const insert = db.prepare(`
            INSERT INTO products (name, stock, minimum, user_id) 
            VALUES (?, ?, ?, ?)
        `);
        const result = insert.run(name, stock, minimum, req.user.id);
        const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
        
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Erreur d'insertion:", error);
        res.status(500).json({ error: 'Erreur lors de la création du produit' });
    }
});

router.put('/:id', authenticateToken, (req, res) => {
    console.log("✏️ PUT /api/products/:id - Modification d'un produit");

    const id = req.params.id;
    const { name, stock, minimum } = req.body;

    try {

    if (!name || stock === undefined || minimum === undefined) {
        return res.status(400).json({ 
            error: 'Données manquantes (name, stock, minimum requis)' 
        });
    }

    const product = db.prepare('SELECT * FROM products WHERE id = ? AND user_id = ?').get(id, req.user.id);

    if (!product) {
        return res.status(404).json({ error: 'Produit introuvable' });
    }

    db.prepare('UPDATE products SET name = ?, stock = ?, minimum = ? WHERE id = ?').run(
        name,
        stock,
        minimum,
        id
    );

    const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    res.json(updatedProduct);

    } catch (error) {
        console.error("Erreur de mise à jour:", error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du produit' });
    }
});

router.delete('/:id', authenticateToken, (req, res) => {
    console.log("🗑️ DELETE /api/products/:id - Suppression d'un produit");

    const id = req.params.id;

    try  {
        const product = db.prepare('SELECT * FROM products WHERE id = ? AND user_id = ?').get(id, req.user.id);

        if (!product) {
        return res.status(404).json({ error: 'Produit introuvable'});
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(id);

    res.json({ message: 'Produit supprimé avec succès',
        deletedProduct: product
    });

    } catch (error) {
        console.error("Erreur de suppression:", error);
        res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
    }
});

module.exports = router;