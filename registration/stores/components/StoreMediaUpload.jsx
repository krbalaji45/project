import { ImagePlus, Upload, X } from "lucide-react";
import { MAX_STORE_PHOTOS } from "../storesConfig";

function StoreMediaUpload({
  logo,
  photos,
  logoInputRef,
  photosInputRef,
  uploadErrors,
  onChange,
  onRemoveLogo,
  onRemovePhoto,
}) {
  return (
    <section className="sr-form-section sr-upload-section">
      <div className="sr-section-heading">
        <div>
          <h3>Store logo</h3>
          <p>Upload a logo customers can recognize.</p>
        </div>
      </div>
      <input
        ref={logoInputRef}
        className="sr-file-input"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) => onChange(event, "logo")}
        aria-label="Upload store logo"
      />
      {logo ? (
        <div className="sr-logo-preview">
          <img src={logo.dataUrl} alt="Store logo preview" />
          <span>{logo.name}</span>
          <button
            type="button"
            className="sr-remove-image"
            onClick={onRemoveLogo}
            aria-label="Remove store logo"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="sr-upload-button"
          onClick={() => logoInputRef.current?.click()}
        >
          <Upload size={18} />
          <span>Upload store logo</span>
        </button>
      )}
      {logo && (
        <button
          type="button"
          className="sr-replace-link"
          onClick={() => logoInputRef.current?.click()}
        >
          Replace logo
        </button>
      )}
      {uploadErrors.logo && (
        <p className="sr-field-error" role="alert">
          {uploadErrors.logo}
        </p>
      )}

      <div className="sr-section-heading sr-store-photos-heading">
        <div>
          <h3>Store photos</h3>
          <p>Show customers your space and what you offer.</p>
        </div>
      </div>
      <input
        ref={photosInputRef}
        className="sr-file-input"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        onChange={(event) => onChange(event, "photos")}
        aria-label="Upload store photos"
      />
      <div className="sr-store-photo-grid">
        {photos.map((photo) => (
          <div className="sr-store-photo" key={photo.id}>
            <img src={photo.dataUrl} alt={photo.name} />
            <button
              type="button"
              className="sr-remove-image"
              onClick={() => onRemovePhoto(photo.id)}
              aria-label={`Remove ${photo.name}`}
            >
              <X size={15} />
            </button>
          </div>
        ))}
        {photos.length < MAX_STORE_PHOTOS && (
          <button
            type="button"
            className="sr-add-photo"
            onClick={() => photosInputRef.current?.click()}
          >
            <ImagePlus size={20} />
            <span>Add store photos</span>
          </button>
        )}
      </div>
      <p className="sr-upload-help">
        Up to {MAX_STORE_PHOTOS} store photos · JPG, PNG, or WebP · max 2 MB each
      </p>
      {uploadErrors.photos && (
        <p className="sr-field-error" role="alert">
          {uploadErrors.photos}
        </p>
      )}
    </section>
  );
}

export default StoreMediaUpload;
