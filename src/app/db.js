import { openDB } from 'idb';

const DB_NAME = 'UserDatabase';
const USER_STORE_NAME = 'users';
const PURCHASE_STORE_NAME = 'purchases';

// Open (or create) the database and store
export const initDB = async () => {
    return openDB(DB_NAME, 2, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(USER_STORE_NAME)) {
                const store = db.createObjectStore(USER_STORE_NAME, { keyPath: 'email' });
                store.createIndex('email', 'email', { unique: true });
            }

            if (!db.objectStoreNames.contains(PURCHASE_STORE_NAME)) {
                const purchaseStore = db.createObjectStore(PURCHASE_STORE_NAME, { keyPath: 'orderID' });
                purchaseStore.createIndex('userEmail', 'userEmail');
                purchaseStore.createIndex('date', 'date');
                console.log("Here")
            }
        },
    });
};

// ******************************************************************
// ******************** User Database: User Info ********************
// ******************************************************************

// Function to generate a unique ID for each user
const generateUniqueId = () => {
    return crypto.randomUUID();  
};

// Function to add a user (sign-up)
export const addUser = async (userData) => {
    const db = await initDB();

    // Add unique ID to user data
    const userDataWithId = { id: generateUniqueId(), paymentMethods: [], ...userData };

    try {
        await db.add(USER_STORE_NAME, userDataWithId);
        return { success: true, message: 'User added successfully', userId: userDataWithId.id };
    } catch (error) {
        return { success: false, message: 'Email already exists' };
    }
};

// Function to get user data by email
export const getUser = async (email) => {
    const db = await initDB();
    return db.get(USER_STORE_NAME, email);
};

// Function to validate user login (sign-in)
export const validateUser = async (email, password) => {
    const user = await getUser(email);
    if (user && user.password === password) {
        const userName = user?.preferredName
                    ? user.preferredName
                    : `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
        return { success: true, message: 'Login successful', userName: userName };
    } else {
        return { success: false, message: 'Invalid email or password' };
    }
};

// Function to delete a user by email
export const deleteUser = async (email) => {
    const db = await initDB();
    await db.delete(USER_STORE_NAME, email);
    return { success: true, message: 'User deleted successfully' };
};

// Function to update the user info
export const updateUserInfo = async (email, updatedData) => {
    const db = await initDB();
    const user = await getUser(email);

    if (!user) {
        return { success: false, message: 'User not found' };
    }

    // Merge the existing user data with the updated data
    const updatedUser = {
        ...user,
        ...updatedData, 
    };

    try {
        // Update the database after the change
        await db.put(USER_STORE_NAME, updatedUser);
        return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { success: false, message: 'Failed to update profile' };
    }
};

// ************************************************************************
// ******************** User Database: Payment Methods ********************
// ************************************************************************
// Function to update payment methods
export const updatePaymentMethods = async (email, paymentMethods = []) => {
    const db = await initDB();
    const user = await getUser(email);

    if (!user) return { success: false, message: 'User not found' };

    const validatedUserData = {
        ...user,
        paymentMethods: paymentMethods.map(pm => ({
            ...pm,  // Ensure the payment method is stored in the correct structure
        }))
    };

    // Checking payment method list
    // console.log("Updated payment methods:", safeUserData.paymentMethods);

    await db.put(USER_STORE_NAME, validatedUserData);
    return { success: true, message: `Payment methods updated.` };
};

// fetch a user's payment methods by email
export const fetchPaymentMethods = async (email) => {
    const user = await getUser(email); 

    if (!user) {
        return { success: false, message: 'User not found', paymentMethods: [] };
    }

    return { success: true, message: 'Payment methods fetched successfully', paymentMethods: user.paymentMethods };
};

// ****************************************************************
// ******************** User Database: Address ********************
// ****************************************************************
// Function to fetch a user's address by email
export const fetchAddress = async (email) => {
    const db = await initDB();
    const user = await getUser(email);

    if (!user || !user.address) {
        return { success: false, message: 'Address not found', address: null };
    }

    return { success: true, message: 'Address fetched successfully', address: user.address };
};

// Function to update a user's address by email
export const updateAddress = async (email, newAddress) => {
    const db = await initDB();
    const user = await getUser(email);

    if (!user) {
        return { success: false, message: 'User not found' };
    }

    // Update user object with new address
    const updatedUser = {
        ...user,
        address: newAddress,
    };

    try {
        await db.put(USER_STORE_NAME, updatedUser);
        return { success: true, message: 'Address updated successfully' };
    } catch (error) {
        return { success: false, message: 'Failed to update address' };
    }
};

// ************************************************************
// ******************** Purchases Database ********************
// ************************************************************

// Function to generate a unique ID for each order
const generateUniqueOrderId = () => {
    return crypto.randomUUID(); // Using uuidv4() is also an option
};

// Unified function to update cart items
export const updateCartItems = async (email, items = null) => {
    const db = await initDB();
    const user = await getUser(email);

    if (!user) return { success: false, message: 'User not found' };


    const validatedUserData = {
        ...user,
        cartItems: items.map(item => ({
            ...item, // Ensure no functions or non-clonable types
        }))
    };

    // Checking cart item list
    // console.log("Updated items:", validatedUserData.cartItems);

    await db.put(USER_STORE_NAME, validatedUserData);
    return { success: true, message: `Cart updated.` };
};

// Function to fetch cart items for a user
export const fetchCartItems = async (email) => {
    
    const user = await getUser(email); 

    if (!user) {
        return { success: false, message: 'User not found', cartItems: [] };
    }

    return user.cartItems;
};

// Function to add purchase history
export const addPurchaseHistory = async (userEmail, purchaseData) => {
    const db = await initDB();

    // Add unique ID and current date to the purchase data
    const purchaseWithId = {
        orderID: generateUniqueOrderId(),
        userEmail,
        date: new Date().toLocaleString(),
        ...purchaseData,
    };

    try {
        await db.add(PURCHASE_STORE_NAME, purchaseWithId);
        return purchaseWithId.orderID;
        return { success: true, message: 'Purchase added successfully', orderID: purchaseWithId.orderID };
    } catch (error) {
        return { success: false, message: 'Failed to add purchase history' };
    }
};

// Function to fetch purchase history by user email
export const fetchPurchaseHistory = async (userEmail) => {
    const db = await initDB();

    const purchases = await db.getAllFromIndex(PURCHASE_STORE_NAME, 'userEmail', userEmail);

    if (purchases.length === 0) {
        return { success: false, message: 'No purchases found for this user', purchases: [] };
    }

    return { success: true, message: 'Purchase history fetched successfully', purchases };
};

// Function to fetch all purchases (could be used for admins or global search)
export const fetchAllPurchases = async () => {
    const db = await initDB();

    const purchases = await db.getAll(PURCHASE_STORE_NAME);

    if (purchases.length === 0) {
        return { success: false, message: 'No purchase history available', purchases: [] };
    }

    return { success: true, message: 'All purchases fetched successfully', purchases };
};




