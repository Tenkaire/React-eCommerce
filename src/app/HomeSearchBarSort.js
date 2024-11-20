import React, { useState } from "react";
import { AiOutlineSortAscending } from "react-icons/ai";

// ******************** Ant Design ********************
import { Button, Dropdown } from "antd";

export default function HomeSearchBarSort({ handleSort }) {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const sortOptions = [
        "A-Z",
        "Z-A",
        "Best Sellers",
        "Newest",
        "Price: Low -> High",
        "Price: High -> Low",
        "Clear Sort"
    ];

    const menuItems = sortOptions.map((option, index) => ({
        key: index.toString(),
        label: option,
    })); // Transform the sortOptions array into an items array for the Menu

    // Handle menu item selection
    const handleMenuClick = ({ key }) => {
        const index = parseInt(key, 10);

        if (index === 6) {
            setSelectedIndex(null);
        } else {
            setSelectedIndex(index);
        }

        handleSort(sortOptions[index]);
    };

    return (
        <Dropdown
            menu={{
                items: menuItems,
                onClick: handleMenuClick,
                selectable: true,
                selectedKeys: [selectedIndex !== null ? `${selectedIndex}` : ""],
            }}
            trigger={['click']}
            placement="bottomLeft"
            style={{ color: '#1890ff' }}
        >
            <Button type="text"
                style={{
                    textAlign: 'right',
                    color: '#1890ff', // Set the text color to blue
                }}
            >
                Sort by <AiOutlineSortAscending />
            </Button>
        </Dropdown>
    );
}
