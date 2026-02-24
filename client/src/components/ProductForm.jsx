import { useState } from 'react';

function ProductForm({ onProductCreated, onShowToast }) {
    // 1. Crée le state formData
    const [formData, setFormData] = useState({
        name: '',
        stock: '',
        minimum: ''
    });

    async function handleSubmit(e) {
        e.preventDefault();
        console.log('Données du formulaire :', formData);

        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    stock: Number(formData.stock),
                    minimum: Number(formData.minimum)
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            onProductCreated()
            onShowToast("✅ Produit créé avec succès: " + data.name, 'success');
            console.log("Produit créé avec succès :", data);

            // Vider le formulaire
            setFormData({
                name: '',
                stock: '',
                minimum: ''
            });

        } catch (erreur) {
            console.error("Erreur lors de la création du produit :", erreur);
            alert("Erreur : " + erreur.message);
        }
    }

    // 3. Crée le JSX avec le formulaire
    return (
        <div className="bg-white/10 backdrop-blur-sm border border-white/10 shadow-lg rounded-xl p-6 max-w-md mx-auto mb-8">
            <h3 className="text-gray-100">Ajouter un nouveau produit</h3>
            <form className='text-gray-100' onSubmit={handleSubmit}>
                <div className='mb-4' >
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

                <div className='mb-4' >
                    <label>Stock initial :</label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-white/50 focus:outline-none"
                    />
                </div>

                <div className='mb-4' >
                    <label>Seuil d'alerte (minimum) :</label>
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
                    Créer le produit</button>
            </form>
        </div>
    );
}

export default ProductForm;