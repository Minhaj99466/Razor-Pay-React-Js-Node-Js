import React, { useState } from "react";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";

const PaymentComponent = () => {
  const { error, isLoading, Razorpay } = useRazorpay();
  const [orderId, setOrderId] = useState(null);

  // Request Order ID from Backend
  const createOrder = async (amount) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_RAZORPAY_BASE_URL}/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const order = await response.json();
      setOrderId(order.id); // Store the order_id for Razorpay
    } catch (err) {
      console.error("Error creating order:", err);
    }
  };

  const handlePayment = () => {
    if (!orderId) return;

    const options: RazorpayOrderOptions = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: 50000, // Amount in paise
      currency: "INR",
      name: "Minhaj.Tech",
      description: "Payement for the services provided",
      order_id: orderId, // Use the order_id received from backend
      handler: (response) => {
        // Send payment details to the backend for verification
        verifyPayment(response);
      },
      prefill: {
        name: "Minhaj",
        email: "Minhaj99466@gmail.com",
        contact: "9946631792",
      },
      theme: {
        color: "#F37254",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  };

  const verifyPayment = async (paymentData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_RAZORPAY_BASE_URL}/verify-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_signature: paymentData.razorpay_signature,
        }),
      });

      const data = await response.json();
      if (data.message === "Payment verified successfully") {
        alert("Payment Successful!");
      } else {
        alert("Payment verification failed!");
      }
    } catch (err) {
      console.error("Error verifying payment:", err);
    }
  };

  return (
    <div>
      <h1>Payment Page</h1>
      {isLoading && <p>Loading Razorpay...</p>}
      {error && <p>Error loading Razorpay: {error}</p>}
      <button onClick={() => createOrder(50000)} disabled={isLoading}>
        Create Order
      </button>
      <button onClick={handlePayment} disabled={isLoading || !orderId}>
        Pay Now
      </button>
    </div>
  );
};

export default PaymentComponent;
