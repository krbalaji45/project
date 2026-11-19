import playConfig from "./playConfig";
import { validateForm } from "../shared/utils/formUtils";

export const validatePlayRegistration = (form, agreedToTerms) =>
  validateForm(form, playConfig, agreedToTerms);
