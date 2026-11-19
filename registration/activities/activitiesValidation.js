import activityConfig from "./activitiesConfig";
import { validateForm } from "../shared/utils/formUtils";

export const validateActivityRegistration = (form, agreedToTerms) =>
  validateForm(form, activityConfig, agreedToTerms);
