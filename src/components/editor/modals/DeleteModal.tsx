
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";

interface DeleteModalProps {
  deleteTarget: any;
  onClose: () => void;
  confirmDelete: () => void;
}

export const DeleteModal = ({
  deleteTarget,
  onClose,
  confirmDelete,
}: DeleteModalProps) => {
  return (
    <DeleteConfirmationModal
      isOpen={deleteTarget !== null}
      onClose={onClose}
      onConfirm={confirmDelete}
      title={`DELETE ${deleteTarget?.type.toUpperCase()}`}
      message={`ARE YOU SURE YOU WANT TO DELETE THIS ${deleteTarget?.type.toUpperCase()}?`}
    />
  );
};
