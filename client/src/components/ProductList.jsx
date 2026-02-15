function ProductList({ products, loading, error, onProductDeleted }) {

    if (loading) {
        return <div>Chargement des produits...</div>;
    }

    if (error) {
        return <div>Erreur : {error}</div>;
    }

    const handleDelete = async (productId) => {

        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log("Produit supprimé avec succès");

            // Rafraîchir la liste
            onProductDeleted();

        } catch (erreur) {
            console.error("Erreur lors de la suppression du produit :", erreur);
            alert("Erreur : " + erreur.message);
        }
    };

    // Rendu de la liste
    return (
        <div>
            <h1>Liste des produits</h1>
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        {product.name} - Stock: {product.stock} (Min: {product.minimum})
                        <button onClick={() => handleDelete(product.id)}>
                            🗑️ Supprimer
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProductList;