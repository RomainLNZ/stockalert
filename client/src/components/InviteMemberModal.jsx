import { useState } from 'react';
import { fetchWithAuth } from '../utils/api';

function InviteMemberModal({ onClose, teamId, onMemberInvited, onShowToast }) {

    const [email, setEmail] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        if (!teamId) {
            alert("Aucune équipe sélectionnée.");
            return;
        }

        try {
            const response = await fetchWithAuth(`/api/teams/${teamId}/members`, {
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            onMemberInvited(data);
            onClose();
            onShowToast("✅ Membre invité avec succès", 'success');

            // Vider le formulaire
            setEmail('');

        } catch (erreur) {
            console.error("Erreur lors de l'invitation du membre :", erreur);
            alert("Erreur : " + erreur.message);
        }
    }

    return (
        <div className="bg-blue/10 relative backdrop-blur-sm border border-white/10 shadow-lg rounded-xl p-6 max-w-md mx-auto mb-8">
            <button
                type='button'
                onClick={() => onClose()}
                className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl"
            >
                ✕
            </button>
            <h3 className="text-gray-100 text-center p-8">Ajouter un memebre</h3>
            <form className='text-gray-100' onSubmit={handleSubmit}>
                <div className='mb-4' >
                    <label>Adresse email :</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-white/50 focus:outline-none"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors mt-2"
                >
                    Inviter le membre</button>
            </form>
        </div>
    );
}

export default InviteMemberModal;