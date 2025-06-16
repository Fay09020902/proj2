import { useState } from "react";
import { Tabs } from "antd";
import PersonalInfoForm from "./PersonalInfoForm";
import VisaStatusManagement from "./VisaStatusManagement";

const { TabPane } = Tabs;

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState("1");

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Employee Dashboard</h1>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Personal Info" key="1">
          {activeTab === "1" && <PersonalInfoForm />}
        </TabPane>
        <TabPane tab="Visa Status Management" key="2">
          {activeTab === "2" && <VisaStatusManagement />}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default EmployeeDashboard;
