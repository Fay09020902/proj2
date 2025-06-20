import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Collapse,
  Avatar,
  Space,
  Modal,
} from "antd";
import { useSelector } from "react-redux";
import useDocumentActions from "../../hooks/useDocumentActions";
import axios from "axios";

const { Panel } = Collapse;

const PersonalInfoForm = ({ form, profile, refreshProfile }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const onboardingStatus = currentUser?.onboardingStatus;
  const email = currentUser?.email;
  const token = localStorage.getItem("token");

  const [isEditing, setIsEditing] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [error, setError] = useState("");

  const { handleDownload, handlePreview } = useDocumentActions(token, setError);

  if (!profile) return <p>Loading...</p>;
  if (onboardingStatus !== "Approved")
    return <div>You are not allowed to view this page.</div>;

  const handleUpdate = async (values) => {
    try {
      await axios.put("http://localhost:5000/api/employee/profile", values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      refreshProfile(); // refresh visa data after update
    } catch (err) {
      setError(err.message);
    }
  };

  const onEdit = () => {
    setOriginalProfile(form.getFieldsValue());
    setIsEditing(true);
  };

  const onCancel = () => {
    const confirmDiscard = window.confirm(
      "Are you sure you want to discard all your changes?"
    );
    if (confirmDiscard) {
      form.setFieldsValue(originalProfile); // restore original values
      setIsEditing(false);
    }
  };

  const onSave = async () => {
    try {
      const values = await form.validateFields();
      await handleUpdate(values);
      setIsEditing(false);
    } catch (err) {
      setError(err.message)
    }
  };

  const renderInput = (name, label, disabled = false) => (
    <Form.Item name={name} label={label}>
      <Input disabled={!isEditing || disabled} />
    </Form.Item>
  );

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={profile}
      style={{ background: "#fff", padding: 24 }}
    >
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Space
        direction="vertical"
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 24,
          borderBottom: "1px solid #f0f0f0",
          paddingBottom: 16,
        }}
      >
        <Avatar
          size={120}
          src={profile.profilePictue}
          alt="Profile Picture"
          style={{ border: "1px solid #ccc" }}
        />
        <div style={{ fontSize: 18, fontWeight: 500 }}>
          {`${profile.firstName} ${profile.lastName}`}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {isEditing ? (
            <>
              <Button type="primary" onClick={onSave}>
                Save
              </Button>
              <Button danger onClick={onCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={onEdit}>Edit</Button>
          )}
        </div>
      </Space>

      <Collapse defaultActiveKey={["1", "2", "3", "4", "5"]}>
        <Panel header="Name & Contact" key="1">
          <Row gutter={16}>
            <Col span={8}>{renderInput("firstName", "First Name")}</Col>
            <Col span={8}>{renderInput("lastName", "Last Name")}</Col>
            <Col span={8}>{renderInput("preferredName", "Preferred Name")}</Col>
            <Col span={12}>
              {renderInput(["contact", "cellPhone"], "Cell Phone")}
            </Col>
            <Col span={12}>
              {renderInput(["contact", "workPhone"], "Work Phone")}
            </Col>
            <Col span={24}>
              <Form.Item label="Email">
                <Input value={email} disabled readOnly />
              </Form.Item>
            </Col>
          </Row>
        </Panel>

        <Panel header="Address" key="2">
          <Row gutter={16}>
            {["building", "street", "city", "state", "zip"].map((field) => (
              <Col span={12} key={field}>
                {renderInput(
                  ["address", field],
                  field.charAt(0).toUpperCase() + field.slice(1)
                )}
              </Col>
            ))}
          </Row>
        </Panel>

        <Panel header="Employment" key="3">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Visa Type">
                <Input value={profile.visa?.visaType} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Start Date">
                <Input value={profile.visa?.startDate?.slice(0, 10)} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="End Date">
                <Input value={profile.visa?.endDate?.slice(0, 10)} disabled />
              </Form.Item>
            </Col>
          </Row>
        </Panel>

        <Panel header="Emergency Contact" key="4">
          <Row gutter={16}>
            {[
              "firstName",
              "lastName",
              "middleName",
              "phone",
              "email",
              "relationship",
            ].map((field) => (
              <Col span={8} key={field}>
                {renderInput(["emergencyContacts", 0, field], field)}
              </Col>
            ))}
          </Row>
        </Panel>

        <Panel header="Documents" key="5">
          {Array.isArray(profile.documents) && profile.documents.length > 0 ? (
            profile.documents.map((doc, idx) => (
              <Row key={idx} gutter={16} style={{ marginBottom: 8 }}>
                <Col span={6}>
                  <strong>{doc.type}</strong>
                </Col>
                <Col span={6}>
                  <span>{doc.originalName}</span>
                </Col>
                <Col span={6}>
                  <Button onClick={() => handlePreview(doc._id)}>
                    Preview
                  </Button>
                </Col>
                <Col span={6}>
                  <Button
                    onClick={() => handleDownload(doc._id, doc.originalName)}
                  >
                    Download
                  </Button>
                </Col>
              </Row>
            ))
          ) : (
            <p>No documents uploaded.</p>
          )}
        </Panel>
      </Collapse>
    </Form>
  );
};

export default PersonalInfoForm;
