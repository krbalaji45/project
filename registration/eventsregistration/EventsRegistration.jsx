import CategoryRegistrationFlow from "../shared/CategoryRegistrationFlow";
import EventDetails from "./components/EventDetails";
import EventSchedule from "./components/EventSchedule";
import EventReview from "./components/EventReview";
import eventsRegistrationConfig from "./eventsConfig";
import { validateEventRegistration } from "./eventsValidation";
import { saveEventRegistration } from "./eventsService";
import "./eventsRegistration.css";

function EventsRegistration() {
  return (
    <CategoryRegistrationFlow
      config={eventsRegistrationConfig}
      DetailsFields={EventDetails}
      ReviewFields={EventReview}
      ScheduleComponent={EventSchedule}
      validateRegistration={validateEventRegistration}
      save={saveEventRegistration}
    />
  );
}

export default EventsRegistration;
