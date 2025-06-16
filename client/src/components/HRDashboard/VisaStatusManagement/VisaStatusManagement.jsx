import VisaStatusForm from "./VisaStatusForm";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Tabs, Spin, Alert, message } from "antd";

const { TabPane } = Tabs;

const VisaStatusManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const handlePreview = (docId) => {
    const url = `http://localhost:5000/api/documents/preview/${docId}`;
    window.open(url, "_blank");
  };

  const getNextStep = (emp) => {
    const { optReceipt, optEAD, i983, i20, workAuth } = emp;
    // "workAuth": "F1(CPT/OPT)",
    if(workAuth !== "F1(CPT/OPT)") {
      return ["Not Applicable", ]
    }

    if (optReceipt.status === "Not Submitted")
      return ["Submit OPT Receipt", "notify", "optReceipt"];
    if (optReceipt.status === "Pending")
      return ["Waiting for HR to approve OPT Receipt", "approve", "optReceipt"];
    if (optReceipt.status === "Rejected")
      return ["Resubmit OPT Receipt", "notify", "optReceipt"];

    if (optEAD.status === "Not Submitted")
      return ["Submit OPT EAD", "notify", "optEAD"];
    if (optEAD.status === "Pending")
      return ["Waiting for HR to approve OPT EAD", "approve", "optEAD"];
    if (optEAD.status === "Rejected")
      return ["Resubmit OPT EAD", "notify", "optEAD"];

    if (i983.status === "Not Submitted")
      return ["Submit I-983", "notify", "i983"];
    if (i983.status === "Pending")
      return ["Waiting for HR to approve I-983", "approve", "i983"];
    if (i983.status === "Rejected") return ["Resubmit I-983", "notify", "i983"];

    if (i20.status === "Not Submitted") return ["Submit I-20", "notify", "i20"];
    if (i20.status === "Pending")
      return ["Waiting for HR to approve I-20", "approve", "i20"];
    if (i20.status === "Rejected") return ["Resubmit I-20", "notify", "i20"];

    return ["All documents approved", "none", null];
  };

  const getDaysRemaining = (endDateStr) => {
    if (!endDateStr) return "N/A";
    const end = new Date(endDateStr);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days < 0 ? "Expired" : `${days} day(s)`;
  };

  const handleReview = async ({ userId, docType, action, feedback = "" }) => {
    try {
      await axios.put(
        "http://localhost:5000/api/hr/visa-status/review",
        { userId, docType, action, feedback },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDownload = async (docId, filename) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/documents/download/${docId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNotify = async (userId, docType) => {
    try {
      await axios.post(
        "http://localhost:5000/api/hr/visa-status/notify",
        { userId, type: docType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Notification sent");
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/hr/visa-status/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEmployees(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const optInProgress = employees.filter(
    (emp) => emp.submittedAllOPT === false && emp.workAuth === "F1(CPT/OPT)"
  );

  return loading ? (
    <Spin />
  ) : (
    <>
      {error && <Alert message="Error" description={error} type="error" showIcon />}
      <Tabs defaultActiveKey="1" destroyInactiveTabPane>
        <TabPane tab="OPT Visa In Progress" key="1">
          <VisaStatusForm
            employees={optInProgress}
            mode="in-progress"
            handleDownload={handleDownload}
            handlePreview={handlePreview}
            handleReview={handleReview}
            handleNotify={handleNotify}
            getNextStep={getNextStep}
            getDaysRemaining={getDaysRemaining}
          />
        </TabPane>
        <TabPane tab="All Visa Status" key="2">
          <VisaStatusForm
            employees={employees}
            mode="all"
            handleDownload={handleDownload}
            handlePreview={handlePreview}
            getNextStep={getNextStep}
            getDaysRemaining={getDaysRemaining}
          />
        </TabPane>
      </Tabs>
    </>
  );
};

export default VisaStatusManagement;
