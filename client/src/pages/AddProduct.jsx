import ProductForm from "../components/ProductForm";

function AddProduct({ onProductCreated, onShowToast }) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Ajouter un produit: </h2>
            <ProductForm
                onProductCreated={onProductCreated}
                onShowToast={onShowToast} />
        </div>
    );
}

export default AddProduct;