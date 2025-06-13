import { Tabs } from "antd";
import OnboardingReviewPage from "./OnboardingReviewPage";
import HiringManagement from "./HiringManagement";
import VisaStatusManagement from './VisaStatusManagement'
const { TabPane } = Tabs;

const HRDashboard = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>HR Dashboard</h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Onboarding Application Review" key="1">
          <OnboardingReviewPage />
        </TabPane>
        <TabPane tab="Visa Status Management" key="2">
          <VisaStatusManagement />
        </TabPane>
        <TabPane tab="Hiring Management" key="3">
          <HiringManagement />
        </TabPane>

      </Tabs>
    </div>
  );
};

export default HRDashboard;
