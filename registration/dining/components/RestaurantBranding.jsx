import { Upload, X } from "lucide-react";

function RestaurantBranding({
  logo,
  logoInputRef,
  onFileChange,
  onRemoveLogo,
  uploadError,
}) {
  return (
    <div className="dr-upload-block">
      <span className="dr-upload-label">Restaurant logo</span>
      <input
        ref={logoInputRef}
        className="dr-file-input"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) => onFileChange(event, "logo")}
        aria-label="Upload restaurant logo"
      />
      {logo ? (
        <div className="dr-logo-preview">
          <img src={logo.dataUrl} alt="Restaurant logo preview" />
          <div className="dr-logo-meta">
            <strong>{logo.name}</strong>
            <span>{(logo.size / 1024).toFixed(0)} KB</span>
          </div>
          <button
            type="button"
            className="dr-remove-image"
            onClick={onRemoveLogo}
            aria-label="Remove restaurant logo"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="dr-logo-dropzone"
          onClick={() => logoInputRef.current?.click()}
        >
          <span className="dr-upload-icon">
            <Upload size={18} />
          </span>
          <strong>Upload a logo</strong>
          <span>PNG, JPG or WebP · max 2 MB</span>
        </button>
      )}
      {logo && (
        <button
          type="button"
          className="dr-replace-link"
          onClick={() => logoInputRef.current?.click()}
        >
          Replace logo
        </button>
      )}
      {uploadError && (
        <p className="dr-error" role="alert">
          {uploadError}
        </p>
      )}
    </div>
  );
}

export default RestaurantBranding;
