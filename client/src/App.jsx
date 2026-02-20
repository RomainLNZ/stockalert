import { useState, useEffect } from 'react';
import ProductList from './components/ProductList'
import ProductForm from './components/ProductForm'
import ProductEditForm from './components/ProductEditForm'
import Toast from './components/Toast2';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState(null);

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

  const showToast = (message, type = 'warning') => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen p-8 flex flex-col items-center bg-blue-100 bg-[url('/src/assets/bg4.png')] bg-cover bg-center">
      <h1 className="text-4xl font-bold text-white mb-8">StockAlert</h1>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}


      <ProductForm onProductCreated={fetchProducts}
        onShowToast={showToast}
      />

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