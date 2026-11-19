import RegistrationSidebar from "../../shared/components/RegistrationSidebar";

const steps = [
  {
    title: "Create your profile",
    description: "Tell us who you are and how customers can reach you.",
  },
  {
    title: "Add your business details",
    description: "Add your offering, location, capacity, and opening hours.",
  },
  {
    title: "Show off your space",
    description: "Upload photos to show customers what you offer.",
  },
  {
    title: "Review your details",
    description: "Check your registration before submitting.",
  },
];

function RegistrationIntro({ activeStep, onSelectStep }) {
  return (
    <RegistrationSidebar
      activeStep={activeStep}
      description="Create your vendor profile and help more customers discover your business."
      onSelectStep={onSelectStep}
      steps={steps}
      title="Grow your local business."
      titleId="dr-main-title"
    />
  );
}

export default RegistrationIntro;
