import React, { useEffect, useState } from "react";
import {
  Outlet,
  NavLink,
  useLocation,
  useNavigate
} from "react-router-dom";

import "./ProfileLayout.css";

const ProfileLayout = () => {
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

  const [currentProfile, setCurrentProfile] = useState(null);
  const [loading, setLoading] = useState(Boolean(memberId));
  const [profileLoadedKey, setProfileLoadedKey] = useState("");

  // -----------------------------------------
  // LOAD CURRENT MEMBER
  // -----------------------------------------
  useEffect(() => {
    if (memberId) {
      try {
        sessionStorage.setItem("memberProfileId", memberId);
      } catch (error) {
        console.log("Unable to persist member id:", error);
      }
    }
  }, [memberId]);

  useEffect(() => {
    const loadProfile = async () => {

      if (location.pathname.endsWith("/create-profile")) {
        setLoading(false);
        return;
      }

      // No member ID
      if (!memberId) {
        setCurrentProfile(null);
        setProfileLoadedKey(`${location.pathname}:`);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(
          `http://localhost:5000/userProfiles/${memberId}`
        );

        if (!response.ok) {
          throw new Error("Unable to find member");
        }

        const data = await response.json();

        console.log("Current member:", data);

        setCurrentProfile(data);
      } catch (error) {
        console.log("Profile loading error:", error);
        setCurrentProfile(null);
      } finally {
        setProfileLoadedKey(`${location.pathname}:${memberId}`);
        setLoading(false);
      }
    };

    loadProfile();
  }, [location.pathname, memberId]);

  // -----------------------------------------
  // COMPLETION CHECKS
  // -----------------------------------------

  const kycCompleted =
    !!currentProfile?.kycDetails?.aadhaar?.aadhaarNumber &&
    !!currentProfile?.kycDetails?.aadhaar?.name &&
    !!currentProfile?.kycDetails?.aadhaar?.dateOfBirth &&
    !!currentProfile?.kycDetails?.aadhaar?.document &&
    !!currentProfile?.kycDetails?.aadhaar?.backDocument &&
    !!currentProfile?.kycDetails?.pan?.panNumber &&
    !!currentProfile?.kycDetails?.pan?.name &&
    !!currentProfile?.kycDetails?.pan?.document;

  const gstCompleted =
    !!currentProfile?.gstDetails?.gstNumber &&
    !!currentProfile?.gstDetails?.legalName &&
    !!currentProfile?.gstDetails?.businessType &&
    (currentProfile?.gstDetails?.businessType !== "Other" ||
      !!currentProfile?.gstDetails?.otherBusinessType?.trim()) &&
    !!currentProfile?.gstDetails?.registrationNumber &&
    !!currentProfile?.gstDetails?.businessAddress &&
    !!currentProfile?.gstDetails?.document;

  const bankCompleted =
    !!currentProfile?.bankDetails?.bankName &&
    !!currentProfile?.bankDetails?.accountNumber &&
    !!currentProfile?.bankDetails?.holderName &&
    !!currentProfile?.bankDetails?.ifscCode &&
    !!currentProfile?.bankDetails?.branchAddress &&
    !!currentProfile?.bankDetails?.document;

  const agreementCompleted =
    currentProfile?.agreement?.accepted === true;

  // -----------------------------------------
  // UNLOCK LOGIC
  // -----------------------------------------

  const kycUnlocked = Boolean(memberId);
  const gstUnlocked = kycUnlocked && kycCompleted;
  const bankUnlocked = gstUnlocked && gstCompleted;
  const agreementUnlocked = bankUnlocked && bankCompleted;
  const summaryUnlocked = agreementUnlocked && agreementCompleted;

  // -----------------------------------------
  // PROTECT LOCKED ROUTES
  // -----------------------------------------
  useEffect(() => {
    if (loading) {
      return;
    }

    const path = location.pathname;
    if (path.endsWith("/create-profile")) {
      return;
    }

    if (!memberId) {
      navigate("/vendor-onboarding/create-profile", { replace: true });
      return;
    }

    if (profileLoadedKey !== `${path}:${memberId}`) {
      return;
    }

    if (!currentProfile) {
      navigate("/vendor-onboarding/create-profile", { replace: true });
      return;
    }

    const firstIncompletePath = !kycCompleted
      ? "/vendor-onboarding/kyc-details"
      : !gstCompleted
        ? "/vendor-onboarding/gst-details"
        : !bankCompleted
          ? "/vendor-onboarding/bank-details"
          : !agreementCompleted
            ? "/vendor-onboarding/agreement"
            : "/vendor-onboarding/profile-summary";

    const isPathUnlocked =
      (path.endsWith("/kyc-details") && kycUnlocked) ||
      (path.endsWith("/gst-details") && gstUnlocked) ||
      (path.endsWith("/bank-details") && bankUnlocked) ||
      (path.endsWith("/agreement") && agreementUnlocked) ||
      (path.endsWith("/profile-summary") && summaryUnlocked);

    if (!isPathUnlocked) {
      navigate(firstIncompletePath, {
        replace: true,
        state: { memberId },
      });
    }
  }, [
    loading,
    location.pathname,
    memberId,
    currentProfile,
    profileLoadedKey,
    kycCompleted,
    gstCompleted,
    bankCompleted,
    agreementCompleted,
    kycUnlocked,
    gstUnlocked,
    bankUnlocked,
    agreementUnlocked,
    summaryUnlocked,
    navigate,
  ]);

  // -----------------------------------------
  // UI
  // -----------------------------------------

  return (
    <div className="profile-layout">

      {/* ================================
          LEFT SIDEBAR
      ================================= */}

      <aside className="profile-sidebar">

        <div className="profile-sidebar-header">
          <h2>Profile Setup</h2>

          <p>
            Complete your profile step by step
          </p>
        </div>

        <div className="profile-steps">

          {/* KYC */}
          {kycUnlocked ? (
            <NavLink
              to="/vendor-onboarding/kyc-details"
              state={{
                memberId
              }}
              className={({ isActive }) =>
                `profile-step ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="step-number">
                1
              </span>

              <div>
                <h4>Aadhaar & PAN</h4>
                <p>KYC details</p>
              </div>
            </NavLink>
          ) : (
            <div className="profile-step locked">

              <span className="step-number">
                1
              </span>

              <div>
                <h4>Aadhaar & PAN</h4>
                <p>Locked</p>
              </div>

            </div>
          )}

          {/* GST */}
          {gstUnlocked ? (
            <NavLink
              to="/vendor-onboarding/gst-details"
              state={{
                memberId
              }}
              className={({ isActive }) =>
                `profile-step ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="step-number">
                2
              </span>

              <div>
                <h4>GST Details</h4>
                <p>Business details</p>
              </div>
            </NavLink>
          ) : (
            <div className="profile-step locked">

              <span className="step-number">
                2
              </span>

              <div>
                <h4>GST Details</h4>
                <p>Locked</p>
              </div>

            </div>
          )}

          {/* BANK */}
          {bankUnlocked ? (
            <NavLink
              to="/vendor-onboarding/bank-details"
              state={{
                memberId
              }}
              className={({ isActive }) =>
                `profile-step ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="step-number">
                3
              </span>

              <div>
                <h4>Bank Details</h4>
                <p>Bank account</p>
              </div>
            </NavLink>
          ) : (
            <div className="profile-step locked">

              <span className="step-number">
                3
              </span>

              <div>
                <h4>Bank Details</h4>
                <p>Locked</p>
              </div>

            </div>
          )}

          {/* AGREEMENT */}
          {agreementUnlocked ? (
            <NavLink
              to="/vendor-onboarding/agreement"
              state={{
                memberId
              }}
              className={({ isActive }) =>
                `profile-step ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="step-number">
                4
              </span>

              <div>
                <h4>Agreement</h4>
                <p>Accept agreement</p>
              </div>
            </NavLink>
          ) : (
            <div className="profile-step locked">

              <span className="step-number">
                4
              </span>

              <div>
                <h4>Agreement</h4>
                <p>Locked</p>
              </div>

            </div>
          )}

          {/* SUMMARY */}
          {summaryUnlocked ? (
            <NavLink
              to="/vendor-onboarding/profile-summary"
              state={{
                memberId
              }}
              className={({ isActive }) =>
                `profile-step ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="step-number">
                5
              </span>

              <div>
                <h4>Profile Summary</h4>
                <p>Review profile</p>
              </div>
            </NavLink>
          ) : (
            <div className="profile-step locked">

              <span className="step-number">
                5
              </span>

              <div>
                <h4>Profile Summary</h4>
                <p>Locked</p>
              </div>

            </div>
          )}

        </div>

      </aside>

      {/* ================================
          RIGHT CONTENT
      ================================= */}

      <main className="profile-content">
        <Outlet />

      </main>

    </div>
  );
};

export default ProfileLayout;