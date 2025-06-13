// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Card, Typography, Select, Input, Button, Spin, message } from 'antd';

// const { Title, Text } = Typography;
// const { Option } = Select;
// import axios from "axios";

// const documentLabels = {
//   optReceipt: "OPT Receipt",
//   optEAD: "OPT EAD",
//   i983: "I-983",
//   i20: "I-20",
// };


// const VisaStatusManagement = ({data}) => {
//       const { userId } = useParams();
//         const [visa, setVisa] = useState(null);
//         const [loading, setLoading] = useState(true);
//         const [feedbacks, setFeedbacks] = useState({});
//         const [actionTypes, setActionTypes] = useState({});
//         const navigate = useNavigate();
//         const token = localStorage.getItem('token');
//         const [err, setErr] = useState(null)

//         const handleApproveandReject = async ({userId, docType, action, feedback}) => {
//     try {
//       await fetch(`http://localhost:5000/api/hr/visa-status/review`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ userId, docType, action, feedback }),
//       });
//     } catch (err) {
//       setErr(err.message)
//     }
//   };

//         const handleDownload = async (docId, filename) => {
//               try {
//                 const res = await axios.get(
//                   `http://localhost:5000/api/documents/download/${docId}`,
//                   {
//                     headers: { Authorization: `Bearer ${token}` },
//                     responseType: 'blob',
//                   }
//                 );
//                 const url = window.URL.createObjectURL(new Blob([res.data]));
//                 const link = document.createElement('a');
//                 link.href = url;
//                 link.setAttribute('download', filename);
//                 document.body.appendChild(link);
//                 link.click();
//                 link.remove();
//                 // Clean up the blob URL
//                 window.URL.revokeObjectURL(url);
//               } catch (err) {
//                 console.error('Download failed', err);
//               }
//             };

//         useEffect(() => {
//             fetch(`http://localhost:5000/api/hr/visa-status/${userId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//             })
//             .then((res) => res.json())
//             .then((data) => setVisa(data))
//             .catch(() => message.error("Failed to load visa data"))
//             .finally(() => setLoading(false));
//         }, [userId, token]);

//         const renderSection = (docType, doc) => {
//             if (!doc) return null;
//             return (
//             <Card title={documentLabels[docType]} style={{ marginBottom: 24 }} key={docType}>
//                 <Text>Status: <b>{doc.status}</b></Text>
//                 {doc.path && (
//                 <div style={{ marginTop: 8 }}>
//                     {/* <a href={`http://localhost:5000${doc.path}`} target="_blank" rel="noopener noreferrer">
//                     <Button>Preview</Button>
//                     </a> */}
//                     <Button
//                         size="small"
//                         type="link"
//                         onClick={() => handleDownload(doc._id, doc.originalName)}
//                         style={{ marginLeft: 4 }}
//                     >
//                         Download
//                     </Button>
//                 </div>
//                 )}
//                 <div style={{ marginTop: 8 }}>
//                 <Select
//                     placeholder="Approve / Reject"
//                     style={{ width: 160, marginRight: 12 }}
//                     disabled={doc.status !== "Pending"}
//                     onChange={(value) => handleApproveandReject({userId, docType, value})}
//                 >
//                     <Option value="approve">Approve</Option>
//                     <Option value="reject">Reject</Option>
//                 </Select>
//                 {/* <Button
//                     type="primary"
//                     disabled={doc.status !== "Pending"}
//                     onClick={() => handleReview(docType)}
//                 >
//                     Submit
//                 </Button> */}
//                 </div>
//                 {doc.feedback && (
//                 <div style={{ marginTop: 8, color: doc.status === "Rejected" ? "red" : "green" }}>
//                     HR Feedback: {doc.feedback}
//                 </div>
//                 )}
//             </Card>
//             );
//   };

//   if (!visa) return <div style={{ marginTop: 40 }}>No visa status found.</div>;
//     if (err) return <Alert message={err} type="error" showIcon style={{ marginTop: 40 }} />;
//   return (
//      <div style={{ padding: 40 }}>
//       <Title level={3}>Visa Document Review - Detail</Title>
//       {Object.entries(documentLabels).map(([docType, label]) =>
//         renderSection(docType, visa[docType])
//       )}
//     </div>
//   );
// };

// export default VisaStatusManagement;
