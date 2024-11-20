"use client";
import React, { useState, useEffect } from "react";
import { AiFillEdit } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { MdLiveHelp } from "react-icons/md";

// ******************** CSS ********************
import './HomeSearchBarSettings.css';

// ******************** Components ********************
import AddressForm from './AddressForm';
import PurchaseHistory from './PurchaseHistory';
import { PaymentCardImage } from "./PaymentCardImage";
import { updatePaymentMethods, fetchPaymentMethods, fetchAddress, updateAddress, getUser, updateUserInfo } from "./db";
import { detectCardType } from './utils';
import dayjs from 'dayjs';

// ******************** Ant Design ********************
import { Button, Form, Input, Modal, List, DatePicker, Typography, Tag } from 'antd';

export default function HomeSearchBarSettings({ paymentMethods, setPaymentMethods, authenticatedUser, setIsSettingsModalOpen, isSettingsModalOpen }) {
    // ******************** User Info ********************
    const [userInfoForm] = Form.useForm();
    const [userData, setUserData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        middleName: '',
        preferredName: '',
        telephone: '',
        dateOfBirth: '',
    }); // User info fetched from db
    const [editedUserData, setEditedUserData] = useState(null); // Data retrieved from userData to edit
    const [isUserInfoEditing, setIsUserInfoEditing] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const user = await getUser(authenticatedUser);
            if (user) {
                setUserData({
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    middleName: user.middleName,
                    preferredName: user.preferredName,
                    telephone: user.telephone,
                    dateOfBirth: user.dateOfBirth,
                });
            }
        };
        fetchUserData();
    }, [authenticatedUser]);

    const handleUserInfoCancelChanges = () => {
        setIsUserInfoEditing(false);
        setEditedUserData(userData);

        userInfoForm.setFieldsValue({
            ...userData,
            dateOfBirth: dayjs(userData.dateOfBirth),
        });

    };

    const handleUserInfoEdit = () => {
        setEditedUserData(userData);
        setIsUserInfoEditing(true);

    };

    const handleUserInfoSave = async () => {
        const editedUserInfo = await userInfoForm.validateFields();
        if (authenticatedUser) {
            const formattedData = {
                ...editedUserInfo,
                dateOfBirth: editedUserInfo.dateOfBirth ? editedUserInfo.dateOfBirth.format('YYYY-MM-DD') : null,
            };
            console.log("Edited User Info:", formattedData);
            const response = await updateUserInfo(authenticatedUser, formattedData);
            if (response.success) {
                setUserData(formattedData);
                setIsUserInfoEditing(false);  // Exit edit mode
            } else {
                console.error("Failed to update profile", response.message);
            }

        }
    };

    // ******************** Address ******************** 
    const [shippingAddress, setShippingAddress] = useState(null);
    const [addressForm] = Form.useForm();

    // Fetch address when the component mounts or when `authenticatedUser` changes
    useEffect(() => {
        const fetchUserAddress = async () => {
            if (authenticatedUser) {
                const response = await fetchAddress(authenticatedUser);
                if (response.success) {
                    setShippingAddress(response.address);
                } else {
                    setShippingAddress(null);
                }
            } else {
                setShippingAddress(null);
            }
        };
        fetchUserAddress();
    }, [authenticatedUser]);

    const handleAddressSubmit = async (addressData) => {
        const submittedaddress = {
            city: addressData.address.city,
            province: addressData.address.province,
            street: addressData.address.street,
            zip: addressData.address.zip,
        }
        console.log(submittedaddress);
        setShippingAddress(submittedaddress); // Save the address in the state
        setIsEditingAddress(false); // Close editing mode after saving

        if (authenticatedUser) {
            const response = await updateAddress(authenticatedUser, submittedaddress);
            if (!response.success) {
                console.error("Failed to update address in the database");
            }
        }
    };

    const handleEditClick = () => {
        setIsEditingAddress(true);  
    };

    const handleCancelEdit = () => {
        setIsEditingAddress(false); 
        addressForm.resetFields();
    };


    // ******************** Payment Methods ******************** 
    const [isEditingAddress, setIsEditingAddress] = useState(false);  // Track if the address is being edited
    const [newCardNumber, setNewCardNumber] = useState('');  // Card number input
    const [nickname, setNickname] = useState('');  // Nickname input, when add a new cards
    const [isDefault, setIsDefault] = useState(false);  // Track if card is default
    const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
    const [cardType, setCardType] = useState('');  // Track the detected card type
    const [editingCardIndex, setEditingCardIndex] = useState(null); // Track which card is being edited
    const [editCardNumber, setEditCardNumber] = useState(''); // Track editable card number
    const [editNickname, setEditNickname] = useState(''); // Track editable nickname for added cards
    const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);
    const [error, setError] = useState('');

    // Fetch payment methods when the component mounts or when `email` changes
    useEffect(() => {
        const fetchData = async () => {
            if (authenticatedUser) {
                const response = await fetchPaymentMethods(authenticatedUser);
                if (response.success) {
                    setPaymentMethods(response.paymentMethods);
                } else {
                    setPaymentMethods([]);
                }
            } else {
                setPaymentMethods([]);
            }
        };
        fetchData();
    }, [authenticatedUser]); // Re-run when `email` changes

    // Update payment methods whenever `paymentMethods` changes
    useEffect(() => {
        if (authenticatedUser && paymentMethods.length >= 0) {
            const updateData = async () => {
                await updatePaymentMethods(authenticatedUser, paymentMethods);
            };
            updateData();
        }
    }, [paymentMethods, authenticatedUser]);

    // Function to validate the card number (only allows 16 digits and detects card type)
    const validateCardNumber = (number) => {
        const trimmedNumber = number.replace(/\s+/g, '');  // Remove any spaces
        const regex = /^\d{16}$/;  // Regex for exactly 16 digits
        return regex.test(trimmedNumber);  // Returns true if it matches 16 digits
    };

    // Function to open add card modal
    const openAddCardModal = () => {
        setIsAddCardModalOpen(true);
        setIsEditCardModalOpen(false);
        setNewCardNumber('');  // Reset inputs
        setNickname('');
        setIsDefault(false);
    };

    // Function to close add card modal
    const closeAddCardModal = () => {
        setIsAddCardModalOpen(false);
        closeCardEditModal();
        setError(''); // Clear any existing error message
    };

    // Function to handle adding a new card
    const handleAddCard = async () => {
        if (newCardNumber.length == 0) {
            setError('Card number is empty. Please enter a valid 16-digit card number.');
            return;
        }

        if (!validateCardNumber(newCardNumber)) {
            setError('Invalid card number. Please enter a valid 16-digit card number.');
            return;
        }

        const detectedType = detectCardType(newCardNumber);

        // Check the card type
        // console.log(detectedType);

        // If "Set as Default" badge is selected, make this card default and unset others
        const updatedPaymentMethods = isDefault
            ? paymentMethods.map((card) => ({ ...card, isDefault: false })) // Clear existing defaults if needed
            : [...paymentMethods];


        const newCard = {
            card: newCardNumber,
            nickname: nickname || '',  // Assign a default nickname if none provided
            detectedType: detectedType,
            isDefault: isDefault || paymentMethods.length === 0,  // Automatically set first card as default
        };

        console.log(nickname);

        setPaymentMethods([...updatedPaymentMethods, newCard]);
        await updatePaymentMethods(authenticatedUser, paymentMethods);

        console.log('After: The length of the payment methods is %d.  \n', paymentMethods.length)

        closeAddCardModal();  // Close the modal after adding
        setNewCardNumber(''); // Reset card number input
        setNickname(''); // Reset nickname input
        setIsDefault(false); // Reset default status
        setError(''); // Clear any existing error message
    };

    const handleCardNumberChange = (e) => {
        const number = e.target.value;
        setNewCardNumber(number);
        setCardType(detectCardType(number));  // Update card type as the user types
        setError('');  // Clear any existing error when user edits the input
    };

    const openCardEditModal = (index) => {
        setIsAddCardModalOpen(false);
        setIsEditCardModalOpen(true);
        setEditingCardIndex(index);
        setEditCardNumber(paymentMethods[index].card); // Set editable card number to current card number
        setEditNickname(paymentMethods[index].nickname); // Set editable nickname to current nickname
    };

    const closeCardEditModal = () => {
        setIsEditCardModalOpen(false);
        setEditingCardIndex(null);
        setEditCardNumber(''); // Clear editable card number
        setEditNickname(''); // Clear editable nickname
        setCardType('');
    };

    const handleRemoveCard = async () => {
        setPaymentMethods((prevMethods) => {
            // Remove the selected card
            const updatedMethods = prevMethods.filter((_, index) => index !== editingCardIndex);

            // Update state with the modified list of cards
            return updatedMethods;
        });

        setPaymentMethods((currentMethods) => {
            if (currentMethods.length > 0 && !currentMethods.some(card => card.isDefault)) {
                // If no card is marked as default, set the first one as default
                const newMethods = [...currentMethods];
                newMethods[0] = { ...newMethods[0], isDefault: true };
                return newMethods;
            }
            return currentMethods;
        });

        closeCardEditModal(); // Close the edit modal after removing the card
    };

    const handleSaveCard = async () => {
        setPaymentMethods((prevMethods) =>
            prevMethods.map((method, index) =>
                index === editingCardIndex
                    ? { ...method, card: editCardNumber, nickname: editNickname, detectedType: detectCardType(editCardNumber) }
                    : method
            )
        );
        closeCardEditModal(); // Close the edit modal after saving changes
    };

    // Handle setting a card as default
    const handleSetAsDefault = async () => {
        setPaymentMethods((prevMethods) =>
            prevMethods.map((method, index) => ({
                ...method,
                isDefault: index === editingCardIndex, // Only the editing card is set as default
            }))
        );
    };

    // ******************** Modal open/close ********************
    // Function to toggle modal open/close
    const toggleSettingsModal = () => {
        setIsEditingAddress(false);
        setIsAddCardModalOpen(false);
        setIsEditCardModalOpen(false);
        setIsUserInfoEditing(false);
        setIsSettingsModalOpen(!isSettingsModalOpen);
        fetchPaymentMethods(authenticatedUser);
        handleUserInfoCancelChanges();
        handleCancelEdit();

    };

    return (
        <Modal
            title={"Personal Profile"}
            open={isSettingsModalOpen}
            onCancel={toggleSettingsModal}
            footer={null}
            width={600}
        >
            <div className="settings-section">
                <h3><FaUserCircle /> User Info</h3>
                {isUserInfoEditing ? (
                    <Form
                        form={userInfoForm}
                        layout="vertical"
                        initialValues={{
                            ...editedUserData,
                            dateOfBirth: editedUserData.dateOfBirth ? dayjs(editedUserData.dateOfBirth) : null,
                        }}
                        style={{
                            background: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            maxWidth: '600px',
                            margin: '0 auto',
                        }}
                    >
                        <Form.Item label="Email" name="email">
                            <Input value={editedUserData.email} disabled />
                        </Form.Item>

                        <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'First name is required' }]}>
                            <Input value={editedUserData.firstName} />
                        </Form.Item>

                        <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Last name is required' }]}>
                            <Input value={editedUserData.lastName} />
                        </Form.Item>

                        <Form.Item label="Middle Name" name="middleName">
                            <Input value={editedUserData.middleName} />
                        </Form.Item>

                        <Form.Item label="Preferred Name" name="preferredName">
                            <Input value={editedUserData.preferredName} />
                        </Form.Item>

                        <Form.Item label="Telephone" name="telephone"
                            rules={[
                                { required: true, message: 'Telephone number is required' },
                                {
                                    pattern: /^[0-9]{10,15}$/,
                                    message: 'Please enter a valid telephone number (10-15 digits).',
                                },
                            ]}
                        >
                            <Input value={editedUserData.telephone} />
                        </Form.Item>

                        <Form.Item
                            label="Date of Birth"
                            name="dateOfBirth"
                            rules={[{ required: true, message: 'Please select your date of birth!' }]}
                        >
                            <DatePicker
                                format="YYYY-MM-DD"
                                style={{ width: '100%' }}
                                disabledDate={(current) => current && current.isAfter(dayjs(), 'day')}
                                onChange={(date) => {
                                    userInfoForm.setFieldsValue({ dateOfBirth: date });
                                }}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" onClick={handleUserInfoSave} style={{ marginRight: '8px' }}>
                                Save Changes
                            </Button>
                            <Button type="default" onClick={handleUserInfoCancelChanges}>
                                Cancel
                            </Button>
                        </Form.Item>
                    </Form>
                ) : (
                    <div>
                        <p>Email: {userData.email}</p>
                        <p>First Name: {userData.firstName}</p>
                        <p>Last Name: {userData.lastName}</p>
                        <p>Middle Name: {userData.middleName}</p>
                        <p>Preferred Name: {userData.preferredName}</p>
                        <p>Telephone: {userData.telephone}</p>
                        <p>Date of Birth: {userData.dateOfBirth}</p>
                        <Button type="primary" onClick={handleUserInfoEdit}>
                            Edit Profile
                        </Button>
                    </div>
                )}
            </div>

            {/* Shipping Address Section */}
            <div className="settings-section">
                <h3><FaMapLocationDot /> Shipping Address</h3>
                <section>
                    {!isEditingAddress ? (
                        shippingAddress ? (
                            <div>
                                <p>{shippingAddress.street}</p>
                                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}</p>
                                <Button type="primary" onClick={handleEditClick}>Edit Address</Button>
                            </div>
                        ) : (
                            <Form
                                form={addressForm}
                                layout="vertical"
                                onFinish={handleAddressSubmit}
                            >
                                <AddressForm />
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Save Address
                                    </Button>
                                </Form.Item>
                            </Form>
                        )
                    ) : (
                        <div>
                            <Form
                                form={addressForm}
                                layout="vertical"
                                onFinish={handleAddressSubmit}
                                style={{ maxWidth: 600 }}
                                initialValues={{
                                    address: shippingAddress,
                                }}
                            >
                                <AddressForm />
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">Save Address</Button>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" onClick={handleCancelEdit}>Cancel</Button> {/* Option to cancel */}
                                </Form.Item>
                            </Form>
                        </div>
                    )}
                </section>
            </div>

            {/* Add new payment method */}
            <div className="settings-section">
                <h3><FaMoneyCheckDollar /> Payment Methods</h3>
                {/* Display message if no payment methods and Add Card Modal is closed */}
                {paymentMethods.length === 0 && !isAddCardModalOpen && (
                    <p className="no-payment-message">No payment methods added. Please add a payment method.</p>
                )}

                {/* List of Added Cards */}
                {paymentMethods.length > 0 && (
                    <div className="added-cards-list">
                        <h4>Added Cards:</h4>
                        <List
                            itemLayout="vertical"
                            dataSource={paymentMethods}
                            renderItem={(method, index) => (
                                <List.Item
                                    key={index}
                                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                                        < PaymentCardImage cardType={method.detectedType} />
                                        <span>
                                            {method.nickname
                                                ? `${method.nickname} (****${method.card.slice(-4)})`
                                                : `${method.detectedType} Card (****${method.card.slice(-4)})`}
                                        </span>
                                        {method.isDefault && (
                                            <Tag bordered={false} color="processing">
                                                Default
                                            </Tag>
                                        )}
                                        <button
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#1890ff',
                                                fontSize: '16px',
                                            }}
                                            onClick={() => openCardEditModal(index)}
                                        >
                                            <AiFillEdit />
                                        </button>
                                    </div>

                                    {/* Conditionally render the Edit Card Modal below the card info */}
                                    {isEditCardModalOpen && editingCardIndex === index && (
                                        <div
                                            className="edit-card-modal"
                                            style={{
                                                width: '100%',
                                                padding: '15px',
                                                marginTop: '10px',
                                                border: '1px solid #d9d9d9',
                                                background: '#fafafa',
                                                borderRadius: '5px',
                                            }}
                                        >
                                            <label>Card No.</label>
                                            <Input
                                                type="text"
                                                value={editCardNumber}
                                                onChange={(e) => setEditCardNumber(e.target.value)}
                                                placeholder="Enter 16-digit card number"
                                                maxLength="16"
                                                style={{ width: '100%', marginBottom: '10px' }}
                                            />
                                            <label>Nickname</label>
                                            <Input
                                                type="text"
                                                value={editNickname}
                                                onChange={(e) => setEditNickname(e.target.value)}
                                                placeholder="Enter nickname"
                                                style={{ width: '100%', marginBottom: '10px' }}
                                            />
                                            {!method.isDefault && (
                                                <button
                                                    onClick={handleSetAsDefault}
                                                    style={{
                                                        display: 'block',
                                                        backgroundColor: '#1890ff',
                                                        color: '#fff',
                                                        padding: '8px 12px',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        marginBottom: '10px',
                                                    }}
                                                >
                                                    Set as Default
                                                </button>
                                            )}
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button
                                                    onClick={handleRemoveCard}
                                                    style={{
                                                        backgroundColor: '#ff4d4f',
                                                        color: '#fff',
                                                        padding: '8px 12px',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    Remove
                                                </button>
                                                <button
                                                    onClick={handleSaveCard}
                                                    style={{
                                                        backgroundColor: '#52c41a',
                                                        color: '#fff',
                                                        padding: '8px 12px',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={closeCardEditModal}
                                                    style={{
                                                        backgroundColor: '#d9d9d9',
                                                        color: '#000',
                                                        padding: '8px 12px',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </List.Item>
                            )}
                        />
                    </div>
                )}

                <Button type="primary" onClick={openAddCardModal}>Add Cards</Button> {/* Open Add Cards modal */}
                {/* Add Card Modal displayed below Add Cards button */}
                {isAddCardModalOpen && (
                    <div className="add-card-modal"
                        style={{
                            width: '100%',
                            padding: '15px',
                            marginTop: '10px',
                            border: '1px solid #d9d9d9',
                            background: '#fafafa',
                            borderRadius: '5px',
                        }}>
                        {/* Card Number Input */}
                        <label>Card No.</label>
                        <Input
                            type="text"
                            value={newCardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="Enter 16-digit card number"
                            maxLength="16"
                        />
                        {cardType &&
                            <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'gray' }}>
                                Detected Card Type:
                                <PaymentCardImage cardType={cardType} />
                                {cardType}
                            </p>}
                        <div />

                        {/* Nickname Input */}
                        <label>Nickname</label>
                        <Input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="Enter nickname"
                        />
                        <div />

                        {/* Error Message */}
                        {error && (
                            <Typography.Text type="danger" >
                                {error}
                            </Typography.Text>
                        )}

                        {/* Buttons */}
                        {/* Only show "Set as Default" if it’s there's no cards set */}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            {paymentMethods.length > 0 && !isDefault && (
                                <Button type="primary" onClick={() => setIsDefault(!isDefault)}>
                                    Set as Default
                                </Button>
                            )}
                            <Button type="primary" onClick={handleAddCard}>Add</Button>
                            <Button type="primary" onClick={closeAddCardModal}>Cancel</Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Purchase History Section */}
            <PurchaseHistory authenticatedUser={authenticatedUser} isModalOpen={toggleSettingsModal} />

            {/* Help Center Section */}
            <div className="settings-section">
                <h3><MdLiveHelp /> Help Center</h3>
                <p>If you need help, please contact our support team.</p>
            </div>
        </Modal>
    );
}
