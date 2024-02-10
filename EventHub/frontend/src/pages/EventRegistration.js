import React, { useState } from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const EventRegistration = () => {
  
  const { eventId, fees, days } = useParams();

  const [user, setUser] = useState({
    name: '',
    email: '',
    contactNo: '',
    numberOfDays: days,
  });

  const [qrCode, setQrCode] = useState(null);

  const handleChange = (e,name) => {
    setUser({
      ...user,
      [name]: e.target.value,
    });
  }

  const userLogin = useSelector((state) => (state.userLogin));
  const userInfo = userLogin.userInfo;

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };

  const generateQrCode = async() => {
    try {
      const response = await axios.post('/api/generateQR',{ user, eventId }, config);

      // Assuming the backend returns a 'qrCode' property in the response
      setQrCode(response.data.qrCode);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // const rzp = new window.Razorpay({
    //   key_id: "rzp_test_6Ce9fqNWqfpRhN", // Replace with your Razorpay key id
    //   amount: fees * 100, // Amount in paise (convert rupees to paise)
    //   currency: 'INR',
    //   name: 'Event Registration',
    //   description: 'Event Registration Fee',
    //   image: 'YOUR_LOGO_URL', // Replace with your logo URL
    //   handler: async (response) => {
    //     // This function will be called after a successful payment
    //     console.log(response);

        // Now, you can store the user data and payment details in your backend
        // const paymentData = {
        //   user: user,
        //   paymentDetails: response,
        // };

        // Send paymentData to your server for further processing and storage
        // try {
        //   const serverResponse = await fetch('/api/payment', {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(paymentData),
        //   });

        //   const serverResponseData = await serverResponse.json();
        //   console.log(serverResponseData);

        //   // Handle the server response as needed
        //   // For example, redirect to a thank you page
        // } catch (error) {
        //   console.error('Error sending payment data to server:', error);
        // }
    //   },
    // });

    // // Open Razorpay payment modal
    // rzp.open();

    const options = {
      key:  "rzp_test_6Ce9fqNWqfpRhN", 
      amount: fees*100, 
      currency: "INR",
      "upi_link": "true",
      name: "Event Registration",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      // order_id: data.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      callback_url: "http://localhost:5000/api/payment",
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.contactNo,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc"
      },
      handler: async (response) => {
            // This function will be called after a successful payment
            console.log(response);
    
            //Now, you can store the user data and payment details in your backend
            const paymentData = {
              user: user,
              paymentDetails: response,
              eventId: eventId,
            };
    
            //Send paymentData to your server for further processing and storage
        
            try {
              const serverResponse = await fetch('/api/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify(paymentData),
              });
              const serverResponseData = await serverResponse.json();
              console.log(serverResponseData);
    
              generateQrCode();
              // Handle the server response as needed
              // For example, redirect to a thank you page
            } catch (error) {
              console.error('Error sending payment data to server:', error);
            }

          },
    };
    const razor = new window.Razorpay(options);
    razor.open();
  }
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold mb-6 text-center">Register</h1>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" htmlFor="name">
            Name:
          </label>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            type="text"
            id="name"
            name="name"
            value = {user.name}
            onChange = {(e) => {handleChange(e,"name")}}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" htmlFor="email">
            Email:
          </label>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange = {(e) => {handleChange(e,"email")}}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" htmlFor="contactNo">
            Contact No:
          </label>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            type="number"
            id="contactNo"
            name="contactNo"
            value = {user.contactNo}
            onChange = {(e) => {handleChange(e,"contactNo")}}
            required
          />
        </div>
        <button
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
          type="submit"
        >
          Submit
        </button>
        {qrCode && (
        <div>
          <h3>QR Code</h3>
          <img src={qrCode} alt="QR Code" />
        </div>
      )}
      </form>
    </div>
  );
};

export default EventRegistration;