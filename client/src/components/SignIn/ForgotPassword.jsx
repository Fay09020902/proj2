import { CardContainer } from '../../common/QuantityControl'
import { Form, Input, Button, Card } from "antd";
import { useDispatch } from "react-redux";
import { sendResetEmailThunk } from "../../features/user/index";
import { useNavigate } from "react-router-dom";
import styled from '@emotion/styled';
import { useState } from 'react';


const ForgetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const ResponsiveFooter = styled.div `
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;

  @media (max-width: 960px) {
  flex-direction: column;
  }
`;

  const onFinish = async ({ email }) => {
    setError(null)
    try {
      const result = await dispatch(sendResetEmailThunk(email));
      if (sendResetEmailThunk.fulfilled.match(result)) {
        setError(null);
        navigate('/signin');
      } else {
        setError(result.payload || "Failed to send email");
      }
    } catch (err) {
      setError("Unexpected error");
    }
  };

  return (
    <CardContainer>
    <Card style={{ maxWidth: '100%', margin: "0 auto", marginTop: "10%", textAlign:'center' }}>
      <h2>Update Your Password</h2>
      <p>Enter your email, we will send you the recovery link.</p>
      {error && (<div style={{color: 'red'}}>{error}</div>)}
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter your email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Send Recovery Email
          </Button>
        </Form.Item>
        <ResponsiveFooter>
                <p style={{ marginRight: '0.5rem' }}>
                  Don't have an account? <a href="/signup">Sign Up</a>
                </p>
          </ResponsiveFooter>
      </Form>
    </Card>
    </CardContainer>
  );
};

export default ForgetPassword;
