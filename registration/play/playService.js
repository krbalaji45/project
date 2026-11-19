import { saveRegistration } from "../shared/utils/registrationService";
import playConfig from "./playConfig";

export const savePlayRegistration = (registration) =>
  saveRegistration(playConfig.collection, registration);
