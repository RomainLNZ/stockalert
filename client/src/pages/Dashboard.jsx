import ProductList from '../components/ProductList';

function Dashboard({ products, loading, error, onProductDeleted, setEditingProduct, setIsAddModalOpen }) {

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-white/60">Chargement...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-red-400">{error}</div>
            </div>
        );
    }

    return (
        <div>
            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 max-w-md">
                        <div className="text-6xl mb-4">📦</div>

                        <h3 className="text-2xl font-bold text-white mb-2">
                            Aucun produit enregistré
                        </h3>

                        <p className="text-white/60 mb-6">
                            Commencez par ajouter un nouveau produit à votre inventaire.
                        </p>

                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600
                                    text-white font-semibold px-6 py-3 rounded-lg
                                    hover:from-blue-600 hover:to-indigo-700
                                    transform transition-all duration-300
                                    hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
                        >
                            Ajouter un produit
                        </button>
                    </div>
                </div>
            ) : (

                <ProductList
                    products={products}
                    loading={loading}
                    error={error}
                    onProductDeleted={onProductDeleted}
                    setEditingProduct={setEditingProduct}
                />
            )}
        </div>
    );
}

export default Dashboard;