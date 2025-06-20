import { useState, useEffect } from 'react';
import { Tabs, Form, Spin } from 'antd';
import PersonalInfoForm from './PersonalInfoForm';
import VisaStatusManagement from './VisaStatusManagement';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { makeHTTPGETFetch } from '../../services/api2';

const { TabPane } = Tabs;

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const currentUser = useSelector((state) => state.user.currentUser);
  const userId = currentUser?.id;
const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await makeHTTPGETFetch(`employee/profile/${userId}`);
        setProfile(data);
        form.setFieldsValue(data);
      } catch (err) {
        console.error('Failed to fetch profile:', err.message);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId, form]);

  if (currentUser?.onboardingStatus !== 'Approved') {
    return <Navigate to="/onboarding" replace />;
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <Spin tip="Loading employee profile..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Employee Dashboard</h1>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Personal Info" key="1">
          {activeTab === '1' && <PersonalInfoForm form={form} profile={profile}  refreshProfile={fetchProfile}/>}
        </TabPane>
        {profile?.visa?.visaType === 'F1(CPT/OPT)' && (
          <TabPane tab="Visa Status Management" key="2">
            {activeTab === '2' && <VisaStatusManagement form={form} profile={profile} />}
          </TabPane>
        )}
      </Tabs>
    </div>
  );
};

export default EmployeeDashboard;
