import React from 'react';

// ******************** Ant Design ********************
import { Layout, Typography, Divider } from 'antd';
const { Content } = Layout;
const { Title, Text } = Typography;

export default function Terms() {
    const currentDate = new Date().toLocaleDateString();

    return (
        <div style={{ padding: '20px' }}>
            <Layout style={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
                <Content style={{ padding: '20px', backgroundColor: 'transparent' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <Title level={2}>Terms of Use</Title>
                        <Text>Last Updated: {currentDate}</Text>
                        <Divider />

                        <Title level={4}>1. Acceptance of Terms</Title>
                        <Text>
                            By using our website and services, you agree to abide by these Terms of Use. If you do not agree to these terms, please do not use our website or services.
                        </Text>
                        <Divider />

                        <Title level={4}>2. Changes to the Terms</Title>
                        <Text>
                            We reserve the right to modify or update these Terms of Use at any time. Any changes will be posted on this page, and the "Last Updated" date will be revised accordingly. Your continued use of our website after changes have been posted constitutes your acceptance of those changes.
                        </Text>
                        <Divider />

                        <Title level={4}>3. Use of the Website</Title>
                        <Text>
                            You agree to use our website only for lawful purposes and in a manner that does not infringe on the rights of others. You may not use the website to:
                        </Text>
                        <ul>
                            <li>Violate any applicable laws or regulations.</li>
                            <li>Transmit any harmful or unlawful content (e.g., viruses, spam, etc.).</li>
                            <li>Interfere with the operation of the website or other users' use of the website.</li>
                        </ul>
                        <Divider />


                        <Title level={4}>4. Contact Us</Title>
                        <Text>
                            If you have any questions or concerns about these Terms of Use, please contact us at:
                        </Text>
                        <ul>
                            <li><strong>Email:</strong> <a href="mailto:support@ensemble.com">patrickl@ensemble.com</a></li>
                            <li><strong>Phone:</strong> +1 (778) 862-5332</li>
                        </ul>
                    </div>
                </Content>
            </Layout>
        </div>
    );
}
