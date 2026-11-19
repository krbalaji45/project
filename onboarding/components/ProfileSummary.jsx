import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DOCUMENT_ACCEPT,
  DOCUMENT_FORMATS_LABEL,
  getTodayDate,
  isValidDateOfBirth,
  validateDocumentFile,
} from "../documentUpload.js";

const ProfileSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const storedMemberId = (() => {
    try {
      return sessionStorage.getItem("memberProfileId");
    } catch (error) {
      console.error("Unable to read stored member id:", error);
      return null;
    }
  })();
  const memberId = location.state?.memberId || storedMemberId || null;
  const [userProfile, setUserProfile] = useState(null);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (!memberId) {
      return;
    }

    fetch(`http://localhost:5000/userProfiles/${memberId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load profile");
        }

        return response.json();
      })
      .then((data) => {
        setUserProfile(data);
        setOriginalProfile(data);
      })
      .catch((error) => {
        console.log("Error loading profile:", error);
      });
  }, [memberId]);

  const handleChange = (section, field, value) => {
    setUserProfile((previousData) => ({
      ...previousData,
      [section]: {
        ...previousData[section],
        [field]: value
      }
    }));

    setMessage("");
    clearValidationError(`${section}.${field}`);
  };

  const handleKycChange = (section, field, value) => {
    setUserProfile((previousData) => ({
      ...previousData,
      kycDetails: {
        ...previousData.kycDetails,
        [section]: {
          ...previousData.kycDetails[section],
          [field]: value
        }
      }
    }));

    setMessage("");
    clearValidationError(`kycDetails.${section}.${field}`);
  };

  const clearValidationError = (field) => {
    setValidationErrors((previousErrors) => {
      if (!previousErrors[field]) {
        return previousErrors;
      }

      const nextErrors = { ...previousErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const renderFieldError = (field) =>
    validationErrors[field] ? (
      <p className="input-error" role="alert">
        {validationErrors[field]}
      </p>
    ) : null;

  const handleDocumentChange = (event, section, field, nestedSection) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const fileError = validateDocumentFile(file);
    if (fileError) {
      event.target.value = "";
      const errorKey = nestedSection
        ? `kycDetails.${nestedSection}.${field}`
        : `${section}.${field}`;
      setValidationErrors((previousErrors) => ({
        ...previousErrors,
        [errorKey]: fileError,
      }));
      return;
    }

    if (nestedSection) {
      handleKycChange(nestedSection, field, file.name);
    } else {
      handleChange(section, field, file.name);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setMessage("");
  };

  const handleCancelEdit = () => {
    setUserProfile(originalProfile);
    setEditMode(false);
    setMessage("");
  };

  const hasChanges =
    editMode &&
    originalProfile &&
    JSON.stringify(userProfile) !== JSON.stringify(originalProfile);

  const handleSubmit = async () => {
    setMessage("");
    setValidationErrors({});

    if (!memberId) {
      setMessage("Unable to update profile. Missing member id.");
      return;
    }

    const errors = {};
    const aadhaarNumber = aadhaar.aadhaarNumber || "";
    const panNumber = pan.panNumber || "";
    const gstNumber = (gstDetails.gstNumber || "").toUpperCase();
    const accountNumber = bankDetails.accountNumber || "";
    const ifscCode = (bankDetails.ifscCode || "").toUpperCase();

    if (!/^\d{12}$/.test(aadhaarNumber)) {
      errors["kycDetails.aadhaar.aadhaarNumber"] =
        "Aadhaar number must contain exactly 12 digits.";
    } else if (/([0-9])\1{4,}/.test(aadhaarNumber)) {
      errors["kycDetails.aadhaar.aadhaarNumber"] =
        "Aadhaar number cannot contain 5 or more consecutive identical digits.";
    }
    if (!aadhaar.name?.trim()) {
      errors["kycDetails.aadhaar.name"] = "Enter the name as per Aadhaar.";
    }
    if (!isValidDateOfBirth(aadhaar.dateOfBirth || "")) {
      errors["kycDetails.aadhaar.dateOfBirth"] =
        "Select a valid Aadhaar date of birth from 1900 through today.";
    }
    if (!aadhaar.document?.trim()) {
      errors["kycDetails.aadhaar.document"] = "Upload the Aadhaar front page.";
    }
    if (!aadhaar.backDocument?.trim()) {
      errors["kycDetails.aadhaar.backDocument"] =
        "Upload the Aadhaar back page.";
    }

    if (!/^[A-Za-z0-9]{10}$/.test(panNumber)) {
      errors["kycDetails.pan.panNumber"] =
        "PAN number must contain exactly 10 letters or digits.";
    }
    if (!pan.name?.trim()) {
      errors["kycDetails.pan.name"] = "Enter the name as per PAN.";
    }
    if (!pan.document?.trim()) {
      errors["kycDetails.pan.document"] = "Upload the PAN document.";
    }

    if (!/^[A-Z0-9]{15}$/.test(gstNumber)) {
      errors["gstDetails.gstNumber"] =
        "GST number must contain exactly 15 letters or digits.";
    }
    if (!gstDetails.legalName?.trim()) {
      errors["gstDetails.legalName"] = "Enter the legal name.";
    }
    if (!gstDetails.businessType?.trim()) {
      errors["gstDetails.businessType"] = "Select a business type.";
    }
    if (
      gstDetails.businessType === "Other" &&
      !gstDetails.otherBusinessType?.trim()
    ) {
      errors["gstDetails.otherBusinessType"] = "Specify the business type.";
    }
    if (!gstDetails.registrationNumber?.trim()) {
      errors["gstDetails.registrationNumber"] = "Enter the registration number.";
    }
    if (!gstDetails.businessAddress?.trim()) {
      errors["gstDetails.businessAddress"] = "Enter the business address.";
    }
    if (!gstDetails.document?.trim()) {
      errors["gstDetails.document"] = "Upload the GST certificate.";
    }

    if (!bankDetails.bankName?.trim()) {
      errors["bankDetails.bankName"] = "Enter the bank name.";
    }
    if (!/^\d{9,18}$/.test(accountNumber)) {
      errors["bankDetails.accountNumber"] =
        "Bank account number must contain 9 to 18 digits.";
    } else if (/([0-9])\1{4,}/.test(accountNumber)) {
      errors["bankDetails.accountNumber"] =
        "Bank account number cannot contain 5 or more consecutive identical digits.";
    }
    if (!bankDetails.holderName?.trim()) {
      errors["bankDetails.holderName"] = "Enter the account holder name.";
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      errors["bankDetails.ifscCode"] = "Enter a valid 11-character IFSC code.";
    }
    if (!bankDetails.branchAddress?.trim()) {
      errors["bankDetails.branchAddress"] = "Enter the branch address.";
    }
    if (!bankDetails.document?.trim()) {
      errors["bankDetails.document"] = "Upload the bank document.";
    }
    if (agreement.accepted !== true) {
      errors["agreement.accepted"] = "Accept the agreement.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setEditMode(true);
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `http://localhost:5000/userProfiles/${memberId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(userProfile)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      const savedData = await response.json();

      setUserProfile(savedData);
      setOriginalProfile(savedData);
      setEditMode(false);
      setMessage("Profile updated successfully.");
      setValidationErrors({});

      console.log("Profile submitted successfully:", savedData);
    } catch (error) {
      console.log("Error submitting profile:", error);
      setMessage("Unable to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="form-card">
        <p>Loading profile...</p>
      </div>
    );
  }

  const kycDetails = userProfile.kycDetails || {};
  const aadhaar = kycDetails.aadhaar || {};
  const pan = kycDetails.pan || {};

  const gstDetails = userProfile.gstDetails || {};
  const bankDetails = userProfile.bankDetails || {};
  const agreement = userProfile.agreement || {};

  return (
    <div className="form-card profile-summary-card">

      <div className="form-header">
        <h2>Profile Summary</h2>
        <p>
          Review your profile details before submitting.
        </p>
      </div>

      {/* ================= KYC ================= */}

      <div className="summary-section">

        <div className="summary-section-header">
          <h3>1. Aadhaar & PAN Details</h3>
        </div>

        <div className="summary-subsection">

          <h4>Aadhaar Details</h4>

          <div className="summary-grid">

            <div>
              <span>Aadhaar Number</span>

              {editMode ? (
                <input
                  type="text"
                  value={aadhaar.aadhaarNumber || ""}
                  onChange={(e) =>
                    handleKycChange(
                      "aadhaar",
                      "aadhaarNumber",
                      e.target.value
                    )
                  }
                />
              ) : (
                <strong>
                  {aadhaar.aadhaarNumber || "-"}
                </strong>
              )}
              {renderFieldError("kycDetails.aadhaar.aadhaarNumber")}
            </div>

            <div>
              <span>Name</span>

              {editMode ? (
                <input
                  type="text"
                  value={aadhaar.name || ""}
                  onChange={(e) =>
                    handleKycChange(
                      "aadhaar",
                      "name",
                      e.target.value
                    )
                  }
                />
              ) : (
                <strong>
                  {aadhaar.name || "-"}
                </strong>
              )}
              {renderFieldError("kycDetails.aadhaar.name")}
            </div>

            <div>
              <span>Date of Birth</span>

              {editMode ? (
                <input
                  type="date"
                  min="1900-01-01"
                  max={getTodayDate()}
                  value={aadhaar.dateOfBirth || ""}
                  onChange={(e) =>
                    handleKycChange(
                      "aadhaar",
                      "dateOfBirth",
                      e.target.value
                    )
                  }
                />
              ) : (
                <strong>
                  {aadhaar.dateOfBirth || "-"}
                </strong>
              )}
              {renderFieldError("kycDetails.aadhaar.dateOfBirth")}
            </div>

            <div>
              <span>Aadhaar Front Page</span>
              {editMode ? (
                <div className="file-picker-control">
                  <button
                    type="button"
                    className="file-picker-button"
                    onClick={() => document.getElementById("summary-aadhaar-front-input").click()}
                  >
                    Choose file
                  </button>
                  <input
                    id="summary-aadhaar-front-input"
                    type="file"
                    accept={DOCUMENT_ACCEPT}
                    onChange={(event) => handleDocumentChange(event, "kycDetails", "document", "aadhaar")}
                    hidden
                  />
                  <span className="file-picker-placeholder">
                    {aadhaar.document || "No file chosen"}
                  </span>
                </div>
              ) : (
                <strong>{aadhaar.document || "-"}</strong>
              )}
              {editMode && (
                <p className="upload-hint">{DOCUMENT_FORMATS_LABEL}</p>
              )}
              {renderFieldError("kycDetails.aadhaar.document")}
            </div>

            <div>
              <span>Aadhaar Back Page</span>
              {editMode ? (
                <div className="file-picker-control">
                  <button
                    type="button"
                    className="file-picker-button"
                    onClick={() => document.getElementById("summary-aadhaar-back-input").click()}
                  >
                    Choose file
                  </button>
                  <input
                    id="summary-aadhaar-back-input"
                    type="file"
                    accept={DOCUMENT_ACCEPT}
                    onChange={(event) => handleDocumentChange(event, "kycDetails", "backDocument", "aadhaar")}
                    hidden
                  />
                  <span className="file-picker-placeholder">
                    {aadhaar.backDocument || "No file chosen"}
                  </span>
                </div>
              ) : (
                <strong>{aadhaar.backDocument || "-"}</strong>
              )}
              {editMode && (
                <p className="upload-hint">{DOCUMENT_FORMATS_LABEL}</p>
              )}
              {renderFieldError("kycDetails.aadhaar.backDocument")}
            </div>

          </div>
        </div>

        <div className="summary-subsection">

          <h4>PAN Details</h4>

          <div className="summary-grid">

            <div>
              <span>PAN Number</span>

              {editMode ? (
                <input
                  type="text"
                  value={pan.panNumber || ""}
                  onChange={(e) =>
                    handleKycChange(
                      "pan",
                      "panNumber",
                      e.target.value.toUpperCase()
                    )
                  }
                />
              ) : (
                <strong>
                  {pan.panNumber || "-"}
                </strong>
              )}
              {renderFieldError("kycDetails.pan.panNumber")}
            </div>

            <div>
              <span>Name</span>

              {editMode ? (
                <input
                  type="text"
                  value={pan.name || ""}
                  onChange={(e) =>
                    handleKycChange(
                      "pan",
                      "name",
                      e.target.value
                    )
                  }
                />
              ) : (
                <strong>
                  {pan.name || "-"}
                </strong>
              )}
              {renderFieldError("kycDetails.pan.name")}
            </div>

            <div>
              <span>PAN Document</span>
              {editMode ? (
                <div className="file-picker-control">
                  <button
                    type="button"
                    className="file-picker-button"
                    onClick={() => document.getElementById("summary-pan-input").click()}
                  >
                    Choose file
                  </button>
                  <input
                    id="summary-pan-input"
                    type="file"
                    accept={DOCUMENT_ACCEPT}
                    onChange={(event) => handleDocumentChange(event, "kycDetails", "document", "pan")}
                    hidden
                  />
                  <span className="file-picker-placeholder">
                    {pan.document || "No file chosen"}
                  </span>
                </div>
              ) : (
                <strong>{pan.document || "-"}</strong>
              )}
              {editMode && (
                <p className="upload-hint">{DOCUMENT_FORMATS_LABEL}</p>
              )}
              {renderFieldError("kycDetails.pan.document")}
            </div>

          </div>
        </div>

      </div>

      {/* ================= GST ================= */}

      <div className="summary-section">

        <div className="summary-section-header">
          <h3>2. GST Details</h3>
        </div>

        <div className="summary-grid">

          <div>
            <span>GST Number</span>

            {editMode ? (
              <input
                type="text"
                value={gstDetails.gstNumber || ""}
                onChange={(e) =>
                  handleChange(
                    "gstDetails",
                    "gstNumber",
                    e.target.value.toUpperCase()
                  )
                }
              />
            ) : (
              <strong>
                {gstDetails.gstNumber || "-"}
              </strong>
            )}
            {renderFieldError("gstDetails.gstNumber")}
          </div>

          <div>
            <span>Legal Name</span>

            {editMode ? (
              <input
                type="text"
                value={gstDetails.legalName || ""}
                onChange={(e) =>
                  handleChange(
                    "gstDetails",
                    "legalName",
                    e.target.value
                  )
                }
              />
            ) : (
              <strong>
                {gstDetails.legalName || "-"}
              </strong>
            )}
            {renderFieldError("gstDetails.legalName")}
          </div>

          <div>
            <span>Business Type</span>

            {editMode ? (
              <select
                value={gstDetails.businessType || ""}
                onChange={(e) =>
                  handleChange(
                    "gstDetails",
                    "businessType",
                    e.target.value
                  )
                }
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
            ) : (
              <strong>
                {gstDetails.businessType || "-"}
              </strong>
            )}
            {renderFieldError("gstDetails.businessType")}
          </div>

          {gstDetails.businessType === "Other" && (
            <div>
              <span>Specify Business Type</span>
              {editMode ? (
                <input
                  type="text"
                  value={gstDetails.otherBusinessType || ""}
                  onChange={(e) =>
                    handleChange(
                      "gstDetails",
                      "otherBusinessType",
                      e.target.value
                    )
                  }
                />
              ) : (
                <strong>{gstDetails.otherBusinessType || "-"}</strong>
              )}
              {renderFieldError("gstDetails.otherBusinessType")}
            </div>
          )}

          <div>
            <span>Registration Number</span>

            {editMode ? (
              <input
                type="text"
                value={gstDetails.registrationNumber || ""}
                onChange={(e) =>
                  handleChange(
                    "gstDetails",
                    "registrationNumber",
                    e.target.value
                  )
                }
              />
            ) : (
              <strong>
                {gstDetails.registrationNumber || "-"}
              </strong>
            )}
            {renderFieldError("gstDetails.registrationNumber")}
          </div>

          <div className="full-width">
            <span>Business Address</span>

            {editMode ? (
              <textarea
                value={gstDetails.businessAddress || ""}
                onChange={(e) =>
                  handleChange(
                    "gstDetails",
                    "businessAddress",
                    e.target.value
                  )
                }
              />
            ) : (
              <strong>
                {gstDetails.businessAddress || "-"}
              </strong>
            )}
            {renderFieldError("gstDetails.businessAddress")}
          </div>

          <div>
            <span>GST Certificate</span>
            {editMode ? (
              <div className="file-picker-control">
                <button
                  type="button"
                  className="file-picker-button"
                  onClick={() => document.getElementById("summary-gst-input").click()}
                >
                  Choose file
                </button>
                <input
                  id="summary-gst-input"
                  type="file"
                  accept={DOCUMENT_ACCEPT}
                  onChange={(event) => handleDocumentChange(event, "gstDetails", "document")}
                  hidden
                />
                <span className="file-picker-placeholder">
                  {gstDetails.document || "No file chosen"}
                </span>
              </div>
            ) : (
              <strong>{gstDetails.document || "-"}</strong>
            )}
            {editMode && (
              <p className="upload-hint">{DOCUMENT_FORMATS_LABEL}</p>
            )}
            {renderFieldError("gstDetails.document")}
          </div>

        </div>
      </div>

      {/* ================= BANK ================= */}

      <div className="summary-section">

        <div className="summary-section-header">
          <h3>3. Bank Details</h3>
        </div>

        <div className="summary-grid">

          <div>
            <span>Bank Name</span>
            {editMode ? (
              <input
                type="text"
                value={bankDetails.bankName || ""}
                onChange={(e) =>
                  handleChange("bankDetails", "bankName", e.target.value)
                }
              />
            ) : (
              <strong>{bankDetails.bankName || "-"}</strong>
            )}
            {renderFieldError("bankDetails.bankName")}
          </div>

          <div>
            <span>Account Number</span>

            {editMode ? (
              <input
                type="text"
                value={bankDetails.accountNumber || ""}
                onChange={(e) =>
                  handleChange(
                    "bankDetails",
                    "accountNumber",
                    e.target.value
                  )
                }
              />
            ) : (
              <strong>
                {bankDetails.accountNumber || "-"}
              </strong>
            )}
            {renderFieldError("bankDetails.accountNumber")}
          </div>

          <div>
            <span>Account Holder Name</span>

            {editMode ? (
              <input
                type="text"
                value={bankDetails.holderName || ""}
                onChange={(e) =>
                  handleChange(
                    "bankDetails",
                    "holderName",
                    e.target.value
                  )
                }
              />
            ) : (
              <strong>
                {bankDetails.holderName || "-"}
              </strong>
            )}
            {renderFieldError("bankDetails.holderName")}
          </div>

          <div>
            <span>IFSC Code</span>

            {editMode ? (
              <input
                type="text"
                value={bankDetails.ifscCode || ""}
                aria-invalid={Boolean(validationErrors["bankDetails.ifscCode"])}
                aria-describedby={
                  validationErrors["bankDetails.ifscCode"]
                    ? "summary-ifsc-error"
                    : undefined
                }
                onChange={(e) =>
                  handleChange(
                    "bankDetails",
                    "ifscCode",
                    e.target.value.toUpperCase()
                  )
                }
              />
            ) : (
              <strong>
                {bankDetails.ifscCode || "-"}
              </strong>
            )}
            {validationErrors["bankDetails.ifscCode"] && (
              <p
                id="summary-ifsc-error"
                className="input-error"
                role="alert"
              >
              {validationErrors["bankDetails.ifscCode"]}
              </p>
            )}
          </div>

          <div>
            <span>Bank Document</span>
            {editMode ? (
              <div className="file-picker-control">
                <button
                  type="button"
                  className="file-picker-button"
                  onClick={() => document.getElementById("summary-bank-input").click()}
                >
                  Choose file
                </button>
                <input
                  id="summary-bank-input"
                  type="file"
                  accept={DOCUMENT_ACCEPT}
                  onChange={(event) => handleDocumentChange(event, "bankDetails", "document")}
                  hidden
                />
                <span className="file-picker-placeholder">
                  {bankDetails.document || "No file chosen"}
                </span>
              </div>
            ) : (
              <strong>{bankDetails.document || "-"}</strong>
            )}
            {editMode && (
              <p className="upload-hint">{DOCUMENT_FORMATS_LABEL}</p>
            )}
            {renderFieldError("bankDetails.document")}
          </div>

          <div className="full-width">
            <span>Branch Address</span>

            {editMode ? (
              <textarea
                value={bankDetails.branchAddress || ""}
                onChange={(e) =>
                  handleChange(
                    "bankDetails",
                    "branchAddress",
                    e.target.value
                  )
                }
              />
            ) : (
              <strong>
                {bankDetails.branchAddress || "-"}
              </strong>
            )}
            {renderFieldError("bankDetails.branchAddress")}
          </div>

        </div>
      </div>

      {/* ================= AGREEMENT ================= */}

      <div className="summary-section">

        <div className="summary-section-header">
          <h3>4. Agreement</h3>
        </div>

        <div className="summary-grid">

          <div>
            <span>Agreement Status</span>

            <strong className="accepted-status">
              {agreement.accepted
                ? "Accepted"
                : "Not Accepted"}
            </strong>
            {renderFieldError("agreement.accepted")}
          </div>

        </div>
      </div>

      {/* ================= BOTTOM BUTTONS ================= */}

      {/* ================= BOTTOM BUTTONS ================= */}

      <div className="summary-submit">

        {message && (
          <p className={`summary-message ${message.startsWith("Unable") || message.startsWith("File") || message.startsWith("Please") ? "error" : "success"}`}>
            {message}
          </p>
        )}

        {editMode ? (
          <>
            <button
              type="button"
              className="save-button summary-cancel-button"
              onClick={handleCancelEdit}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="save-button"
              onClick={editMode ? handleSubmit : handleEdit}
              disabled={saving || (editMode && !hasChanges)}
            >
              {saving ? "Updating..." : hasChanges ? "Update Details" : "Edit Details"}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="save-button summary-cancel-button"
              onClick={() =>
                navigate("/vendor-onboarding/agreement", {
                  state: { memberId },
                })
              }
            >
              Previous
            </button>
            <button
              type="button"
              className="save-button summary-edit-button"
              onClick={handleEdit}
            >
              Edit Details
            </button>
            <button
              type="button"
              className="save-button"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? "Submitting..." : "Submit Profile"}
            </button>
          </>
        )}

      </div>

    </div>
  );
};

export default ProfileSummary;