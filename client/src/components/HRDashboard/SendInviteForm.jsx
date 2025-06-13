import { Form, Input, Button, message } from "antd";
import { CardContainer, AuthContainer } from '../../common/QuantityControl'
import { useState } from "react";

const SendInviteForm = ({setRefreshTrigger}) => {
    const [submitted, setSubmitted] = useState(false);
    const [err, setErr] = useState(null)
    const token = localStorage.getItem('token');

  const onFinish = async ({ name, email }) => {
    try {
      const res = await fetch("http://localhost:5000/api/hr/send-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
         },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSubmitted(true);
      setRefreshTrigger(prev => prev + 1)
      setErr(null)
    } catch (err) {
      setErr(err.message)
      message.error(err.message || "Something went wrong.");
    }
  };
  // Reset submitted and error state on input change
  const handleInputChange = () => {
    if (submitted) setSubmitted(false);
    if (err) setErr(null);
  };

  return (
        <AuthContainer>
        {err && <div style={{ color: "red", marginBottom: "1rem" }}>{err}</div>}
        {submitted && (
          <div style={{ textAlign: "center" }}>
            <h2>Request Submitted ✅</h2>
          </div>
        )}
            <Form layout="vertical" onFinish={onFinish}>
            <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
              <Input onChange={handleInputChange} />
            </Form.Item>
            <Form.Item name="email" label="Work Email" rules={[{ required: true, type: "email" }]}>
              <Input  onChange={handleInputChange}/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Send Invitation Link</Button>
            </Form.Item>
          </Form>

    </AuthContainer>
  );
};

export default SendInviteForm;
