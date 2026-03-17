import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { fetchWithAuth } from './utils/api';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';
import ProductEditForm from './components/ProductEditForm'
import Toast from './components/Toast';
import ProductForm from './components/ProductForm';
import TeamForm from './components/TeamForm';
import Modal from './components/Modal';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchProducts = async () => {
    try {
      const activeTeamId = localStorage.getItem('activeTeamId');

      if (!activeTeamId) {
        console.log('Aucune team sélectionnée');
        setProducts([]);
        setLoading(false);
        return;
      }

      const response = await fetchWithAuth(`/api/products?team_id=${activeTeamId}`);

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

  const fetchTeams = async () => {
    try {
      const response = await fetchWithAuth('/api/teams');
      const data = await response.json();
      console.log("Teams récupérés :", data);
    } catch (error) {
      console.error("Erreur lors de la récupération des teams :", error);
    }
  };

  const showToast = (message, type = 'warning') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!isAuthPage) {
      fetchProducts();
    }

    const handleTeamChanged = () => {
      fetchProducts();
    };
    window.addEventListener('teamChanged', handleTeamChanged);

    return () => {
      window.removeEventListener('teamChanged', handleTeamChanged);
    };
  }, [isAuthPage]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (isAddProductModalOpen) setIsAddProductModalOpen(false);
        if (isAddTeamModalOpen) setIsAddTeamModalOpen(false);
        if (editingProduct) setEditingProduct(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAddProductModalOpen, isAddTeamModalOpen, editingProduct]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-950 ${isAuthPage ? '' : 'p-8'} text-white`}>
      {!isAuthPage && (
        <Navbar
          setIsAddProductModalOpen={setIsAddProductModalOpen}
          setIsAddTeamModalOpen={setIsAddTeamModalOpen}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Routes>
        <Route path="/login" element={<LoginPage onShowToast={showToast} />} />
        <Route path="/signup" element={<SignupPage onShowToast={showToast} />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard
              products={products}
              loading={loading}
              error={error}
              onProductDeleted={fetchProducts}
              setEditingProduct={setEditingProduct}
              setIsAddProductModalOpen={setIsAddProductModalOpen}
            />
          </ProtectedRoute>
        }
        />

        <Route path="/add" element={
          <ProtectedRoute>
            <AddProduct
              onProductCreated={fetchProducts}
              onShowToast={showToast}
            />
          </ProtectedRoute>
        }
        />
      </Routes>

      <Modal isOpen={isAddProductModalOpen} onClose={() => setIsAddProductModalOpen(false)}>
        <ProductForm
          onProductCreated={() => {
            fetchProducts();
            setIsAddProductModalOpen(false);
          }}
          onCancel={() => setIsAddProductModalOpen(false)}
          onShowToast={showToast}
        />
      </Modal>

      <Modal isOpen={isAddTeamModalOpen} onClose={() => setIsAddTeamModalOpen(false)}>
        <TeamForm
          onTeamCreated={() => {
            fetchTeams();
            setIsAddTeamModalOpen(false);
            window.dispatchEvent(new Event('teamCreated'));
          }}
          onCancel={() => setIsAddTeamModalOpen(false)}
          onShowToast={showToast}
        />
      </Modal>

      <Modal isOpen={!!editingProduct} onClose={() => setEditingProduct(null)}>
        {editingProduct && (
          <ProductEditForm
            product={editingProduct}
            onProductUpdated={fetchProducts}
            onCancel={() => setEditingProduct(null)}
            onShowToast={showToast}
          />
        )}
      </Modal>

    </div>
  );
}

export default App;