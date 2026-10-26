import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function AddProduct() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !price) {
      alert('merci de remplir tous les chqmps');
      return;
    }

   
    fetch('https://dummyjson.com/products/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title,
        price: parseFloat(price),
        description: description,
        thumbnail: thumbnail ? thumbnail : 'https://via.placeholder.com/150'
      })
    })
      .then((res) => res.json())
      .then((newProduct) => {
        const productWithId = {
          ...newProduct,
          id: Date.now(), 
          thumbnail: thumbnail ? thumbnail : 'https://via.placeholder.com/150'
        };

       
        const existingProducts = JSON.parse(localStorage.getItem('addedProducts')) || [];
        localStorage.setItem('addedProducts', JSON.stringify([productWithId, ...existingProducts]));

        alert('Bien, le produit est ajouté avec succès !');
        navigate('/');
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '40px' }}>
      <h1>Ajouter un nouveau produit</h1>

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '10px', border: '1px solid #ddd' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Titre :</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nom du produit"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Prix ($) :</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Prix"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Lien de l'image (URL) :</label>
          <input
            type="text"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="https://example.com/image.jpg"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Description :</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description du produit"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', height: '100px' }}
          />
        </div>

        <button type="submit" className="btn" style={{ width: '100%', padding: '12px', cursor: 'pointer', border: 'none', backgroundColor: 'blueviolet', color: 'white', borderRadius: '5px', fontWeight: 'bold' }}>
          Ajouter le produit
        </button>

        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <Link to="/" style={{ color: 'blueviolet', textDecoration: 'none' }}>
            Retour à l'accueil
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;