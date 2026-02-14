import { useState, useEffect } from 'react';
import ProductList from './components/ProductList'
import ProductForm from './components/ProductForm'


function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Définis fetchProducts ICI (en dehors du useEffect)
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      console.log("Produits récupérés :", data);

      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
      setError("Impossible de charger les produits : " + error.message);
      setLoading(false);
    }
  };

  // 2. Appelle fetchProducts dans le useEffect
  useEffect(() => {
    fetchProducts();  // ← Appelle la fonction définie au-dessus
  }, []);

  return (
    <div>
      <h1>StockAlert</h1>
      <ProductForm onProductCreated={fetchProducts} />  {/* ← Maintenant ça marche */}
      <ProductList products={products} loading={loading} error={error} />
    </div>
  );
}

export default App;