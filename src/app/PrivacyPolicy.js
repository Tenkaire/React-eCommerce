import React from 'react';

// ******************** Ant Design ********************
import { Layout, Typography, Divider } from 'antd';
const { Title, Text } = Typography;
const { Content } = Layout;

const currentDate = new Date().toLocaleDateString();
export default function PrivacyPolicy() {
    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
            <Content style={{ padding: '20px', backgroundColor: 'transparent' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <Title level={2}>Privacy Policy</Title>
                    <Text>Last Updated: {currentDate}</Text>
                    <Divider />

                    <Title level={4}>1. Information We Collect</Title>
                    <Text>
                        We collect information to provide and improve our services. This may include:
                    </Text>
                    <ul>
                        <li><strong>Personal Information:</strong> Name, email address, phone number, shipping address, and payment details.</li>
                        <li><strong>Usage Data:</strong> IP address, browser type, pages visited, time spent on pages, and other analytics.</li>
                        <li><strong>Cookies:</strong> Small files stored on your device to improve your experience and analyze usage.</li>
                    </ul>
                    <Divider />

                    <Title level={4}>2. Changes to This Policy</Title>
                    <Text>
                        We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the updated date will be noted.
                    </Text>
                    <Divider />

                    <Title level={4}>3. Contact Us</Title>
                    <Text>
                        If you have any questions or concerns about this Privacy Policy, please contact us at:
                    </Text>
                    <ul>
                        <li><strong>Email:</strong> <a href="mailto:support@ensemble.com">patrickl@ensemble.com</a></li>
                        <li><strong>Phone:</strong> +1 (778) 862-5332</li>
                    </ul>
                </div>
            </Content>
        </Layout>
    );
}
