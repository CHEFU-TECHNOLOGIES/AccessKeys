import { AlertTriangle } from 'lucide-react';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { AccessKey } from '../data/sample';

interface RevokeModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  keyItem: AccessKey | null;
}

export default function RevokeModal({ open, onClose, onConfirm, keyItem }: RevokeModalProps) {
  return (
    <Modal open={open} onClose={onClose} width="max-w-md" showClose={false}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-100">Revoke access key?</h2>
            {keyItem && (
              <p className="text-sm text-zinc-500 mt-1">
                <span className="font-mono text-zinc-400">{keyItem.keyMasked}</span>
                <span className="mx-1.5 text-zinc-600">·</span>
                <span>{keyItem.name}</span>
              </p>
            )}
          </div>
        </div>

        <p className="text-sm text-zinc-400 mt-4 leading-relaxed">
          This key will <strong className="text-zinc-200">immediately stop working</strong>. Any application or employee using this credential will lose access. This action cannot be undone.
        </p>
      </div>

      <div className="px-6 pb-6 flex items-center justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={() => { onConfirm(); onClose(); }}>
          Revoke key
        </Button>
      </div>
    </Modal>
  );
}
