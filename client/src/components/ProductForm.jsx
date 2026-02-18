import { useState } from 'react';

function ProductForm({ onProductCreated }) {
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
        <div>
            <h3>Ajouter un nouveau produit</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nom du produit :</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label>Stock initial :</label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label>Seuil d'alerte (minimum) :</label>
                    <input
                        type="number"
                        name="minimum"
                        value={formData.minimum}
                        onChange={(e) => setFormData({ ...formData, minimum: e.target.value })}
                        required
                    />
                </div>

                <button type="submit">Créer le produit</button>
            </form>
        </div>
    );
}

export default ProductForm;