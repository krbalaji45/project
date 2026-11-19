import FormField from "../../shared/components/FormField";
import {
  CANCELLATION_POLICIES,
  GIFT_WRAPPING_OPTIONS,
  ORDER_PROCESSING_TIMES,
  RETURN_POLICIES,
  RETURN_WINDOWS,
} from "../storesConfig";

function StorePolicies({ form, errors, onChange }) {
  const needsReturnWindow =
    form.returnPolicy && form.returnPolicy !== "Non-Returnable Products";

  return (
    <section className="sr-form-section" aria-labelledby="sr-policies">
      <div className="sr-section-heading">
        <div>
          <h3 id="sr-policies">Order processing and store policies</h3>
          <p>Set expectations for order handling, returns, and cancellations.</p>
        </div>
      </div>
      <div className="sr-fields-grid">
        <FormField
          label="Order processing time *"
          name="orderProcessingTime"
          error={errors.orderProcessingTime}
        >
          <select
            id="orderProcessingTime"
            name="orderProcessingTime"
            value={form.orderProcessingTime}
            onChange={onChange}
            aria-invalid={Boolean(errors.orderProcessingTime)}
            required
          >
            <option value="">Select processing time</option>
            {ORDER_PROCESSING_TIMES.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </FormField>
        {form.orderProcessingTime === "Custom" && (
          <FormField
            label="Custom processing time *"
            name="customOrderProcessingTime"
            error={errors.customOrderProcessingTime}
          >
            <input
              id="customOrderProcessingTime"
              name="customOrderProcessingTime"
              value={form.customOrderProcessingTime}
              onChange={onChange}
              maxLength={100}
              aria-invalid={Boolean(errors.customOrderProcessingTime)}
              required
            />
          </FormField>
        )}
        <FormField
          label="Return policy *"
          name="returnPolicy"
          error={errors.returnPolicy}
        >
          <select
            id="returnPolicy"
            name="returnPolicy"
            value={form.returnPolicy}
            onChange={onChange}
            aria-invalid={Boolean(errors.returnPolicy)}
            required
          >
            <option value="">Select a return policy</option>
            {RETURN_POLICIES.map((policy) => (
              <option key={policy} value={policy}>
                {policy}
              </option>
            ))}
          </select>
        </FormField>
        {needsReturnWindow && (
          <FormField
            label="Return window *"
            name="returnWindow"
            error={errors.returnWindow}
          >
            <select
              id="returnWindow"
              name="returnWindow"
              value={form.returnWindow}
              onChange={onChange}
              aria-invalid={Boolean(errors.returnWindow)}
              required
            >
              <option value="">Select a return window</option>
              {RETURN_WINDOWS.map((window) => (
                <option key={window} value={window}>
                  {window}
                </option>
              ))}
            </select>
          </FormField>
        )}
        {form.returnWindow === "Custom" && needsReturnWindow && (
          <FormField
            label="Custom return window *"
            name="customReturnWindow"
            error={errors.customReturnWindow}
          >
            <input
              id="customReturnWindow"
              name="customReturnWindow"
              value={form.customReturnWindow}
              onChange={onChange}
              maxLength={100}
              aria-invalid={Boolean(errors.customReturnWindow)}
              required
            />
          </FormField>
        )}
        <FormField
          label="Cancellation policy *"
          name="cancellationPolicy"
          error={errors.cancellationPolicy}
        >
          <select
            id="cancellationPolicy"
            name="cancellationPolicy"
            value={form.cancellationPolicy}
            onChange={onChange}
            aria-invalid={Boolean(errors.cancellationPolicy)}
            required
          >
            <option value="">Select a cancellation policy</option>
            {CANCELLATION_POLICIES.map((policy) => (
              <option key={policy} value={policy}>
                {policy}
              </option>
            ))}
          </select>
        </FormField>
        {form.cancellationPolicy === "Custom Policy" && (
          <FormField
            label="Custom cancellation policy *"
            name="customCancellationPolicy"
            error={errors.customCancellationPolicy}
          >
            <input
              id="customCancellationPolicy"
              name="customCancellationPolicy"
              value={form.customCancellationPolicy}
              onChange={onChange}
              maxLength={300}
              aria-invalid={Boolean(errors.customCancellationPolicy)}
              required
            />
          </FormField>
        )}
        <FormField
          label="Gift wrapping"
          name="giftWrapping"
          error={errors.giftWrapping}
        >
          <select
            id="giftWrapping"
            name="giftWrapping"
            value={form.giftWrapping}
            onChange={onChange}
            aria-invalid={Boolean(errors.giftWrapping)}
          >
            <option value="">Select an option (optional)</option>
            {GIFT_WRAPPING_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
      </div>
    </section>
  );
}

export default StorePolicies;
