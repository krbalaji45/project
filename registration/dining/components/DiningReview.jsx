import { Check } from "lucide-react";

function SummarySection({ title, children }) {
  return (
    <section className="dr-summary-section" aria-label={title}>
      <div className="dr-summary-section-heading">
        <h3>{title}</h3>
      </div>
      {children}
    </section>
  );
}

function SummaryItem({ label, value, fullWidth = false }) {
  return (
    <div
      className={`dr-summary-item${fullWidth ? " dr-summary-item-full" : ""}`}
    >
      <dt>{label}</dt>
      <dd>{value || "—"}</dd>
    </div>
  );
}

function DiningRegistrationSummary({
  registrationType,
  form,
  logo,
  photos,
  menuPhotos,
  agreedToTerms,
}) {
  const ownerName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
  const tableConfigurations = form.customTableCounts.filter((table) => table.saved);
  const images = [
    ...(logo ? [{ ...logo, kind: "Logo" }] : []),
    ...photos.map((photo) => ({ ...photo, kind: "Gallery" })),
    ...menuPhotos.map((photo) => ({ ...photo, kind: "Menu" })),
  ];

  return (
    <div className="dr-summary">
      <SummarySection title="Profile and contact">
        <dl className="dr-summary-grid">
          <SummaryItem label="Registration type" value={registrationType} />
          <SummaryItem label="Name" value={ownerName} />
          <SummaryItem label="Phone" value={form.phone} />
          <SummaryItem label="Email" value={form.email} />
        </dl>
      </SummarySection>

      <SummarySection title="Business details">
        <dl className="dr-summary-grid">
          <SummaryItem label="Business name" value={form.restaurantName} />
          <SummaryItem
            label="Business type"
            value={
              form.restaurantType === "Other"
                ? form.restaurantTypeOther
                : form.restaurantType
            }
          />
          <SummaryItem label="Air conditioning" value={form.airConditioning} />
          <SummaryItem
            label="Table booking charges (non-refundable)"
            value={
              form.tableBookingCharge
                ? `₹${form.tableBookingCharge}`
                : "₹0"
            }
          />
          <SummaryItem label="City" value={form.city} />
          <SummaryItem label="Area" value={form.area} />
          <SummaryItem label="Address" value={form.address} />
          <SummaryItem label="State" value={form.region} />
          <SummaryItem label="PIN code" value={form.postalCode} />
          <SummaryItem
            label="Description"
            value={form.businessDescription || "Not provided"}
            fullWidth
          />
          <SummaryItem
            label="Cuisine types"
            value={[
              ...form.cuisineTypes.filter((cuisine) => cuisine !== "Other"),
              ...(form.cuisineTypes.includes("Other") && form.cuisineTypeOther
                ? [form.cuisineTypeOther]
                : []),
            ].join(", ")}
          />
          <SummaryItem label="Food preference" value={form.foodPreference} />
          <SummaryItem
            label="Services"
            value={form.diningServices.join(", ")}
            fullWidth
          />
          <SummaryItem
            label="Table configurations"
            value={
              tableConfigurations.length
                ? tableConfigurations
                    .map((table) => {
                      const seats =
                        table.seats === "Other"
                          ? table.customSeats
                          : table.seats;
                      return `${table.count} × ${seats}-seat (${table.location})`;
                    })
                    .join("; ")
                : "—"
            }
            fullWidth
          />
          <SummaryItem
            label="Opening days"
            value={
              form.openingHours.length
                ? form.openingHours
                    .map(
                      (hours) =>
                        `${hours.day}: ${
                          hours.isOpen
                            ? `${hours.open}–${hours.close}`
                            : "Closed"
                        }`,
                    )
                    .join(", ")
                : "—"
            }
            fullWidth
          />
        </dl>
      </SummarySection>

      <SummarySection title="Photos">
        {images.length ? (
          <div className="dr-summary-images">
            {images.map((image) => (
              <figure className="dr-summary-image" key={image.id}>
                <img src={image.dataUrl} alt={image.name} />
                <figcaption>
                  <strong>{image.kind}</strong>
                  <span>{image.name}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <p className="dr-summary-empty">No photos added.</p>
        )}
      </SummarySection>

      <p className="dr-summary-terms">
        {agreedToTerms ? (
          <Check size={16} aria-hidden="true" />
        ) : (
          <span className="dr-summary-terms-pending" aria-hidden="true" />
        )}
        Terms and Privacy Policy{" "}
        {agreedToTerms ? "accepted" : "not yet accepted"}
      </p>
    </div>
  );
}

export default DiningRegistrationSummary;
