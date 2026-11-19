import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DOCUMENT_ACCEPT,
  DOCUMENT_FORMATS_LABEL,
  validateDocumentFile,
} from "../documentUpload.js";

const GstDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const storedMemberId = (() => {
    try {
      return sessionStorage.getItem("memberProfileId");
    } catch (error) {
      return null;
    }
  })();
  const memberId = location.state?.memberId || storedMemberId || null;

  const [formData, setFormData] = useState({
    gstNumber: "",
    legalName: "",
    businessType: "",
    otherBusinessType: "",
    registrationNumber: "",
    businessAddress: "",
    document: ""
  });

  const [gstFile, setGstFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  /*
    Load saved data only when Edit is clicked
  */
  useEffect(() => {
    if (!location.state?.editMode || !memberId) {
      return;
    }

    fetch(`http://localhost:5000/userProfiles/${memberId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load GST details");
        }

        return response.json();
      })
      .then((data) => {
        if (data.gstDetails) {
          setFormData({
            gstNumber: data.gstDetails.gstNumber || "",
            legalName: data.gstDetails.legalName || "",
            businessType: data.gstDetails.businessType || "",
            otherBusinessType: data.gstDetails.otherBusinessType || "",
            registrationNumber:
              data.gstDetails.registrationNumber || "",
            businessAddress:
              data.gstDetails.businessAddress || "",
            document: data.gstDetails.document || ""
          });
        }
      })
      .catch((error) => {
        console.log("Error loading GST details:", error);
      });
  }, [location.state, memberId]);


  /*
    Handle input changes
  */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "gstNumber") {
      const upperValue = value.toUpperCase();

      if (!/^[A-Z0-9]*$/.test(upperValue)) {
        return;
      }

      if (upperValue.length > 15) {
        return;
      }

      setFormData((previousData) => ({
        ...previousData,
        gstNumber: upperValue
      }));
    }

    else if (name === "legalName") {
      if (!/^[A-Za-z ]*$/.test(value)) {
        return;
      }

      setFormData((previousData) => ({
        ...previousData,
        legalName: value
      }));
    }

    else if (name === "registrationNumber") {
      if (!/^[A-Za-z0-9]*$/.test(value)) {
        return;
      }

      setFormData((previousData) => ({
        ...previousData,
        registrationNumber: value
      }));
    }

    else if (name === "businessType") {
      setFormData((previousData) => ({
        ...previousData,
        businessType: value,
        otherBusinessType:
          value === "Other" ? previousData.otherBusinessType : ""
      }));
    }

    else {
      setFormData((previousData) => ({
        ...previousData,
        [name]: value
      }));
    }

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: ""
    }));
  };


  /*
    Add GST document
  */
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const fileError = validateDocumentFile(file);
    if (fileError) {
      e.target.value = "";
      setErrors((previousErrors) => ({
        ...previousErrors,
        document: fileError
      }));
      return;
    }

    setGstFile(file);

    setFormData((previousData) => ({
      ...previousData,
      document: file.name
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      document: ""
    }));
  };


  /*
    Download selected GST file
  */
  const handleFileDownload = () => {
    if (!gstFile) {
      return;
    }

    const fileUrl = URL.createObjectURL(gstFile);

    const link = document.createElement("a");

    link.href = fileUrl;
    link.download = gstFile.name;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(fileUrl);
  };


  /*
    Save GST details
  */
  const handleSave = async () => {
    const newErrors = {};

    if (formData.gstNumber.trim() === "") {
      newErrors.gstNumber =
        "Please enter GST number";
    } else if (formData.gstNumber.length !== 15) {
      newErrors.gstNumber =
        "GST number must be exactly 15 characters";
    }

    if (formData.legalName.trim() === "") {
      newErrors.legalName =
        "Please enter legal name";
    }

    if (formData.businessType.trim() === "") {
      newErrors.businessType =
        "Please select business type";
    } else if (
      formData.businessType === "Other" &&
      !formData.otherBusinessType.trim()
    ) {
      newErrors.otherBusinessType =
        "Please specify your business type";
    }

    if (formData.registrationNumber.trim() === "") {
      newErrors.registrationNumber =
        "Please enter registration number";
    }

    if (formData.businessAddress.trim() === "") {
      newErrors.businessAddress =
        "Please enter business address";
    }

    if (formData.document.trim() === "") {
      newErrors.document =
        "Please upload GST certificate";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setSaving(true);

    try {
      if (!memberId) {
        throw new Error("Missing member id");
      }

      const response = await fetch(
        `http://localhost:5000/userProfiles/${memberId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            gstDetails: formData
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save GST details");
      }

      const savedData = await response.json();

      console.log(
        "GST details saved successfully:",
        savedData
      );

      /*
        Edit mode:return to Profile Summary
        Normal mode:go to Bank Details
      */
      if (location.state?.editMode) {
        navigate("/vendor-onboarding/profile-summary", { state: { memberId } });
      } else {
        navigate("/vendor-onboarding/bank-details", { state: { memberId } });
      }

    } catch (error) {
      console.log(
        "Error saving GST details:",
        error
      );

      setErrors({
        document:
          "Unable to save GST details. Please try again."
      });

    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-card">

      <div className="form-header">
        <h2>GST Details</h2>

        <p>
          Enter your GST and business details
        </p>
      </div>

      {/* GST NUMBER */}

      <div className="form-group">

        <label>GST Number</label>

        <input
          type="text"
          name="gstNumber"
          value={formData.gstNumber}
          onChange={handleChange}
          placeholder="Enter GST number"
          maxLength="15"
        />

        {errors.gstNumber && (
          <p className="input-error">
            {errors.gstNumber}
          </p>
        )}

      </div>

      {/* LEGAL NAME */}

      <div className="form-group">

        <label>Legal Name</label>

        <input
          type="text"
          name="legalName"
          value={formData.legalName}
          onChange={handleChange}
          placeholder="Enter legal name"
        />

        {errors.legalName && (
          <p className="input-error">
            {errors.legalName}
          </p>
        )}

      </div>

      {/* BUSINESS TYPE */}

      <div className="form-group">

        <label>Business Type</label>

        <select
          name="businessType"
          value={formData.businessType}
          onChange={handleChange}
        >
          <option value="">
            Select business type
          </option>

          <option value="Proprietorship">
            Proprietorship
          </option>

          <option value="Partnership">
            Partnership
          </option>

          <option value="Private Limited">
            Private Limited
          </option>

          <option value="LLP">
            LLP
          </option>

          <option value="Other">
            Other
          </option>
        </select>

        {errors.businessType && (
          <p className="input-error">
            {errors.businessType}
          </p>
        )}

      </div>

      {formData.businessType === "Other" && (
        <div className="form-group">
          <label htmlFor="other-business-type">Specify Business Type</label>
          <input
            id="other-business-type"
            type="text"
            name="otherBusinessType"
            value={formData.otherBusinessType}
            onChange={handleChange}
            placeholder="Enter your business type"
          />
          {errors.otherBusinessType && (
            <p className="input-error" role="alert">
              {errors.otherBusinessType}
            </p>
          )}
        </div>
      )}

      {/* REGISTRATION NUMBER */}

      <div className="form-group">

        <label>Registration Number</label>

        <input
          type="text"
          name="registrationNumber"
          value={formData.registrationNumber}
          onChange={handleChange}
          placeholder="Enter registration number"
        />

        {errors.registrationNumber && (
          <p className="input-error">
            {errors.registrationNumber}
          </p>
        )}

      </div>

      {/* BUSINESS ADDRESS */}

      <div className="form-group">

        <label>Business Address</label>

        <textarea
          name="businessAddress"
          value={formData.businessAddress}
          onChange={handleChange}
          placeholder="Enter business address"
        />

        {errors.businessAddress && (
          <p className="input-error">
            {errors.businessAddress}
          </p>
        )}

      </div>

      {/* GST DOCUMENT */}

      <div className="form-group">

        <label>GST Certificate</label>

        <div className="file-picker-control">
          <button
            type="button"
            className="file-picker-button"
            onClick={() => document.getElementById("gst-document-input").click()}
          >
            Choose file
          </button>
          <input
            id="gst-document-input"
            type="file"
            accept={DOCUMENT_ACCEPT}
            onChange={handleFileChange}
            hidden
          />
          {formData.document ? (
            <button
              type="button"
              className="file-name-button"
              onClick={handleFileDownload}
              disabled={!gstFile}
            >
              {formData.document}
            </button>
          ) : (
            <span className="file-picker-placeholder">No file chosen</span>
          )}
        </div>
        <p className="upload-hint">{DOCUMENT_FORMATS_LABEL}</p>

        {errors.document && (
          <p className="input-error">
            {errors.document}
          </p>
        )}

      </div>

      {/* SAVE */}

      <div className="form-footer">

        <button
          type="button"
          className="save-button"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save GST Details"}
        </button>

      </div>

    </div>
  );
};

export default GstDetails;