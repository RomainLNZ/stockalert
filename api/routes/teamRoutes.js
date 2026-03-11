const express = require('express');
const { db } = require('../database/init');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticateToken, (req, res) => {
    console.log("➕ POST /api/teams - Création d'une team");

    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ 
            error: 'Le nom de la team est requis' 
        });
    }

    try {
        const existingTeam = db.prepare('SELECT id FROM teams WHERE name = ?').get(name);
            if (existingTeam) {
            return res.status(409).json({ error: 'Nom de team déjà utilisé' });
        }
        // Créer la team
        const insertTeam = db.prepare(`
            INSERT INTO teams (name, created_by) 
            VALUES (?, ?)
        `);
        const resultTeam = insertTeam.run(name, req.user.id);
        const newTeamId = resultTeam.lastInsertRowid;

        // Ajouter le créateur comme owner
        const insertMember = db.prepare(`
            INSERT INTO team_members (user_id, team_id, role) 
            VALUES (?, ?, ?)
        `);
        insertMember.run(req.user.id, newTeamId, 'owner');

        // Récupérer la team complète
        const newTeam = db.prepare('SELECT * FROM teams WHERE id = ?').get(newTeamId);
        
        res.status(201).json(newTeam);
    } catch (error) {
        console.error("Erreur lors de la création de la team :", error);
        res.status(500).json({ error: 'Erreur lors de la création de la team' });
    }
});

router.get('/', authenticateToken, (req, res) => {
    console.log("📋 GET /api/teams - Récupération des teams de l'user");

    try {
        // TOI : Écris la requête SQL avec JOIN
        const teams = db.prepare(`
            SELECT teams.*
            FROM teams
            JOIN team_members ON teams.id = team_members.team_id
            WHERE team_members.user_id = ?
        `).all(req.user.id);
        res.json(teams);
    } catch (error) {
        console.error("Erreur lors de la récupération des teams :", error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;