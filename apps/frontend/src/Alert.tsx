import React from 'react';
import { useAlert } from './AlertContext';

const Alert: React.FC = () => {
  const { alert, clearAlert } = useAlert();

  if (!alert) return null;

  return (
    <div
      className={`alert alert-${alert.type} alert-dismissible fade show`}
      role="alert"
      style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1050 }}
    >
      {alert.message}
      <button
        type="button"
        className="btn-close"
        aria-label="Close"
        onClick={clearAlert}
      ></button>
    </div>
  );
};

export default Alert;