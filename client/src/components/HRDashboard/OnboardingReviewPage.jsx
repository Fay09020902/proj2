import React, { useEffect, useMemo, useState } from 'react';
import { Typography, Button, Input, Form, Collapse, Spin, Tabs, Table } from 'antd';
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplicationsByStatus } from '../../features/onboarding'
import TabPane from 'antd/es/tabs/TabPane';
const { TextArea } = Input;
// Tabs for Pending, Approved, and Rejected

// For each application: show full name, email, and “View Application” button

// “View Application”:

// For Pending: show full data + approve/reject buttons

// For Rejected and Approved: view-only

const statusList = ['Pending', 'Approved', 'Rejected'];


  const columns = [
    { title: 'Full Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'View Application',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => window.open(`/hr/view-application/${record.userId}`, '_blank')}
        >
          View Application
        </Button>
      ),
    },
  ];

const OnboardingReviewPage = () => {
//   const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending');
  const { applications, fetched, loading, error } = useSelector((state) => state.onboarding);
  const token = localStorage.getItem('token')
  const [feedback, setFeedback] = useState('');
  const dispatch = useDispatch();

  //console.log("reredender happens")
//   console.log(applications)



    useEffect(() => {
        //console.log("useefect happens")
      if(token && !fetched[activeTab]) {
        //console.log("useefect fetch happens")
        dispatch(fetchApplicationsByStatus({ status: activeTab, token }));
      }
  }, [activeTab, fetched, token]);

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
