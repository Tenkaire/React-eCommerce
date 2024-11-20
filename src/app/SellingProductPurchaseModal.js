import React, { useState, useEffect } from 'react';

// ******************** CSS ********************
import './SellingProductPurchaseModal.css';

// ******************** Components ********************
import { fetchCartItems, addPurchaseHistory } from './db';
import { formatPrice, getImageURL } from './utils';
import { PaymentCardImage } from './PaymentCardImage';

// ******************** Ant Design ********************
import { Result, Button, Select, Typography, Modal, Spin, Alert } from "antd";
import { HeartOutlined } from "@ant-design/icons";
const { Text } = Typography;
const { Option } = Select;

export default function SellingProductPurchaseModal({ isOpen, onClose, item, increaseQty, decreaseQty, onSaveForLater, paymentMethods, onItemRemove, authenticatedUser }) {
    if (!isOpen) return null; // Don't render anything if not open

    const [quantity, setQuantity] = useState(item?.qty || 1);
    const [isCheckout, setIsCheckout] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]?.card || "");
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);
    const [orderID, setOrderID] = useState("");

    useEffect(() => {
        setQuantity(item.qty || 1);

        // Check the quantity of the item
        // console.log("item.qty changed:", item.qty);
    }, [item]);

    // Fetch cart items from IndexedDB when the component mounts (if authenticated)
    useEffect(() => {
        if (authenticatedUser) {
            const loadCart = async () => {
                const result = await fetchCartItems(authenticatedUser);
                if (result.success) {
                    setUserCartItems(result.cartItems);
                }
            };
            loadCart();
        }
    }, [authenticatedUser]);

    useEffect(() => {
        if (isOpen) {
            resetDefaultPayment();
        }
    }, [isOpen]);

    const handleIncrease = () => {
        setQuantity(prevQty => prevQty + 1);
        increaseQty(item.id);
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(prevQty => prevQty - 1);
            decreaseQty(item.id);
        }
    };

    const handleProceedToPayment = () => {
        setIsCheckout(true);
    };

    const handleBackToCart = () => {
        setIsCheckout(false);
    };

    const handlePaymentSelect = (selectedValue) => {
        setSelectedPayment(selectedValue); // Update selected payment method
        console.log(`Selected Payment ID: ${selectedValue}`);
    };

    const calculateTotal = () => {
        return (item.price * quantity).toFixed(2);
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        const selectedMethod = paymentMethods.find(method => method.card === selectedPayment);
        console.log("Selected Method Object:", selectedMethod);

        if (selectedMethod) {
            // Log the full card number for verification (if needed)
            console.log(`Selected Card Number: ${selectedMethod.card}`);

            // Masked card number
            const maskedNumber = `****${selectedMethod.card.slice(-4)}`;

            // Create alert message
            const alertMessage = selectedMethod.nickname
                ? `Order placed with ${selectedMethod.nickname} (${maskedNumber})`
                : `Order placed with ${selectedMethod.detectedType || "Card"} (${maskedNumber})`;

            // Check the payment method
            // console.log(alertMessage);
            // alert(alertMessage);
        } else {
            console.error("Selected payment method not found.");
        }

        const totalAmount = calculateTotal();
        console.log(`The item.qty is ${item.qty}, and the quantity is ${quantity}`);
        const purchaseData = {
            userEmail: authenticatedUser,
            purchaseItems: [{ ...item, qty: quantity }],
            cardInfo: selectedMethod,
            total: totalAmount,
        };

        try {
            // Add the purchase history to IndexedDB
            const orderID = await addPurchaseHistory(authenticatedUser, purchaseData);
            setOrderID(orderID);
        } finally {
            setTimeout(() => {
                setLoading(false);
                // Log the cart items and total amount
                console.log(`Order Summary: ${item.name} x${quantity}: $${totalAmount}`);
                onItemRemove(item.id);
                setPurchaseSuccess(true); // Show success result
            }, 3000); // Spinner stays for 3 seconds
        }
    }

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

    // ********************* Order Place Loading ********************
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("Loading state updated:", loading);
    }, [loading]);

    return (
        <Modal
            title={purchaseSuccess ? "Order Successful" : isCheckout ? "Checkout" : "Purchase Item"}
            open={isOpen}
            onCancel={onClose}
            footer={null}
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
                                setPurchaseSuccess(false); // Reset success state
                                onClose(); // Close modal
                            }}
                        >
                            Go back to Home
                        </Button>,
                    ]}
                />
            ) : (
                !isCheckout ? (
                    <>
                        {item && (
                            <div
                                key="cart-view"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '10px',
                                    marginTop: '10px',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                }}
                            >
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
                                <div style={{ flex: 1, marginRight: '10px' }}>
                                    <Text strong>{item.name}</Text> - {item.brand}
                                    <div>
                                        <Button onClick={handleDecrease} disabled={quantity === 1}>
                                            -
                                        </Button>
                                        <span style={{ margin: "0 10px" }}>Qty: {quantity}</span>
                                        <Button onClick={handleIncrease}>+</Button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <Text strong  >Total: {formatPrice(calculateTotal())}</Text>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px", justifyContent: "space-between" }}>
                            <Button onClick={onSaveForLater} icon={<HeartOutlined />}>
                                Save it for Later
                            </Button>
                            <Button type="primary" onClick={handleProceedToPayment}>
                                Proceed to Payment
                            </Button>
                        </div>
                    </>
                ) : (
                    <Spin spinning={loading} size="large" tip="Processing your order...">
                        <div key="checkout-view">
                            <span
                                onClick={handleBackToCart}
                                style={{
                                    cursor: loading ? "not-allowed" : "pointer",
                                    color: loading ? "#d9d9d9" : "#1677ff",
                                    marginLeft: 0,
                                }}
                            >
                                {"<"} Back
                            </span>
                            <div />
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
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", justifyContent: "space-between" }}>
                                <Text strong>Total: {formatPrice(calculateTotal())}</Text>
                                <Button type="primary" onClick={handlePlaceOrder} disabled={paymentMethods.length === 0}>
                                    Place Order
                                </Button>
                            </div>
                        </div>
                    </Spin>
                )
            )}
        </Modal>
    );
}