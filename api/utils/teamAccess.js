const { db } = require('../database/init');

function getTeamMembership(team_id, user_id) {
    const membership = db
        .prepare('SELECT * FROM team_members WHERE team_id = ? AND user_id = ?')
        .get(team_id, user_id);

    return membership;
}

module.exports = { getTeamMembership };