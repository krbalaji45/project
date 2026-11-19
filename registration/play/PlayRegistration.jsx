import CategoryRegistrationFlow from "../shared/CategoryRegistrationFlow";
import playRegistrationConfig from "./playConfig";
import PlayDetailsFields from "./components/PlayDetails";
import PlayReview from "./components/PlayReview";
import PlaySchedule from "./components/PlaySchedule";
import PlayMediaUpload from "./components/PlayMediaUpload";
import { validatePlayRegistration } from "./playValidation";
import { savePlayRegistration } from "./playService";

function PlayRegistration() {
  return (
    <CategoryRegistrationFlow
      config={playRegistrationConfig}
      DetailsFields={PlayDetailsFields}
      ReviewFields={PlayReview}
      ScheduleComponent={PlaySchedule}
      MediaUploadComponent={PlayMediaUpload}
      validateRegistration={validatePlayRegistration}
      save={savePlayRegistration}
    />
  );
}

export default PlayRegistration;
