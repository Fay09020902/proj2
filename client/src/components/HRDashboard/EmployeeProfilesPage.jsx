import React, { useEffect, useState } from 'react';
import { Table, Input, Typography, Spin, message } from 'antd';
import axios from 'axios';

const { Title } = Typography;
const { Search } = Input;

const EmployeeProfilesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/hr/employees', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sorted = res.data.employees.sort((a, b) => a.lastName.localeCompare(b.lastName));
        setEmployees(sorted);
        setFiltered(sorted);
      } catch (err) {
        message.error('Failed to load employee profiles');
      }
      setLoading(false);
    };

    fetchEmployees();
  }, [token]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);
    const result = employees.filter((emp) => {
      return (
        emp.firstName.toLowerCase().includes(value) ||
        emp.lastName.toLowerCase().includes(value) ||
        emp.preferredName?.toLowerCase().includes(value)
      );
    });
    setFiltered(result);
  };

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => (
        <a
          href={`/hr/employee-profile/${record.userId._id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {record.firstName} {record.lastName}
        </a>
      ),
    },
    {
      title: 'SSN',
      dataIndex: 'ssn',
      key: 'ssn',
    },
    {
      title: 'Work Authorization',
      key: 'workAuth',
      render: (_, record) =>
        record.visa?.isCitizenOrResident
          ? record.visa?.citizenType
          : record.visa?.visaType,
    },
    {
      title: 'Phone',
      dataIndex: ['contact', 'cellPhone'],
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: ['userId', 'email'],
      key: 'email',
    },
  ];

  return (
    <div style={{ padding: 40 }}>
      <Title level={2}>Employee Profiles</Title>
      <p>Total Employees: {filtered.length}</p>
      <Search
        placeholder="Search by first name, last name, or preferred name"
        value={query}
        onChange={handleSearch}
        style={{ marginBottom: 20, maxWidth: 400 }}
        allowClear
      />
      {loading ? (
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey={(record) => record.userId._id}
          pagination={{ pageSize: 8 }}
        />
      )}
    </div>
  );
};

export default EmployeeProfilesPage;
