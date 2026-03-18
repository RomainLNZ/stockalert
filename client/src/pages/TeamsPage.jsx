import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/api';
import { useNavigate } from 'react-router-dom';

function TeamsPage() {
    const [activeTeam, setActiveTeam] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const navigate = useNavigate();

    async function loadTeamData() {

        try {
            // Récupérer la team active depuis localStorage
            const teamId = localStorage.getItem('activeTeamId');
            const teamName = localStorage.getItem('activeTeamName');

            if (!teamId) {
                alert('Veuillez sélectionner une team');
                navigate('/');
                return;
            }

            setActiveTeam({ id: teamId, name: teamName });

            const response = await fetchWithAuth(`/api/teams/${teamId}/members`);
            const data = await response.json();
            setMembers(data.members || []);

            setLoading(false);
        } catch (error) {
            console.error('Erreur chargement team:', error);
            setLoading(false);
        }
    }

    async function handleInvite(e) {
        e.preventDefault();

        try {
            const response = await fetchWithAuth(`/api/teams/${activeTeam.id}/members`, {
                method: 'POST',
                body: JSON.stringify({ email: inviteEmail })
            });

            if (!response.ok) {
                const error = await response.json();
                alert(error.error);
                return;
            }

            alert('✅ Membre invité avec succès !');
            setInviteEmail('');
            loadTeamData(); // Recharger la liste
        } catch (error) {
            console.error('Erreur invitation:', error);
            alert('Erreur lors de l\'invitation');
        }
    }

    async function handleRemove(userId) {
        if (!window.confirm('Voulez-vous vraiment retirer ce membre ?')) {
            return;
        }

        try {
            const response = await fetchWithAuth(
                `/api/teams/${activeTeam.id}/members/${userId}?team_id=${activeTeam.id}`,
                { method: 'DELETE' }
            );

            if (!response.ok) {
                const error = await response.json();
                alert(error.error);
                return;
            }

            alert('✅ Membre retiré avec succès !');
            loadTeamData(); // Recharger la liste
        } catch (error) {
            console.error('Erreur suppression:', error);
            alert('Erreur lors du retrait du membre');
        }
    }

    useEffect(() => {
        loadTeamData();
    }, []);


    if (loading) {
        return <div className="text-white text-center">Chargement...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        🏢 {activeTeam?.name}
                    </h1>
                    <p className="text-gray-400">Gérez votre équipe et ses membres</p>
                </div>

                {/* Section Membres (à compléter) */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">
                        👥 Membres ({members?.length || 0})
                    </h2>
                    <div className="bg-white/5 rounded-lg divide-y divide-white/10">
                        {members.map(member => (
                            <div key={member.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">
                                        {member.role === 'owner' ? '👑' : '👤'}
                                    </span>
                                    <div>
                                        <p className="text-white font-medium">{member.email}</p>
                                        <p className="text-sm text-gray-400">
                                            {member.role === 'owner' ? 'Propriétaire' : 'Membre'}
                                        </p>
                                    </div>
                                </div>

                                {member.role !== 'owner' && (
                                    <button
                                        onClick={() => handleRemove(member.id)}
                                        className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 
                                                text-red-400 rounded-lg text-sm transition"
                                    >
                                        Retirer
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section Invitation (à compléter) */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">
                        ➕ Inviter un membre
                    </h2>
                    <div className="bg-white/5 rounded-lg p-4">
                        <form onSubmit={handleInvite} className="flex gap-3">
                            <input
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                placeholder="email@exemple.com"
                                required
                                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 
                                        text-white placeholder-gray-400 focus:border-white/50 focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white 
                                        rounded-lg transition font-medium"
                            >
                                Inviter
                            </button>
                        </form>
                    </div>
                </div>

                {/* Section Danger Zone (à compléter) */}
                <div>
                    <h2 className="text-xl font-bold text-red-400 mb-4">
                        ⚠️ Zone dangereuse
                    </h2>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <p className="text-gray-400">Supprimer la team ici...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeamsPage;