const express = require('express');
const { db } = require('../database/init');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
    console.log("📦 GET /api/products - Lecture depuis la BDD");

    const { team_id } = req.query;
    
    if (!team_id) {
        return res.status(400).json({ error: 'team_id requis' });
    }

    try {
        const products = db.prepare('SELECT * FROM products WHERE team_id = ?').all(team_id);
        res.json(products);
    } catch (error) {
        console.error("Erreur BDD:", error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.get('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { team_id } = req.query;
    
    if (!team_id) {
        return res.status(400).json({ error: 'team_id requis' });
    }

    try {
        const product = db.prepare('SELECT * FROM products WHERE id = ? AND team_id = ?').get(id, team_id);
        
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        
        res.json(product);
    } catch (error) {
        console.error("Erreur BDD:", error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/', authenticateToken, (req, res) => {
    console.log("➕ POST /api/products - Création d'un produit");

    const { name, description, stock, minimum, team_id } = req.body;

    if (!name || stock === undefined || minimum === undefined) {
        return res.status(400).json({ 
            error: 'Les champs name, stock et minimum sont requis' 
        });
    }

    if (!team_id) {
        return res.status(400).json({ error: 'team_id requis' });
    }

    try {
        const insert = db.prepare(`
            INSERT INTO products (name, description, stock, minimum, team_id) 
            VALUES (?, ?, ?, ?, ?)
        `);
        
        const result = insert.run(name, description, stock, minimum, team_id);
        
        const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
        
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Erreur d'insertion:", error);
        res.status(500).json({ error: 'Erreur lors de la création du produit' });
    }
});

router.put('/:id', authenticateToken, (req, res) => {
    console.log("✏️ PUT /api/products/:id - Modification d'un produit");
    
    const { id } = req.params;
    const { name, description, stock, minimum, team_id } = req.body;

    if (!name || stock === undefined || minimum === undefined) {
        return res.status(400).json({ 
            error: 'Les champs name, stock et minimum sont requis' 
        });
    }

    if (!team_id) {
        return res.status(400).json({ error: 'team_id requis' });
    }

    try {
        const product = db.prepare('SELECT * FROM products WHERE id = ? AND team_id = ?').get(id, team_id);
        
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé ou vous n\'avez pas accès' });
        }

        const update = db.prepare(`
            UPDATE products 
            SET name = ?, description = ?, stock = ?, minimum = ? 
            WHERE id = ? AND team_id = ?
        `);
        
        update.run(name, description, stock, minimum, id, team_id);
        
        const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
        
        res.json(updatedProduct);
    } catch (error) {
        console.error("Erreur de mise à jour:", error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
});

router.delete('/:id', authenticateToken, (req, res) => {
    console.log("🗑️ DELETE /api/products/:id - Suppression d'un produit");
    
    const { id } = req.params;
    const { team_id } = req.query;

    if (!team_id) {
        return res.status(400).json({ error: 'team_id requis' });
    }

    try {
        const product = db.prepare('SELECT * FROM products WHERE id = ? AND team_id = ?').get(id, team_id);
        
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé ou vous n\'avez pas accès' });
        }

        const deleteStmt = db.prepare('DELETE FROM products WHERE id = ? AND team_id = ?');
        deleteStmt.run(id, team_id);
        
        res.json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
        console.error("Erreur de suppression:", error);
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
});

module.exports = router;