import ProductList from '../components/ProductList';

function Dashboard({ products, loading, error, onProductDeleted, setEditingProduct, setIsAddModalOpen }) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Tableau de bord</h2>
            <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Ajouter un produit
            </button>
            <ProductList
                products={products}
                loading={loading}
                error={error}
                onProductDeleted={onProductDeleted}
                setEditingProduct={setEditingProduct}
            />
        </div>
    );
}

export default Dashboard;