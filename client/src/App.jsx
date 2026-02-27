import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';
import ProductEditForm from './components/ProductEditForm'
import Toast from './components/Toast';
import ProductForm from './components/ProductForm';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

      <Navbar
        setIsAddModalOpen={setIsAddModalOpen}
      />

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
          setIsAddModalOpen={setIsAddModalOpen}
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

      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-800 ${isAddModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsAddModalOpen(false)}
        >
        <div className={`relative max-w-2xl w-full mx-4 transition-all duration-900 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isAddModalOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <ProductForm
            onProductCreated={() => {
              fetchProducts();
              setIsAddModalOpen(false);
            }}
            onCancel={() => setIsAddModalOpen(false)}
            onShowToast={showToast}
          />
        </div>
      </div>

    </div>
  );
}

export default App;