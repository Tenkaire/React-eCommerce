import React from 'react';
import { useNavigate } from 'react-router-dom';

// ******************** Components ********************
import AddressForm from './AddressForm';
import { addUser } from './db';
import dayjs from 'dayjs';

// ******************** Ant Design ********************
import { Form, Input, Button, DatePicker, message } from 'antd';

export default function SignUp({ setIsAuthenticated, setAuthenticatedUser, setLoading }) {
    const navigate = useNavigate();
    const [signUpForm] = Form.useForm();

    const handleFinish = async (values) => {
        setLoading(true);
        if (values.password !== values.confirmPassword) {
            message.error("Passwords do not match!");
            return;
        }

        const { confirmPassword, ...userData } = values; // Exclude confirmPassword
        const fullUserData = {
            ...userData,
            dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
        };
        console.log("User Info:", values);
        console.log("Address:", values.address);

        try {
            const result = await addUser(fullUserData);
            if (result.success) {
                const userName = fullUserData?.preferredName
                    ? fullUserData.preferredName
                    : `${fullUserData?.firstName || ''} ${fullUserData?.lastName || ''}`.trim();
                message.success(`Welcome, ${userName}! Enjoy your shopping experience.`);
                setIsAuthenticated(true);
                setAuthenticatedUser(values.email);
                navigate('/');
            } else {
                message.error(result.message);
            }
        } catch (error) {
            console.error("Error adding user:", error);
            message.error("An error occurred while signing up. Please try again.");
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 3000);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h2 style={{ textAlign: 'center' }}>Sign Up</h2>
            <Form
                form={signUpForm}
                layout="vertical"
                onFinish={handleFinish}
                autoComplete="off"
                style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}
                initialValues={{
                    address: {
                        street: "",
                        city: "",
                        province: "",
                        zip: "",
                    },
                }}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please enter your email!' }, { type: 'email', message: 'Enter a valid email!' }]}
                    style={{ marginBottom: '12px' }}
                >
                    <Input placeholder="Email" />
                </Form.Item>
                <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[{ required: true, message: 'Please enter your first name!' }]}
                    style={{ marginBottom: '12px' }}
                >
                    <Input placeholder="First Name" />
                </Form.Item>
                <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[{ required: true, message: 'Please enter your last name!' }]}
                    style={{ marginBottom: '12px' }}
                >
                    <Input placeholder="Last Name" />
                </Form.Item>
                <Form.Item label="Middle Name" name="middleName" style={{ marginBottom: '12px' }}>
                    <Input placeholder="Middle Name (optional)" />
                </Form.Item>
                <Form.Item label="Preferred Name" name="preferredName" style={{ marginBottom: '12px' }}>
                    <Input placeholder="Preferred Name (optional)" />
                </Form.Item>
                <Form.Item
                    label="Telephone"
                    name="telephone"
                    rules={[{ required: true, message: 'Please enter your telephone number!' }]}
                    style={{ marginBottom: '12px' }}
                >
                    <Input placeholder="Telephone Number" />
                </Form.Item>
                <Form.Item
                    label="Date of Birth"
                    name="dateOfBirth"
                    rules={[{ required: true, message: 'Please select your date of birth!' }]}
                    style={{ marginBottom: '12px' }}
                >
                    <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" disabledDate={(current) => current && current.isAfter(dayjs(), 'day')} />
                </Form.Item>
                <AddressForm />
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password!' }]}
                    style={{ marginBottom: '12px' }}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>
                <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    rules={[{ required: true, message: 'Please confirm your password!' }]}
                >
                    <Input.Password placeholder="Re-enter Password" />
                </Form.Item>
                <Form.Item style={{ marginBottom: '12px' }}>
                    <Button type="primary" htmlType="submit" block>
                        Sign Up
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button type="link" onClick={() => navigate('/signin')} block>
                        Go to Sign In
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
