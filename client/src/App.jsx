import { useState, useEffect } from 'react';
import ProductList from './components/ProductList'
import ProductForm from './components/ProductForm'
import ProductEditForm from './components/ProductEditForm'
import Toast from './components/Toast';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

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

  const showToast = (message) => {
    setToastMessage(message);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>StockAlert</h1>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type="warning"
          onClose={() => setToastMessage(null)}
        />
      )}


      <ProductForm onProductCreated={fetchProducts} />

      {editingProduct ? (
        <ProductEditForm
          product={editingProduct}
          onProductUpdated={fetchProducts}
          onCancel={() => setEditingProduct(null)}
          onShowToast={showToast}
        />
      ) : null}

      <ProductList
        products={products}
        loading={loading}
        error={error}
        onProductDeleted={fetchProducts}
        setEditingProduct={setEditingProduct}
      />
    </div>
  );
}

export default App;