import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Typography, message, Card } from 'antd';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from '../../features/user'
// import { CardContainer } from '../../common/QuantityControl'
// import { makeHTTPPOSTRequest } from '../../services/api';
// import {createUserAsync, clearError} from '../../features/user'

const { Title } = Typography;

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: #f7f7f7;
  border-radius: 10px;
  max-width: 400px;
  margin: 0 auto;
`;

const StyledForm = styled(Form)`
  width: 100%;
  max-width: 300px;
`;

const RegisterWithToken = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams();
  const [err, setErr] = useState(null)
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/validate-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
      body: JSON.stringify({ token }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.email) {
          setEmail(data.email);
        } else {
          message.error(data.message || 'Invalid or expired token');
        }
      })
      .catch((err) => setErr(err));
  }, []);

  const onFinish = async ({ username, password }) => {
    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, token })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      // const storedUser = localStorage.getItem('user');
      //     if (storedUser) {
      //       // const parsedUser = JSON.parse(storedUser);
      //       dispatch(setCurrentUser(JSON.parse(storedUser) ));
      //     }
      message.success('Registration successful!');
      navigate('/signin');
    } catch (err) {
      setErr(err);
    }
  };

  return (
    <RegisterContainer>
      {err && <div style={{ color: "red", marginBottom: "1rem" }}>{err.message}</div>}
      <Title level={3}>Register Your Account</Title>
      <StyledForm layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email">
          <Input value={email} disabled />
        </Form.Item>
        <Form.Item name="username" label="Username" rules={[{ required: true }]}>
          <Input placeholder="Choose a username" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password placeholder="Create a password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>Register</Button>
        </Form.Item>
      </StyledForm>
    </RegisterContainer>
  );
};

export default RegisterWithToken;
