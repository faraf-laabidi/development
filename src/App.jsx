import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    
    const savedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setHistory(savedHistory);

  
    fetch('https://dummyjson.com/products/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log(err));

    fetch('https://dummyjson.com/products')
      .then((res) => res.json())
      .then((data) => {
        const apiProducts = data.products;
        const localAddedProducts = JSON.parse(localStorage.getItem('addedProducts')) || [];
        setProducts([...localAddedProducts, ...apiProducts]);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setLoading(true);

    const url = category === 'all' 
      ? 'https://dummyjson.com/products' 
      : `https://dummyjson.com/products/category/${category}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const apiProducts = data.products;
        const localAddedProducts = JSON.parse(localStorage.getItem('addedProducts')) || [];
      
        if (category === 'all') {
          setProducts([...localAddedProducts, ...apiProducts]);
        } else {
          setProducts(apiProducts);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const updatedHistory = [
      searchTerm,
      ...history.filter((item) => item.toLowerCase() !== searchTerm.toLowerCase())
    ].slice(0, 5);

    setHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    setShowHistory(false);
  };

  const deleteHistoryItem = (itemToDelete) => {
    const updatedHistory = history.filter((item) => item !== itemToDelete);
    setHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  const handleDeleteLocalProduct = (id) => {
    const localAddedProducts = JSON.parse(localStorage.getItem('addedProducts')) || [];
    const updatedLocalProducts = localAddedProducts.filter((product) => product.id !== id);
    localStorage.setItem('addedProducts', JSON.stringify(updatedLocalProducts));
    setProducts(products.filter((product) => product.id !== id));
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && products.length === 0) {
    return <h2>Chargement...</h2>;
  }

  return (
    <div className="container">
      <h1>Liste des articles</h1>

      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <Link to="/add-product" className="btn" style={{ backgroundColor: 'green', textDecoration: 'none', padding: '10px 20px', borderRadius: '6px', color: 'white' }}>
          + Ajouter un produit
        </Link>

     
        <select 
          value={selectedCategory} 
          onChange={(e) => handleCategoryChange(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '15px', cursor: 'pointer' }}
        >
          <option value="all">Toutes les catégories</option>
          {categories.map((cat, index) => {
            
            const catName = typeof cat === 'string' ? cat : cat.slug;
            const catTitle = typeof cat === 'string' ? cat : cat.name;
            return (
              <option key={index} value={catName}>
                {catTitle}
              </option>
            );
          })}
        </select>
      </div>

      
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onFocus={() => setShowHistory(true)}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn-search">Rechercher</button>
        </form>

        {showHistory && history.length > 0 && (
          <ul className="history-list">
            <li className="history-header">Recherches récentes :</li>
            {history.map((item, index) => (
              <li key={index} className="history-item">
                <span onClick={() => { setSearchTerm(item); setShowHistory(false); }}>
                  🕒 {item}
                </span>
                <button className="delete-btn" onClick={() => deleteHistoryItem(item)}>✕</button>
              </li>
            ))}
          </ul>
        )}
      </div>


      <div className="products">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="product" key={product.id}>
              <img src={product.thumbnail} alt={product.title} />

              <div className="details">
                <h2>{product.title}</h2>
                <p>Prix : {product.price} $</p>
                <p>Stock : {product.stock || 10}</p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Link to={`/product/${product.id}`} className="btn">
                    Détails
                  </Link>

                  <button 
                    onClick={() => handleDeleteLocalProduct(product.id)}
                    style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '10px 14px', borderRadius: '5px', cursor: 'pointer', marginTop: '8px', fontWeight: 'bold' }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-result">Aucun produit trouvé.</p>
        )}
      </div>
    </div>
  );
}

export default App;