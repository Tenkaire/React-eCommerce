import React from "react";
import { Link } from "react-router-dom";

// ******************** Ant Design ********************
import { Layout, Space, Typography, Divider } from "antd";
import { XOutlined, FacebookOutlined, InstagramOutlined, LinkedinOutlined } from '@ant-design/icons';
const { Footer } = Layout;

export default function HomeFooter() {
    const iconStyle = { color: "black", margin: "0 10px" };

    return (
        <Footer style={{ textAlign: "center", backgroundColor: "#f0f2f5", marginTop: "20px" }}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                {/* Navigation Links */}
                <Space size="middle">
                    <a href="https://www.ensemble.com/" target="_blank" rel="noopener noreferrer">
                        About Us
                    </a>
                    <Divider type="vertical" />
                    <a href="https://www.ensemble.com/contact/" target="_blank" rel="noopener noreferrer">
                        Contact
                    </a>
                    <Divider type="vertical" />
                    <Link to="/privacy">Privacy Policy</Link>
                    <Divider type="vertical" />
                    <Link to="/terms">Terms of Service</Link>
                </Space>

                {/* Social Media Icons */}
                <Space size="middle">
                    <a href="https://facebook.com" style={iconStyle}>
                        <FacebookOutlined style={{ fontSize: '180%' }} />
                    </a>
                    <a href="https://twitter.com" style={iconStyle}>
                        <XOutlined style={{ fontSize: '150%' }} />
                    </a>
                    <a href="https://instagram.com" style={iconStyle}>
                        <InstagramOutlined style={{ fontSize: '180%' }} />
                    </a>
                    <a href="https://linkedin.com" style={iconStyle}>
                        <LinkedinOutlined style={{ fontSize: '180%' }} />
                    </a>
                </Space>

                {/* Copyright */}
                <Typography.Text type="secondary" style={{ fontSize: "small" }}>
                    Ensemble &copy; 2024 Patrick Liu. All rights reserved.
                </Typography.Text>
            </Space>
        </Footer>
    );
}