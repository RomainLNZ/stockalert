const { db } = require('../database/init');
const AppError = require('./AppError');

function getTeamMembership(teamId, userId) {
    const membership = db
        .prepare(`
            SELECT teams.*, team_members.role
            FROM teams
            JOIN team_members ON teams.id = team_members.team_id
            WHERE teams.id = ? AND team_members.user_id = ?
        `)
        .get(teamId, userId);

    return membership;
}

function assertOwner(role) {
    if (role !== 'owner') {
        throw new AppError('INSUFFICIENT_PERMISSIONS', 403);
    }
}

function requireTeamOwner(teamId, userId) {
    const teamMembership = getTeamMembership(teamId, userId);

    if (!teamMembership) {
        throw new AppError('TEAM_NOT_FOUND', 404);
    }

    assertOwner(teamMembership.role);

    return teamMembership;
}

module.exports = {
    getTeamMembership,
    assertOwner,
    requireTeamOwner
};