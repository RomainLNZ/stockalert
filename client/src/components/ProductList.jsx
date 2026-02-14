function ProductList({ products, loading, error }) {
    if (loading) {
        return <div>Chargement des produits...</div>;
    }
    if (error) {
        return <div>Erreur : {error}</div>;
    }

    return (
        <div>
            <h1>Liste des produits</h1>
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        {product.name} - Stock: {product.stock} (Min: {product.minimum})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProductList;