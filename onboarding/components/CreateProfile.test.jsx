import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import CreateProfile from "./CreateProfile";

const renderBootstrap = (signupProfile) =>
  render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: "/vendor-onboarding/create-profile",
          state: { signupProfile },
        },
      ]}
    >
      <Routes>
        <Route
          path="/vendor-onboarding/create-profile"
          element={<CreateProfile />}
        />
        <Route
          path="/vendor-onboarding/kyc-details"
          element={<p>KYC details</p>}
        />
      </Routes>
    </MemoryRouter>,
  );

test("creates a backend profile automatically and continues to KYC", async () => {
  const signupProfile = {
    vendorId: "vendor-42",
    firstName: "Alice",
    lastName: "Brown",
    email: "alice@example.com",
  };
  const fetchMock = jest
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => [],
    })
    .mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ id: "profile-100" }),
    });
  global.fetch = fetchMock;

  renderBootstrap(signupProfile);

  expect(await screen.findByText("KYC details")).toBeInTheDocument();
  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  expect(fetchMock.mock.calls[0][0]).toBe(
    "http://localhost:5000/userProfiles?createProfile.vendorId=vendor-42",
  );
  expect(fetchMock.mock.calls[1][1].method).toBe("POST");
  expect(
    JSON.parse(fetchMock.mock.calls[1][1].body).createProfile,
  ).toMatchObject(signupProfile);
  expect(screen.queryByText("Create Profile")).not.toBeInTheDocument();
});

test("reuses an existing onboarding profile and continues to KYC", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => [
      {
        id: "profile-42",
        createProfile: {
          vendorId: "vendor-42",
          email: "asha@example.com",
        },
      },
    ],
  });

  renderBootstrap({
    vendorId: "vendor-42",
    firstName: "Asha",
    lastName: "Rao",
    email: "asha@example.com",
  });

  expect(await screen.findByText("KYC details")).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(sessionStorage.getItem("memberProfileId")).toBe("profile-42");
});
