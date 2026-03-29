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
        console.log(newTeam);

        res.status(201).json(newTeam);
    } catch (error) {
        console.error("Erreur lors de la création de la team :", error);
        res.status(500).json({ error: 'Erreur lors de la création de la team' });
    }
});

router.get('/', authenticateToken, (req, res) => {
    console.log("📋 GET /api/teams - Récupération des teams de l'user");

    try {
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

router.post('/:teamId/members', authenticateToken, (req, res) => {
    console.log("➕ POST /api/team-members - Ajouter un membre à une team");

    const teamId = req.params.teamId;
    const { email } = req.body;

    if (!teamId || !email) {
        return res.status(400).json({ 
            error: 'teamId et email sont requis' 
        });
    }

    try {
        // Vérifier que la team existe et que l'utilisateur est owner
        const team = db.prepare(`
            SELECT teams.*, team_members.role
            FROM teams
            JOIN team_members ON teams.id = team_members.team_id
            WHERE teams.id = ? AND team_members.user_id = ?
        `).get(teamId, req.user.id);
        if (!team) {
            return res.status(404).json({ error: 'Team introuvable' });
        }
        if (team.role !== 'owner') {
            return res.status(403).json({ error: 'Droits insuffisants pour ajouter un membre à cette team' });
        }
        // Vérifier que le teammate existe
        const teammate = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (!teammate) {
            return res.status(404).json({ error: 'Utilisateur à ajouter introuvable' });
        }
        // Vérifier que le teammate n'est pas déjà membre
        const existingMembership = db.prepare('SELECT id FROM team_members WHERE team_id = ? AND user_id = ?').get(teamId, teammate.id);
        if (existingMembership) {
            return res.status(409).json({ error: 'Cet utilisateur est déjà membre de la team' });
        }
        // Ajouter le membre à la team
        const insertMember = db.prepare(`
            INSERT INTO team_members (user_id, team_id, role) 
            VALUES (?, ?, ?)
        `);
        insertMember.run(teammate.id, teamId, 'member');
        res.status(201).json({ message: 'Membre ajouté à la team avec succès' });
    } catch (error) {
        console.error("Erreur lors de l'ajout du membre à la team :", error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.delete('/:teamId/members/:userId', authenticateToken, (req, res) => {
    console.log("➖ DELETE /api/team-members - Retirer un membre d'une team");

    const teamId = req.params.teamId;
    const userId = req.params.userId;

    if (!teamId || !userId) {
        return res.status(400).json({ 
            error: 'teamId et userId sont requis' 
        });
    }

    try {
        // Vérifier que la team existe et que l'utilisateur est owner
        const team = db.prepare(`SELECT teams.*, team_members.role
            FROM teams
            JOIN team_members ON teams.id = team_members.team_id
            WHERE teams.id = ? AND team_members.user_id = ?`).get(teamId, req.user.id);
        // Vérifier que le membre existe
        const member = db.prepare('SELECT id FROM team_members WHERE team_id = ? AND user_id = ?').get(teamId, userId);
        if (!team) {
            return res.status(404).json({ error: 'Team introuvable' });
        }
        if (!member) {
            return res.status(404).json({ error: 'Membre non trouvé dans cette team' });
        }
        if (team.role !== 'owner') {
            return res.status(403).json({ error: 'Droits insuffisants pour retirer un membre de cette team' });
        }
        if (userId === req.user.id && team.role === 'owner') {
            return res.status(403).json({ error: 'Vous ne pouvez pas vous retirer de la team si vous êtes owner' });
        }
        // Retirer le membre de la team
        const deleteMember = db.prepare('DELETE FROM team_members WHERE team_id = ? AND user_id = ?');
        deleteMember.run(teamId, userId);
        res.json({ message: 'Membre retiré de la team avec succès' });
    } catch (error) {
        console.error("Erreur lors du retrait du membre de la team :", error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.get('/:teamId/members', authenticateToken, (req, res) => {
    console.log("📋 GET /api/team-members - Récupération des membres d'une team");

    const teamId = req.params.teamId;
    const userId = req.user.id;

    if (!teamId) {
        return res.status(400).json({ error: 'teamId est requis' });
    }

    try {
        // Vérifier que la team existe et que l'utilisateur est membre
        const team = db.prepare(`
            SELECT teams.*, team_members.role
            FROM teams
            JOIN team_members ON teams.id = team_members.team_id
            WHERE teams.id = ? AND team_members.user_id = ?
        `).get(teamId, userId);
        if (!team) {
            return res.status(404).json({ error: 'Team introuvable ou utilisateur non membre' });
        }

        // Récupérer les membres de la team
        const members = db.prepare(`
            SELECT users.id, users.email, team_members.role, team_members.created_at AS joined_at
            FROM team_members
            JOIN users ON team_members.user_id = users.id
            WHERE team_members.team_id = ?
        `).all(teamId);
        res.json({ members });
    } catch (error) {
        console.error("Erreur lors de la récupération des membres de la team :", error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.delete('/:teamId', authenticateToken, (req, res) => {
    console.log("➖ DELETE /api/teams - Suppression d'une team");

    const teamId = req.params.teamId;

    if (!teamId) {
        return res.status(400).json({ error: 'teamId est requis' });
    }

    try {
        // Vérifier que la team existe et que l'utilisateur est owner
        const team = db.prepare(`
            SELECT teams.*, team_members.role
            FROM teams
            JOIN team_members ON teams.id = team_members.team_id
            WHERE teams.id = ? AND team_members.user_id = ? AND team_members.role = 'owner'
        `).get(teamId, req.user.id);

        if (!team) {
            return res.status(404).json({ error: 'Team introuvable ou utilisateur non owner' });
        }

        // Supprimer la team
// 1. Supprimer les produits d'abord
    db.prepare('DELETE FROM products WHERE team_id = ?').run(teamId);

// 2. Supprimer les membres (y compris owner)
    db.prepare('DELETE FROM team_members WHERE team_id = ?').run(teamId);

// 3. Supprimer la team
    db.prepare('DELETE FROM teams WHERE id = ?').run(teamId);

res.json({ message: 'Team supprimée avec succès' });
    } catch (error) {
        console.error("Erreur lors de la suppression de la team :", error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;