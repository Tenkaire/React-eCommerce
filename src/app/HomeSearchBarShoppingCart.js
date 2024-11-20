"use client";
import React, { useRef, useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';

// ******************** CSS ********************
import './HomeSearchBarShoppingCart.css';

// ******************** Components ********************
import { fetchCartItems, updateCartItems, addPurchaseHistory } from './db';
import { APP_CONFIG, formatPrice, cardTypes, getImageURL } from './utils';
import { PaymentCardImage } from './PaymentCardImage';

// ******************** Ant Design ********************
import { Badge, Button, Modal, Select, Checkbox, InputNumber, Typography, Empty, Result, FloatButton, Spin, Alert } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
const { Option } = Select;
const { Text } = Typography;


export default function HomeSearchBarShoppingCart({ cartItems, increaseQty, decreaseQty, clearCart, removeItem, paymentMethods, updateCart, authenticatedUser }) {
    const [selectedItems, setSelectedItems] = useState({}); 
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);
    const [orderID, setOrderID] = useState("");
    const navigate = useNavigate();

    // ******************** Cart Modal *********************
    const [isOpen, setIsOpen] = useState(false);  
    // Function to toggle modal open/close
    const toggleModal = () => {
        setIsOpen(!isOpen);
        setCheckout(false);
        resetDefaultPayment();
        setShowPaymentMessage(false);
        setPurchaseSuccess(false);
    };

    // Fetch cart items from IndexedDB when the component mounts (if authenticated)
    useEffect(() => {
        if (authenticatedUser) {
            const loadCart = async () => {
                const result = await fetchCartItems(authenticatedUser);
                if (result && result.success) { // Ensure result is defined
                    setUserCartItems(result.cartItems);
                } else {
                    console.info("Shopping cart is empty.");
                }
            };
            loadCart();
        }
    }, [authenticatedUser]);

    useEffect(() => {
        if (isOpen) {
            // Check all items when the modal opens
            const newSelectedItems = {};
            cartItems.forEach(item => {
                newSelectedItems[item.id] = true; // Mark all items as selected
            });
            setSelectedItems(newSelectedItems);
        }
    }, [isOpen, cartItems]);

    // ******************** Shopping cart list ********************
    const [checkout, setCheckout] = useState(false); // New state to toggle checkout view

    const calculateTotal = () => {
        let total = 0;
        cartItems.forEach(item => {
            if (selectedItems[item.id]) { // Only include items that are selected
                total += item.price * item.qty;
            }
        });
        return total.toFixed(2);
    };

    const handleCheckboxChange = (itemId) => {
        setSelectedItems(prevSelected => ({
            ...prevSelected,
            [itemId]: !prevSelected[itemId] // Toggle selection
        }));
    };

    const handleProceedToCheckout = () => {
        if (!authenticatedUser) {
            // alert("Please sign in first to place an order.");
            navigate(`/signin`);
            return; // Exit the function
        }

        setCheckout(true); // Switch to checkout view
    };

    // ******************** Checkout page ********************
    const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]?.card || ""); // Default to the first card in settings
    const [showPaymentMessage, setShowPaymentMessage] = useState(false); // Warning message when there's no added payments

    const handleBackToCart = () => {
        setCheckout(false); // Switch back to cart view
        setShowPaymentMessage(false);
        resetDefaultPayment();
    };

    const handlePaymentSelect = (event) => {
        const selectedId = event.target.value; // Get the selected method id
        setSelectedPayment(selectedId); // Update selected payment method
        console.log(`Selected Payment ID: ${selectedId}`);
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        // Find the selected payment method object
        const selectedMethod = paymentMethods.find(method => method.card === selectedPayment);
        console.log("Selected Method Object:", selectedPayment);

        if (selectedPayment === "") {
            setShowPaymentMessage(true); // Show message if no payment method is selected

            // Check if payment message will show
            // console.log(`showPaymentMessage is ${showPaymentMessage}`);
            return;
        }

        if (selectedMethod) {

            // Log the full card number for verification (if needed)
            console.log(`Selected Card Number: ${selectedMethod.card}`);

            // Masked card number
            const maskedNumber = `****${selectedMethod.card.slice(-4)}`;

            // Create alert message
            const alertMessage = selectedMethod.nickname
                ? `Order placed with ${selectedMethod.nickname} (${maskedNumber})`
                : `Order placed with ${selectedMethod.detectedType || "Card"} (${maskedNumber})`;

            // alert(alertMessage);
        } else {
            console.warn("Selected payment method not found.");
        }

        // Log the cart items and total amount
        console.log("Order Summary:");
        cartItems.forEach(item => {
            if (selectedItems[item.id]) { // Only log selected items
                console.log(`- ${item.name} x${item.qty}: ${formatPrice((item.price * item.qty))}`);
            }
        });
        const totalAmount = calculateTotal();
        console.log(`Total: ${formatPrice(totalAmount)}`);

        // Prepare data for db
        const purchaseData = {
            userEmail: authenticatedUser,
            purchaseItems: cartItems.filter(item => selectedItems[item.id]),
            cardInfo: selectedMethod,
            total: totalAmount,
        };

        try {
            // Add the purchase history to IndexedDB
            const orderID = await addPurchaseHistory(authenticatedUser, purchaseData);
            setOrderID(orderID);
            console.log("Order placed!");
        } finally {
            setTimeout(() => {
                setLoading(false);
                // Transition to success modal or next step after spinner
                setPurchaseSuccess(true);
                // Clear the cart
                const remainingItems = cartItems.filter(item => !selectedItems[item.id]); // Keep unchecked items
                updateCart(remainingItems);
                setCheckout(false);
                resetDefaultPayment();
            }, 3000); // Spinner stays for 3 seconds
        }
    };

    const resetDefaultPayment = () => {
        if (!paymentMethods || paymentMethods.length === 0) {
            console.warn("No payment methods available to set as default.");
            setSelectedPayment(""); // Clear the selection if there are no payment methods
            return;
        }
        // Find the default payment method (where isDefault is true)
        const defaultMethod = paymentMethods.find(method => method.isDefault) || paymentMethods[0];
        if (defaultMethod) {
            console.log(`Selected Payment default state: ${defaultMethod.card} - ${defaultMethod.isDefault}`);
            setSelectedPayment(defaultMethod.card);
        } else {
            console.warn("Default payment method not found.");
            setSelectedPayment(""); // Clear the selection if no default method is found
        }
    };

    // ******************** Badge effect on cart ********************
    const [badgeContent, setBadgeContent] = useState(null);

    useEffect(() => {
        const cartLength = cartItems.length;

        if (cartLength === 0) {
            setBadgeContent(null);  // No badge
        } else if (cartLength < 10) {
            setBadgeContent(cartLength);  // Show number
        } else {
            setBadgeContent('...');  // Show ellipsis
        }
    }, [cartItems]);

    // ********************* Floating Cart button ********************
    const [isFloatingVisible, setIsFloatingVisible] = useState(false);
    const shoppingCartRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // If the button is not visible, show the floating button
                setIsFloatingVisible(!entry.isIntersecting);
            },
            { threshold: 1.0 } // Trigger when the entire button is out of view
        );

        if (shoppingCartRef.current) {
            observer.observe(shoppingCartRef.current);
        }

        return () => {
            if (shoppingCartRef.current) {
                observer.unobserve(shoppingCartRef.current);
            }
        };
    }, []);

    // ******************** Order Place Loading ********************
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        console.log("Loading state updated:", loading);
    }, [loading]);

    return (
        <div>
            {/* Shopping Cart Button */}
            <div ref={shoppingCartRef}>
                <Badge count={badgeContent} overflowCount={9}>
                    <Button
                        type="text"
                        onClick={toggleModal}
                        style={{
                            padding: '0px',
                            color: '#1890ff',
                            fontSize: '16px',  
                        }}
                        shape="circle"
                    >
                        <ShoppingCartOutlined style={{ fontSize: '16px' }} />  
                    </Button>
                </Badge>
            </div>

            {isFloatingVisible && (
                <FloatButton
                    icon={<ShoppingCartOutlined style={{ fontSize: '20px', marginLeft: '-3px' }} />}
                    onClick={toggleModal}
                    type="primary"
                    style={{ right: 24, bottom: 80, fontSize: '24px', height: '60px', width: '60px' }}
                    badge={{ count: badgeContent }}
                />
            )}

            {/* Shopping Cart modal */}
            <Modal
                title={checkout ? "Checkout" : "Your Shopping Cart"}
                open={isOpen}
                onCancel={toggleModal}
                footer={null}
                width={600}
            >
                {purchaseSuccess ? (
                    <Result
                        status="success"
                        title="Purchased successfully!"
                        subTitle={`Order ID: ${orderID}. Please check the order on Profile > Purchase History.`}
                        extra={[
                            <Button
                                type="primary"
                                key="home"
                                onClick={() => {
                                    setIsOpen(false); // Close the modal
                                    setPurchaseSuccess(false); // Reset success state
                                }}
                            >
                                Go back to Home
                            </Button>,
                        ]}
                    /> 
                ) : (
                    <>
                        {checkout ? (
                            <div>
                                {/* Place Order Page */}
                                <Spin spinning={loading} size="large" tip="Processing your order...">
                                    <div style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? "none" : "auto" }}>
                                        <span
                                            onClick={loading ? null : handleBackToCart}
                                            style={{
                                                cursor: loading ? "not-allowed" : "pointer",
                                                color: loading ? "#d9d9d9" : "#1677ff",
                                                marginLeft: 0,
                                            }}
                                        >
                                            {"<"} Back to Cart
                                        </span>
                                        <div style={{ marginBottom: "20px" }}>
                                            <label htmlFor="paymentMethod">Select Payment Method:</label>
                                            {!(paymentMethods.length === 0) && (
                                                <Select
                                                    id="paymentMethod"
                                                    style={{ width: "100%", marginBottom: '10px' }}
                                                    value={selectedPayment}
                                                    onChange={handlePaymentSelect}
                                                    disabled={paymentMethods.length === 0}
                                                >
                                                    {paymentMethods.map(method => (
                                                        <Option key={method.card} value={method.card}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <PaymentCardImage cardType={method.detectedType} />
                                                                {method.nickname
                                                                    ? `${method.nickname} (****${method.card.slice(-4)})`
                                                                    : `${method.detectedType} Card (****${method.card.slice(-4)})`}
                                                            </div>
                                                        </Option>
                                                    ))}
                                                </Select>
                                            )}
                                            {paymentMethods.length === 0 && (
                                                <Alert
                                                    message="No payment methods available. Please add a valid payment method."
                                                    type="error"
                                                    showIcon
                                                />
                                            )}
                                            {showPaymentMessage && (
                                                <Text type="danger">Please select a valid payment method.</Text>
                                            )}
                                        </div>
                                    </div>


                                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", justifyContent: "space-between" }}>
                                        <Text strong>Total: {formatPrice(calculateTotal())}</Text>
                                        <Button type="primary" onClick={handlePlaceOrder} disabled={paymentMethods.length === 0}>
                                            Place Order
                                        </Button>
                                    </div>
                                </Spin>
                            </div>
                        ) : (
                            <div>
                                {cartItems.length > 0 ? (
                                    <>
                                    {/* Item List page */}
                                        <Button type="default" onClick={clearCart} disabled={cartItems.length === 0}>
                                            Clear Cart
                                        </Button>
                                        <div style={{ marginTop: '10px' }}>
                                            {cartItems.map(item => (
                                                <div
                                                    key={item.id}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        marginBottom: '10px',
                                                        padding: '10px',
                                                        border: '1px solid #ccc',
                                                        borderRadius: '8px',
                                                    }}
                                                >
                                                    {/* Checkbox */}
                                                    <Checkbox
                                                        checked={selectedItems[item.id] || false}
                                                        onChange={() => handleCheckboxChange(item.id)}
                                                        style={{ marginRight: '10px' }}
                                                    />

                                                    {/* Product Image */}
                                                    <img
                                                        src={getImageURL(item.id)}
                                                        alt={item.name}
                                                        style={{
                                                            width: '60px',
                                                            height: '60px',
                                                            objectFit: 'cover',
                                                            marginRight: '10px',
                                                            borderRadius: '4px',
                                                        }}
                                                    />

                                                    {/* Item Info */}
                                                    <div style={{ flex: 1, marginRight: '10px' }}>
                                                        <div>
                                                            <strong>{item.name}</strong> - {item.brand}
                                                        </div>
                                                        <div style={{ color: '#888', marginTop: '5px' }}>{APP_CONFIG.currency}{item.price}</div>
                                                    </div>

                                                    {/* Quantity Controls */}
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <Button size="small" onClick={() => decreaseQty(item.id)}>-</Button>
                                                        <InputNumber
                                                            min={1}
                                                            value={item.qty}
                                                            readOnly
                                                            style={{ width: "50px", margin: "0 5px" }}
                                                        />
                                                        <Button size="small" onClick={() => increaseQty(item.id)}>+</Button>
                                                    </div>

                                                    {/* Remove Item */}
                                                    <Button type="link" danger onClick={() => removeItem(item.id)} style={{ marginLeft: '10px' }}>
                                                        <RiDeleteBin6Line />
                                                    </Button>
                                                </div>
                                            ))}

                                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", justifyContent: "space-between" }}>
                                                <Text strong>Total: {formatPrice(calculateTotal())}</Text>
                                                <Button type="primary" onClick={handleProceedToCheckout}>
                                                    Proceed to Checkout
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Empty
                                            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                            imageStyle={{ height: 60 }}
                                            description={
                                                <Typography.Text>
                                                    Your cart is empty.
                                                </Typography.Text>
                                            }
                                        />
                                    </>
                                )}
                            </div>
                        )}
                    </>
                )}
            </Modal>
        </div>
    );
}