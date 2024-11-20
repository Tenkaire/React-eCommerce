"use client";
import React from 'react';
import { GiHamburgerMenu } from "react-icons/gi";

// ******************** Components ********************
import { categoriesItems } from './utils';

// ******************** CSS ********************
import './HomeCategoryList.css';

// ******************** Ant Design ********************
import { Card, Divider, Button } from 'antd';
const { Meta } = Card;

export default function HomeCategoryList({ handleCategorySelect, handleReset }) {
    return (
        <div>
            {/* All Categories button: Clicking will display all items across all categories */}
            <Divider orientation="left"  >
                <Button type="text" size="large" onClick={() => handleReset()}>
                    <GiHamburgerMenu />
                    All Categories
                </Button>
            </Divider>

            {/* Category cards (8): Displayed from the categoriesItems array */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1px", minWidth: '845px' }}>
                {categoriesItems.map((category, index) => (
                    <div key={index} className="category-item">
                        <Card
                            hoverable
                            style={{ width: "100%" }}
                            cover={
                                <img
                                    src={category.image} 
                                    alt={category.label} 
                                    onError={(e) => { e.target.src = "https://placehold.co/150x85?text=Image+Not+Available"; }}
                                    style={{ width: "50px", height: "50px", cursor: "pointer", display: "block", margin: "10px auto 0" }}
                                />
                            }
                            onClick={() => handleCategorySelect(category.label)} 
                        >
                            <Meta
                                title={
                                    <div className="category-title">
                                        {category.label} 
                                    </div>
                                }
                                style={{ textAlign: "center" }}
                            />
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}