import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <h2>Chargement...</h2>;
  }

  if (!product) {
    return <p>Produit introuvable.</p>;
  }

  return (
    <div className="detail-page">
      <div className="product-info">
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        <p><strong>Prix :</strong> {product.price} $</p>
        <p><strong>Stock :</strong> {product.stock}</p>
        <p><strong>Catégorie :</strong> {product.category}</p>

        <Link to="/" className="btn">
          Retour aux produits
        </Link>
      </div>

      <div className="product-image">
        <img src={product.thumbnail} alt={product.title} />
      </div>
    </div>
  );
}

export default ProductDetails;