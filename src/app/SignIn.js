import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ******************** Components ********************
import { validateUser } from './db';

// ******************** Ant Design ********************
import { Button, Form, Input, message } from 'antd';

export default function SignIn({ setIsAuthenticated, setAuthenticatedUser, setLoading }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        const { email, password } = values;
        try {
            const result = await validateUser(email, password);

            if (result.success) {
                message.success(`Welcome back, ${result.userName}!`);
                setIsAuthenticated(true);
                setAuthenticatedUser(email); // Using email directly from values
                navigate('/'); // Redirect to the home page upon success
            } else {
                alert(result.message || "Invalid email or password.");
            }
        } catch (error) {
            console.error("Error signing in:", error);
            alert("An error occurred during sign-in. Please try again.");
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 3000); 
        }

        // console.log('Sign In Data:', values); // Logging form data
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h2 style={{ textAlign: 'center' }}>Sign In</h2>
            <Form onFinish={handleSubmit} layout="vertical"
                style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
                >
                    <Input type="email" name="email" placeholder="Email" onChange={handleChange} />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password name="password" placeholder="Password" onChange={handleChange} />
                </Form.Item>

                <Form.Item style={{ marginBottom: '10px' }}>
                    <Button type="primary" htmlType="submit" block style={{ width: '100%' }}>
                        Sign In
                    </Button>
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                        type="link"
                        onClick={() => navigate('/signup')}
                        style={{ width: '100%' }}
                        block
                    >
                        Go to Sign Up
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
