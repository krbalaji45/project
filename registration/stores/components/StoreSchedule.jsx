import ScheduleFields from "../../shared/components/ScheduleFields";

function StoreSchedule({
  form,
  errors,
  onHoursChange,
  onDayPresetChange,
}) {
  return (
    <ScheduleFields
      form={form}
      errors={errors}
      onHoursChange={onHoursChange}
      onDayPresetChange={onDayPresetChange}
      showDayPresets
    />
  );
}

export default StoreSchedule;
