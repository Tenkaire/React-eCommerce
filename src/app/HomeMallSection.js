"use client";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// ******************** CSS ********************
import './HomeMallSection.css';

// ******************** Components ********************
import HomeCategoryList from './HomeCategoryList';
import HomeSearchBar from './HomeSearchBar';
import SellingProductPurchaseModal from './SellingProductPurchaseModal';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Terms from './Terms';
import PrivacyPolicy from './PrivacyPolicy';
import { updateCartItems, getUser } from './db';
import productsData from './products.json';
import { APP_CONFIG, getImageURL } from './utils';

// ******************** Ant Design ********************
import { Button, Space, InputNumber, Watermark, Skeleton, Empty, Typography } from 'antd';

function SellingProduct({ product, addToCart, increaseQty, decreaseQty, cartItems, onBuyClick, loading }) {
    const cartItem = cartItems.find((item) => item.id === product.id);
    const imageURL = getImageURL(product.id);

    return (
        <div className="selling-product">
            {loading ?
                <Skeleton.Image style={{ width: 200, height: 115, marginBottom: '10px' }} loading={loading} />
                :
                <img
                    src={imageURL}
                    alt={product.name}
                    onError={(e) => { e.target.src = "https://placehold.co/150x85?text=Image+Not+Available"; }}
                    className="product-image"
                    style={{ width: 200, height: 115 }} />
            }

            <Skeleton loading={loading}>
                {/* Main Product Info */}
                <div style={{ fontSize: '18px', marginBottom: '5px' }}>{product.name}</div>

                {/* Secondary Info */}
                <div style={{ fontSize: '14px', marginBottom: '5px' }}>{product.brand}</div>
                <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                    {APP_CONFIG.currency}{product.price}
                </div>
                <div style={{ fontSize: '14px', color: '#888', marginBottom: '5px' }}>
                    Since {product.date}
                </div>
                <div style={{ fontSize: '14px', color: '#888', marginBottom: '5px' }}>
                    Sold: {product.sold}
                </div>

                {/* Button Container */}
                <div className="button-container" style={{ display: 'flex', alignItems: 'center' }}>
                    {cartItem ? (
                        <div className="quantity-controls" style={{ display: 'flex', alignItems: 'center', width: '100px' }}>
                            <Button type="primary" shape="circle" size="small" onClick={() => decreaseQty(product.id)}>-</Button>
                            <span style={{ whiteSpace: 'nowrap' }}>Qty: {cartItem.qty}</span>
                            <Button type="primary" shape="circle" size="small" onClick={() => increaseQty(product.id)}>+</Button>
                        </div>
                    ) : (
                        <Button type="primary" size="small" style={{ width: '100px' }} onClick={() => addToCart(product)}>Add to Buy</Button>
                    )}
                    <Button type="primary" size="small" style={{ width: '80px', marginLeft: '10px' }} onClick={() => onBuyClick(product)}>Buy</Button>
                </div>
            </Skeleton>
        </div>
    );
}

