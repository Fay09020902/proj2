import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Form, Input, Button, Typography, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../../features/user';
import { CardContainer, AuthContainer } from '../../common/QuantityControl'

import styled from '@emotion/styled';

const { Title } = Typography;

const StyledForm = styled(Form)`
  width: 300px;
  .ant-form-item-label {
    color: #333;
  }
`;

const ResponsiveFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;

  @media (max-width: 960px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SignIn = () => {
  const { error, isAuthenticated, isAdmin, onboardingStatus } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      if(isAdmin) {
        navigate('/hr/dashboard');
      } else {
        if (onboardingStatus === 'Unsubmitted' || onboardingStatus === 'Rejected' ) {
         navigate('/onboarding');
        } else {
        navigate("/employee/dashboard");
        }
      }
    }
  }, [isAuthenticated, navigate]);

  const onFinish = async (values) => {
    dispatch(clearError());
    const { email, password } = values;
    await dispatch(loginUser({ email, password }));

  };

  const handleFieldChange = () => {
    if (error) dispatch(clearError());
  };

  return (
    <CardContainer>
      <AuthContainer>
        <Title level={3}>Sign In to Your Account</Title>
        {error && (
  <Form.Item>
    <Alert
      message="Login Failed"
      description={error}
      type="error"
      showIcon
      closable
      onClose={() => dispatch(clearError())}
    />
  </Form.Item>
)}
        <StyledForm name="signin" layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input onChange={handleFieldChange} placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password onChange={handleFieldChange} placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Sign In
            </Button>
          </Form.Item>

          <ResponsiveFooter>
            <p>
              <a href="/forget-password">Forgot Password?</a>
            </p>
          </ResponsiveFooter>
        </StyledForm>
      </AuthContainer>
    </CardContainer>
  );
};

export default SignIn;
