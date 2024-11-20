"use client";
import React, { useState, useEffect } from "react";

// ******************** CSS ********************
import './HomeSearchBarFeedback.css';

// ******************** Ant Design ********************
import { Button, Form, Select, Input, Modal } from 'antd';
import { MdOutlineFeedback } from "react-icons/md";

export default function HomeSearchBarFeedback() {
    const [isOpen, setIsOpen] = useState(false);
    const [feedbackType, setFeedbackType] = useState('');  // Default feedback type
    const [feedbackText, setFeedbackText] = useState('');  // Stores the feedback description
    const [showSuccessPrompt, setShowSuccessPrompt] = useState(false);

    // Function to toggle modal open/close
    const toggleModal = () => {
        setIsOpen(!isOpen);
        form.resetFields();
    };

    // Function to handle submit button click
    const handleSubmit = () => {
        if (!feedbackType) {
            return;
        }
        if (!feedbackText.trim()) {
            return;
        }

        console.log(`Feedback Type: ${feedbackType}`);
        console.log(`Feedback Description: ${feedbackText}`);

        setShowSuccessPrompt(true);

        // Reset the form here after submission
        setFeedbackType('');
        setFeedbackText('');
        toggleModal(); 
        form.resetFields();
    };

    // Auto-dismiss the success prompt after 3 seconds
    useEffect(() => {
        if (showSuccessPrompt) {
            console.log("showSuccessPrompt has been updated to:", showSuccessPrompt);
            const timer = setTimeout(() => {
                setShowSuccessPrompt(false);
            }, 3000);  // 3 seconds

            // Cleanup the timer 
            return () => clearTimeout(timer);
        }
    }, [showSuccessPrompt]);

    const [form] = Form.useForm();

    const onFinish = (values) => {
        handleSubmit(values); // Pass form data to your submission handler
    };

    return (
        <div>
            {/* Feedback Button */}
            <Button type="text"
                onClick={toggleModal}
                style={{
                    padding: '0px',
                    color: '#1890ff',
                    fontSize: '16px',
                }}
                shape="circle"
            >
                <MdOutlineFeedback style={{ fontSize: '16px' }} />
            </Button>

            {/* Feedback Modal*/}
            <Modal
                title="Submit Feedback"
                open={isOpen}
                onCancel={toggleModal}
                footer={null} // Customize footer with form submit button
            >

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    {/* Feedback Type Dropdown */}
                    <Form.Item
                        label="Feedback Type"
                        name="feedbackType"
                        rules={[{ required: true, message: 'Please select a feedback type' }]}
                    >
                        <Select
                            value={feedbackType}
                            onChange={(value) => setFeedbackType(value)}
                            placeholder="Select feedback type"
                        >
                            <Select.Option value="Products">Products</Select.Option>
                            <Select.Option value="Technical">Technical</Select.Option>
                            <Select.Option value="Payment">Payment</Select.Option>
                            <Select.Option value="Refund">Refund</Select.Option>
                            <Select.Option value="Others">Others</Select.Option>
                        </Select>
                    </Form.Item>

                    {/* Feedback Description Textbox */}
                    <Form.Item
                        label="Description"
                        name="feedbackText"
                        rules={[{ required: true, message: 'Please provide a description' }]}
                    >
                        <Input.TextArea
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="Write your feedback here..."
                            rows={4}
                            style={{ resize: 'none' }}
                        />
                    </Form.Item>

                    {/* Submit Button */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit Feedback
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            
            {/* Success Prompt after submission */}
            {showSuccessPrompt && (
                <div className="success-prompt">
                    <p>Feedback submitted successfully!</p>
                    <Button onClick={() => setShowSuccessPrompt(false)}>
                        Dismiss
                    </Button>
                </div>
            )}
        </div>
    );
}
