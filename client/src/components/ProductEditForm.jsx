import { useState } from 'react';

function ProductEditForm({ product, onProductUpdated, onCancel, onShowToast }) {

    const [quantity, setQuantity] = useState('');

    const [formData, setFormData] = useState({
        id: product.id,
        name: product.name,
        minimum: product.minimum
    });

    async function handleUpdate(e) {
        e.preventDefault()

        if (!window.confirm("Êtes-vous sûr de vouloir modifier ce produit ?")) {
            return;
        }


        try {
            const response = await fetch(`http://localhost:5000/api/products/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    stock: product.stock,
                    minimum: Number(formData.minimum)
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            onProductUpdated()
            onCancel()

        } catch (erreur) {
            console.error("Erreur lors de la modification du produit :", erreur);
            alert("Erreur : " + erreur.message);
        }
    }

    const handleAdd = async (e) => {
        e.preventDefault();
        const newStock = product.stock + Number(quantity)
        try {
            const response = await fetch(`http://localhost:5000/api/products/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    stock: newStock,
                    minimum: Number(formData.minimum)
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            onProductUpdated()
            onCancel()
            setQuantity('')

        } catch (erreur) {
            console.error("Erreur lors de l'ajout de stock :", erreur);
            alert("Erreur : " + erreur.message);
        }
    };

    const handleRemove = async (e) => {
        e.preventDefault();
        if (Number(quantity) > product.stock) {
            alert("La quantité à retirer dépasse le stock disponible.");
            return;
        }

        const newStock = product.stock - Number(quantity)

        if (newStock < product.minimum) {
            onShowToast(`⚠️ Stock critique : ${product.name}, 'warning'`);
        }
        
        try {
            const response = await fetch(`http://localhost:5000/api/products/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    stock: newStock,
                    minimum: Number(formData.minimum)
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            onProductUpdated()
            onCancel()
            setQuantity('')

        } catch (erreur) {
            console.error("Erreur lors du retrait de stock :", erreur);
            alert("Erreur : " + erreur.message);
        }
    };

    return (
        <>
            <h3>Modifier le produit</h3>
            <form onSubmit={handleUpdate}>
                <div>
                    <label>Nom :</label>
                    <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>

                <div>
                    <label>Seuil d'alerte :</label>
                    <input value={formData.minimum} onChange={(e) => setFormData({ ...formData, minimum: e.target.value })} required />
                </div>

                <button type="submit">Sauvegarder modifications</button>
            </form>

            {/* Section séparée pour la gestion du stock */}
            <div>
                <p>Stock actuel : {product.stock}</p>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Quantité"
                />
                <button type="button" onClick={handleAdd}>Ajouter</button>
                <button type="button" onClick={handleRemove}>Retirer</button>
            </div>

            <button type="button" onClick={onCancel}>Annuler</button>
        </>
    )
};

export default ProductEditForm;