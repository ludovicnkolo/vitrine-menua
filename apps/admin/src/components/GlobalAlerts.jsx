import React, { useState, useEffect } from "react";
import ConfirmModal from "./ConfirmModal";
import AlertModal from "./AlertModal";
import { alertService } from "../utils/AlertService";

const GlobalAlerts = () => {
  const [alertData, setAlertData] = useState(null); // { message, title, type }
  const [confirmData, setConfirmData] = useState(null); // { message, title, resolve }

  useEffect(() => {
    alertService.setAlertListener((message, title, type) => {
      setAlertData({ message, title, type });
    });

    alertService.setConfirmListener((message, title, resolve) => {
      setConfirmData({ message, title, resolve });
    });

    return () => {
      alertService.setAlertListener(null);
      alertService.setConfirmListener(null);
    };
  }, []);

  const handleAlertClose = () => {
    setAlertData(null);
  };

  const handleConfirm = (choice) => {
    if (confirmData && confirmData.resolve) {
      confirmData.resolve(choice);
    }
    setConfirmData(null);
  };

  return (
    <>
      <AlertModal
        isOpen={!!alertData}
        title={alertData?.title}
        message={alertData?.message}
        type={alertData?.type}
        onClose={handleAlertClose}
      />
      <ConfirmModal
        isOpen={!!confirmData}
        title={confirmData?.title}
        message={confirmData?.message}
        onConfirm={() => handleConfirm(true)}
        onCancel={() => handleConfirm(false)}
      />
    </>
  );
};

export default GlobalAlerts;
