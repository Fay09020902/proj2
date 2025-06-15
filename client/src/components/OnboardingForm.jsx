import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Alert,
  Input,
  Select,
  Button,
  Typography,
  DatePicker,
  Checkbox,
  Card,
  Upload,
  message,
  Space,
} from "antd";
import styled from "@emotion/styled";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";
import { setCurrentUser, setOnboardingStatus } from "../features/user";
import EmployeeDashboard from "./EmployeeDashboard/EmployeeDashboard";

const { Title } = Typography;
const { Option } = Select;

const SubInput = styled.div`
  margin-left: 2rem;
  padding: 1rem 0;
`;

const OnboardingForm = () => {
  const [form] = Form.useForm();
  const [isCitizen, setIsCitizen] = useState("unknown");
  const [visaType, setVisaType] = useState("");
  const [optReceipt, setOptReceipt] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [err, setErr] = useState(null);
  const currentUser = useSelector((state) => state.user.currentUser);
  const token = localStorage.getItem("token");
  const onboardingStatus = currentUser?.onboardingStatus;
  const email = currentUser?.email;
  const feedback = currentUser?.feedback;
  const isPending = onboardingStatus === "Pending";

const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleOptUpload = async (file) => {
    if (!file || !token) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "opt_receipt");
    formData.append("userId", currentUser.id);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/documents/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const uploaded = res.data.document;
      setUploadedDocuments((prev) => [...prev, uploaded._id]);
      setOptReceipt({ url: uploaded.fileUrl, docId: uploaded._id });
      message.success("OPT Receipt uploaded successfully");
    } catch (err) {
      console.error("OPT Upload failed", err);
    }
  };

  //如果更改type 删除opt document，delete 这个user all documents

  const handlePreview = (docId) => {
    const url = `http://localhost:5000/api/documents/preview/${docId}`;
    window.open(url, "_blank");
  };

  const onFinish = async (values) => {
    if (visaType === "F1(CPT/OPT)" && !optReceipt) {
      message.error("Please upload OPT Receipt before submitting.");
      return;
    }

    try {
      const payload = {
        ...values,
        profilePictue: profilePicture,
        //documents: uploadedDocuments, // store only IDs of uploaded docs (optional)
      };

      const res = await fetch("http://localhost:5000/api/employee/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const { message: errMsg } = await res.json();
        throw new Error(errMsg || "Failed to submit onboarding form.");
      }
      dispatch(setOnboardingStatus("Pending"));

      const updatedUser = { ...currentUser, onboardingStatus: "Pending" };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      message.success("Onboarding form submitted successfully.");
    } catch (err) {
      setErr(err);
      message.error(err.message || "Submission failed.");
    }
  };

  useEffect(() => {
  if (onboardingStatus === 'Approved' ) {
    navigate(`/employee/dashboard`);
  }
}, [onboardingStatus, userId, navigate]);

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
      disabled={isPending}
    >
      {isPending && (
        <Alert
          message="Profile Submitted"
          description="Your onboarding profile has been submitted successfully and is awaiting HR approval."
          type="success"
          showIcon
        />
      )}
      {onboardingStatus === "Rejected" && (
        <Alert
          message="Your application is rejected"
          description={
            <>
              Your onboarding profile is rejected and please review feedback and
              resubmit
              <div>
                <b>Feedback: {feedback}</b>
              </div>
            </>
          }
          type="error"
          showIcon
        />
      )}
      {onboardingStatus === "Rejected"}
      <Title level={4}>Basic Info</Title>
      <Form.Item
        label="Upload Profile Picture (URL)"
        name="profilePicture"
        required
        rules={[
          { required: true, message: "Please provide a profile picture URL" },
          { type: "url", message: "Please enter a valid URL" },
        ]}
      >
        <Input
          value={profilePicture}
          onChange={(e) => setProfilePicture(e.target.value)}
          placeholder="Enter image URL"
        />
      </Form.Item>
      <Form.Item
        name="firstName"
        label="First Name"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="middleName" label="Middle Name">
        <Input />
      </Form.Item>
      <Form.Item name="preferredName" label="Preferred Name">
        <Input />
      </Form.Item>

      <Title level={4}>Address</Title>
      <Form.Item
        name={["address", "building"]}
        label="Building"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={["address", "street"]}
        label="Street"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={["address", "city"]}
        label="City"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={["address", "state"]}
        label="State"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={["address", "zip"]}
        label="ZIP"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Title level={4}>Contact</Title>
      <Form.Item
        name={["contact", "cellPhone"]}
        label="Cell Phone"
        rules={[
          { required: true, message: "Cell phone is required" },
          { pattern: /^\d{10}$/, message: "Must be 10 digits" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name={["contact", "workPhone"]} label="Work Phone">
        <Input />
      </Form.Item>
      <Form.Item label="Email">
        <Input value={email} disabled />
      </Form.Item>

      <Title level={4}>Personal</Title>
      <Form.Item
        name="dob"
        label="Date of Birth"
        rules={[
          { required: true },
          () => ({
            validator(_, value) {
              return value && value.isBefore()
                ? Promise.resolve()
                : Promise.reject(
                    new Error("Date of Birth must be in the past")
                  );
            },
          }),
        ]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="gender"
        label="Gender"
        rules={[{ required: true, message: "Please select your gender" }]}
      >
        <Select placeholder="Select gender">
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
          <Option value="prefer not to say">Prefer not to say</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="ssn"
        label="SSN"
        rules={[
          { required: true, message: "SSN is required" },
          {
            pattern: /^\d{3}-\d{2}-\d{4}$/,
            message: "SSN must be in the format XXX-XX-XXXX",
          },
        ]}
      >
        <Input placeholder="123-45-6789" />
      </Form.Item>

      <Title level={4}>Visa</Title>
      <Form.Item
        name={["visa", "isCitizenOrResident"]}
        label="Permanent resident or citizen of the U.S.?"
        required
      >
        <Select
          onChange={(value) => {
            setIsCitizen(value);
          }}
          allowClear
        >
          <Option value={true}>Yes</Option>
          <Option value={false}>No</Option>
        </Select>
      </Form.Item>

      {isCitizen === true ? (
        <SubInput>
          <Form.Item name={["visa", "citizenType"]} label="Citizen Type">
            <Select>
              <Option value="Green Card">Green Card</Option>
              <Option value="Citizen">Citizen</Option>
            </Select>
          </Form.Item>
        </SubInput>
      ) : !isCitizen ? (
        <SubInput>
          <Form.Item
            name={["visa", "visaType"]}
            label="What is your work authorization?"
          >
            <Select
              value={visaType || undefined}
              onChange={(value) => setVisaType(value)}
              allowClear
            >
              <Option value="H1-B">H1-B</Option>
              <Option value="L2">L2</Option>
              <Option value="F1(CPT/OPT)">F1(CPT/OPT)</Option>
              <Option value="H4">H4</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          {visaType === "F1(CPT/OPT)" && (
            <Form.Item label="Upload OPT Receipt">
              <Upload
                beforeUpload={(file) => {
                  handleOptUpload(file);
                  return false;
                }}
                maxCount={1}
              >
                {" "}
                <Button icon={<UploadOutlined />}>Upload</Button>{" "}
              </Upload>
            </Form.Item>
          )}

          {visaType === "Other" && (
            <Form.Item
              name={["visa", "otherVisaTitle"]}
              label="Other Visa Title"
            >
              <Input />
            </Form.Item>
          )}

          <Form.Item name={["visa", "startDate"]} label="Start Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name={["visa", "endDate"]} label="End Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </SubInput>
      ) : null}

      <Title level={4}>Reference (Who referred you?)</Title>
      <Form.Item name={["reference", "firstName"]} label="First Name" required>
        <Input />
      </Form.Item>
      <Form.Item name={["reference", "lastName"]} label="Last Name" required>
        <Input />
      </Form.Item>
      <Form.Item name={["reference", "middleName"]} label="Middle Name">
        <Input />
      </Form.Item>
      <Form.Item name={["reference", "phone"]} label="Phone">
        <Input />
      </Form.Item>
      <Form.Item name={["reference", "email"]} label="Email">
        <Input />
      </Form.Item>
      <Form.Item
        name={["reference", "relationship"]}
        label="Relationship"
        required
      >
        <Input />
      </Form.Item>

      <Title level={4}>Emergency Contact(s)</Title>
      <Form.List name="emergencyContacts">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card key={key} style={{ marginBottom: "1rem" }}>
                <Form.Item
                  {...restField}
                  name={[name, "firstName"]}
                  label="First Name"
                  required
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "lastName"]}
                  label="Last Name"
                  required
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "middleName"]}
                  label="Middle Name"
                >
                  <Input />
                </Form.Item>
                <Form.Item {...restField} name={[name, "phone"]} label="Phone">
                  <Input />
                </Form.Item>
                <Form.Item {...restField} name={[name, "email"]} label="Email">
                  <Input />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "relationship"]}
                  label="Relationship"
                  required
                >
                  <Input />
                </Form.Item>
                <Button danger onClick={() => remove(name)}>
                  Remove
                </Button>
              </Card>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block>
                Add Emergency Contact
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Title level={4}>Summary of Uploaded Files</Title>

      {profilePicture ? (
        <Space style={{ justifyContent: "space-between", width: "100%" }}>
          <span>
            <strong>Profile Picture</strong>
          </span>
          <Space>
            <a href={profilePicture} target="_blank" rel="noopener noreferrer">
              Preview
            </a>
          </Space>
        </Space>
      ) : (
        <p>Profile Picture: Not uploaded</p>
      )}

      {optReceipt ? (
        <Space
          style={{
            justifyContent: "space-between",
            width: "100%",
            marginTop: "0.5rem",
          }}
        >
          <span>
            <strong>OPT Receipt</strong>
          </span>
          <Space>
            <Button onClick={() => handlePreview(optReceipt.docId)}>
              Preview
            </Button>
          </Space>
        </Space>
      ) : (
        <p>OPT Receipt: Not uploaded</p>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default OnboardingForm;
