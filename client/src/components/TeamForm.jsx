import { useState } from 'react';
import { fetchWithAuth } from '../utils/api';

function TeamForm({ onTeamCreated, onShowToast, onCancel }) {
    // 1. Crée le state formData
    const [formData, setFormData] = useState({
        name: '',
    });

    async function handleSubmit(e) {
        e.preventDefault();
        console.log('Données du formulaire :', formData);

        try {
            const response = await fetchWithAuth('/api/teams', {
                method: 'POST',
                body: JSON.stringify({
                    name: formData.name,
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            onTeamCreated()
            onShowToast("✅ Team créé avec succès: " + data.name, 'success');
            console.log("Team créé avec succès :", data);

            // Vider le formulaire
            setFormData({
                name: '',

            });

        } catch (erreur) {
            console.error("Erreur lors de la création du team :", erreur);
            onShowToast("Erreur : " + erreur.message, 'error');
        }
    }

    return (
        <div className="bg-blue/10 relative backdrop-blur-sm border border-white/10 shadow-lg rounded-xl p-6 max-w-md mx-auto mb-8">
            <button
                type='button'
                onClick={() => onCancel()}
                className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl"
            >
                ✕
            </button>
            <h3 className="text-gray-100 text-center p-8">Ajouter une nouvelle équipe</h3>
            <form className='text-gray-100' onSubmit={handleSubmit}>
                <div className='mb-4' >
                    <label>Nom de l' équipe :</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-white/50 focus:outline-none"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors mt-2"
                >
                    Créer l'équipe</button>
            </form>
        </div>
    );
}

export default TeamForm;