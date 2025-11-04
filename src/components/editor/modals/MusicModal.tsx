
import { PixelModal } from "@/components/pixel-modal";
import { PixelInput } from "@/components/pixel-input";
import { FileUpload } from "@/components/file-upload";
import { PixelButton } from "@/components/pixel-button";
import { Library } from "lucide-react";

interface MusicModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingMusic: any;
  musicFormData: any;
  setMusicFormData: (data: any) => void;
  uploadedMusic: string;
  handleMusicUpload: (file: File) => void;
  openAssetLibrary: (type: string) => void;
  handleUpdateMusic: () => void;
  handleAddMusic: () => void;
}

export const MusicModal = ({
  isOpen,
  onClose,
  editingMusic,
  musicFormData,
  setMusicFormData,
  uploadedMusic,
  handleMusicUpload,
  openAssetLibrary,
  handleUpdateMusic,
  handleAddMusic,
}: MusicModalProps) => {
  return (
    <PixelModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingMusic ? "EDIT MUSIC" : "ADD MUSIC"}
    >
      <div className="space-y-4">
        <PixelInput
          label="MUSIC NAME"
          value={musicFormData.name}
          onChange={(e) =>
            setMusicFormData({ ...musicFormData, name: e.target.value })
          }
          placeholder="CHIPTUNE_BEAT.MP3"
        />
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-wider">
            MUSIC FILE
          </label>
          {uploadedMusic && (
            <div className="flex justify-center mb-3">
              <audio controls className="w-full">
                <source src={uploadedMusic} type="audio/mpeg" />
              </audio>
            </div>
          )}
          <FileUpload
            accept="audio/*"
            onFileSelect={handleMusicUpload}
            maxSize={10}
            label={uploadedMusic ? "REPLACE AUDIO" : "UPLOAD AUDIO"}
          />
        </div>
        <PixelButton
          variant="secondary"
          className="w-full text-[10px] flex items-center justify-center gap-2"
          onClick={() => openAssetLibrary("music")}
        >
          <Library className="w-4 h-4" /> CHOOSE FROM LIBRARY
        </PixelButton>
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
            onClick={editingMusic ? handleUpdateMusic : handleAddMusic}
          >
            {editingMusic ? "UPDATE" : "ADD"}
          </PixelButton>
        </div>
      </div>
    </PixelModal>
  );
};
