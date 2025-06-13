import React, { useEffect, useState } from 'react';
import { Table, Button, message, Typography, Space, Modal } from 'antd';
import axios from 'axios';

const { Text, Link } = Typography;

const VisaStatusManagementInProgress = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  function toCamelCasePreserveAcronym(snake) {
  return snake.split('_').map((part, index) => {
    if (index === 0) return part;
    return part.toUpperCase();
  }).join('');
}

  const handlePreview = (docId) => {
        const url = `http://localhost:5000/api/documents/preview/${docId}`;
        window.open(url, '_blank');
};

  const fetchEmployees = async () =>{
      axios
            .get('http://localhost:5000/api/hr/visa-status/all', {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setEmployees(res.data))
            .catch((err) => setError(err.message));
  }
  useEffect(() => {
    fetchEmployees()
  }, []);

  const getNextStep = (emp) => {
    const { optReceipt, optEAD, i983, i20 } = emp;

    if (optReceipt.status === 'Not Submitted') return ['Submit OPT Receipt', 'notify', 'optReceipt'];
    if (optReceipt.status === 'Pending') return ['Waiting for HR to approve OPT Receipt', 'approve', 'optReceipt'];
    if (optReceipt.status === 'Rejected') return ['Resubmit OPT Receipt', 'notify', 'optReceipt'];

    if (optEAD.status === 'Not Submitted') return ['Submit OPT EAD', 'notify', 'optEAD'];
    if (optEAD.status === 'Pending') return ['Waiting for HR to approve OPT EAD', 'approve', 'optEAD'];
    if (optEAD.status === 'Rejected') return ['Resubmit OPT EAD', 'notify', 'optEAD'];

    if (i983.status === 'Not Submitted') return ['Submit I-983', 'notify', 'i983'];
    if (i983.status === 'Pending') return ['Waiting for HR to approve I-983', 'approve', 'i983'];
    if (i983.status === 'Rejected') return ['Resubmit I-983', 'notify', 'i983'];

    if (i20.status === 'Not Submitted') return ['Submit I-20', 'notify', 'i20'];
    if (i20.status === 'Pending') return ['Waiting for HR to approve I-20', 'approve', 'i20'];
    if (i20.status === 'Rejected') return ['Resubmit I-20', 'notify', 'i20'];

    return ['All documents approved', 'none', null];
  };

  const getDaysRemaining = (endDateStr) => {
    if (!endDateStr) return 'N/A';
    const end = new Date(endDateStr);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days < 0 ? 'Expired' : `${days} day(s)`;
  };

  const handleReview = async ({ userId, docType, action, feedback = '' }) => {
    try {
      await axios.put(
        'http://localhost:5000/api/hr/visa-status/review',
        { userId, docType, action, feedback },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success(`${action} submitted`);
      fetchEmployees()
    } catch (err) {
      message.error('Failed to submit review');
    }
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
      window.URL.revokeObjectURL(url);
    } catch (err) {
      message.error('Download failed');
    }
  };

  const handleNotify = async (userId, docType) => {
    try {
      await axios.post(
        'http://localhost:5000/api/hr/visa-status/notify',
        { userId, type: docType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('Notification sent');
    } catch (err) {
      message.error('Failed to notify');
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
    {
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
                      docType: docKey,
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
                        docType: docKey,
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
  ];

  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: 40 }}>
      <h2>Visa Status - In Progress</h2>
      <Table
        rowKey="userId"
        dataSource={employees}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default VisaStatusManagementInProgress;
