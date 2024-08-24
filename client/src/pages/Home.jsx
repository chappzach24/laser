import React, { useState, useEffect } from "react";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched Products:', data);
        setProducts(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      {products.length > 0 ? (
        products.map(product => (
          <div key={product._id} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px' }}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price !== undefined ? product.price.toFixed(2) : 'N/A'}</p>
            <p>Category: {product.category}</p>
            {product.imageUrl && (
              <img src={product.imageUrl} alt={product.name} style={{ width: '100px' }} />
            )}
            <p>Stock: {product.stockQuantity}</p>
          </div>
        ))
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
};

export default Home;
