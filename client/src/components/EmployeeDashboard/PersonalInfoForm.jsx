import {fetchEmployees, getEmployeeProfileById} from '../../features/employee'
import { useState, useEffect, ChangeEvent, useCallback } from 'react';
import axios from 'axios';
import {
  Form, Input, Button, Row, Col, Select, Upload, Typography, Collapse, Avatar, Space, message
} from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

const { Title } = Typography;
const { Option } = Select;
const { Panel } = Collapse;


const PersonalInfoForm = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.user.currentUser);
    const token = localStorage.getItem('token');
    const onboardingStatus = currentUser?.onboardingStatus;
    const email = currentUser?.email;
    const userId = currentUser?.id;
     const { error, loading} = useSelector((state) => state.employee);
const [form] = Form.useForm();
const [profile, setProfile] = useState(null);

      const handleDownload = async (docId, filename) => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/documents/download/${docId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob',
          }
        );
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        // Clean up the blob URL
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Download failed', err);
      }
    };

    const handlePreview = (docId) => {
        const url = `http://localhost:5000/api/documents/preview/${docId}`;
        window.open(url, '_blank');
};



    useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/employee/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        form.setFieldsValue(res.data);
      } catch (err) {
        message.error('Failed to load profile');
      }
    };
    fetchProfile();
  }, [userId, token, form]);



    if (!profile) return <p>Loading...</p>;
    if(onboardingStatus !== 'Approved') return (<div>You are not allowed to view the page</div>)
    return (
        <Form form={form} layout="vertical" style={{ background: '#fff', padding: 24 }}>
         {error && <p style={{ color: 'red' }}>{error}</p>}
         <Collapse defaultActiveKey={['1', '2']}>
        <Panel header="Name & Contact" key="1">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="First Name">
                <Input
                  value={profile?.firstName}
                //   disabled={!isEditing}
                //   onChange={handleChange('name', 'firstName')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Last Name">
                <Input
                  value={profile?.lastName}
                  //disabled={!isEditing}
                  //onChange={handleChange('name', 'lastName')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Preferred Name">
                <Input
                  value={profile?.preferredName}
                  //disabled={!isEditing}
                  //onChange={handleChange('name', 'preferredName')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Cell Phone">
                <Input
                  value={profile.contact?.cellPhone}
                  //disabled={!isEditing}
                  //onChange={handleChange('contact', 'cell')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Work Phone">
                <Input
                  value={profile.contact?.workPhone}
                  //disabled={!isEditing}
                  //onChange={handleChange('contact', 'work')}
                />
              </Form.Item>
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
            {['building', 'street', 'city', 'state', 'zip'].map((field) => (
              <Col span={12} key={field}>
                <Form.Item label={field.replace(/\b\w/g, (c) => c.toUpperCase())}>
                  <Input
                    value={profile.address?.[field]}
                    //disabled={!isEditing}
                    //onChange={handleChange('address', field)}
                  />
                </Form.Item>
              </Col>
            ))}
          </Row>
        </Panel>

        <Panel header="Employment" key="3">
          <Row gutter={16}>
            <Col span={8}><Form.Item label="Visa Type"><Input value={profile.visa?.visaType} disabled /></Form.Item></Col>
            <Col span={8}><Form.Item label="Start Date"><Input value={profile.visa?.startDate?.slice(0, 10)} disabled /></Form.Item></Col>
            <Col span={8}><Form.Item label="End Date"><Input value={profile.visa?.endDate?.slice(0, 10)} disabled /></Form.Item></Col>
          </Row>
        </Panel>
<Panel header="Emergency Contact" key="4">
          <Row gutter={16}>
            <Col span={8}><Form.Item label="First Name"><Input value={profile.emergencyContacts?.[0]?.firstName} disabled /></Form.Item></Col>
            <Col span={8}><Form.Item label="Last Name"><Input value={profile.emergencyContacts?.[0]?.lastName} disabled /></Form.Item></Col>
            <Col span={8}><Form.Item label="Middle Name"><Input value={profile.emergencyContacts?.[0]?.middleName} disabled /></Form.Item></Col>
            <Col span={8}><Form.Item label="Phone"><Input value={profile.emergencyContacts?.[0]?.phone} disabled /></Form.Item></Col>
            <Col span={8}><Form.Item label="Email"><Input value={profile.emergencyContacts?.[0]?.email} disabled /></Form.Item></Col>
            <Col span={8}><Form.Item label="Relationship"><Input value={profile.emergencyContacts?.[0]?.relationship} disabled /></Form.Item></Col>
          </Row>
        </Panel>

        <Panel header="Documents" key="5">
          {Array.isArray(profile.documents) && profile.documents.length > 0 ? (
            profile.documents.map((doc, idx) => (
              <Row key={idx} gutter={16} style={{ marginBottom: 8 }}>
                <Col span={6}><strong>{doc.type}</strong></Col>
                <Col span={6}><span>{doc.originalName}</span></Col>
                <Col span={6}><Button onClick={() => handlePreview(doc._id)}>Preview</Button></Col>
                <Col span={6}><Button onClick={() => handleDownload(doc._id, doc.originalName)}>Download</Button></Col>
              </Row>
            ))
          ) : (
            <p>No documents uploaded.</p>
          )}
        </Panel>
      </Collapse>
     </Form>
    )
 }

 export default PersonalInfoForm
