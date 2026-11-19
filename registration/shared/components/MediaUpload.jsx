import { ImagePlus, Upload, X } from "lucide-react";
import { MAX_PHOTOS } from "../utils/formUtils";

function MediaUploadFields({
  singular,
  showLogo = true,
  photosTitle,
  photosRequired = false,
  maxPhotos = MAX_PHOTOS,
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
      {showLogo && (
        <>
          <div className="sr-section-heading">
            <div>
              <h3>{singular === "activity" ? "Activity" : "Play"} logo</h3>
              <p>Upload a logo customers can recognize.</p>
            </div>
          </div>
          <input
            ref={logoInputRef}
            className="sr-file-input"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => onChange(event, "logo")}
            aria-label={`Upload ${singular} logo`}
          />
          {logo ? (
            <div className="sr-logo-preview">
              <img src={logo.dataUrl} alt={`${singular} logo preview`} />
              <span>{logo.name}</span>
              <button
                type="button"
                className="sr-remove-image"
                onClick={onRemoveLogo}
                aria-label="Remove logo"
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
              <span>Upload {singular} logo</span>
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
        </>
      )}

      <div className="sr-section-heading sr-store-photos-heading">
        <div>
          <h3>{photosTitle || `${singular === "activity" ? "Activity" : "Play"} photos`}{photosRequired ? " *" : ""}</h3>
          <p>Show customers your space and what you offer.</p>
        </div>
      </div>
      <input
        ref={photosInputRef}
        className="sr-file-input"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        aria-required={photosRequired}
        onChange={(event) => onChange(event, "photos")}
        aria-label={`Upload ${singular} photos`}
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
        {photos.length < maxPhotos && (
          <button
            type="button"
            className="sr-add-photo"
            onClick={() => photosInputRef.current?.click()}
          >
            <ImagePlus size={20} />
            <span>Add photos</span>
          </button>
        )}
      </div>
      <p className="sr-upload-help">
        {photosRequired ? "At least one photo required. " : ""}
        Up to {maxPhotos} photos · JPG, PNG, or WebP · max 2 MB each
      </p>
      {uploadErrors.photos && (
        <p className="sr-field-error" role="alert">
          {uploadErrors.photos}
        </p>
      )}
    </section>
  );
}

export default MediaUploadFields;
