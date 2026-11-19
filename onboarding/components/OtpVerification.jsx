import React, {
  useState
} from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

const OtpVerification = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const {
    firstName,
    lastName,
    email,
    otp
  } = location.state || {};

  const [enteredOtp, setEnteredOtp] =
    useState("");

  const [error, setError] =
    useState("");


  if (!location.state) {
    navigate("/vendor-onboarding/create-profile", {
      replace: true
    });

    return null;
  }


  const handleChange = (e) => {

    const value = e.target.value;

    if (!/^[0-9]*$/.test(value)) {
      return;
    }

    if (value.length > 6) {
      return;
    }

    setEnteredOtp(value);

    setError("");
  };


  const handleVerify = () => {

    if (enteredOtp.length !== 6) {

      setError(
        "Please enter the 6-digit OTP"
      );

      return;
    }


    if (enteredOtp !== otp) {

      setError(
        "Invalid OTP. Please try again."
      );

      return;
    }


    navigate("/vendor-onboarding/create-profile", {
      replace: true,

      state: {
        memberId: location.state?.memberId,
        firstName,
        lastName,
        email,
        emailVerified: true
      }
    });
  };


  return (
    <div className="form-card">

      <div className="form-header">

        <h2>Verify Email</h2>

        <p>
          Enter the OTP sent to {email}
        </p>

      </div>


      <div className="form-group">

        <label>
          OTP
        </label>

        <input
          type="text"
          value={enteredOtp}
          onChange={handleChange}
          placeholder="Enter 6-digit OTP"
          maxLength="6"
          inputMode="numeric"
        />

        {error && (
          <p className="input-error">
            {error}
          </p>
        )}

      </div>


      <div className="form-footer">

        <button
          type="button"
          className="save-button"
          onClick={handleVerify}
        >
          Verify OTP
        </button>

      </div>

    </div>
  );
};

export default OtpVerification;