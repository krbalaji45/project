import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DOCUMENT_ACCEPT,
  DOCUMENT_FORMATS_LABEL,
  validateDocumentFile,
} from "../documentUpload.js";

const BankDetails = () => {
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
    bankName: "",
    accountNumber: "",
    holderName: "",
    ifscCode: "",
    branchAddress: "",
    document: ""
  });

  const [bankFile, setBankFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  /*
    Load saved data only in Edit mode
  */
  useEffect(() => {
    if (!location.state?.editMode || !memberId) {
      return;
    }

    fetch(`http://localhost:5000/userProfiles/${memberId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load bank details");
        }

        return response.json();
      })
      .then((data) => {
        if (data.bankDetails) {
          setFormData({
            bankName: data.bankDetails.bankName || "",
            accountNumber:
              data.bankDetails.accountNumber || "",

            holderName:
              data.bankDetails.holderName || "",

            ifscCode:
              data.bankDetails.ifscCode || "",

            branchAddress:
              data.bankDetails.branchAddress || "",

            document:
              data.bankDetails.document || ""
          });
        }
      })
      .catch((error) => {
        console.log(
          "Error loading bank details:",
          error
        );
      });
  }, [location.state, memberId]);


  /*
    Handle input changes
  */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "accountNumber") {
      if (!/^[0-9]*$/.test(value)) {
        return;
      }

      if (value.length > 18) {
        return;
      }

      setFormData((previousData) => ({
        ...previousData,
        accountNumber: value
      }));
    }

    else if (name === "holderName") {
      if (!/^[A-Za-z ]*$/.test(value)) {
        return;
      }

      setFormData((previousData) => ({
        ...previousData,
        holderName: value
      }));
    }

    else if (name === "ifscCode") {
      const upperValue = value.toUpperCase();

      if (!/^[A-Z0-9]*$/.test(upperValue)) {
        return;
      }

      if (upperValue.length > 11) {
        return;
      }

      setFormData((previousData) => ({
        ...previousData,
        ifscCode: upperValue
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
    Add bank document
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

    setBankFile(file);

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
    Download selected bank file
  */
  const handleFileDownload = () => {
    if (!bankFile) {
      return;
    }

    const fileUrl = URL.createObjectURL(bankFile);

    const link = document.createElement("a");

    link.href = fileUrl;
    link.download = bankFile.name;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(fileUrl);
  };


  /*
    Save bank details
  */
  const handleSave = async () => {
    const newErrors = {};

    if (formData.bankName.trim() === "") {
      newErrors.bankName = "Please enter bank name";
    }

    if (formData.accountNumber.trim() === "") {
      newErrors.accountNumber =
        "Please enter account number";
    } else if (!/^\d{9,18}$/.test(formData.accountNumber)) {
      newErrors.accountNumber =
        "Account number must contain 9 to 18 digits";
    } else if (/([0-9])\1{4,}/.test(formData.accountNumber)) {
      newErrors.accountNumber =
        "Account number cannot contain 5 or more consecutive identical digits";
    }

    if (formData.holderName.trim() === "") {
      newErrors.holderName =
        "Please enter account holder name";
    }

    if (formData.ifscCode.trim() === "") {
      newErrors.ifscCode =
        "Please enter IFSC code";
    } else if (formData.ifscCode.length !== 11) {
      newErrors.ifscCode =
        "IFSC code must be exactly 11 characters";
    }

    if (formData.branchAddress.trim() === "") {
      newErrors.branchAddress =
        "Please enter branch address";
    }

    if (formData.document.trim() === "") {
      newErrors.document =
        "Please upload bank document";
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
            bankDetails: formData
          })
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to save bank details"
        );
      }

      const savedData =
        await response.json();

      console.log(
        "Bank details saved successfully:",
        savedData
      );

      /*
        Edit mode:
        return to Profile Summary

        Normal mode:
        go to Agreement
      */
      if (location.state?.editMode) {
        navigate("/vendor-onboarding/profile-summary", { state: { memberId } });
      } else {
        navigate("/vendor-onboarding/agreement", { state: { memberId } });
      }

    } catch (error) {
      console.log(
        "Error saving bank details:",
        error
      );

      setErrors({
        document:
          "Unable to save bank details. Please try again."
      });

    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="form-card">

      <div className="form-header">

        <h2>Bank Details</h2>

        <p>
          Enter your bank account details
        </p>

      </div>


      {/* ACCOUNT NUMBER */}

      <div className="form-group">

        <label>
          Bank Name
        </label>

        <input
          type="text"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
          placeholder="Enter bank name"
        />

        {errors.bankName && (
          <p className="input-error">
            {errors.bankName}
          </p>
        )}

      </div>

      <div className="form-group">

        <label>
          Account Number
        </label>

        <input
          type="text"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          placeholder="Enter account number"
          inputMode="numeric"
          maxLength="18"
        />

        {errors.accountNumber && (
          <p className="input-error">
            {errors.accountNumber}
          </p>
        )}

      </div>


      {/* HOLDER NAME */}

      <div className="form-group">

        <label>
          Account Holder Name
        </label>

        <input
          type="text"
          name="holderName"
          value={formData.holderName}
          onChange={handleChange}
          placeholder="Enter account holder name"
        />

        {errors.holderName && (
          <p className="input-error">
            {errors.holderName}
          </p>
        )}

      </div>


      {/* IFSC */}

      <div className="form-group">

        <label>
          IFSC Code
        </label>

        <input
          type="text"
          name="ifscCode"
          value={formData.ifscCode}
          onChange={handleChange}
          placeholder="Enter IFSC code"
          maxLength="11"
        />

        {errors.ifscCode && (
          <p className="input-error">
            {errors.ifscCode}
          </p>
        )}

      </div>


      {/* BRANCH ADDRESS */}

      <div className="form-group">

        <label>
          Branch Address
        </label>

        <textarea
          name="branchAddress"
          value={formData.branchAddress}
          onChange={handleChange}
          placeholder="Enter branch address"
        />

        {errors.branchAddress && (
          <p className="input-error">
            {errors.branchAddress}
          </p>
        )}

      </div>


      {/* BANK DOCUMENT */}

      <div className="form-group">

        <label>
          Bank Document
        </label>

        <div className="file-picker-control">
          <button
            type="button"
            className="file-picker-button"
            onClick={() => document.getElementById("bank-document-input").click()}
          >
            Choose file
          </button>
          <input
            id="bank-document-input"
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
              disabled={!bankFile}
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
          {saving ? "Saving..." : "Save Bank Details"}
        </button>

      </div>

    </div>
  );
};

export default BankDetails;