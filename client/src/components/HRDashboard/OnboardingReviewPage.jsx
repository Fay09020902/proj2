import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Typography, Button, Input, Form, Collapse, Spin, Tabs, Table } from 'antd';
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplicationsByStatus } from '../../features/onboarding'
import TabPane from 'antd/es/tabs/TabPane';
const { TextArea } = Input;


const OnboardingReviewPage = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const { applications, fetched, loading, error } = useSelector((state) => state.onboarding);
  const token = localStorage.getItem('token')
  const [initialFetched, setInitialFetched] = useState(false);
  const [feedback, setFeedback] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

    const columns = [
    { title: 'Full Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'View Application',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/hr/view-application/${record.userId}`)}
        >
          View Application
        </Button>
      ),
    },
  ];


  useEffect(() => {
      if (token && !initialFetched) {
          //避免重复fetch
        dispatch(fetchApplicationsByStatus({ status: activeTab, token }));
        setInitialFetched(true);
      } else if (token && !fetched[activeTab]) {
        dispatch(fetchApplicationsByStatus({ status: activeTab, token }));
      }
}, [activeTab, fetched, token, initialFetched]);

  const tabData = useMemo(() => applications[activeTab] || [], [applications, activeTab])

  if (!applications) return <div>Applications not found</div>;


    return (

        <div style={{ padding: 40, maxWidth: 700, margin: 'auto' }}>
           <Title level={2}>Onboarding Applications</Title>
           <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
            {["Pending", "Approved", "Rejected"].map(status => (
              <TabPane tab={status} key={status}>
                {loading? (
                  <Spin/>
                ): (
                  <Table
                dataSource={tabData}
                columns={columns}
                rowKey="userId"
                pagination={{ pageSize: 8 }}
              />
                )}
              </TabPane>
            ))}
           </Tabs>
      </div>
    )
}
export default OnboardingReviewPage;
