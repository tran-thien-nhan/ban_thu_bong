import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import Home from './components/Home';
import ListTrue from './components/ListTrue';
import Create from './components/Create';
import Swal from 'sweetalert2';
import Footer from './components/Footer';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://localhost:7008/api/Product/');
        setProducts(response.data);
      } catch (error) {
        console.log('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(`https://localhost:7008/api/Product/status/${id}`, {
        status: newStatus
      });

      if (response.status === 200) {
        setProducts(products.map(product =>
          product.id === id ? { ...product, status: newStatus } : product
        ));

        if (product.status === true) {
          showSuccessMessage('Activated successfully!');
        } else {
          showSuccessMessage('Deactivated successfully!');
        }
      } else {
        console.log('Failed to update product status');
      }
    } catch (error) {
      console.error('Error updating product status', error);
    }
  };

  const showSuccessMessage = (message) => {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      timer: 1000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  };

  return (
    <div className="App">
      <Router>
        <Navbar bg="" expand="lg">
          <Navbar.Brand href="/" className='mx-2'>Shop</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/list">List</Nav.Link>
              <Nav.Link as={Link} to="/create">Create</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Routes>
          <Route path="/" element={<Home
            products={products}
            loading={loading}
            handleUpdateStatus={handleUpdateStatus} />} />
          <Route path="/list" element={<ListTrue
            products={products}
            loading={loading} />} />
          <Route path="/create" element={<Create />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
