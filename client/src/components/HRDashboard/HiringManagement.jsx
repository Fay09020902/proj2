import { Tabs } from 'antd';
import { useState } from 'react';
import SendInviteForm from './SendInviteForm';
import InviteHistory from './InviteHistory';
import OnboardingReviewPage from './OnboardingReviewPage';

const HiringManagement = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div style={{ padding: '2rem' }}>
      <Tabs defaultActiveKey="invite">
        <Tabs.TabPane tab="Send Invitation" key="invite">
          <h2>Send Registration Invitation</h2>
          <SendInviteForm setRefreshTrigger={setRefreshTrigger} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Invite History" key="history">
          <h2>Invite History</h2>
          <InviteHistory refreshTrigger={refreshTrigger} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Onboarding Applications" key="applications">
          <h2>Onboarding Application Review</h2>
          <OnboardingReviewPage refreshTrigger={refreshTrigger} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default HiringManagement;
