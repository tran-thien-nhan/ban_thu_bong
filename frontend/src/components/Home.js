import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

function Home({ products, loading, handleUpdateStatus }) {
    const [productList, setProductList] = useState(products);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [product, setProduct] = useState({ name: '', price: 0, status: false, image: null });
    const [showAll, setShowAll] = useState(true);
    const [showAvailable, setShowAvailable] = useState(false);
    const [showNotAvailable, setShowNotAvailable] = useState(false);
    const [availableCount, setAvailableCount] = useState(0);
    const [notAvailableCount, setNotAvailableCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchIdTerm, setSearchIdTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(3);
    const [showModal, setShowModal] = useState(false);
    const [updateProductId, setUpdateProductId] = useState(null);
    const [updateProductName, setUpdateProductName] = useState('');
    const [updateProductPrice, setUpdateProductPrice] = useState(0);
    const [currentProduct, setCurrentProduct] = useState(product);
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (showAll) {
            setFilteredProducts(products);
        } else if (showAvailable) {
            setFilteredProducts(products.filter(item => item.status));
        } else if (showNotAvailable) {
            setFilteredProducts(products.filter(item => !item.status));
        }
        setAvailableCount(products.filter(item => item.status).length);
        setNotAvailableCount(products.filter(item => !item.status).length);
    }, [products, showAll, showAvailable, showNotAvailable]);

    useEffect(() => {
        const searchResults = products.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredProducts(searchResults);
    }, [searchTerm]);

    useEffect(() => {
        const searchResults = products.filter(item => item.id.toString().includes(searchIdTerm));
        setFilteredProducts(searchResults);
    }, [searchIdTerm]);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    // Pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const handleUpdateProduct = async (id) => {
        const productToUpdate = products.find(item => item.id === id);

        if (productToUpdate) {
            setUpdateProductId(id);
            setShowModal(true);
            setCurrentProduct(productToUpdate);
            setUpdateProductName(productToUpdate.name);
            setUpdateProductPrice(productToUpdate.price);
            setFile(productToUpdate.image);
        } else {
            console.error(`No product found with id: ${id}`);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setUpdateProductId(null);
        setUpdateProductName('');
        setUpdateProductPrice(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('id', updateProductId);
        formData.append('name', updateProductName);
        formData.append('price', updateProductPrice);
        formData.append('file', file);

        try {
            const res = await axios.put(`https://localhost:7008/api/Product/update/${updateProductId}`, formData);

            if (res.status === 200) {
                setProductList(prevProducts => prevProducts.map(product => product.id === updateProductId ? res.data.data : product));
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Product updated successfully!',
                }).then(() => {
                    handleCloseModal();

                    // Sử dụng Promise để đảm bảo reload đã hoàn thành trước khi tiếp tục
                    return new Promise(resolve => {
                        setTimeout(() => {
                            window.location.reload();
                            resolve();
                        }, 1000); // Đặt thời gian chờ tùy ý (ví dụ: 1000ms = 1 giây)
                    });
                });

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: res.data.data || 'Something went wrong',
                });
            }
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data) {
                // Truy cập vào thông tin lỗi từ đối tượng response
                const errorData = error.response.data;
                console.log('Error Data:', errorData);

                // Hiển thị thông báo lỗi cụ thể từ server
                //handleValidationErrors(errorData.errors);
            } else {
                // Xử lý các loại lỗi khác
                console.error('Update failed:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: 'Something went wrong. Please try again.',
                });
            }
        }
    };

    function handleValidationErrors(errors) {
        if (errors && errors.errors) {
            const errorMessages = Object.values(errors.errors).flatMap(fieldErrors => fieldErrors);
            Swal.fire({
                icon: 'error',
                title: 'Validation Errors',
                text: errorMessages.join('\n'),
            });
        } else {
            console.error('Unexpected error format:', errors);
            Swal.fire({
                icon: 'error',
                title: 'Unexpected Error',
                text: 'Please contact support.',
            });
        }
    }

    const handleSaveProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('id', updateProductId);
        formData.append('name', updateProductName);
        formData.append('price', updateProductPrice);
        formData.append('file', file);

        try {
            const res = await axios.put(`https://localhost:7008/api/Product/update/${updateProductId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.status === 200) {
                setProductList(prevProducts => [...prevProducts, res.data.data]);
                setProduct({ name: "", price: "" });
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Product updated successfully!',
                });
                setTimeout(() => {
                    Swal.close(); // Close the SweetAlert2 message
                }, 1000);
                handleCloseModal();
            }
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data) {
                // Access error information from the response object
                const errorData = error.response.data;
                console.log('Error Data:', errorData);

                // Example: Display server-side validation error message
                if (errorData.errors && errorData.errors.file) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Validation Error',
                        text: errorData.errors.file[0], // Display server-side validation error message
                    });
                } else {
                    // Handle other server-side error messages
                    console.log('Other errors:', errorData);
                }
            } else {
                // Handle other types of errors
                console.log(error);
            }
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h1 className="display-4">List Products</h1>
                    <div className="col-md-12 px-2 my-2">
                        <div className="form-group">
                            <label htmlFor="search">Search By Name:</label>
                            <input type="text" className="form-control" name="search" id="search" placeholder='tìm kiếm theo tên...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                    <div className="col-md-12 px-2 my-2">
                        <div className="form-group">
                            <label htmlFor="search">Search By Id:</label>
                            <input type="text" className="form-control" name="search" id="search" placeholder='tìm kiếm ...' value={searchIdTerm} onChange={(e) => setSearchIdTerm(e.target.value)} />
                        </div>
                    </div>
                    <div className="btn-group mb-3">
                        <button
                            className={`btn ${showAll ? 'btn-warning' : 'btn-secondary'} mx-2`}
                            onClick={() => {
                                setShowAll(true);
                                setShowAvailable(false);
                                setShowNotAvailable(false);
                            }}
                        >
                            All
                        </button>
                        <button
                            className={`btn ${showAvailable ? 'btn-warning' : 'btn-secondary'}`}
                            onClick={() => {
                                setShowAll(false);
                                setShowAvailable(true);
                                setShowNotAvailable(false);
                            }}
                        >
                            Available
                        </button>
                        <button
                            className={`mx-2 btn ${showNotAvailable ? 'btn-warning' : 'btn-secondary'}`}
                            onClick={() => {
                                setShowAll(false);
                                setShowAvailable(false);
                                setShowNotAvailable(true);
                            }}
                        >
                            Not Available
                        </button>
                    </div>
                    <div>
                        <strong className='d-flex'>
                            <p className={`badge ${showAvailable ? 'bg-danger' : 'bg-dark'} mx-2`}>Available : {availableCount}</p>
                            <p className={`badge ${showNotAvailable ? 'bg-danger' : 'bg-dark'} mx-2`}>Not Available : {notAvailableCount}</p>
                        </strong>
                    </div>
                    <table className="table">
                        <thead className="thead-dark">
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Image</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody className='table-striped table-hover'>
                            {currentProducts.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.price}</td>
                                    <td>{item.status ? 'Available' : 'Not Available'}</td>
                                    <td><img src={item.image} alt={item.name} width={100} className='img-thumbnail' /></td>
                                    <td>
                                        <div className="btn-group">
                                            <button
                                                className={`btn ${item.status ? 'btn-danger' : 'btn-success  '}`}
                                                onClick={() => handleUpdateStatus(item.id, !item.status)}
                                            >
                                                {item.status ? <FaTimes /> : <FaCheck />}
                                            </button>
                                            <button
                                                className="btn btn-primary mx-2"
                                                onClick={() => handleUpdateProduct(item.id)}
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <nav>
                        <ul className="pagination">
                            {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }).map((_, index) => (
                                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => paginate(index + 1)}>
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Update Product</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSubmit} encType='multipart/form-data'>
                                <Form.Group>
                                    <Form.Label htmlFor="formProductName">Product ID</Form.Label>
                                    <Form.Control type="number" id="formProductName" placeholder="Enter product id" value={updateProductId} onChange={(e) => setUpdateProductId(e.target.value)} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label htmlFor="formProductName">Product Name</Form.Label>
                                    <Form.Control type="text" id="formProductName" placeholder="Enter product name" value={updateProductName} onChange={(e) => setUpdateProductName(e.target.value)} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label htmlFor="formProductPrice">Product Price</Form.Label>
                                    <Form.Control type="number" id="formProductPrice" placeholder="Enter product price" value={updateProductPrice} onChange={(e) => setUpdateProductPrice(e.target.value)} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label htmlFor="formProductImage">Product Image</Form.Label>
                                    <Form.Control type="file" className="form-control-file" name="image" id="formProductImage" onChange={e => setFile(e.target.files[0])} />
                                    {currentProduct && currentProduct.image && (
                                        typeof currentProduct.image === 'string'
                                            ? <img src={currentProduct.image} alt={currentProduct.name} width={100} className='img-thumbnail my-2' />
                                            : <img src={URL.createObjectURL(currentProduct.image)} alt={currentProduct.name} width={100} className='img-thumbnail my-2' />
                                    )}
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                            <Button onClick={handleSaveProduct}>Update</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default Home;
