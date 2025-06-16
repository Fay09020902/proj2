import { Tabs } from "antd";
import HiringManagement from "./HiringManagement/HiringManagement";
import VisaStatusManagement from './VisaStatusManagement/VisaStatusManagement'
import EmployeeProfilesPage from './EmployeeProfilesPage'
const { TabPane } = Tabs;

const HRDashboard = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>HR Dashboard</h1>
      <Tabs defaultActiveKey="1"
       tabBarStyle={{ fontSize: '18px', fontWeight: 'bold', padding: '12px 0' }}
      >
        <TabPane tab="Visa Status Management" key="2">
          <VisaStatusManagement />
        </TabPane>
        <TabPane tab="Hiring Management" key="3">
          <HiringManagement />
        </TabPane>
        <TabPane tab="Employee Profiles" key="4">
          <EmployeeProfilesPage />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default HRDashboard;
