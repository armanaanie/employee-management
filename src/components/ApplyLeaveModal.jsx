import React, { useState } from "react";
import { X } from "lucide-react";
import { useLeaves } from "../context/LeaveContext";
import "./ApplyLeaveModal.css";

const ApplyLeaveModal = ({ onClose }) => {
  const { applyLeave } = useLeaves();
  const [formData, setFormData] = useState({
    type: "Casual",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.startDate || !formData.endDate || !formData.reason) {
      setError("Please fill out all fields.");
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError("Start date must be before end date.");
      return;
    }

    setIsSubmitting(true);
    const result = await applyLeave(formData);
    
    if (result.success) {
      onClose();
    } else {
      setError(result.error || "Failed to apply for leave");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel animate-fade-in">
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        <h2>Apply for Leave</h2>
        
        {error && <div className="auth-alert auth-alert--danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Leave Type</label>
            <select
              className="form-input"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Casual">Casual</option>
              <option value="Sick">Sick</option>
              <option value="Annual">Annual</option>
            </select>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Reason</label>
            <textarea
              className="form-input"
              rows="3"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
            ></textarea>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeaveModal;
