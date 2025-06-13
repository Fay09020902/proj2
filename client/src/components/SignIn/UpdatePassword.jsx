import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Form, Input, Button, Card, message } from "antd";
import { jwtDecode } from 'jwt-decode';
import { updatePasswordThunk } from "../../features/user";
import { CardContainer } from "../../common/QuantityControl";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  //verify token format
  useEffect(() => {
    try {
      jwtDecode(token);
    } catch (e) {
      message.error("Invalid or expired link.");
      navigate("/");
    }
  }, [token, navigate]);

  const onFinish = async ({ password }) => {
    const result = await dispatch(updatePasswordThunk({ token, password }));

    if (updatePasswordThunk.fulfilled.match(result)) {
      message.success("Password updated successfully!");
      navigate("/signin");
    } else {
      message.error(result.payload || "Failed to update password.");
    }
  };

  return (
    <CardContainer>
      <Card style={{ width: "100%", maxWidth: 500, margin: "0 auto" }}>
        <h2>Update Password</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="New Password"
            name="password"
            rules={[{ required: true, message: "Please input your new password" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </CardContainer>
  );
};

export default UpdatePassword;
