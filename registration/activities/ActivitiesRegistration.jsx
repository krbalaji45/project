import CategoryRegistrationFlow from "../shared/CategoryRegistrationFlow";
import activityRegistrationConfig from "./activitiesConfig";
import ActivityDetailsFields from "./components/ActivityDetails";
import ActivityReview from "./components/ActivityReview";
import ActivitySchedule from "./components/ActivitySchedule";
import ActivityMediaUpload from "./components/ActivityMediaUpload";
import { validateActivityRegistration } from "./activitiesValidation";
import { saveActivityRegistration } from "./activitiesService";

function ActivitiesRegistration() {
  return (
    <CategoryRegistrationFlow
      config={activityRegistrationConfig}
      DetailsFields={ActivityDetailsFields}
      ReviewFields={ActivityReview}
      ScheduleComponent={ActivitySchedule}
      MediaUploadComponent={ActivityMediaUpload}
      validateRegistration={validateActivityRegistration}
      save={saveActivityRegistration}
    />
  );
}

export default ActivitiesRegistration;
