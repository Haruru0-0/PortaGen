
import { PixelModal } from "@/components/pixel-modal";
import { PixelInput } from "@/components/pixel-input";
import { FileUpload } from "@/components/file-upload";
import { PixelButton } from "@/components/pixel-button";
import { Library } from "lucide-react";
import { StaticImageData } from "next/image";

interface IconModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingIcon: any;
  iconFormData: any;
  setIconFormData: (data: any) => void;
  iconImagePreview: string | StaticImageData;
  handleIconImageUpload: (file: File) => void;
  openAssetLibrary: (type: string) => void;
  handleUpdateIcon: () => void;
  handleAddIcon: () => void;
}

export const IconModal = ({
  isOpen,
  onClose,
  editingIcon,
  iconFormData,
  setIconFormData,
  iconImagePreview,
  handleIconImageUpload,
  openAssetLibrary,
  handleUpdateIcon,
  handleAddIcon,
}: IconModalProps) => {
  return (
    <PixelModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingIcon ? "EDIT ICON" : "ADD ICON"}
    >
      <div className="space-y-4">
        <PixelInput
          label="ICON NAME"
          value={iconFormData.name}
          onChange={(e) =>
            setIconFormData({ ...iconFormData, name: e.target.value })
          }
          placeholder="ABOUT ME"
        />
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-wider">
            ICON IMAGE
          </label>
          {iconImagePreview && (
            <div className="flex justify-center mb-3">
              <img
                src={iconImagePreview as string}
                alt="Icon preview"
                className="w-16 h-16 border-4 border-border object-cover"
              />
            </div>
          )}
          <FileUpload
            accept="image/*"
            onFileSelect={handleIconImageUpload}
            maxSize={1}
            label={iconImagePreview ? "REPLACE IMAGE" : "UPLOAD IMAGE"}
          />
          <PixelButton
            variant="secondary"
            className="w-full text-[10px] flex items-center justify-center gap-2"
            onClick={() => openAssetLibrary("icon")}
          >
            <Library className="w-4 h-4" /> CHOOSE FROM LIBRARY
          </PixelButton>
        </div>
        <PixelInput
          label="LINK URL (OPTIONAL)"
          value={iconFormData.url}
          onChange={(e) =>
            setIconFormData({ ...iconFormData, url: e.target.value })
          }
          placeholder="https://..."
        />
        <div className="flex gap-3 pt-2">
          <PixelButton
            variant="secondary"
            className="flex-1 text-[10px]"
            onClick={onClose}
          >
            CANCEL
          </PixelButton>
          <PixelButton
            variant="primary"
            className="flex-1 text-[10px]"
            onClick={editingIcon ? handleUpdateIcon : handleAddIcon}
          >
            {editingIcon ? "UPDATE" : "ADD"}
          </PixelButton>
        </div>
      </div>
    </PixelModal>
  );
};
