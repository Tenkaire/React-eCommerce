import React, { useState, useEffect } from 'react';
import { AiOutlineFieldTime } from "react-icons/ai";
import { BsClockHistory } from "react-icons/bs";

// ******************** Components ********************
import { fetchPurchaseHistory } from './db';
import { APP_CONFIG, formatPrice, cardTypes } from './utils';

// ******************** Ant Design ********************
import { Card, Button, Space } from 'antd';

export default function PurchaseHistory({ authenticatedUser, isModalOpen }) {
    const [purchases, setPurchases] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');


    const [visibleCount, setVisibleCount] = useState(3); // Initial count of items to display
    const increment = 3;

    // Reset visibleCount whenever the modal is reopened
    useEffect(() => {
        if (isModalOpen) {
            setVisibleCount(3); // Reset to initial count when modal opens
        }
    }, [isModalOpen]);


    // Function to load more items
    const handleLoadMore = () => {
        setVisibleCount((prevCount) => Math.min(prevCount + increment, purchases.length)); // Ensure we don't exceed the total count
    };

    // Function to load fewer items
    const handleLoadLess = () => {
        setVisibleCount((prevCount) => Math.max(prevCount - increment, 3)); // Ensure we don't go below the initial count
    };

    useEffect(() => {
        if (isModalOpen) {
            setVisibleCount(3); // Reset to initial count when modal opens
        }
    }, [isModalOpen]);

    useEffect(() => {
        const loadPurchaseHistory = async () => {
            if (authenticatedUser) {
                const response = await fetchPurchaseHistory(authenticatedUser);
                if (response.success) {
                    setPurchases(response.purchases);
                } else {
                    setErrorMessage(response.message);
                    console.error(errorMessage);
                }
            }
        };

        loadPurchaseHistory();
    }, [authenticatedUser]);

    return (
        <div className="settings-section">
            <h3><BsClockHistory /> Purchase History</h3>
            {purchases.length === 0 ? (
                <p>You have no purchase history.</p>
            ) : (
                <div>
                    <ul>
                        {purchases
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .slice(0, visibleCount)
                            .map((purchase) => (
                                <Card
                                    key={purchase.orderID}
                                    title={
                                        <div>
                                            <span style={{ fontSize: '12px', color: '#888' }}>Order ID:</span>
                                            <br />
                                            <strong>{purchase.orderID}</strong>
                                        </div>
                                    }
                                    extra={<span>Total: {formatPrice(purchase.total)}</span>}
                                >
                                    {purchase.purchaseItems.map((item) => (
                                        <p key={item.id} style={{ margin: '0.5rem 0' }}>
                                            {item.name} - {item.brand} ${item.price.toFixed(2)} x {item.qty}
                                        </p>
                                    ))}
                                    <p style={{
                                        marginBottom: 0,
                                        fontStyle: 'italic',
                                        color: '#555',
                                        alignSelf: 'flex-end',
                                        marginTop: 'auto', // Pushes this item to the bottom
                                    }}>
                                        <AiOutlineFieldTime />
                                        Purchased on {new Date(purchase.date).toLocaleString()}
                                    </p>
                                </Card>
                            ))}
                    </ul>
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <Space>
                            {visibleCount > 3 && ( // Show Load Less button only if more than the initial count
                                <Button type="default" onClick={handleLoadLess}>
                                    Load Less
                                </Button>
                            )}
                            {visibleCount < purchases.length && ( // Show Load More button only if there are more items
                                <Button type="primary" onClick={handleLoadMore}>
                                    Load More
                                </Button>
                            )}
                        </Space>
                    </div>
                </div>
            )}
        </div>
    );
}
