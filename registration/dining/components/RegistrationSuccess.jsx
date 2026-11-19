import { Link } from "react-router-dom";
import { Check } from "lucide-react";

function RegistrationSuccess({
  businessName,
  registrationType,
  onRegisterAnother,
}) {
  return (
    <div className="dr-success" role="status">
      <div className="dr-success-icon">
        <Check size={28} />
      </div>
      <p className="dr-card-kicker">YOU’RE ON YOUR WAY</p>
      <h2 id="dr-form-title">Registration received</h2>
      <p>
        <strong>{businessName}</strong> has been saved as {registrationType}.
        You can now sign in or register another business.
      </p>
      <Link className="dr-submit" to="/login">
        Continue to log in <span aria-hidden="true">→</span>
      </Link>
      <button 
        type="button"
        className="dr-another-link"
        onClick={onRegisterAnother}
      >
        Register another business
      </button>
    </div>
  );
}

export default RegistrationSuccess;
