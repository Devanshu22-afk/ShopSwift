import React, { useState, useEffect } from "react";
import API from "../axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: false,
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = localStorage.getItem("isAuthenticated");
      const token = localStorage.getItem("token");
      
      if (authStatus !== "true" || !token) {
        toast.error("Please login to access this page");
        navigate("/");
        return;
      }

      try {
        const response = await API.get('/user/current');
        if (response.data && response.data.role) {
          setUserRole(response.data.role);
          setIsAuthenticated(true);
          if (response.data.role !== "ADMIN") {
            toast.error("Only administrators can add products");
            navigate("/");
          }
        } else {
          toast.error("Unable to verify user role");
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("role");
          navigate("/");
        } else {
          const storedRole = localStorage.getItem("role");
          if (storedRole === "ADMIN") {
            setUserRole(storedRole);
            setIsAuthenticated(true);
          } else {
            toast.error("Please login as administrator");
            navigate("/");
          }
        }
      }
    };

    checkAuth();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setProduct({ ...product, [name]: fieldValue });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setErrors({
          ...errors,
          image: "Please select a valid image file (JPEG or PNG)",
        });
      } else if (file.size > 10 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size should be less than 10MB" });
      } else {
        setErrors({ ...errors, image: null });
      }
    } else {
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!product.name.trim()) newErrors.name = "Product name is required";
    if (!product.brand.trim()) newErrors.brand = "Brand is required";
    if (!product.description.trim())
      newErrors.description = "Description is required";
    if (!product.price || parseFloat(product.price) <= 0)
      newErrors.price = "Price must be greater than zero";
    if (!product.category) newErrors.category = "Please select a category";
    if (!product.stockQuantity || parseInt(product.stockQuantity) < 0)
      newErrors.stockQuantity = "Stock quantity cannot be negative";
    if (!product.releaseDate)
      newErrors.releaseDate = "Release date is required";
    if (!image) newErrors.image = "Product image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    if (!validateForm() || !form.checkValidity()) {
      event.stopPropagation();
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    API
      .post("/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        toast.success("Product added successfully");
        setProduct({
          name: "",
          brand: "",
          description: "",
          price: "",
          category: "",
          stockQuantity: "",
          releaseDate: "",
          productAvailable: false,
        });
        setImage(null);
        setImagePreview(null);
        setValidated(false);
        setErrors({});
        navigate("/");
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        if (error.response) {
          const status = error.response.status;
          if (status === 413) {
            toast.error("Image file is too large. Please use an image smaller than 10MB.");
            setErrors({ ...errors, image: "Image file is too large. Maximum size is 10MB." });
          } else if (status === 401 || status === 403) {
            toast.error("Access denied. Please login as administrator.");
            localStorage.removeItem("token");
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("role");
            navigate("/");
          } else if (error.response.data) {
            const errorMessage = typeof error.response.data === 'string' 
              ? error.response.data 
              : (error.response.data.message || "Unknown error");
            setErrors(error.response.data);
            toast.error("Error adding product: " + errorMessage);
          } else {
            toast.error(`Error adding product (Status: ${status}). Please try again.`);
          }
        } else if (error.request) {
          toast.error("Unable to connect to server. Please check your connection.");
        } else {
          toast.error("Error adding product. Please check your connection and try again.");
        }
        setLoading(false);
      });
  };

  if (!isAuthenticated || userRole !== "ADMIN") {
    return (
      <div className="container mt-5 pt-5">
        <div className="text-center">
          <h4>Access Denied</h4>
          <p>Only administrators can add products.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-4">
      <form noValidate onSubmit={submitHandler} className="row g-4">
        <div className="col-md-6">
          <label>Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={product.name}
            onChange={handleInputChange}
          />
          {errors.name && <div className="text-danger">{errors.name}</div>}
        </div>

        <div className="col-md-6">
          <label>Brand</label>
          <input
            type="text"
            name="brand"
            className="form-control"
            value={product.brand}
            onChange={handleInputChange}
          />
          {errors.brand && <div className="text-danger">{errors.brand}</div>}
        </div>

        <div className="col-md-12">
          <label>Description</label>
          <textarea
            name="description"
            className="form-control"
            value={product.description}
            onChange={handleInputChange}
          />
          {errors.description && (
            <div className="text-danger">{errors.description}</div>
          )}
        </div>

        <div className="col-md-4">
          <label>Price</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={product.price}
            onChange={handleInputChange}
          />
          {errors.price && <div className="text-danger">{errors.price}</div>}
        </div>

        <div className="col-md-4">
          <label>Category</label>
          <select
            className="form-select"
            value={product.category}
            onChange={handleInputChange}
            name="category"
            id="category"
          >
            <option value="">Select category</option>
            <option value="Laptop">Laptop</option>
            <option value="Headphone">Headphone</option>
            <option value="Mobile">Mobile</option>
            <option value="Electronics">Electronics</option>
            <option value="Toys">Toys</option>
            <option value="Fashion">Fashion</option>
          </select>
          {errors.category && (
            <div className="text-danger">{errors.category}</div>
          )}
        </div>

        <div className="col-md-4">
          <label>Stock Quantity</label>
          <input
            type="number"
            name="stockQuantity"
            className="form-control"
            value={product.stockQuantity}
            onChange={handleInputChange}
          />
          {errors.stockQuantity && (
            <div className="text-danger">{errors.stockQuantity}</div>
          )}
        </div>

        <div className="col-md-6">
          <label>Release Date</label>
          <input
            type="date"
            name="releaseDate"
            className="form-control"
            value={product.releaseDate}
            onChange={handleInputChange}
          />
          {errors.releaseDate && (
            <div className="text-danger">{errors.releaseDate}</div>
          )}
        </div>

        <div className="col-md-6 d-flex align-items-center">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="productAvailable"
              checked={product.productAvailable}
              onChange={handleInputChange}
            />
            <label className="form-check-label">Product Available</label>
          </div>
        </div>

        <div className="col-md-12">
          <label>Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
          />
          {errors.image && <div className="text-danger">{errors.image}</div>}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: "150px", marginTop: "10px" }}
            />
          )}
        </div>

        <div className="col-12 text-center">
          <button type="submit" className="btn btn-primary">
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
