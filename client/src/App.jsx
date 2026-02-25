import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';
import ProductEditForm from './components/ProductEditForm'
import Toast from './components/Toast';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-950 p-8 text-white">

      <Navbar />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Routes>
        <Route path="/" element={<Dashboard
          products={products}
          loading={loading}
          error={error}
          onProductDeleted={fetchProducts}
          setEditingProduct={setEditingProduct}
        />}
        />

        <Route path="/add" element={<AddProduct
          onProductCreated={fetchProducts}
          onShowToast={showToast}
        />}
        />
      </Routes>

      {editingProduct ? (
        <ProductEditForm
          product={editingProduct}
          onProductUpdated={fetchProducts}
          onCancel={() => setEditingProduct(null)}
          onShowToast={showToast}
        />
      ) : null}

    </div>
  );
}

export default App;