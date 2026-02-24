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
        <div className="bg-white/10 backdrop-blur-sm border border-white/10 shadow-lg rounded-xl p-6 max-w-md mx-auto mb-8">
            <h3 className='text-gray-100'>Modifier le produit</h3>
            <form className='text-gray-100' onSubmit={handleUpdate}>
                <div className='mb-4' >
                    <label>Nom :</label>
                    <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-white/50 focus:outline-none"
                    />
                </div>

                <div className='mb-4' >
                    <label>Seuil d'alerte :</label>
                    <input value={formData.minimum} onChange={(e) => setFormData({ ...formData, minimum: e.target.value })} required
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-white/50 focus:outline-none"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors mt-2 mb-3"
                >Sauvegarder modifications</button>
            </form>

            {/* Section séparée pour la gestion du stock */}
            <div className='text-gray-100'>
                <p >Stock actuel : {product.stock}</p>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Quantité"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-white/50 focus:outline-none mb-3"
                />
                <div className="flex gap-2 mb-3">
                    <button
                        type="button"
                        onClick={handleAdd}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                        Ajouter</button>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                        Retirer</button>
                </div>
            </div>

            <button
                type="button" onClick={onCancel}
                className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-colors"
            >
                Annuler</button>
        </div>
    )
};

export default ProductEditForm;