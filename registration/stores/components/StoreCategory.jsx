import ProductCategories from "./ProductCategories";

function StoreCategory({ form, errors, onChange }) {
  return (
    <section className="sr-form-section" aria-label="Store category">
      <div className="sr-section-heading">
        <div>
          <h3>Store category</h3>
          <p>Choose the category that best describes your products.</p>
        </div>
      </div>
      <div className="sr-fields-grid">
        <ProductCategories form={form} errors={errors} onChange={onChange} />
      </div>
    </section>
  );
}

export default StoreCategory;
