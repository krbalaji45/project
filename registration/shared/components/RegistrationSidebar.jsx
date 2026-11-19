import "./RegistrationSidebar.css";

function RegistrationSidebar({
  activeStep,
  description,
  onSelectStep,
  steps,
  title,
  titleId,
}) {
  return (
    <aside className="registration-sidebar" aria-labelledby={titleId}>
      <h1 id={titleId}>{title}</h1>
      <p className="registration-sidebar-copy">{description}</p>
      <ol className="registration-steps" aria-label="Registration sections">
        {steps.map((step, index) => (
          <li className="registration-steps-item" key={step.title}>
            <button
              type="button"
              className={`registration-step-button${
                activeStep === index ? " is-active" : ""
              }`}
              aria-current={activeStep === index ? "step" : undefined}
              onClick={() => onSelectStep(index)}
            >
              <span className="registration-step-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="registration-step-copy">
                <span className="registration-step-title">{step.title}</span>
                <span className="registration-step-description">
                  {step.description}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </aside>
  );
}

export default RegistrationSidebar;
