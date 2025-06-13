import { Tabs } from "antd";
import PersonalInfoForm from "./PersonalInfoForm";
import VisaStatusManagement from "./VisaStatusManagement"
const { TabPane } = Tabs;

const EmployeeDashboard = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Employee Dashboard</h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Personal Info" key="1">
          <PersonalInfoForm />
        </TabPane>
        <TabPane tab="Visa Status Management" key="2">
          <VisaStatusManagement />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default EmployeeDashboard;
