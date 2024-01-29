import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap";

function Create(props) {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState([]);
  const [file, setFile] = useState(null);
  console.log("file", file);

  function handleChangeInput(e) {
    let { name, value } = e.target;
    if (name === "status") {
      value = e.target.checked ? false : true;
    }

    if (name === "price") {
      value = Number(value);
    }
    setProduct({ ...product, [name]: value });
  }
  console.log("product", product);

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("status", product.status);
    formData.append("file", file);

    axios
      .post("https://localhost:7008/api/Product/", formData)
      .then((res) => {
        if (res.status === 201) {
          setProducts((prevProducts) => [...prevProducts, res.data.data]);
          setProduct({ name: "", price: "" });
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Product added successfully!",
          });
          setTimeout(() => {
            Swal.close(); // Close the SweetAlert2 message
          }, 1000);
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="container">
      <h1 className="display-4">Create Product</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group>
          <Form.Label htmlFor="name">Name:</Form.Label>
          <Form.Control
            type="text"
            className="form-control"
            name="name"
            id="name"
            value={product.name}
            onChange={handleChangeInput}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="price">Price:</Form.Label>
          <Form.Control
            type="number"
            className="form-control"
            name="price"
            id="price"
            value={product.price}
            onChange={handleChangeInput}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="status">Status:</Form.Label>
          <Form.Control
            type="checkbox"
            className="form-check-input"
            name="status"
            id="status"
            unchecked={!product.status}
            onChange={handleChangeInput}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="image">Image:</Form.Label>
          <Form.Control
            type="file"
            className="form-control-file"
            name="image"
            id="image"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="Product"
              style={{ marginTop: "10px", maxWidth: "100px" }}
            />
          )}
        </Form.Group>
        <button type="submit" className="btn btn-primary my-2">
          Create Product
        </button>
      </form>
    </div>
  );
}

export default Create;
