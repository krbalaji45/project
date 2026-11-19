import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const readStoredSignupProfile = () => {
  try {
    const storedProfile = sessionStorage.getItem("signupProfile");
    return storedProfile ? JSON.parse(storedProfile) : null;
  } catch (error) {
    console.error("Unable to read stored signup profile:", error);
    return null;
  }
};

const CreateProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [signupProfile] = useState(
    () => location.state?.signupProfile || readStoredSignupProfile(),
  );

  useEffect(() => {
    let active = true;

    const continueOnboarding = async () => {
      try {
        const memberId =
          location.state?.memberId || sessionStorage.getItem("memberProfileId");

        if (memberId && !signupProfile) {
          const profileResponse = await fetch(
            `http://localhost:5000/userProfiles/${memberId}`,
          );
          if (!profileResponse.ok) {
            throw new Error("Saved profile not found. Please sign up again.");
          }

          navigate("/vendor-onboarding/kyc-details", {
            replace: true,
            state: { memberId },
          });
          return;
        }

        if (!signupProfile?.vendorId || !signupProfile.email) {
          navigate("/login", { replace: true });
          return;
        }

        const response = await fetch(
          `http://localhost:5000/userProfiles?createProfile.vendorId=${encodeURIComponent(
            signupProfile.vendorId,
          )}`,
        );
        if (!response.ok) {
          throw new Error("Unable to look up your onboarding profile.");
        }

        const profiles = await response.json();
        const matchingProfile = profiles.find(
          (profile) =>
            profile.createProfile?.vendorId === signupProfile.vendorId &&
            profile.createProfile?.email?.toLowerCase() ===
              signupProfile.email.toLowerCase(),
        );

        let savedProfile = matchingProfile;
        if (!savedProfile) {
          const createResponse = await fetch(
            "http://localhost:5000/userProfiles",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                createProfile: {
                  firstName: signupProfile.firstName || "",
                  lastName: signupProfile.lastName || "",
                  email: signupProfile.email,
                  emailVerified: false,
                  vendorId: signupProfile.vendorId,
                },
                kycDetails: {
                  aadhaar: {
                    aadhaarNumber: "",
                    name: "",
                    dateOfBirth: "",
                    document: "",
                    backDocument: "",
                  },
                  pan: {
                    panNumber: "",
                    name: "",
                    document: "",
                  },
                },
                gstDetails: {
                  gstNumber: "",
                  legalName: "",
                  businessType: "",
                  otherBusinessType: "",
                  registrationNumber: "",
                  businessAddress: "",
                  document: "",
                },
                bankDetails: {
                  bankName: "",
                  accountNumber: "",
                  holderName: "",
                  ifscCode: "",
                  branchAddress: "",
                  document: "",
                },
                agreement: { accepted: false },
                profileSubmitted: false,
              }),
            },
          );
          if (!createResponse.ok) {
            throw new Error("Unable to create your onboarding profile.");
          }
          savedProfile = await createResponse.json();
        }

        if (!savedProfile?.id) {
          throw new Error("The backend did not return a profile id.");
        }

        sessionStorage.setItem("memberProfileId", savedProfile.id);
        sessionStorage.setItem("signupProfile", JSON.stringify(signupProfile));

        if (active) {
          navigate("/vendor-onboarding/kyc-details", {
            replace: true,
            state: { memberId: savedProfile.id },
          });
        }
      } catch (error) {
        console.error("Unable to start onboarding:", error);
        if (active) {
          navigate("/login", { replace: true });
        }
      }
    };

    continueOnboarding();

    return () => {
      active = false;
    };
  }, [location.state, navigate, signupProfile]);

  return null;
};

export default CreateProfile;
