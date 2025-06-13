import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchApplicationByUserId} from '../../features/onboarding'
import axios from 'axios';
import { Typography, Button, Input, Form, Spin, Collapse, Alert } from 'antd';
const { Title, Paragraph } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;

const ViewApplicationPage = () => {
  const { currentApplication, loading, error } = useSelector((state) => state.onboarding);
  const [err, setErr] = useState(null)
  const dispatch = useDispatch();
  const { userId } = useParams();
  const token = localStorage.getItem('token')
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

   const handleApprove = async () => {
    setSubmitting(true);
    try {
      await fetch(`http://localhost:5000/api/hr/hiring/application/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId }),
      });
      navigate('/hr/dashboard');
    } catch (err) {
      setErr(err.message)
    }
    setSubmitting(false);
  };

    const handleReject = async () => {
    if (!feedback.trim()) return alert('Please provide feedback for rejection');
    setSubmitting(true);
    try {
      await fetch(`http://localhost:5000/api/hr/hiring/application/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, feedback }),
      });
      navigate('/hr/dashboard');
    } catch (err) {
      setErr(err.message)
    }
    setSubmitting(false);
  };


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

  useEffect(() => {
     dispatch(fetchApplicationByUserId({ userId, token }));
  }, [userId] )


  if (loading) return <Spin style={{ marginTop: 40 }} />;
  if (error) return <Alert message={error} type="error" showIcon style={{ marginTop: 40 }} />;
  if (!currentApplication) return <div style={{ marginTop: 40 }}>Application not found.</div>;

  const { fullName, email, status, feedback: existingFeedback, profile } = currentApplication;
return (
       <div style={{ padding: 40, maxWidth: 700, margin: 'auto' }}>
      <Title level={2}>Onboarding Application</Title>
      <Collapse defaultActiveKey={['1', '2', '3', '4', '5', '6', '7']}>
        <Panel header="Basic Info" key="1">
          <Paragraph><b>Full Name:</b> {fullName}</Paragraph>
          <Paragraph><b>Email:</b> {email}</Paragraph>
        </Panel>
        <Panel header="Personal Info" key="2">
          <Paragraph><b>SSN:</b> {profile?.ssn}</Paragraph>
          <Paragraph><b>Date of Birth:</b> {profile?.dob?.slice(0,10)}</Paragraph>
          <Paragraph><b>Gender:</b> {profile?.gender}</Paragraph>
        </Panel>
        <Panel header="Address" key="3">
          <Paragraph><b>Building:</b> {profile?.address?.building}</Paragraph>
          <Paragraph><b>Street:</b> {profile?.address?.street}</Paragraph>
          <Paragraph><b>City:</b> {profile?.address?.city}</Paragraph>
          <Paragraph><b>State:</b> {profile?.address?.state}</Paragraph>
          <Paragraph><b>ZIP:</b> {profile?.address?.zip}</Paragraph>
        </Panel>
        <Panel header="Contact" key="4">
          <Paragraph><b>Cell Phone:</b> {profile?.contact?.cellPhone}</Paragraph>
          <Paragraph><b>Work Phone:</b> {profile?.contact?.workPhone}</Paragraph>
        </Panel>
        <Panel header="Visa" key="5">
          <Paragraph><b>Is Citizen/Resident:</b> {profile?.visa?.isCitizenOrResident ? "Yes" : "No"}</Paragraph>
          {profile?.visa?.isCitizenOrResident && (
            <Paragraph><b>Citizen Type:</b> {profile?.visa?.citizenType}</Paragraph>
          )}
          {profile?.visa && !profile?.visa?.isCitizenOrResident && (
            <>
              <Paragraph><b>Visa Type:</b> {profile?.visa?.visaType}</Paragraph>
              <Paragraph><b>Other Visa Title:</b> {profile?.visa?.otherVisaTitle}</Paragraph>
              <Paragraph><b>Start Date:</b> {profile?.visa?.startDate?.slice(0, 10)}</Paragraph>
              <Paragraph><b>End Date:</b> {profile?.visa?.endDate?.slice(0, 10)}</Paragraph>
            </>
          )}
        </Panel>
        <Panel header="Reference" key="6">
          <Paragraph><b>First Name:</b> {profile?.reference?.firstName}</Paragraph>
          <Paragraph><b>Last Name:</b> {profile?.reference?.lastName}</Paragraph>
          <Paragraph><b>Middle Name:</b> {profile?.reference?.middleName}</Paragraph>
          <Paragraph><b>Phone:</b> {profile?.reference?.phone}</Paragraph>
          <Paragraph><b>Email:</b> {profile?.reference?.email}</Paragraph>
          <Paragraph><b>Relationship:</b> {profile?.reference?.relationship}</Paragraph>
        </Panel>
        <Panel header="Emergency Contacts" key="7">
          {profile?.emergencyContacts?.length
            ? profile.emergencyContacts.map((ec, idx) => (
                <div key={idx}>
                  <Paragraph><b>First Name:</b> {ec.firstName}</Paragraph>
                  <Paragraph><b>Last Name:</b> {ec.lastName}</Paragraph>
                  <Paragraph><b>Middle Name:</b> {ec.middleName}</Paragraph>
                  <Paragraph><b>Phone:</b> {ec.phone}</Paragraph>
                  <Paragraph><b>Email:</b> {ec.email}</Paragraph>
                  <Paragraph><b>Relationship:</b> {ec.relationship}</Paragraph>
                  {idx !== profile.emergencyContacts.length - 1 && <hr />}
                </div>
              ))
            : <Paragraph>-</Paragraph>
          }
        </Panel>

        <Panel header="Uploaded Documents" key="8">
          {profile?.documents && profile.documents.length ? (
            profile.documents.map((doc) => (
              <Paragraph key={doc._id}>
                <b>{doc.type.replace('_', ' ').toUpperCase()}</b>: {doc.originalName}
                <Button
                  size="small"
                  type="link"
                  onClick={() => handleDownload(doc._id, doc.originalName)}
                  style={{ marginLeft: 4 }}
                >
                  Download
                </Button>
                {doc.feedback && <span style={{ color: 'red', marginLeft: 8 }}>Feedback: {doc.feedback}</span>}
              </Paragraph>
            ))
          ) : (
            <Paragraph>No documents uploaded.</Paragraph>
          )}
        </Panel>
      </Collapse>

      {(status === 'Rejected' || status === 'Approved') && (
        <Alert message={`HR Feedback: ${existingFeedback || "None"}`} type={status === 'Rejected' ? 'error' : 'success'} showIcon style={{ margin: "24px 0" }}/>
      )}
      {err && <div style={{ color: "red", marginBottom: "1rem" }}>{err}</div>}
      {status === 'Pending' && (
         <Form layout="vertical" style={{ marginTop: 32 }}>
          <Form.Item label="Feedback (required if rejecting)">
            <TextArea rows={3} value={feedback} onChange={e => setFeedback(e.target.value)} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleApprove} loading={submitting} style={{ marginRight: 8 }}>
              Approve
            </Button>
            <Button danger onClick={handleReject} loading={submitting} style={{ marginRight: 5 }}>
              Reject
            </Button>
          </Form.Item>
        </Form>
      )}
      <div style={{ marginTop: 24 }}>
        <Button onClick={() => navigate('/hr/dashboard')}>Return to Review Page</Button>
      </div>
    </div>
)
};

export default ViewApplicationPage;
