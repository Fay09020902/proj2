import { useState, useEffect } from "react";
import { Tabs } from "antd";
import PersonalInfoForm from "./PersonalInfoForm";
import VisaStatusManagement from "./VisaStatusManagement";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const { TabPane } = Tabs;

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState("1");
  const currentUser = useSelector((state) => state.user.currentUser);

  if (currentUser?.onboardingStatus !== "Approved") {
    return <Navigate to="/onboarding" replace />;
  }
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Employee Dashboard</h1>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Personal Info" key="1">
          {activeTab === "1" && <PersonalInfoForm />}
        </TabPane>
        {currentUser?.profile?.visa?.visaType === "F1(CPT/OPT)" && (
          <TabPane tab="Visa Status Management" key="2">
            {activeTab === "2" && <VisaStatusManagement />}
          </TabPane>
        )}
      </Tabs>
    </div>
  );
};

export default EmployeeDashboard;
