"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

// ******************** Components ********************
import HomeSearchBarSettings from "./HomeSearchBarSettings";
import HomeSearchBarShoppingCart from "./HomeSearchBarShoppingCart";
import HomeSearchBarSort from "./HomeSearchBarSort";
import HomeSearchBarFeedback from "./HomeSearchBarFeedback";
import { getUser } from './db';

// ******************** Ant Design ********************
import { AutoComplete, Input, Button, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default function HomeSearchBar({ handleSearch, handleSort, cartItems, increaseQty, decreaseQty,
	clearCart, removeItem, updateCart,
	paymentMethods, setPaymentMethods,
	isAuthenticated, handleLogout, authenticatedUser, searchOptions }) {
	// ******************** Search Bar ********************
	const [searchTerm, setSearchTerm] = useState("");
	// Function to handle the search query and filter items
	const handleInputChange = (event) => {
		const term = event.target.value;
		setSearchTerm(term);
	};
	// ******************** Logout modal ********************
	const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

	const showLogoutModal = () => {
		setIsLogoutModalVisible(true);
	};

	const handleCancelLogout = () => {
		setIsLogoutModalVisible(false);
	};

	const confirmLogout = () => {
		setIsLogoutModalVisible(false);
		handleLogout();
	};

	const [userName, setUserName] = useState(null);
	useEffect(() => {
		if (authenticatedUser) {
			getUser(authenticatedUser).then(user => {
				if (user) {
					const name = user?.preferredName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
					setUserName(name);
				}
			});
		}
	}, [authenticatedUser]);


	// ******************** User Sign In/ Sign Up section ********************
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const navigate = useNavigate();

	const handleDropdownEnter = () => {
		setDropdownVisible(true);
	};

	const handleDropdownLeave = () => {
		setDropdownVisible(false);
	};

	const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

	const toggleProfileModalOpen = () => {
		setIsProfileModalOpen(true);
		setDropdownVisible(false);
	}


	return (
		<div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '10px 20px' }}>
			<div style={{ flex: '0 1 auto' }}>
				<h2 style={{ color: "#1890ff" }}>ensemble</h2>
			</div>

			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%' }}>
				{/* Search Bar */}
				<AutoComplete
					style={{ width: "40%", maxWidth: '800px', minWidth: '600px' }}
					dropdownStyle={{ width: "35%" }}
					options={searchOptions}
					filterOption={(inputValue, option) =>
						option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
					}
				>
					<Input.Search
						size="large"
						placeholder="Search by name, brand, or category.."
						value={searchTerm}
						onChange={handleInputChange}
						onSearch={() => handleSearch(searchTerm)}
						allowClear
						onClear={() => {
							setSearchTerm("");
							handleSearch("");
						}}
						enterButton
					/>
				</AutoComplete>

				{/* Sort Button */}
				<div style={{ width: "40%", maxWidth: '800px', minWidth: '600px', textAlign: 'left' }}>
					<HomeSearchBarSort handleSort={handleSort} />
				</div>
			</div>

			<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
				{isAuthenticated ? (
					<>
						<div style={{ display: "inline-block", position: "relative" }}>
							{dropdownVisible ? (
								<Button type="primary"
									onClick={toggleProfileModalOpen}
									style={{
										width: "200px",
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										padding: "10px",
									}}
									onMouseEnter={handleDropdownEnter}
									onMouseLeave={handleDropdownLeave}
								>
									Your Profile
								</Button>
							) : (
								// Show the button by default
								<Button
									type="text"
									style={{
										width: "200px",
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										padding: "10px",
										color: "#1890ff",
									}}
									onMouseEnter={handleDropdownEnter}
									onMouseLeave={handleDropdownLeave}
								>
									<UserOutlined /> Hi, {userName}!
								</Button>
							)}

							{dropdownVisible && (
								<div
									style={{
										position: "absolute",
										top: "100%",
										left: "0",
										backgroundColor: "white",
										boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
										minWidth: "200px",
										borderRadius: "4px",
										padding: "10px",
										zIndex: 9999,
										display: "flex",
										flexDirection: "column",
									}}
									onMouseEnter={handleDropdownEnter}
									onMouseLeave={handleDropdownLeave}
								>
									<Button
										onClick={showLogoutModal}
										type="default"
										style={{ width: "100%", color: "#1890ff" }}
									>
										Log Out
									</Button>
								</div>
							)}

							<HomeSearchBarSettings
								paymentMethods={paymentMethods}
								setPaymentMethods={setPaymentMethods}
								authenticatedUser={authenticatedUser}
								setIsSettingsModalOpen={setIsProfileModalOpen}
								isSettingsModalOpen={isProfileModalOpen}
							/>
						</div>
					</>
				) : (
					<div
						style={{ display: 'inline-block', position: 'relative' }}
						onMouseEnter={handleDropdownEnter}
						onMouseLeave={handleDropdownLeave}
					>
						<Button
							type="text" // Ant Design 'text' type for no button background and border
							style={{
								width: "200px",
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								padding: '10px',
								color: '#1890ff',
							}}
							onMouseEnter={handleDropdownEnter} // Keep dropdown visible when hovering over the button
							onMouseLeave={handleDropdownLeave} // Hide dropdown when leaving the button
						>
							<UserOutlined /> Sign In / Create Account
						</Button>

						{/* Dropdown Menu (will show on hover) */}
						{dropdownVisible && (
							<div
								style={{
									position: 'absolute',
									top: '100%',
									left: '0',
									backgroundColor: 'white',
									boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
									minWidth: '200px',
									borderRadius: '4px',
									padding: '10px',
									zIndex: 9999,
									display: 'flex',
									flexDirection: 'column',
								}}
								onMouseEnter={handleDropdownEnter} // Keep dropdown visible when hovering over it
								onMouseLeave={handleDropdownLeave} // Hide dropdown when leaving the dropdown
							>
								<Button type="primary" style={{ width: '100%', marginBottom: '10px' }} onClick={() => navigate('/signin')}>
									Sign In
								</Button>
								<Button type="default" style={{ width: '100%', color: '#1890ff' }} onClick={() => navigate('/signup')}>
									Create an Account
								</Button>
							</div>
						)}
					</div>

				)}

				<HomeSearchBarShoppingCart cartItems={cartItems}
					increaseQty={increaseQty}
					decreaseQty={decreaseQty}
					clearCart={clearCart}
					removeItem={removeItem}
					paymentMethods={paymentMethods}
					updateCart={updateCart}
					authenticatedUser={authenticatedUser} />


				<HomeSearchBarFeedback />
				{/* Logout Confirmation Modal */}
				<Modal
					title="Confirm Logout"
					open={isLogoutModalVisible}
					onOk={confirmLogout}
					onCancel={handleCancelLogout}
					okText="Yes, I'm Sure"
					cancelText="Cancel"
					centered
				>
					<p>Are you sure you want to log out?</p>
				</Modal>
			</div>
		</div>
	);
} 