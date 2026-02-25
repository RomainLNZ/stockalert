import ProductList from '../components/ProductList';

function Dashboard({ products, loading, error, onProductDeleted, setEditingProduct }) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Tableau de bord</h2>
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