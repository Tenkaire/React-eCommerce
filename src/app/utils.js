export const APP_CONFIG = {
    siteName: "My Online Store",
    currency: "CAD $",
    itemsPerPage: 30,
    categories: ["Clothes", "Bags", "Electronics", "Books", "Accessories"],
};

export const CLOUD_PATH = "https://github.com/Tenkaire/generated_images/blob/main/";

// Global Functions
export const formatPrice = (price) => {
    const numPrice = Number(price); // Convert price to number
    if (isNaN(numPrice)) {
        return `${APP_CONFIG.currency} Invalid price`; // or another fallback
    }
    return `${APP_CONFIG.currency}${numPrice.toFixed(2)}`;
};

export const getImageURL = (productId) => {
    return `${CLOUD_PATH}products/selling_product_${productId}.jpg?raw=true`;
};


export const categoriesItems = [
    {
        label: "Clothes",
        image: `${CLOUD_PATH}categories/clothes.png?raw=true`,
    },
    {
        label: "Bags",
        image: `${CLOUD_PATH}categories/bags.png?raw=true`,
    },
    {
        label: "Foods",
        image: `${CLOUD_PATH}categories/foods.png?raw=true`,
    },
    {
        label: "Health & Wellness",
        image: `${CLOUD_PATH}categories/health.png?raw=true`,
    },
    {
        label: "Computers & Laptops",
        image: `${CLOUD_PATH}categories/computers.png?raw=true`,
    },
    {
        label: "Sports",
        image: `${CLOUD_PATH}categories/sports.png?raw=true`,
    },
    {
        label: "Pets",
        image: `${CLOUD_PATH}categories/pets.png?raw=true`,
    },
    {
        label: "More",
        image: `${CLOUD_PATH}categories/more.png?raw=true`,
    },
];

export const detectCardType = (number) => {
    const trimmedNumber = number.replace(/\s+/g, '');  // Remove any spaces
    const firstDigit = trimmedNumber[0];
    const firstTwoDigits = trimmedNumber.slice(0, 2);
    const firstFourDigits = trimmedNumber.slice(0, 4);

    if (firstDigit === '4') {
        return 'Visa';
    } else if (firstTwoDigits >= '51' && firstTwoDigits <= '55') {
        return 'MasterCard';
    } else if (firstFourDigits === '6011' || firstTwoDigits === '65') {
        return 'Discover';
    } else if (firstTwoDigits === '34' || firstTwoDigits === '37') {
        return 'American Express';
    }
    return '';  // Unknown card type
};

export const cardTypes = [
    {
        label: 'MasterCard',
        image: `${CLOUD_PATH}cardType/mastercard.png?raw=true`,
    },
    {
        label: '',
        image: `${CLOUD_PATH}cardType/credit-card.png?raw=true`,
    },
    {
        label: 'Discover',
        image: `${CLOUD_PATH}cardType/discover.png?raw=true`,
    },
    {
        label: 'Visa',
        image: `${CLOUD_PATH}cardType/visa.png?raw=true`,
    },
    {
        label: 'American Express',
        image: `${CLOUD_PATH}cardType/american-express.png?raw=true`,
    },
]

export const skeletonLoading = (setLoading, time) => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), time); // Simulates loading delay
    return () => clearTimeout(timer);
};

