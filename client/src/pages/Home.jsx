import React, { useState, useEffect } from "react";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        console.log("Fetched Products:", data); // Log data to check what is fetched
        setProducts(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProducts();
  }, []);

  if (products.length === 0) {
    return <p>No products available.</p>;
  }

  return (
    <div>
      <h1>Home Page</h1>
      {products.map(product => (
        <div key={product._id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>Price: ${product.price?.toFixed(2) || 'N/A'}</p>
          <p>Category: {product.category}</p>
          <img src={product.imageUrl} alt={product.name} style={{ width: '100px' }} />
          <p>Stock: {product.stockQuantity}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;
