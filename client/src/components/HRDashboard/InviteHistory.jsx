import { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';

const InviteHistory = ({refreshTrigger}) => {
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/hr/invites', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setInvites(data);
      } catch (err) {
        console.error("Failed to fetch invites:", err);
      }
    };

    fetchInvites();
  }, [refreshTrigger]);

  const columns = [
    {
      title: 'Employee Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Registration Link',
      key: 'link',
      render: (_, record) => {
        const link = `http://localhost:5173/register/${record.token}`;
        return <a href={link} target="_blank" rel="noopener noreferrer">Open Link</a>;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'registered' ? 'green' : 'blue';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Expires At',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  return <Table dataSource={invites} columns={columns} rowKey="_id" />;
};

export default InviteHistory;