export default function HomeMallSection() {
    // ******************** Authentication *********************
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authenticatedUser, setAuthenticatedUser] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && authenticatedUser) {
            const fetchedItems = fetchCartItems(authenticatedUser);
            console.log("Type of fetchedItems:", typeof fetchedItems, fetchedItems);
            if (Array.isArray(fetchedItems)) {
                console.log("Fetched cart items:", fetchedItems); // Check what is returned
                setCartItems(fetchedItems);
            } else {
                setCartItems([]); // Ensure cartItems is always an array
            }
        }
    }, [isAuthenticated]);

    // Effect to update the database whenever cartItems changes
    useEffect(() => {
        if (isAuthenticated) {
            updateCartItems(authenticatedUser, cartItems).catch(error =>
                console.error("Failed to update cart items in DB:", error)
            );
        }
    }, [cartItems]);

    async function fetchCartItems(email) {
        const user = await getUser(email); // Fetch user data from the database
        return user.cartItems || [];
    }

    useEffect(() => {
        if (isAuthenticated && authenticatedUser) {
            fetchCartItems(authenticatedUser).then(fetchedCartItems => {
                setCartItems(fetchedCartItems); // Populate the cart state
            });
        }
    }, [isAuthenticated, authenticatedUser]);

    const handleLogout = () => {
        setIsAuthenticated(false);
        setAuthenticatedUser(null);
        clearCart();
        skeletonLoading(2000);
    }

    // ******************** Purchase Modal *********************
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const handleBuyClick = (product) => {
        if (isAuthenticated) {
            const existingItem = cartItems.find((item) => item.id === product.id);
            const selectedProduct = {
                ...product,
                qty: existingItem ? existingItem.qty : 1,
            };
            if (!existingItem) {
                addToCart(selectedProduct);
            }
            setSelectedProduct(selectedProduct);

            // console.log(`Product: ${selectedProduct.name} has quantity ${selectedProduct.qty}.`);
            setIsPurchaseModalOpen(true); // Open the modal
        } else {
            navigate(`/signin`);
        }
    };

    const closePurchaseModal = () => {
        setIsPurchaseModalOpen(false); // Close the modal
        removeItem(selectedProduct.id);
        setIsPurchaseModalOpen(null); // Reset selected product
    };

    const saveForLater = () => {
        // Your logic for saving the item for later
        console.log(`Saved ${selectedProduct.name} for later with quantity ${selectedProduct.qty}.`);
        setIsPurchaseModalOpen(false); // Close the modal
        setIsPurchaseModalOpen(null); // Reset selected product
    };

    // ******************* Search and Sort ********************
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("");
    const maxResults = 5;

    const filteredItems = items.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory
            ? item.category === selectedCategory
            : true;

        return searchTerm ? matchesSearch : matchesCategory;
    });

    const searchOptions = searchTerm
        ? filteredItems.length
            ? [
                ...filteredItems.slice(0, maxResults).map((item) => {
                    // Choose value based on the search term
                    const value = item.name.toLowerCase().includes(searchTerm.toLowerCase())
                        ? item.name
                        : item.brand.toLowerCase().includes(searchTerm.toLowerCase())
                            ? item.brand
                            : item.category.toLowerCase().includes(searchTerm.toLowerCase())
                                ? item.category
                                : item.name; // Fallback to item.name if no match found

                    return {
                        value,
                        label: `${item.name} - ${item.brand} (${item.category})`, // Option format
                    };
                }),
                ...(filteredItems.length > maxResults
                    ? [{ value: '…more', label: '…more' }]
                    : []),
            ]
            : [] // Empty array if no results
        : [];

    const sortedItems = [...filteredItems].sort((a, b) => {
        switch (sortOption) {
            case 'A-Z':
                return a.name.localeCompare(b.name);
            case 'Z-A':
                return b.name.localeCompare(a.name);
            case 'Best Sellers':
                return b.sold - a.sold;
            case 'Newest':
                return b.date.localeCompare(a.date);
            case 'Price: Low -> High':
                return a.price - b.price;
            case 'Price: High -> Low':
                return b.price - a.price;
            default:
                return 0;  // No sorting or clear sort
        }
    });

    // Function to handle category selection
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
        setInputPage(1);
        skeletonLoading(2000);
    };

    // Function to handle category reset
    const handleReset = () => {
        setSelectedCategory(null);
        setCurrentPage(1);
        setInputPage(1);
        skeletonLoading(2000);
    }

    // Function to handle search input
    const handleSearch = (term) => {
        setSearchTerm(term);
        skeletonLoading(2000);
    };

    // Function to handle sorting selection
    const handleSort = (sortOption) => {
        setSortOption(sortOption);
        skeletonLoading(2000);
    };

    // ******************** Selling product ********************
    // Function to handle adding items to the cart
    const addToCart = async (product) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id);
            if (existingItem) {
                // If the item already exists in the cart, increase the quantity
                return prevItems.map((item) =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            } else {
                // If it's a new item, add it to the cart with qty: 1
                return [...prevItems, { ...product, qty: 1 }];
            }
        });
    };

    // Item quantity control: increase
    const increaseQty = (id) => {
        console.log("increaseQty is called");
        const updatedCart = cartItems.map(item =>
            item.id === id ? { ...item, qty: item.qty + 1 } : item
        );
        setCartItems(updatedCart);

        // Verify the quantity of the item after being updated
        // console.log(`Updated item qty in parent:`, updatedCart.find(item => item.id === id).qty);
    };

    // Item quantity control: decrease
    const decreaseQty = (id) => {
        setCartItems((prevItems) =>
            prevItems
                .map((item) =>
                    item.id === id ? { ...item, qty: item.qty - 1 } : item
                )  // Decrease the quantity if the item matches
                .filter((item) => item.qty > 0)  // Remove items with qty 0
        );
    };

    const clearCart = () => {
        setCartItems([]);  // Set cartItems to an empty array, clearing the cart
    };

    const updateCart = (updatedItems) => {
        setCartItems(updatedItems);
    }

    const removeItem = (id) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
    };

    // ******************** Pagination Start ********************
    const [currentPage, setCurrentPage] = useState(1);
    const [inputPage, setInputPage] = useState(currentPage);

    const totalPages = Math.ceil(sortedItems.length / APP_CONFIG.itemsPerPage);
    const startIndex = (currentPage - 1) * APP_CONFIG.itemsPerPage;
    const endIndex = startIndex + APP_CONFIG.itemsPerPage;
    const paginatedItems = sortedItems.slice(startIndex, endIndex);

    useEffect(() => {
        setItems(productsData); // Load products from JSON file
    }, []);

    const handlePageInputChange = (value) => {
        const page = value === '' ? '' : Number(value);
        setInputPage(page); // Update only inputPage
    };

    const handlePageInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (inputPage === '') {
                setInputPage(currentPage);
            } else {
                handlePageChange(inputPage); // Set currentPage only on Enter key
            }
        }
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            setInputPage(pageNumber);
        } else if (pageNumber > totalPages) {
            setCurrentPage(totalPages);
            setInputPage(totalPages);
        } else {
            setCurrentPage(1);
            setInputPage(1);
        }
        skeletonLoading(2000);
    };

    // ******************** Skeleton ********************
    const [loading, setLoading] = useState(false);

    const skeletonLoading = (time) => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), time); // Simulates loading delay
        return () => clearTimeout(timer);
    }

    useEffect(() => {
        skeletonLoading(2000);
    }, []);

    return (
        <div className="home-mall-container">
            <Routes>
                {/* Landing Page with Sign In and Sign Up options */}
                <Route path="/" element={
                    <div style={{ justifyContent: 'center' }}>
                        <HomeSearchBar handleSearch={handleSearch}
                            handleSort={handleSort}
                            cartItems={cartItems}
                            increaseQty={increaseQty}
                            decreaseQty={decreaseQty}
                            clearCart={clearCart}
                            removeItem={removeItem}
                            updateCart={updateCart}
                            paymentMethods={paymentMethods}
                            setPaymentMethods={setPaymentMethods}
                            isAuthenticated={isAuthenticated}
                            handleLogout={handleLogout}
                            authenticatedUser={authenticatedUser}
                            searchOptions={searchOptions} />
                        <HomeCategoryList handleCategorySelect={handleCategorySelect} handleReset={handleReset} />

                        {/* Display products and pagination only if there are results */}
                        {paginatedItems.length > 0 ? (
                            <>
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(5, 220px)',  // Fixed 5 items per row
                                        justifyContent: 'center',  // Center the grid content horizontally
                                        gap: '10px',  // Space between cards
                                        width: '100%',  // Full width container
                                        padding: '0 10px',  // Padding for left and right spaces (empty spaces)
                                    }}
                                >
                                    {/* Display products */}
                                    {paginatedItems.map((item, id) => (
                                        <div key={item.id} >
                                            <SellingProduct
                                                key={id}
                                                product={item}
                                                addToCart={addToCart}
                                                increaseQty={increaseQty}
                                                decreaseQty={decreaseQty}
                                                cartItems={cartItems}
                                                onBuyClick={handleBuyClick}
                                                loading={loading}
                                            />
                                        </div>
                                    ))}

                                </div>

                                <Space style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                                    {/* First page button */}
                                    <Button
                                        className="no-border-button"
                                        onClick={() => handlePageChange(1)}
                                        disabled={currentPage === 1}
                                    >
                                        {'I<'}
                                    </Button>
                                    {/* Previous page button */}
                                    <Button
                                        className="no-border-button"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        {'< Previous'}
                                    </Button>
                                    {/* Input for specific page */}
                                    <InputNumber
                                        value={inputPage}
                                        onChange={handlePageInputChange}
                                        onKeyDown={handlePageInputKeyPress}
                                        min={1}
                                        max={totalPages}
                                        className="no-arrow-input"
                                        style={{ width: '40px', textAlign: 'center' }}
                                    />
                                    {/* Display total pages */}
                                    <span>of {totalPages}</span>
                                    {/* Next page button */}
                                    <Button
                                        className="no-border-button"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        {'Next >'}
                                    </Button>
                                    {/* Last page button */}
                                    <Button
                                        className="no-border-button"
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={currentPage === totalPages}
                                    >
                                        {'>I'}
                                    </Button>
                                </Space>
                            </>
                        ) : (
                            <div style={{ width: '100%', textAlign: 'center', padding: '20px', color: '#888' }}>
                                <Empty
                                    description={
                                        <Typography.Text>
                                            No results found. Please look for other buying options.
                                        </Typography.Text>
                                    }
                                />
                            </div>
                        )}

                        {isPurchaseModalOpen && selectedProduct && (
                            <SellingProductPurchaseModal isOpen={isPurchaseModalOpen}
                                onClose={closePurchaseModal}
                                item={selectedProduct}
                                increaseQty={increaseQty}
                                decreaseQty={decreaseQty}
                                onSaveForLater={saveForLater}
                                paymentMethods={paymentMethods}
                                onItemRemove={removeItem}
                                authenticatedUser={authenticatedUser} />
                        )}
                    </div>
                } />
                <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} setAuthenticatedUser={setAuthenticatedUser} setLoading={setLoading} />} />
                <Route path="/signup" element={<SignUp setIsAuthenticated={setIsAuthenticated} setAuthenticatedUser={setAuthenticatedUser} setLoading={setLoading} />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
            </Routes>
            <Watermark
                content={['Patrick Liu', 'Ensemble']}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: -1, // Ensures it's behind the product grid
                }}
            />
        </div>
    );
}