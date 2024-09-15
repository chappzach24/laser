import React, { useState, useEffect } from "react";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(response => response.json())
      .then(data => {
        // console.log('Fetched Products:', data);
        setProducts(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

    return (
      <div>
        
        <div className="d-flex flex-wrap"> 
          {products.length > 0 ? (
            products.map(product => (
              <div key={product._id} className="card" style={{ width: '18rem', margin: '10px' }}>
                <img 
                  className="card-img-top" 
                  src={product.imageUrl} 
                  alt={product.name} 
                  style={{ maxHeight: '180px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text">Price: ${product.price ? product.price.toFixed(2) : 'N/A'}</p>
                  {/* <p className="card-text">Stock: {product.stockQuantity}</p> */}
                  <a href="#" className="btn btn-primary">Add to Cart</a>
                </div>
              </div>
            ))
          ) : (
            <p>No products available.</p>
          )}
        </div>
      </div>
    );
  };

export default Home;
