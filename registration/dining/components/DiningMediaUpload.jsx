import { ImagePlus, X } from "lucide-react";
import {
  MAX_GALLERY_IMAGES,
  MAX_MENU_IMAGES,
} from "../diningConfig";
import RestaurantBranding from "./RestaurantBranding";

function DiningMediaUpload({
  logo,
  photos,
  menuPhotos,
  logoInputRef,
  galleryInputRef,
  menuInputRef,
  onFileChange,
  onRemoveLogo,
  onRemovePhoto,
  onRemoveMenuPhoto,
  uploadErrors,
}) {
  return (
    <div className="dr-upload-section">
      <div className="dr-section-heading">
        <div>
          <h3>Restaurant branding</h3>
          <p>Add your logo so customers can recognize your business.</p>
        </div>
      </div>
      <RestaurantBranding
        logo={logo}
        logoInputRef={logoInputRef}
        onFileChange={onFileChange}
        onRemoveLogo={onRemoveLogo}
        uploadError={uploadErrors.logo}
      />

      <div className="dr-menu-upload-block">
        <div className="dr-section-heading">
          <h3>
            Restaurant photos{" "}
            <small>
              ({photos.length}/{MAX_GALLERY_IMAGES})
            </small>
          </h3>
          <p>Show customers your dining space and atmosphere.</p>
        </div>
        <input
          ref={galleryInputRef}
          className="dr-file-input"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          onChange={(event) => onFileChange(event, "photo")}
          aria-label="Upload restaurant photos"
        />
        <div className="dr-photo-grid">
          {photos.map((photo) => (
            <div className="dr-photo-preview" key={photo.id}>
              <img src={photo.dataUrl} alt={photo.name} />
              <button
                type="button"
                className="dr-remove-image"
                onClick={() => onRemovePhoto(photo.id)}
                aria-label={`Remove ${photo.name}`}
              >
                <X size={15} />
              </button>
            </div>
          ))}
          {photos.length < MAX_GALLERY_IMAGES && (
            <button
              type="button"
              className="dr-add-photo"
              onClick={() => galleryInputRef.current?.click()}
            >
              <ImagePlus size={20} />
              <span>Add photos</span>
            </button>
          )}
        </div>
        <p className="dr-upload-help">
          Up to {MAX_GALLERY_IMAGES} restaurant photos · max 2 MB each
        </p>
        {uploadErrors.photo && (
          <p className="dr-error" role="alert">
            {uploadErrors.photo}
          </p>
        )}
      </div>
      <div className="dr-menu-upload-block">
        <div className="dr-section-heading">
          <h3>Menu card photos</h3>
          <p>Upload up to five photos of your menu cards.</p>
        </div>
        <input
          ref={menuInputRef}
          className="dr-file-input"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          onChange={(event) => onFileChange(event, "menu")}
          aria-label="Upload menu card photos"
        />
        <div className="dr-photo-grid">
          {menuPhotos.map((photo) => (
            <div className="dr-photo-preview" key={photo.id}>
              <img src={photo.dataUrl} alt={photo.name} />
              <button
                type="button"
                className="dr-remove-image"
                onClick={() => onRemoveMenuPhoto(photo.id)}
                aria-label={`Remove ${photo.name}`}
              >
                <X size={15} />
              </button>
            </div>
          ))}
          {menuPhotos.length < MAX_MENU_IMAGES && (
            <button
              type="button"
              className="dr-add-photo"
              onClick={() => menuInputRef.current?.click()}
            >
              <ImagePlus size={20} />
              <span>Add menu card photos</span>
            </button>
          )}
        </div>
        <p className="dr-upload-help">
          Up to {MAX_MENU_IMAGES} menu card photos · JPG, PNG or WebP · max 2 MB each
        </p>
        {uploadErrors.menu && (
          <p className="dr-error" role="alert">
            {uploadErrors.menu}
          </p>
        )}
      </div>
      <p className="dr-storage-note">
        Images are saved with your registration in this browser. Each image can
        be up to 2 MB.
      </p>
    </div>
  );
}

export default DiningMediaUpload;
