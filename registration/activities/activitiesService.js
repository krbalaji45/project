import { saveRegistration } from "../shared/utils/registrationService";
import activityConfig from "./activitiesConfig";

export const saveActivityRegistration = (registration) =>
  saveRegistration(activityConfig.collection, registration);
