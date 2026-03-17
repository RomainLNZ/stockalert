import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/api';

function TeamSelector({ setIsAddTeamModalOpen, onTeamCreated }) {
    const [teams, setTeams] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [activeTeam, setActiveTeam] = useState(null);

    const reloadTeams = async () => {
        try {
            const response = await fetchWithAuth('/api/teams');
            const data = await response.json();
            setTeams(data);
        } catch (error) {
            console.error('Erreur fetch teams:', error);
        }
    };

    useEffect(() => {
        async function loadTeams() {
            try {
                const response = await fetchWithAuth('/api/teams');
                const data = await response.json();
                setTeams(data);

                const savedTeamId = localStorage.getItem('activeTeamId');
                const savedTeamName = localStorage.getItem('activeTeamName');
                if (savedTeamId && savedTeamName) {
                    setActiveTeam({ id: savedTeamId, name: savedTeamName });
                } else if (data.length > 0) {
                    const firstTeam = data[0];
                    localStorage.setItem('activeTeamId', firstTeam.id);
                    localStorage.setItem('activeTeamName', firstTeam.name);
                    setActiveTeam(firstTeam);
                    window.dispatchEvent(new Event('teamChanged'));
                }
            } catch (error) {
                console.error('Erreur fetch teams:', error);
            }
        }
        loadTeams();

        const handleTeamCreated = () => {
            reloadTeams();
        };
        window.addEventListener('teamCreated', handleTeamCreated);

        return () => {
            window.removeEventListener('teamCreated', handleTeamCreated);
        };
    }, []);

    return (
        <div className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 
                border border-white/10 hover:border-blue-400/30
                transition-all duration-300 flex items-center justify-between"
            >
                <div className="flex items-center gap-2">
                    <span>🏢</span>
                    <span>{activeTeam ? activeTeam.name : 'Sélectionner une team'}</span>
                </div>
                <span>{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 
                    bg-slate-900/95 backdrop-blur-xl border border-white/10 
                    rounded-xl shadow-2xl z-[200]">
                    <div className="p-2">
                        {teams.map(team => (
                            <button
                                key={team.id}
                                onClick={() => {
                                    localStorage.setItem('activeTeamId', team.id);
                                    localStorage.setItem('activeTeamName', team.name);
                                    setActiveTeam(team);
                                    setIsOpen(false);
                                    window.dispatchEvent(new Event('teamChanged'));
                                }}
                                className="w-full px-4 py-2 rounded-lg hover:bg-white/10 transition text-left"
                            >
                                • {team.name}
                            </button>
                        ))}

                        <hr className="my-2 border-white/10" />

                        <button
                            onClick={() => {
                                setIsAddTeamModalOpen(true);
                                setIsOpen(false);
                                if (onTeamCreated) {
                                    onTeamCreated(reloadTeams);
                                }
                            }}
                            className="w-full px-4 py-2 rounded-lg hover:bg-white/10 transition text-left"
                        >
                            ➕ Créer une équipe
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TeamSelector;