const express = require('express');
const { db } = require('../database/init');
const authenticateToken = require('../middleware/auth');
const { getTeamMembership } = require('../utils/teamAccess');
const router = express.Router();

router.get('/', authenticateToken, (req, res, next) => {
    console.log("📦 GET /api/products - Lecture depuis la BDD");

    const { team_id } = req.query;
    
    if (!team_id) {
        return res.status(400).json({ error: 'team_id requis' });
    }

    try {

        const membership = getTeamMembership(team_id, req.user.id);
        
        if (!membership) {
            return res.status(403).json({ error: 'Vous n\'êtes pas membre de cette équipe' });
        }

        const products = db.prepare('SELECT * FROM products WHERE team_id = ?').all(team_id);
        res.json(products);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', authenticateToken, (req, res, next) => {
    const { id } = req.params;
    const { team_id } = req.query;
    
    if (!team_id) {
        return res.status(400).json({ error: 'team_id requis' });
    }

    try {

        const membership = getTeamMembership(team_id, req.user.id);
        
        if (!membership) {
            return res.status(403).json({ error: 'Vous n\'êtes pas membre de cette équipe' });
        }

        const product = db.prepare('SELECT * FROM products WHERE id = ? AND team_id = ?').get(id, team_id);
        
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        
        res.json(product);
    } catch (error) {
        next(error);
    }
});

router.post('/', authenticateToken, (req, res, next) => {
    console.log("➕ POST /api/products - Création d'un produit");

    const { name, description, stock, minimum, team_id } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({
            error: 'Le nom est requis'
        });
    }

    if (!Number.isInteger(stock) || stock < 0) {
        return res.status(400).json({
            error: 'Le stock doit être un entier supérieur ou égal à 0'
        });
    }

    if (!Number.isInteger(minimum) || minimum < 0) {
        return res.status(400).json({
            error: 'Le minimum doit être un entier supérieur ou égal à 0'
        });
    }

    if (!team_id) {
        return res.status(400).json({ error: 'team_id requis' });
    }

    try {

        const membership = getTeamMembership(team_id, req.user.id);
        
        if (!membership) {
            return res.status(403).json({ error: 'Vous n\'êtes pas membre de cette équipe' });
        }

        const insert = db.prepare(`
            INSERT INTO products (name, description, stock, minimum, team_id) 
            VALUES (?, ?, ?, ?, ?)
        `);
        
        const result = insert.run(name, description, stock, minimum, team_id);
        
        const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
        
        res.status(201).json(newProduct);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', authenticateToken, (req, res, next) => {
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

        const membership = getTeamMembership(team_id, req.user.id);
        
        if (!membership) {
            return res.status(403).json({ error: 'Vous n\'êtes pas membre de cette équipe' });
        }

        const product = db.prepare('SELECT * FROM products WHERE id = ? AND team_id = ?').get(id, team_id);
        
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        const update = db.prepare(`
            UPDATE products 
            SET name = ?, description = ?, stock = ?, minimum = ? 
            WHERE id = ? AND team_id = ?
        `);
        
        update.run(name, description, stock, minimum, id, team_id);
        
        const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ? AND team_id = ?').get(id, team_id);
        
        res.json(updatedProduct);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', authenticateToken, (req, res, next) => {
    console.log("🗑️ DELETE /api/products/:id - Suppression d'un produit");
    
    const { id } = req.params;
    const { team_id } = req.query;

    if (!team_id) {
        return res.status(400).json({ error: 'team_id requis' });
    }

    try {

        const membership = getTeamMembership(team_id, req.user.id);
        
        if (!membership) {
            return res.status(403).json({ error: 'Vous n\'êtes pas membre de cette équipe' });
        }

        const product = db.prepare('SELECT * FROM products WHERE id = ? AND team_id = ?').get(id, team_id);
        
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        const deleteStmt = db.prepare('DELETE FROM products WHERE id = ? AND team_id = ?');
        deleteStmt.run(id, team_id);
        
        res.json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;