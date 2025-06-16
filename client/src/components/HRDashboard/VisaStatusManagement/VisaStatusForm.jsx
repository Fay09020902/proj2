import React, { useEffect, useState } from 'react';
import { Table, Button, message, Typography, Space, Modal } from 'antd';
import axios from 'axios';

const { Text, Link } = Typography;

const VisaStatusForm = ({employees,
  mode,
  handleDownload,
  handlePreview,
  handleReview,
  handleNotify,
  getNextStep,
getDaysRemaining}) => {

  const docTypeMap = {
  optReceipt: 'opt_receipt',
  optEAD: 'opt_ead',
  i983: 'i_983',
  i20: 'i_20',
  driverslicense: 'drivers_license',
  profilepicture: 'profile_picture',
};

  function toCamelCasePreserveAcronym(snake) {
  return snake.split('_').map((part, index) => {
    if (index === 0) return part;
    return part.toUpperCase();
  }).join('');
}

  const [docMap, setDocMap] = useState({}); // userId -> [documents]
  const token = localStorage.getItem('token');

const fetchDocsForUser = async (userId) => {
  if (docMap[userId]) return;

  try {
    const res = await axios.get(`http://localhost:5000/api/documents/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDocMap(prev => ({ ...prev, [userId]: res.data }));
  } catch (err) {
    message.error('Failed to fetch user documents');
  }
};

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Work Auth',
      dataIndex: 'workAuth',
      key: 'workAuth',
    },
    {
      title: 'Start - End Date',
      key: 'dateRange',
      render: (_, record) => {
        const start = record.startDate ? new Date(record.startDate).toLocaleDateString() : 'N/A';
        const end = record.endDate ? new Date(record.endDate).toLocaleDateString() : 'N/A';
        return `${start} - ${end}`;
      },
    },
    {
      title: 'Days Remaining',
      key: 'daysRemaining',
      render: (_, record) => getDaysRemaining(record.endDate),
    },
    {
      title: 'Next Step',
      key: 'nextStep',
      render: (_, record) => {
        const [nextStep] = getNextStep(record);
        return <Text>{nextStep}</Text>;
      },
    },
  ]
  if(mode === 'in-progress')
    columns.push({
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const [step, actionType, docKey] = getNextStep(record);
        const doc = record[toCamelCasePreserveAcronym(docKey)] || {};
        return (
          <Space direction="vertical">
            {actionType === 'approve' && (
              <>
                {doc.fileUrl && (
                  <Link href={doc.fileUrl} target="_blank">
                    {doc.originalName}
                  </Link>
                )}
                <Button onClick={() => handlePreview(doc._id)}>Preview</Button>
                <Button
                  onClick={() => handleDownload(doc._id, doc.originalName)}
                >
                  Download
                </Button>
                <Button
                  type="primary"
                  onClick={() =>
                    handleReview({
                      userId: record.userId,
                      docType: docTypeMap[docKey],
                      action: 'approve',
                    })
                  }
                >
                  Approve
                </Button>
                <Button
                  danger
                  onClick={() => {
                    const feedback = prompt('Enter rejection feedback:');
                    if (feedback) {
                      handleReview({
                        userId: record.userId,
                        docType: docTypeMap[docKey],
                        action: 'reject',
                        feedback,
                      });
                    }
                  }}
                >
                  Reject
                </Button>
              </>
            )}
            {actionType === 'notify' && (
              <Button onClick={() => handleNotify(record.userId, docKey)}>
                Send Notification
              </Button>
            )}
          </Space>
        );
      },
    },
  )


  if (mode === 'all') {
    columns.push({
      title: 'Approved Documents',
      key: 'documents',
      render: (_, record) => {
        const approvedTypes = ['optReceipt', 'optEAD', 'i983', 'i20', 'driverslicense', 'profilepicture'];
        return (
          <Space direction="vertical">
            {approvedTypes.map((key) => {
              const doc = record[key];
              if (doc && doc.status === 'Approved') {
                return (
                  <div key={doc._id || key} >
                    <Text strong>{key}: {doc.originalName}</Text>
                    <div style={{ marginTop: '4px' }}>
                      <Button size="small" onClick={() => handlePreview(doc._id)} style={{ marginRight: 8 }}>Preview</Button>
                      <Button size="small" onClick={() => handleDownload(doc._id, doc.originalName)}>Download</Button>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </Space>
        );
      },
    });
  }

  return (
    <div style={{ padding: 40 }}>
      <Table
        rowKey="userId"
        dataSource={employees}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default VisaStatusForm;
