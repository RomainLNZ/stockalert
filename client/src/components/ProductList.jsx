import { fetchWithAuth } from '../utils/api';

function ProductList({ products, onProductDeleted, setEditingProduct }) {
    
    async function handleDelete(productId) {
        if (!window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
            return;
        }

        const activeTeamId = localStorage.getItem('activeTeamId');
        if (!activeTeamId) {
            alert('Veuillez sélectionner une team');
            return;
        }

        try {
            const response = await fetchWithAuth(`/api/products/${productId}?team_id=${activeTeamId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            onProductDeleted();
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            alert("Erreur : " + error.message);
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
                <div key={product.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    {product.description && (
                        <p className="text-gray-400 mb-4">{product.description}</p>
                    )}
                    <div className="space-y-2">
                        <p>Stock: <span className="font-bold">{product.stock}</span></p>
                        <p>Minimum: <span className="font-bold">{product.minimum}</span></p>
                        {product.stock <= product.minimum && (
                            <p className="text-red-400 font-bold">⚠️ Stock faible !</p>
                        )}
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={() => setEditingProduct(product)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                        >
                            ✏️ Modifier
                        </button>
                        <button
                            onClick={() => handleDelete(product.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                        >
                            🗑️ Supprimer
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProductList;