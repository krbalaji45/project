import { saveRegistration } from "../shared/utils/registrationService";
import eventsRegistrationConfig from "./eventsConfig";

export const saveEventRegistration = (registration) =>
  saveRegistration(eventsRegistrationConfig.collection, registration);
