import React from "react";
import { Input, Select, Form } from "antd";

const { Option } = Select;

// Address Form Component (fields only)
export default function AddressForm() {
    return (
        <>
            <Form.Item
                label="Street Address"
                name={["address", "street"]}
                rules={[{ required: true, message: "Please enter your street address." }]}
                style={{ marginBottom: '12px' }}
            >
                <Input placeholder="Enter street address" />
            </Form.Item>

            <Form.Item
                label="City"
                name={["address", "city"]}
                rules={[{ required: true, message: "Please enter your city." }]}
                style={{ marginBottom: '12px' }}
            >
                <Input placeholder="Enter city" />
            </Form.Item>

            <Form.Item
                label="Province/Territory"
                name={["address", "province"]}
                rules={[{ required: true, message: "Please select a province or territory." }]}
                style={{ marginBottom: '12px' }}
            >
                <Select placeholder="Select a province or territory">
                    <Option value="AB">Alberta</Option>
                    <Option value="BC">British Columbia</Option>
                    <Option value="MB">Manitoba</Option>
                    <Option value="NB">New Brunswick</Option>
                    <Option value="NL">Newfoundland and Labrador</Option>
                    <Option value="NS">Nova Scotia</Option>
                    <Option value="ON">Ontario</Option>
                    <Option value="PE">Prince Edward Island</Option>
                    <Option value="QC">Quebec</Option>
                    <Option value="SK">Saskatchewan</Option>
                    <Option value="NT">Northwest Territories</Option>
                    <Option value="NU">Nunavut</Option>
                    <Option value="YT">Yukon</Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Postal Code"
                name={["address", "zip"]}
                rules={[
                    { required: true, message: "Please enter your postal code." },
                    {
                        pattern: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
                        message: "Please enter a valid Canadian postal code (e.g., A1A 1A1).",
                    },
                ]}
                style={{ marginBottom: '12px' }}
            >
                <Input placeholder="Enter postal code" maxLength={7} />
            </Form.Item>
        </>
    );
}
