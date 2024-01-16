import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';

function ListTrue({ loading }) {
    const [products, setProducts] = useState([]);
    const [min, setMin] = useState('');
    const [max, setMax] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [originalProducts, setOriginalProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(4);

    useEffect(() => {
        fetch('https://localhost:7008/api/Product/status')
            .then(response => response.json())
            .then(data => {
                setProducts(data);
                setOriginalProducts(data);
            })
            .catch(error => console.log(error));
    }, []);

    const filteredProducts = products.filter(product => {
        if (min && max) {
            return product.status === true && product.price >= min && product.price <= max && product.name.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (min) {
            return product.status === true && product.price >= min && product.name.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (max) {
            return product.status === true && product.price <= max && product.name.toLowerCase().includes(searchTerm.toLowerCase());
        } else {
            return product.status === true && product.name.toLowerCase().includes(searchTerm.toLowerCase());
        }
    });

    const sortedProducts = filteredProducts.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.price - b.price;
        } else if (sortOrder === 'desc') {
            return b.price - a.price;
        } else {
            return a.id - b.id;
        }
    });

    const handleSortAsc = () => {
        setSortOrder('asc');
    };

    const handleSortDesc = () => {
        setSortOrder('desc');
    };

    const handleReset = () => {
        setProducts(originalProducts);
        setMin('');
        setMax('');
        setSearchTerm('');
        setSortOrder('');
    };

    const handlePriceRange100to200 = () => {
        setMin(100);
        setMax(200);
    };

    const handlePriceRange200to300 = () => {
        setMin(200);
        setMax(300);
    };

    const handlePriceRange300to400 = () => {
        setMin(300);
        setMax(400);
    };

    const handleAddCart = () => {
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Add to cart successfully!',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
        });
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <div>
            <div className="container">
                <img
                    className="d-block w-100"
                    src="https://i.redd.it/rimmw0teson51.jpg"
                    alt=""
                />
            </div>
            <div className="container my-2">
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdownMenuButton">
                        Setting
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <div className="col-md-12 px-2">
                            <div className="form-group">
                                <label htmlFor="min">Min:</label>
                                <input type="number" className="form-control" name="min" id="min" placeholder='nhập min value' value={min} onChange={(e) => setMin(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-12 px-2">
                            <div className="form-group">
                                <label htmlFor="max">Max:</label>
                                <input type="number" className="form-control" name="max" id="max" placeholder='nhập max value' value={max} onChange={(e) => setMax(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-12 px-2">
                            <div className="form-group">
                                <label htmlFor="search">Search:</label>
                                <input type="text" className="form-control" name="search" id="search" placeholder='tìm kiếm ...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                        </div>
                        <div className="d-flex col-12 my-2">
                            <button className="btn btn-primary mx-2" onClick={handleSortAsc}>giá tăng dần</button>
                            <button className="btn btn-primary" onClick={handleSortDesc}>giá giảm dần</button>
                        </div>
                        <div className="d-flex col-12 my-2">
                            <button className="btn btn-success mx-2" onClick={handlePriceRange100to200}>100$-200$</button>
                            <button className="btn btn-success mx-2" onClick={handlePriceRange200to300}>200$-300$</button>
                            <button className="btn btn-success mx-2" onClick={handlePriceRange300to400}>300$-400$</button>
                        </div>
                        <button className="btn btn-secondary mx-2" onClick={handleReset}>Reset</button>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <br />
            <div className="container">
                <div className="row justify-content-center">
                    {currentProducts.map(product => (
                        <div className="col-md-3" key={product.id}>
                            <div className="card mb-4">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="card-img-top"
                                    style={{ filter: 'brightness(100%)', transition: 'filter 0.3s', cursor: 'pointer' }}
                                    onMouseOver={(e) => e.target.style.filter = 'brightness(70%)'}
                                    onMouseOut={(e) => e.target.style.filter = 'brightness(100%)'}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text">Price: {product.price}$</p>
                                </div>
                                <div className="card-footer text-center">
                                    <button className="btn btn-warning" onClick={handleAddCart}>Add to cart</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="pagination justify-content-center">
                <ul className="pagination">
                    {Array.from({ length: Math.ceil(sortedProducts.length / productsPerPage) }).map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => paginate(index + 1)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ListTrue;