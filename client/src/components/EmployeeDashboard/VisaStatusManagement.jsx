import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button, Collapse, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Panel } = Collapse;

const VisaStatusManagement = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const token = localStorage.getItem('token');
  const userId = currentUser?.id;
  const [visa, setVisa] = useState(null);
  const [form] = Form.useForm();

  const fetchVisaStatus = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/employee/visa-status/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVisa(res.data);
      } catch (err) {
        message.error('Failed to fetch visa status');
      }
    };

    useEffect(() => {
      if (userId && token) fetchVisaStatus();
    }, [userId, token]);


const handleUpload = (type) => async ({ file }) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  formData.append('userId', userId);

  try {
    await axios.post('http://localhost:5000/api/documents/upload', formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    message.success(`${type} uploaded successfully`);
    //refetch status to get new status and the next step based on new status
    fetchVisaStatus();
  } catch (err) {
    message.error('Upload failed');
  }
};

  if (!visa) return <p>Loading...</p>;

  const renderStage = () => {
    const { optReceipt, optEAD, i983, i20 } = visa;

    if (!optReceipt || optReceipt.status === 'Not Submitted' || optReceipt.status === 'Rejected') {
      return (
        <>
          <p>Please upload your OPT Receipt</p>
          {optReceipt?.status === 'Rejected' && <p style={{ color: 'red' }}>HR Feedback: {optReceipt.feedback}</p>}
          <Upload customRequest={handleUpload('opt_receipt')} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Upload OPT Receipt</Button>
          </Upload>
        </>
      );
    }

    if (optReceipt.status === 'Pending') {
      return <p>Waiting for HR to approve your OPT Receipt</p>;
    }

    if (optReceipt.status === 'Approved' && (!optEAD || optEAD.status === 'Not Submitted' || optEAD.status === 'Rejected')) {
      return (
        <>
          <p>Please upload your OPT EAD</p>
          {optEAD?.status === 'Rejected' && <p style={{ color: 'red' }}>HR Feedback: {optEAD.feedback}</p>}
          <Upload customRequest={handleUpload('opt_ead')} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Upload OPT EAD</Button>
          </Upload>
        </>
      );
    }

    if (optEAD?.status === 'Pending') {
      return <p>Waiting for HR to approve your OPT EAD</p>;
    }

    if (optEAD?.status === 'Approved' && (!i983 || i983.status === 'Not Submitted' || i983.status === 'Rejected')) {
      return (
        <>
          <p>Please download and fill out the I-983 form</p>
          <a href="/static/i983-empty.pdf" target="_blank" rel="noreferrer">Empty Template</a><br />
          <a href="/static/i983-sample.pdf" target="_blank" rel="noreferrer">Sample Template</a><br />
          {i983?.status === 'Rejected' && <p style={{ color: 'red' }}>HR Feedback: {i983.feedback}</p>}
          <Upload customRequest={handleUpload('i_983')} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Upload I-983</Button>
          </Upload>
        </>
      );
    }

    if (i983?.status === 'Pending') {
      return <p>Waiting for HR to approve your I-983</p>;
    }

    if (i983?.status === 'Approved' && (!i20 || i20.status === 'Not Submitted' || i20.status === 'Rejected')) {
      return (
        <>
          <p>Please upload your I-20</p>
          {i20?.status === 'Rejected' && <p style={{ color: 'red' }}>HR Feedback: {i20.feedback}</p>}
          <Upload customRequest={handleUpload('i_20')} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Upload I-20</Button>
          </Upload>
        </>
      );
    }

    if (i20?.status === 'Pending') {
      return <p>Waiting for HR to approve your I-20</p>;
    }

    if (i20?.status === 'Approved') {
      return <p>🎉 All documents approved!</p>;
    }

    return null;
  };

  return (
    <Form form={form} layout="vertical" style={{ background: '#fff', padding: 24 }}>
      <Collapse defaultActiveKey={['visa']}>
        <Panel header="Visa Status Document Upload" key="visa">
          {renderStage()}
        </Panel>
      </Collapse>
    </Form>
  );
};

export default VisaStatusManagement;
