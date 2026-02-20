function ProductList({ products, loading, error, onProductDeleted, setEditingProduct }) {
    if (loading) return <div>Chargement des produits...</div>;
    if (error) return <div>Erreur : {error}</div>;

    const handleDelete = async (productId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            onProductDeleted();
        } catch (erreur) {
            console.error("Erreur lors de la suppression du produit :", erreur);
            alert("Erreur : " + erreur.message);
        }
    };

    return (
        <div>
            <h2>Liste des produits :</h2>

            {/* GRID de cartes */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className={`
                            bg-white/10 backdrop-blur-sm border border-white/10 shadow-lg rounded-xl p-4
                            transition-all duration-300 ease-in-out hover:bg-white/15 hover:shadow-xl hover:-translate-y-0.5
                            ${product.stock < product.minimum ? "text-red-600" : "text-gray-800"}
                            max-w-[260px] w-full
                            aspect-square
                        `}
                    >
                        <div className="h-full flex flex-col justify-between">
                            {/* Haut */}
                            <div>
                                <div className="font-semibold text-lg truncate">{product.name}</div>

                                <div className="mt-2 text-sm">
                                    Stock: <span className="font-medium">{product.stock}</span>{" "}
                                    <span className="opacity-70">(Min: {product.minimum})</span>
                                </div>

                                {product.stock < product.minimum && (
                                    <div className="mt-3 text-orange-500 font-bold">
                                        ⚠️ ALERTE
                                    </div>
                                )}
                            </div>

                            {/* Bas : actions */}
                            <div className="mt-4 flex gap-2 justify-end">
                                <button
                                    className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                                    onClick={() => setEditingProduct(product)}
                                    title="Modifier"
                                >
                                    ✏️
                                </button>
                                <button
                                    className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                                    onClick={() => handleDelete(product.id)}
                                    title="Supprimer"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;