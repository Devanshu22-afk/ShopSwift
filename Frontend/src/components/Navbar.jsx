import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../axios";
import { toast } from "react-toastify";

const Navbar = ({ onSelectCategory }) => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };
  
  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNoProductsMessage, setShowNoProductsMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");

  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const navbarRef = useRef(null);
  
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const checkAuthStatus = async () => {
    const authStatus = localStorage.getItem("isAuthenticated");
    const storedUsername = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    
    // If authenticated but no token, user needs to login again (JWT migration)
    if (authStatus === "true" && !token) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      setIsAuthenticated(false);
      setUsername("");
      setUserRole("");
      return;
    }
    
    setIsAuthenticated(authStatus === "true" && token !== null);
    setUsername(storedUsername || "");
    
    // Initialize role from localStorage first (for immediate display)
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setUserRole(storedRole);
    }
    
    if (authStatus === "true" && storedUsername && token) {
      try {
        const response = await API.get('/user/current');
        if (response.data && response.data.role) {
          setUserRole(response.data.role);
          localStorage.setItem("role", response.data.role);
        }
      } catch (error) {
        // If 401/403, token is invalid - clear auth
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("username");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setIsAuthenticated(false);
          setUsername("");
          setUserRole("");
        } else {
          // On network error, keep stored role if available
          if (storedRole) {
            setUserRole(storedRole);
          }
        }
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setUsername("");
    setUserRole("");
    toast.success("Logged out successfully");
    navigate("/");
    setIsNavCollapsed(true);
    window.location.reload();
  };

  useEffect(() => {
    // Initialize role from localStorage on mount
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setUserRole(storedRole);
    }
    
    fetchInitialData();
    checkAuthStatus();
    // Check auth status every 30 seconds instead of every second to reduce API calls
    const interval = setInterval(checkAuthStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // 3. Add this to your useEffect or as a separate useEffect
useEffect(() => {
  // Add click event listener to close navbar when clicking outside
  const handleClickOutside = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      setIsNavCollapsed(true);
    }
  };
  
  // Add event listener to document when component mounts
  document.addEventListener("mousedown", handleClickOutside);
  
  // Clean up event listener on component unmount
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  // Initial data fetch (if needed)
  const fetchInitialData = async () => {
    // Removed unnecessary data fetch - products are fetched in Home component
  };

// 4. Add these new functions
// Toggle navbar collapse state
const handleNavbarToggle = () => {
  setIsNavCollapsed(!isNavCollapsed);
};

// Close navbar when a link is clicked
const handleLinkClick = () => {
  setIsNavCollapsed(true);
};

  // Update input value without searching
  const handleInputChange = (value) => {
    setInput(value);
  };

  // Only search when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (input.trim() === "") return;
    
    setShowNoProductsMessage(false);
    setIsLoading(true);
    setIsNavCollapsed(true);
    
    try {
      const response = await axios.get(
        `${baseUrl}/api/products/search?keyword=${input}`
      );
      setSearchResults(response.data);
      
      if (response.data.length === 0) {
        setNoResults(true);
        setShowNoProductsMessage(true);
      } else {
        // Redirect to search results page with the search data
        navigate(`/search-results`, { state: { searchData: response.data } });
      }
      
      // Search results handled
    } catch (error) {
      setShowNoProductsMessage(true);
    } finally {
      setIsLoading(false); // Hide loader when API call finishes (success or error)
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
    setIsNavCollapsed(true);
  };
  
  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];
  
  return (
    <nav className="navbar navbar-expand-lg fixed-top bg-white shadow-sm" ref={navbarRef}>
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          Devanshu's Marketplace
        </a>
        <button
  className="navbar-toggler"
  type="button"
  onClick={handleNavbarToggle}
  aria-controls="navbarSupportedContent"
  aria-expanded={!isNavCollapsed}
  aria-label="Toggle navigation"
>
  <span className="navbar-toggler-icon"></span>
</button>
        <div
          className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`}
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/" onClick={handleLinkClick}>
                Home
              </a>
            </li>
            {userRole === "ADMIN" && (
              <li className="nav-item">
                <a className="nav-link" href="/add_product" onClick={handleLinkClick}>
                  Add Product
                </a>
              </li>
            )}

            {isAuthenticated && (
              <li className="nav-item">
                <a className="nav-link" href="/orders" onClick={handleLinkClick}>
                  Orders
                </a>
              </li>
            )}
      

          </ul>
          
         
          
          <div className="d-flex align-items-center">
            <a href="/cart" className="nav-link text-dark me-3" onClick={handleLinkClick}>
              <i className="bi bi-cart me-1"></i>
              Cart
            </a>
            
            {isAuthenticated ? (
              <div className="dropdown me-3">
                <button
                  className="btn btn-outline-primary dropdown-toggle"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-1"></i>
                  {username}
                </button>
                <ul className="dropdown-menu" aria-labelledby="userDropdown">
                  <li>
                    <span className="dropdown-item-text">
                      <small className="text-muted">Logged in as: {username}</small>
                    </span>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <a href="/login" className="btn btn-outline-primary me-2" onClick={handleLinkClick}>
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Login
                </a>
                <a href="/register" className="btn btn-primary" onClick={handleLinkClick}>
                  <i className="bi bi-person-plus me-1"></i>
                  Register
                </a>
              </>
            )}
            
            <form className="d-flex ms-3" role="search" onSubmit={handleSubmit} id="searchForm">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Type to search"
                aria-label="Search"
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
              />
              {isLoading ? (
                <button
                  className="btn btn-outline-success"
                  type="button"
                  disabled
                >
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span className="visually-hidden">Loading...</span>
                </button>
              ) : (
                <button
                  className="btn btn-outline-success"
                  type="submit"
                >
                  Search
                </button>
              )}
            </form>
            
            {showNoProductsMessage && (
              <div className="alert alert-warning position-absolute mt-2" style={{ top: "100%", zIndex: 1000 }}>
                No products found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;