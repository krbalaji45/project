
import { useEffect, useState } from "react";
import "./SpaceSlotForm.css";

const MAX_PHOTOS = 50;

export default function SpaceSlotForm({
  photos,
  onPhotosChange,
  onBack,
  onSubmit,
}) {
  const [error, setError] = useState("");

  const [photoPreviews, setPhotoPreviews] = useState([]);

  useEffect(() => {
    const previews = photos.map((photo) => ({
      file: photo,
      url: URL.createObjectURL(photo),
    }));

    setPhotoPreviews(previews);

    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [photos]);

  const handlePhotoChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length === 0) return;

    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length !== selectedFiles.length) {
      setError("Please select image files only.");
    } else {
      setError("");
    }

    onPhotosChange((previousPhotos) => {
      const remainingSlots = MAX_PHOTOS - previousPhotos.length;

      if (remainingSlots <= 0) {
        setError("You can upload a maximum of 50 photos.");
        return previousPhotos;
      }

      const filesToAdd = imageFiles.slice(0, remainingSlots);

      if (imageFiles.length > remainingSlots) {
        setError(
          `Only ${remainingSlots} more photos can be added. Maximum is 50.`
        );
      }

      return [...previousPhotos, ...filesToAdd];
    });

    // Allows selecting the same file again if needed.
    event.target.value = "";
  };

  const removePhoto = (indexToRemove) => {
    onPhotosChange((previousPhotos) =>
      previousPhotos.filter((_, index) => index !== indexToRemove)
    );

    setError("");
  };

  return (
    <div className="form-panel space-slot-form">
      <div className="step-label">STEP 3 OF 3</div>

      <h2>Show off your space</h2>

      <p className="form-subtitle">
        Upload photos of your event space. You can add more photos anytime
        before finishing.
      </p>

      <form onSubmit={onSubmit}>
        <div className="photo-upload-box">
          <input
            id="spacePhotos"
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
            disabled={photos.length >= MAX_PHOTOS}
          />

          <label htmlFor="spacePhotos" className="upload-label">
            <span className="upload-icon">＋</span>

            <strong>
              {photos.length >= MAX_PHOTOS
                ? "Photo limit reached"
                : "Upload photos"}
            </strong>

            <span>
              Select multiple images or add more photos later.
            </span>

            <span className="upload-count">
              {photos.length} / {MAX_PHOTOS} photos added
            </span>
          </label>
        </div>

        {error && <p className="upload-error">{error}</p>}

        {photoPreviews.length > 0 && (
          <div className="uploaded-photos-section">
            <h3>Your uploaded photos ({photos.length})</h3>

            <div className="uploaded-photos-grid">
              {photoPreviews.map((preview, index) => (
                <div
                  className="uploaded-photo-card"
                  key={`${preview.file.name}-${preview.file.lastModified}-${index}`}
                >
                  <img
                    src={preview.url}
                    alt={preview.file.name}
                  />

                  <div className="uploaded-photo-info">
                    <span title={preview.file.name}>
                      {preview.file.name}
                    </span>

                    <button
                      type="button"
                      className="remove-photo-button"
                      onClick={() => removePhoto(index)}
                      aria-label={`Remove ${preview.file.name}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onBack}
          >
            Back
          </button>

          <button type="submit" className="primary-button">
            Finish
          </button>
        </div>
      </form>
    </div>
  );
}
