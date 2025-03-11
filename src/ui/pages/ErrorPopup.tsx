import { useEffect } from 'react';

interface ErrorPopupProps {
  message: string;
  onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ message, onClose }) => {

  return (
    <div className="position-fixed top-50 start-50 translate-middle z-3">
      <div className="alert alert-danger d-flex align-items-center fade show shadow-lg" role="alert">
        <div className="d-flex align-items-center">
          <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
          <span className="me-4">{message}</span>
        </div>
        <button 
          type="button" 
          className="btn-close" 
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
};

export default ErrorPopup;