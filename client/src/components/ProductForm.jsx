import { useState } from 'react';
import { fetchWithAuth } from '../utils/api';

function ProductForm({ onProductCreated, onShowToast, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        stock: 0,
        minimum: 0
    });

    async function handleSubmit(e) {
        e.preventDefault();
        console.log('Données du formulaire :', formData);

        const activeTeamId = localStorage.getItem('activeTeamId');
        if (!activeTeamId) {
            onShowToast('Veuillez sélectionner une team avant de créer un produit', 'warning');
            return;
        }

        try {
            const response = await fetchWithAuth('/api/products', {
                method: 'POST',
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    stock: Number(formData.stock),
                    minimum: Number(formData.minimum),
                    team_id: Number(activeTeamId)
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            onProductCreated();
            onShowToast("✅ Produit créé avec succès: " + data.name, 'success');
            console.log("Produit créé avec succès :", data);

            setFormData({
                name: '',
                description: '',
                stock: 0,
                minimum: 0
            });

        } catch (erreur) {
            console.error("Erreur lors de la création du produit :", erreur);
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
            <h3 className="text-gray-100 text-center p-8">Ajouter un nouveau produit</h3>
            <form className='text-gray-100' onSubmit={handleSubmit}>
                <div className='mb-4'>
                    <label>Nom du produit :</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-white/50 focus:outline-none"
                    />
                </div>

                <div className='mb-4'>
                    <label>Description :</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-white/50 focus:outline-none"
                        rows="3"
                    />
                </div>

                <div className='mb-4'>
                    <label>Stock :</label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-white/50 focus:outline-none"
                    />
                </div>

                <div className='mb-4'>
                    <label>Minimum :</label>
                    <input
                        type="number"
                        name="minimum"
                        value={formData.minimum}
                        onChange={(e) => setFormData({ ...formData, minimum: e.target.value })}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-white/50 focus:outline-none"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors mt-2"
                >
                    Créer le produit
                </button>
            </form>
        </div>
    );
}

export default ProductForm;