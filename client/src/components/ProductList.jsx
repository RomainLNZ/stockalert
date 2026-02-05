import { useEffect, useState } from 'react';

function ProductList() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                console.log("Produits récupérés :", data);

                setProducts(data);
                setLoading(false);
            } catch (erreur) {
                console.error("Erreur lors de la récupération des produits :", erreur);
                setError("Impossible de charger les produits : " + erreur.message);
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

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

export default ProductList