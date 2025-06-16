import { useState } from "react";
import axios from "axios";

const useDocumentActions = (token, setError) => {
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
      setError(err.message || "Download failed");
    }
  };

  const handlePreview = (docId) => {
    try {
      const url = `http://localhost:5000/api/documents/preview/${docId}`;
      window.open(url, "_blank");
    } catch (err) {
      setError(err.message || "Preview failed");
    }
  };


  const handleNotify = async (userId, docType) => {
    try {
      await axios.post(
        "http://localhost:5000/api/hr/visa-status/notify",
        { userId, type: docType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return { handleDownload, handlePreview, handleNotify };
};

export default useDocumentActions;
