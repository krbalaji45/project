import RegistrationField from "../../shared/components/FormField";

function PlayFacilities({ form, errors, onChange }) {
  return (
    <RegistrationField
      label="Facilities or play equipment *"
      name="facilities"
      error={errors.facilities}
    >
      <textarea
        id="facilities"
        name="facilities"
        value={form.facilities}
        onChange={onChange}
        maxLength={500}
        rows={3}
        placeholder="List the play equipment and facilities available"
        aria-invalid={Boolean(errors.facilities)}
        required
      />
    </RegistrationField>
  );
}

export default PlayFacilities;
