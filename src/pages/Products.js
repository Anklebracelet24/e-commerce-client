import { useState, useEffect, useContext } from "react";
import ProductCard from "../components/ProductCard";
import UserView from "../components/UserView";
import AdminView from "../components/AdminView";
import UserContext from "../context/UserContext";
import ProductDetails from "../components/ProductDetails";
import ProductSearch from "../components/ProductSearch"; // Import ProductSearch component
import { useCart } from "../context/CartContext";
import Pagination from "react-bootstrap/Pagination"; // Import Pagination from react-bootstrap

export default function Products() {
  const { user } = useContext(UserContext); // Get user context to determine role (admin or user)
  const { addToCart } = useCart(); // Context to handle cart-related actions
  const [products, setProducts] = useState([]); // State to hold all products fetched from the API
  const [selectedProduct, setSelectedProduct] = useState(null); // State to hold the selected product for details view
  const [currentPage, setCurrentPage] = useState(1); // State to manage the current page
  const [totalPages, setTotalPages] = useState(1); // State to hold the total number of pages for pagination

  const productsPerPage = 9; // Number of products to display per page

  // Fetch products based on the user's role (admin or user)
  const fetchData = () => {
    const fetchUrl =
      user.isAdmin === true
        ? `${process.env.REACT_APP_API_BASE_URL}/products/all` // Admin fetches all products
        : `${process.env.REACT_APP_API_BASE_URL}/products/active`; // User fetches only active products

    // Make API request with authorization token
    fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Attach token for authentication
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data); // Set the fetched products
          setTotalPages(Math.ceil(data.length / productsPerPage)); // Calculate and set the total number of pages
        } else {
          console.error("Fetched data is not an array:", data);
          setProducts([]); // Reset products on error
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setProducts([]); // Reset products on error
      });
  };

  // Fetch products once the user context is available
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // Handle selecting a product to display its details in a modal
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  // Close the product details modal
  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  // Update the products list based on search results
  const handleSearchResults = (searchResults) => {
    setProducts(searchResults);
  };

  // Calculate the index of the first and last product for the current page
  const indexOfLastProduct = currentPage * productsPerPage; // Index of the last product on the current page
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage; // Index of the first product on the current page

  // Slice the products array to display only the products for the current page
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Update the current page when a page number is clicked
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate an array of page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers(); // Get the array of page numbers

  // Create Pagination items dynamically
  const paginationItems = pageNumbers.map((number) => (
    <Pagination.Item
      key={number}
      active={number === currentPage} // Highlight the current page
      onClick={() => paginate(number)} // Navigate to the selected page
    >
      {number}
    </Pagination.Item>
  ));

  return (
    <>
      {/* Conditionally render the search bar for non-admin users */}
      {!user.isAdmin && <ProductSearch onSearchResults={handleSearchResults} />}

      {/* Render either AdminView or UserView based on user role */}
      {user.isAdmin ? (
        <AdminView
          productsData={currentProducts} // Pass the current page's products
          fetchData={fetchData} // Provide fetchData to refresh products
        />
      ) : (
        <UserView
          productsData={currentProducts} // Pass the current page's products
          handleProductSelect={handleProductSelect} // Handle product selection
        />
      )}

      {/* Render the product details modal if a product is selected */}
      {selectedProduct && (
        <ProductDetails product={selectedProduct} onClose={handleCloseModal} />
      )}

      {/* Pagination Controls */}
      <div className="pagination-wrapper">
        <Pagination>
          <Pagination.First
            disabled={currentPage === 1} // Disable if already on the first page
            onClick={() => paginate(1)} // Navigate to the first page
          />
          <Pagination.Prev
            disabled={currentPage === 1} // Disable if already on the first page
            onClick={() => paginate(currentPage - 1)} // Navigate to the previous page
          />
          {paginationItems} {/* Render the pagination items */}
          <Pagination.Next
            disabled={currentPage === totalPages} // Disable if already on the last page
            onClick={() => paginate(currentPage + 1)} // Navigate to the next page
          />
          <Pagination.Last
            disabled={currentPage === totalPages} // Disable if already on the last page
            onClick={() => paginate(totalPages)} // Navigate to the last page
          />
        </Pagination>
      </div>
    </>
  );
}