const sampleItems = [
    { id: 1, name: "T-Shirt", category: "Clothes", brand: "Adidas", price: 19.99, date: "2023-12-04", sold: 355 },
    { id: 2, name: "Laptop Bag", category: "Bags", brand: "Samsonite", price: 49.99, date: "2024-03-08", sold: 632 },
    { id: 3, name: "Organic Apples", category: "Foods", brand: "FreshFarm", price: 4.99, date: "2023-12-29", sold: 410 },
    { id: 4, name: "Vitamin C", category: "Health & Wellness", brand: "NatureMade", price: 12.99, date: "2024-05-24", sold: 809 },
    { id: 5, name: "Gaming Laptop", category: "Computers & Laptops", brand: "Acer", price: 1299.99, date: "2023-11-06", sold: 896 },
    { id: 6, name: "Basketball", category: "Sports", brand: "Spalding", price: 29.99, date: "2024-05-23", sold: 410 },
    { id: 7, name: "Cat Food", category: "Pets", brand: "Purina", price: 14.99, date: "2024-10-10", sold: 328 },
    { id: 8, name: "Running Shoes", category: "Clothes", brand: "Nike", price: 99.99, date: "2024-10-11", sold: 676 },
    { id: 9, name: "Backpack", category: "Bags", brand: "North Face", price: 69.99, date: "2024-05-03", sold: 64 },
    { id: 10, name: "Organic Bananas", category: "Foods", brand: "Dole", price: 1.99, date: "2023-11-07", sold: 463 },
    { id: 11, name: "Yoga Mat", category: "Health & Wellness", brand: "Gaiam", price: 25.99, date: "2023-10-31", sold: 950 },
    { id: 12, name: "Desktop Computer", category: "Computers & Laptops", brand: "HP", price: 899.99, date: "2024-08-17", sold: 645 },
    { id: 13, name: "Soccer Ball", category: "Sports", brand: "Adidas", price: 22.99, date: "2024-08-30", sold: 623 },
    { id: 14, name: "Dog Collar", category: "Pets", brand: "KONG", price: 9.99, date: "2023-11-16", sold: 854 },
    { id: 15, name: "Smart Watch", category: "More", brand: "Apple", price: 399.99, date: "2024-05-26", sold: 556 },
    { id: 16, name: "Monitor", category: "Computers & Laptops", brand: "Dell", price: 299.99, date: "2024-05-23", sold: 645 },
    { id: 17, name: "Rice Cooker", category: "Kitchen", brand: "Zojirushi", price: 169.99, date: "2024-07-20", sold: 968 },
    { id: 18, name: "Wireless Mouse", category: "Computers & Laptops", brand: "Logitech", price: 39.99, date: "2024-04-13", sold: 894 },
    { id: 19, name: "Sofa", category: "Furniture", brand: "Ikea", price: 699.99, date: "2023-11-13", sold: 180 },
    { id: 20, name: "Instant Pot", category: "Kitchen", brand: "Instant", price: 89.99, date: "2023-12-28", sold: 772 },
    { id: 21, name: "VR Headset", category: "More", brand: "Oculus", price: 299.99, date: "2024-10-06", sold: 126 },
    { id: 22, name: "Handbag", category: "Bags", brand: "Gucci", price: 499.99, date: "2024-09-10", sold: 916 },
    { id: 23, name: "Bluetooth Speaker", category: "Electronics", brand: "Bose", price: 199.99, date: "2023-12-10", sold: 763 },
    { id: 24, name: "Office Chair", category: "Furniture", brand: "Herman Miller", price: 1299.99, date: "2024-07-09", sold: 856 },
    { id: 25, name: "Gaming Console", category: "More", brand: "Sony", price: 499.99, date: "2024-05-22", sold: 501 },
    { id: 26, name: "Microwave", category: "Kitchen", brand: "Panasonic", price: 199.99, date: "2024-06-13", sold: 391 },
    { id: 27, name: "Protein Bars", category: "Foods", brand: "Quest", price: 24.99, date: "2024-05-22", sold: 412 },
    { id: 28, name: "Coffee Grinder", category: "Kitchen", brand: "Baratza", price: 249.99, date: "2024-05-28", sold: 232 },
    { id: 29, name: "Fitness Tracker", category: "Health & Wellness", brand: "Fitbit", price: 149.99, date: "2024-05-26", sold: 817 },
    { id: 30, name: "Dog Leash", category: "Pets", brand: "Flexi", price: 19.99, date: "2024-01-10", sold: 539 },
    { id: 31, name: "Water Bottle", category: "Sports", brand: "Hydro Flask", price: 29.99, date: "2023-12-02", sold: 195 },
    { id: 32, name: "Air Conditioner", category: "Home Appliances", brand: "LG", price: 399.99, date: "2023-11-20", sold: 780 },
    { id: 33, name: "Tablet", category: "Computers & Laptops", brand: "Microsoft", price: 899.99, date: "2023-12-15", sold: 665 },
    { id: 34, name: "Cycling Helmet", category: "Sports", brand: "Bell", price: 59.99, date: "2024-08-08", sold: 377 },
    { id: 35, name: "Dog Bed", category: "Pets", brand: "FurHaven", price: 49.99, date: "2024-09-23", sold: 423 },
    { id: 36, name: "Sneakers", category: "Clothes", brand: "Puma", price: 79.99, date: "2024-07-03", sold: 759 },
    { id: 37, name: "Coffee Maker", category: "Kitchen", brand: "Keurig", price: 129.99, date: "2023-12-05", sold: 827 },
    { id: 38, name: "Electric Toothbrush", category: "Health & Wellness", brand: "Oral-B", price: 99.99, date: "2023-10-30", sold: 913 },
    { id: 39, name: "Mountain Bike", category: "Sports", brand: "Trek", price: 1099.99, date: "2024-02-20", sold: 123 },
    { id: 40, name: "Cat Tree", category: "Pets", brand: "Frisco", price: 89.99, date: "2024-06-07", sold: 914 },
    { id: 41, name: "E-Book Reader", category: "More", brand: "Amazon", price: 119.99, date: "2024-05-15", sold: 645 },
    { id: 42, name: "Hair Dryer", category: "Health & Wellness", brand: "Dyson", price: 399.99, date: "2024-04-09", sold: 781 },
    { id: 43, name: "Tennis Racket", category: "Sports", brand: "Wilson", price: 129.99, date: "2024-07-18", sold: 244 },
    { id: 44, name: "Blender", category: "Kitchen", brand: "Ninja", price: 99.99, date: "2024-08-13", sold: 876 },
    { id: 45, name: "Smartphone", category: "Electronics", brand: "Samsung", price: 799.99, date: "2024-10-07", sold: 905 },
];



