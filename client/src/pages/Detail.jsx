// Import necessary libraries and components
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import Cart from '../components/Cart';
import { QUERY_PRODUCTS } from '../utils/queries';
import { idbPromise } from '../utils/helpers';
import { updateProducts } from '../store/slices/productSlice';
import { addToCart, removeFromCart, updateCartQuantity } from '../store/slices/cartSlice';
import spinner from '../assets/spinner.gif';

function Detail() {
  // Redux dispatch hook for updating state
  const dispatch = useDispatch();
  
  // Retrieve the product ID from URL parameters
  const { id } = useParams();

  // Local state to manage the currently viewed product
  const [currentProduct, setCurrentProduct] = useState({});
  
  // Access Redux store state for products and cart
  const { products } = useSelector(state => state.products);
  const { cart } = useSelector(state => state.cart);
  
  // Apollo query to fetch product data
  const { loading, data } = useQuery(QUERY_PRODUCTS);

  // useEffect to handle product data loading and state updates
  useEffect(() => {
    // Check if products are already loaded in the Redux store
    if (products.length) {
      setCurrentProduct(products.find(product => product._id === id));
    } 
    // If data is fetched from the server, update Redux store and IndexedDB
    else if (data) {
      dispatch(updateProducts(data.products));
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    }
  }, [products, data, loading, dispatch, id]);

  // Handle adding the current product to the cart
  const handleAddToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);
    if (itemInCart) {
      dispatch(updateCartQuantity({
        _id: id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      }));
    } else {
      dispatch(addToCart({ ...currentProduct, purchaseQuantity: 1 }));
    }
  };

  // Handle removing the current product from the cart
  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(currentProduct._id));
  };

  return (
    <>
      {/* Render product details if available */}
      {currentProduct && cart ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button onClick={handleAddToCart}>Add to Cart</button>
            <button
              disabled={!cart.find((p) => p._id === currentProduct._id)}
              onClick={handleRemoveFromCart}
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      
      {/* Display loading spinner if data is being fetched */}
      {loading ? <img src={spinner} alt="loading" /> : null}
      
      {/* Render the Cart component */}
      <Cart />
    </>
  );
}

export default Detail;
