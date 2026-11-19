import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import {
  DOCUMENT_ACCEPT,
  DOCUMENT_FORMATS_LABEL,
  getTodayDate,
  isValidDateOfBirth,
  validateDocumentFile,
} from "../documentUpload.js";

const KycDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const aadhaarDateInputRef = useRef(null);
  const storedMemberId = (() => {
    try {
      return sessionStorage.getItem("memberProfileId");
    } catch (error) {
      return null;
    }
  })();
  const memberId = location.state?.memberId || storedMemberId || null;

  const [formData, setFormData] = useState({
    aadhaar: {
      aadhaarNumber: "",
      name: "",
      dateOfBirth: "",
      document: "",
      backDocument: ""
    },
    pan: {
      panNumber: "",
      name: "",
      document: ""
    }
  });

  // Store the actual selected files temporarily
  const [aadhaarFrontFile, setAadhaarFrontFile] = useState(null);
  const [aadhaarBackFile, setAadhaarBackFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [errors, setErrors] = useState({ aadhaar: {}, pan: {}, form: "" });
  const [statusMessage, setStatusMessage] = useState("");

  const openAadhaarDatePicker = () => {
    const dateInput = aadhaarDateInputRef.current;
    if (!dateInput) {
      return;
    }

    if (typeof dateInput.showPicker === "function") {
      dateInput.showPicker();
    } else {
      dateInput.focus();
      dateInput.click();
    }
  };

  useEffect(() => {
    if (!location.state?.editMode || !memberId) {
      return;
    }

    fetch(`http://localhost:5000/userProfiles/${memberId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load KYC details");
        }

        return response.json();
      })
      .then((data) => {
        if (data.kycDetails) {
          setFormData({
            aadhaar: {
              aadhaarNumber: data.kycDetails.aadhaar?.aadhaarNumber || "",
              name: data.kycDetails.aadhaar?.name || "",
              dateOfBirth: data.kycDetails.aadhaar?.dateOfBirth || "",
              document: data.kycDetails.aadhaar?.document || "",
              backDocument: data.kycDetails.aadhaar?.backDocument || ""
            },
            pan: {
              panNumber: data.kycDetails.pan?.panNumber || "",
              name: data.kycDetails.pan?.name || "",
              document: data.kycDetails.pan?.document || ""
            }
          });
        }
      })
      .catch((error) => {
        console.log("Error loading KYC details:", error);
      });
  }, [location.state, memberId]);

  // Aadhaar Input Change

  const handleAadhaarChange = (e) => {
    const { name, value } = e.target;

    // Aadhaar number - numbers only
    if (name === "aadhaarNumber") {
      if (!/^[0-9]*$/.test(value)) {
        return;
      }

      if (value.length > 12) {
        return;
      }
    }

    // Aadhaar name - letters and spaces only
    if (name === "name") {
      if (!/^[A-Za-z ]*$/.test(value)) {
        return;
      }
    }

    setFormData({
      ...formData,
      aadhaar: {
        ...formData.aadhaar,
        [name]: value
      }
    });

    const errorField = name === "name" ? "name" : name;
    setErrors((previous) => ({
      ...previous,
      aadhaar: { ...previous.aadhaar, [errorField]: "" },
      form: ""
    }));
    setStatusMessage("");
  };


  // PAN Input Change

  const handlePanChange = (e) => {
    const { name, value } = e.target;

    // PAN name - letters and spaces only
    if (name === "name") {
      if (!/^[A-Za-z ]*$/.test(value)) {
        return;
      }
    }

    // PAN number - letters and numbers only
    if (name === "panNumber") {
      if (!/^[A-Za-z0-9]*$/.test(value)) {
        return;
      }

      if (value.length > 10) {
        return;
      }
    }

    setFormData({
      ...formData,
      pan: {
        ...formData.pan,
        [name]: value.toUpperCase()
      }
    });

    setErrors((previous) => ({
      ...previous,
      pan: { ...previous.pan, [name]: "" },
      form: ""
    }));
    setStatusMessage("");
  };

  // Aadhaar Document Selection

  const handleAadhaarDocumentChange = (e, side) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const fileError = validateDocumentFile(file);
    if (fileError) {
      e.target.value = "";
      const field = side === "document" ? "document" : "backDocument";
      setErrors((previous) => ({
        ...previous,
        aadhaar: { ...previous.aadhaar, [field]: fileError },
      }));
      return;
    }

    // Store actual file temporarily
    if (side === "document") {
      setAadhaarFrontFile(file);
    } else {
      setAadhaarBackFile(file);
    }

    // Store filename in formData
    setFormData({
      ...formData,
      aadhaar: {
        ...formData.aadhaar,
        [side]: file.name
      }
    });

    const field = side === "document" ? "document" : "backDocument";
    setErrors((previous) => ({
      ...previous,
      aadhaar: { ...previous.aadhaar, [field]: "" },
      form: ""
    }));
    setStatusMessage("");
  };

  // PAN Document Selection

  const handlePanDocumentChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const fileError = validateDocumentFile(file);
    if (fileError) {
      e.target.value = "";
      setErrors((previous) => ({
        ...previous,
        pan: { ...previous.pan, document: fileError },
      }));
      return;
    }

    // Store actual file temporarily
    setPanFile(file);

    // Store filename in formData
    setFormData({
      ...formData,
      pan: {
        ...formData.pan,
        document: file.name
      }
    });

    setErrors((previous) => ({
      ...previous,
      pan: { ...previous.pan, document: "" },
      form: ""
    }));
    setStatusMessage("");
  };

  // Download Aadhaar Document

  const handleAadhaarDownload = (file) => {
    if (!file) {
      return;
    }

    const fileUrl = URL.createObjectURL(file);

    const link = document.createElement("a");

    link.href = fileUrl;
    link.download = file.name;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(fileUrl);
  };

  // Download PAN Document

  const handlePanDownload = () => {
    if (!panFile) {
      return;
    }

    const fileUrl = URL.createObjectURL(panFile);

    const link = document.createElement("a");

    link.href = fileUrl;
    link.download = panFile.name;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(fileUrl);
  };

  // Save KYC Details
  
  const handleSave = async () => {
    const aadhaarNumber = formData.aadhaar.aadhaarNumber;
    const panNumber = formData.pan.panNumber;
    const newErrors = { aadhaar: {}, pan: {}, form: "" };

    if (!memberId) {
      newErrors.form = "Profile id is missing. Please go back and re-enter the profile.";
    }

    if (!aadhaarNumber) {
      newErrors.aadhaar.aadhaarNumber = "Please enter Aadhaar number";
    } else if (aadhaarNumber.length !== 12) {
      newErrors.aadhaar.aadhaarNumber = "Aadhaar number must contain exactly 12 digits";
    } else if (/([0-9])\1{4,}/.test(aadhaarNumber)) {
      newErrors.aadhaar.aadhaarNumber = "Aadhaar number cannot contain 5 or more consecutive identical digits";
    }

    if (!formData.aadhaar.name.trim()) {
      newErrors.aadhaar.name = "Please enter name as per Aadhaar";
    }

    if (!formData.aadhaar.dateOfBirth) {
      newErrors.aadhaar.dateOfBirth = "Please select date of birth";
    } else if (!isValidDateOfBirth(formData.aadhaar.dateOfBirth)) {
      newErrors.aadhaar.dateOfBirth = "Enter a valid date of birth from 1900 through today";
    }

    if (!formData.aadhaar.document) {
      newErrors.aadhaar.document = "Please upload the front page of Aadhaar";
    }

    if (!formData.aadhaar.backDocument) {
      newErrors.aadhaar.backDocument = "Please upload the back page of Aadhaar";
    }

    if (!panNumber) {
      newErrors.pan.panNumber = "Please enter PAN number";
    } else if (panNumber.length !== 10) {
      newErrors.pan.panNumber = "PAN number must contain exactly 10 characters";
    }

    if (!formData.pan.name.trim()) {
      newErrors.pan.name = "Please enter name as per PAN";
    }

    if (!formData.pan.document) {
      newErrors.pan.document = "Please upload PAN document";
    }

    setErrors(newErrors);
    setStatusMessage("");

    const hasFieldErrors =
      Object.values(newErrors.aadhaar).some(Boolean) ||
      Object.values(newErrors.pan).some(Boolean);

    if (hasFieldErrors || newErrors.form) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/userProfiles/${memberId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            kycDetails: formData
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save KYC details");
      }

      setStatusMessage("KYC details saved successfully. Continuing...");

      try {
        sessionStorage.setItem("memberProfileId", memberId);
      } catch (error) {
        console.log("Unable to persist member id:", error);
      }

      navigate("/vendor-onboarding/gst-details", {
        state: { memberId }
      });
    } catch (error) {
      console.log(error);
      setErrors((previous) => ({
        ...previous,
        form: "Unable to save KYC details. Please try again."
      }));
      setStatusMessage("");
    }
  };

  return (
    <div className="form-card">

      {/* Header */}
      <div className="form-header">
        <h2>Aadhaar & PAN Details</h2>

        <p>
          Enter your Aadhaar and PAN details
        </p>
      </div>

      {errors.form && (
        <p className="input-error" role="alert">
          {errors.form}
        </p>
      )}

      {statusMessage && (
        <p className="kyc-status-message" role="status">
          {statusMessage}
        </p>
      )}

      {/* KYC Cards */}
      <div className="kyc-cards">

        {/* =========================
            AADHAAR CARD
        ========================= */}
        <div className="kyc-card">

          <h3>Aadhaar Details</h3>

          {/* Aadhaar Number */}
          <div className="form-group">
            <label>Aadhaar Number</label>

            <input
              type="text"
              name="aadhaarNumber"
              placeholder="Enter 12 digit Aadhaar number"
              value={formData.aadhaar.aadhaarNumber}
              onChange={handleAadhaarChange}
              maxLength="12"
              inputMode="numeric"
            />
            {errors.aadhaar.aadhaarNumber && (
              <p className="input-error" role="alert">
                {errors.aadhaar.aadhaarNumber}
              </p>
            )}
          </div>

          {/* Aadhaar Name */}
          <div className="form-group">
            <label>Name as per Aadhaar</label>

            <input
              type="text"
              name="name"
              placeholder="Enter name"
              value={formData.aadhaar.name}
              onChange={handleAadhaarChange}
            />
            {errors.aadhaar.name && (
              <p className="input-error" role="alert">
                {errors.aadhaar.name}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="form-group">
            <label>Date of Birth</label>

            <div className="date-picker-control">
              <input
                ref={aadhaarDateInputRef}
                type="date"
                name="dateOfBirth"
                value={formData.aadhaar.dateOfBirth}
                min="1900-01-01"
                max={getTodayDate()}
                onChange={handleAadhaarChange}
              />
              <button
                type="button"
                className="date-picker-button"
                aria-label="Open Aadhaar date of birth calendar"
                onClick={openAadhaarDatePicker}
              >
                <CalendarDays size={18} aria-hidden="true" />
              </button>
            </div>
            {errors.aadhaar.dateOfBirth && (
              <p className="input-error" role="alert">
                {errors.aadhaar.dateOfBirth}
              </p>
            )}
          </div>

          {/* Aadhaar Front Page */}
          <div className="form-group">
            <label>Aadhaar Front Page</label>

            <div className="file-picker-control">
              <button
                type="button"
                className="file-picker-button"
                onClick={() => document.getElementById("aadhaar-front-input").click()}
              >
                Choose file
              </button>
              <input
                id="aadhaar-front-input"
                type="file"
                accept={DOCUMENT_ACCEPT}
                onChange={(e) => handleAadhaarDocumentChange(e, "document")}
                hidden
              />
              {formData.aadhaar.document ? (
                <button
                  type="button"
                  className="file-name-button"
                  onClick={() => handleAadhaarDownload(aadhaarFrontFile)}
                  disabled={!aadhaarFrontFile}
                >
                  {formData.aadhaar.document}
                </button>
              ) : (
                <span className="file-picker-placeholder">No file chosen</span>
              )}
            </div>
            <p className="upload-hint">{DOCUMENT_FORMATS_LABEL}</p>
            {errors.aadhaar.document && (
              <p className="input-error" role="alert">
                {errors.aadhaar.document}
              </p>
            )}
          </div>

          {/* Aadhaar Back Page */}
          <div className="form-group">
            <label>Aadhaar Back Page</label>

            <div className="file-picker-control">
              <button
                type="button"
                className="file-picker-button"
                onClick={() => document.getElementById("aadhaar-back-input").click()}
              >
                Choose file
              </button>
              <input
                id="aadhaar-back-input"
                type="file"
                accept={DOCUMENT_ACCEPT}
                onChange={(e) => handleAadhaarDocumentChange(e, "backDocument")}
                hidden
              />
              {formData.aadhaar.backDocument ? (
                <button
                  type="button"
                  className="file-name-button"
                  onClick={() => handleAadhaarDownload(aadhaarBackFile)}
                  disabled={!aadhaarBackFile}
                >
                  {formData.aadhaar.backDocument}
                </button>
              ) : (
                <span className="file-picker-placeholder">No file chosen</span>
              )}
            </div>
            <p className="upload-hint">{DOCUMENT_FORMATS_LABEL}</p>
            {errors.aadhaar.backDocument && (
              <p className="input-error" role="alert">
                {errors.aadhaar.backDocument}
              </p>
            )}
          </div>

        </div>

        {/* =========================
            PAN CARD
        ========================= */}
        <div className="kyc-card">

          <h3>PAN Details</h3>

          {/* PAN Number */}
          <div className="form-group">
            <label>PAN Number</label>

            <input
              type="text"
              name="panNumber"
              placeholder="Enter PAN number"
              value={formData.pan.panNumber}
              onChange={handlePanChange}
              maxLength="10"
            />
            {errors.pan.panNumber && (
              <p className="input-error" role="alert">
                {errors.pan.panNumber}
              </p>
            )}
          </div>

          {/* PAN Name */}
          <div className="form-group">
            <label>Name as per PAN</label>

            <input
              type="text"
              name="name"
              placeholder="Enter name"
              value={formData.pan.name}
              onChange={handlePanChange}
            />
            {errors.pan.name && (
              <p className="input-error" role="alert">
                {errors.pan.name}
              </p>
            )}
          </div>

          {/* PAN Document */}
          <div className="form-group">
            <label>PAN Document</label>

            <div className="file-picker-control">
              <button
                type="button"
                className="file-picker-button"
                onClick={() => document.getElementById("pan-document-input").click()}
              >
                Choose file
              </button>
              <input
                id="pan-document-input"
                type="file"
                accept={DOCUMENT_ACCEPT}
                onChange={handlePanDocumentChange}
                hidden
              />
              {formData.pan.document ? (
                <button
                  type="button"
                  className="file-name-button"
                  onClick={handlePanDownload}
                  disabled={!panFile}
                >
                  {formData.pan.document}
                </button>
              ) : (
                <span className="file-picker-placeholder">No file chosen</span>
              )}
            </div>
            <p className="upload-hint">{DOCUMENT_FORMATS_LABEL}</p>
            {errors.pan.document && (
              <p className="input-error" role="alert">
                {errors.pan.document}
              </p>
            )}
          </div>

        </div>

      </div>

      {/* Save Button */}
      <div className="form-footer">

        <button
          type="button"
          className="save-button"
          onClick={handleSave}
        >
          Save KYC Details
        </button>

      </div>

    </div>
  );
};

export default KycDetails;