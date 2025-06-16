import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Typography, message, Card } from 'antd';
import styled from '@emotion/styled';
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
  const { token } = useParams();
  const [err, setErr] = useState(null)
  const [email, setEmail] = useState('');
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/validate-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (data.message === 'User already registered with this email. Please Signin') {
        setAlreadyRegistered(true);
      }
        if (!res.ok) {
          throw new Error(data.message);
        }
        if(data.email) {
          setEmail(data.email)
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
      <StyledForm layout="vertical" onFinish={onFinish} disabled={alreadyRegistered}>
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
