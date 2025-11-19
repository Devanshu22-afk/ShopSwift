import API from '../axios';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice }) => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [validated, setValidated] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      const token = localStorage.getItem("token");
      
      if (isAuthenticated !== "true" || !token) {
        setToastVariant('danger');
        setToastMessage('Please login to checkout.');
        setShowToast(true);
        return;
      }

      try {
        const response = await API.get('/user/current');
        if (response.data && response.data.username) {
          setUserData(response.data);
        } else {
          setToastVariant('warning');
          setToastMessage('Unable to fetch user information.');
          setShowToast(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setToastVariant('danger');
          setToastMessage('Session expired. Please login again.');
          setShowToast(true);
          // Clear invalid auth state
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          localStorage.removeItem("role");
        } else {
          setToastVariant('warning');
          setToastMessage('Unable to load user information. Please try again.');
          setShowToast(true);
        }
      }
    };

    if (show) {
      fetchUserData();
    }
  }, [show]);

  const handleConfirm = async (event) => {
    event.preventDefault();

    if (!userData || !userData.username || !userData.email) {
      setToastVariant('danger');
      setToastMessage('Unable to fetch user information. Please login again.');
      setShowToast(true);
      return;
    }

    setValidated(true);
    setIsSubmitting(true);

    const orderItems = cartItems.map(item => ({
      productId: item.id,
      quantity: item.quantity
    }));

    const data = {
      customerName: "",
      email: "",
      items: orderItems
    };

    try {
      const response = await API.post('/place', data);
      console.log(response, 'order placed');

      // Show success notification
      setToastVariant('success');
      setToastMessage('Order placed successfully!');
      setShowToast(true);

      // Clear cart and redirect after a short delay
      localStorage.removeItem('cart');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error("Error placing order:", error);
      setToastVariant('danger');
      setToastMessage('Failed to place order. Please try again.');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  const convertBase64ToDataURL = (base64String, mimeType = 'image/jpeg') => {
    if (!base64String) return "/fallback-image.jpg"; // Return fallback image if no data

    // If it's already a data URL, return as is
    if (base64String.startsWith('data:')) {
      return base64String;
    }

    // If it's already a URL, return as is
    if (base64String.startsWith('http')) {
      return base64String;
    }

    // Convert base64 string to data URL
    return `data:${mimeType};base64,${base64String}`;
  };
  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Checkout</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleConfirm}>
          <Modal.Body>
            <div className="checkout-items mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="d-flex mb-3 border-bottom pb-3">
                  <img
                    src={convertBase64ToDataURL(item.imageData)}
                    alt={item.name}
                    className="me-3 rounded"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.name}</h6>
                    <p className="mb-1 small">Quantity: {item.quantity}</p>
                    <p className="mb-0 small">Price: ₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}

              <div className="text-center my-4">
                <h5 className="fw-bold">Total: ₹{totalPrice.toFixed(2)}</h5>
              </div>

              {userData && (
                <div className="mb-3 p-3 bg-light rounded">
                  <h6 className="mb-2">Order Details:</h6>
                  <p className="mb-1"><strong>Name:</strong> {userData.username}</p>
                  <p className="mb-0"><strong>Email:</strong> {userData.email}</p>
                </div>
              )}

              {!userData && (
                <div className="mb-3">
                  <Alert variant="warning">
                    Loading user information...
                  </Alert>
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
              Close
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : 'Confirm Purchase'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Toast notification */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1070 }}>
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header closeButton>
            <strong className="me-auto">Order Status</strong>
          </Toast.Header>
          <Toast.Body className={toastVariant === 'success' ? 'text-white' : ''}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default CheckoutPopup;