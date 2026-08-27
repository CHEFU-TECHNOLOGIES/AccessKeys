import { useState } from "react";
import {
  Check,
  Copy,
  Download,
  Key,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import {
  Permission,
  PERMISSION_LABELS,
  PERMISSION_DESCRIPTIONS,
  AccessKey,
  employees,
} from "../data/sample";
import { useData } from "../context/DataContext";

const PERMISSIONS: Permission[] = [
  "send_email",
  "view_logs",
  "manage_templates",
  "api_access",
];

const EXPIRY_OPTIONS = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
  { label: "1 year", value: "1y" },
  { label: "Never", value: "never" },
  { label: "Custom date", value: "custom" },
];

function generateKey() {
  const chars = "abcdef0123456789";
  let key = "FLOW_";
  for (let i = 0; i < 32; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
  }
  return key;
}

function getExpiryDate(value: string): string | null {
  if (value === "never") return null;
  const now = new Date();
  const map: Record<string, number> = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
    "1y": 365,
  };
  const days = map[value];
  if (!days) return "Custom";
  const d = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface GenerateKeyModalProps {
  open: boolean;
  onClose: () => void;
}

export default function GenerateKeyModal({
  open,
  onClose,
}: GenerateKeyModalProps) {
  const { addKey } = useData();
  const [step, setStep] = useState<"form" | "success">("form");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [keyName, setKeyName] = useState("");
  const [expiry, setExpiry] = useState("90d");
  const [customDate, setCustomDate] = useState("");
  const [permissions, setPermissions] = useState<Permission[]>(["send_email"]);
  const [generatedKey, setGeneratedKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [assignType, setAssignType] = useState<"employee" | "workspace">(
    "employee",
  );

  const selectedEmp = employees.find((e) => e.id === selectedEmployee);

  const handleGenerate = () => {
    if (!selectedEmployee || !keyName || permissions.length === 0) return;
    const key = generateKey();
    setGeneratedKey(key);

    const expDate = expiry === "custom" ? customDate : getExpiryDate(expiry);
    const newKey: AccessKey = {
      id: `ak_${Date.now()}`,
      name: keyName,
      employee: selectedEmp?.name ?? "",
      employeeId: selectedEmployee,
      workspace: selectedEmp?.workspace ?? "",
      keyMasked: `FLOW_••••••••••••${key.slice(-4).toUpperCase()}`,
      keyLastFour: key.slice(-4).toUpperCase(),
      status: "active",
      permissions,
      created: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      expires: expDate,
      lastUsed: "Just now",
      createdBy: "Admin",
      createdFrom: "Dashboard",
    };
    addKey(newKey);
    setStep("success");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = `AccessKey credential\n\nName: ${keyName}\nEmployee: ${selectedEmp?.name}\nKey: ${generatedKey}\nCreated: ${new Date().toISOString()}\n\nStore this credential securely. It will not be shown again.`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${keyName.replace(/\s+/g, "_").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep("form");
      setSelectedEmployee("");
      setKeyName("");
      setExpiry("90d");
      setPermissions(["send_email"]);
      setGeneratedKey("");
      setCopied(false);
    }, 200);
  };

  const togglePermission = (p: Permission) => {
    setPermissions((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  };

  const isValid = selectedEmployee && keyName.trim() && permissions.length > 0;

  return (
    <Modal open={open} onClose={handleClose} width="max-w-xl" showClose={false}>
      {step === "form" ? (
        <>
          <div className="px-6 py-5 border-b border-zinc-800 flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-100">
                Generate access key
              </h2>
              <p className="text-sm text-zinc-500 mt-0.5">
                Create a secure credential for an employee or workspace.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors ml-4 mt-0.5"
            >
              <span className="text-lg leading-none">×</span>
            </button>
          </div>

          <div className="px-6 py-5 space-y-5">
            {/* Type toggle */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">
                Assign to
              </label>
              <div className="flex gap-1 p-0.5 bg-zinc-800 rounded-lg w-fit">
                {(["employee", "workspace"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setAssignType(t)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      assignType === t
                        ? "bg-zinc-700 text-zinc-100 shadow-sm"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Employee/Workspace selector */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                {assignType === "employee" ? "Employee" : "Workspace"}
              </label>
              <div className="relative">
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full h-9 pl-3 pr-8 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 appearance-none transition-colors"
                >
                  <option value="">Select an employee...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} — {emp.workspace}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            {/* Key name */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Key name
              </label>
              <input
                type="text"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="e.g. Marketing Email Sender"
                className="w-full h-9 px-3 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors"
              />
            </div>

            {/* Expiration */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Expiration
              </label>
              <div className="flex flex-wrap gap-1.5">
                {EXPIRY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setExpiry(opt.value)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                      expiry === opt.value
                        ? "bg-violet-500/15 border-violet-500/50 text-violet-300"
                        : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {expiry === "custom" && (
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="mt-2 w-full h-9 px-3 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-violet-500 transition-colors"
                />
              )}
            </div>

            {/* Permissions */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">
                Permissions
              </label>
              <div className="space-y-1.5">
                {PERMISSIONS.map((p) => (
                  <label
                    key={p}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      permissions.includes(p)
                        ? "bg-violet-500/8 border-violet-500/30"
                        : "bg-zinc-800/50 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        permissions.includes(p)
                          ? "bg-violet-500 border-violet-500"
                          : "bg-transparent border-zinc-600"
                      }`}
                      onClick={() => togglePermission(p)}
                    >
                      {permissions.includes(p) && (
                        <Check
                          className="w-2.5 h-2.5 text-white"
                          strokeWidth={3}
                        />
                      )}
                    </div>
                    <div onClick={() => togglePermission(p)}>
                      <p className="text-sm font-medium text-zinc-200">
                        {PERMISSION_LABELS[p]}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {PERMISSION_DESCRIPTIONS[p]}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleGenerate}
              disabled={!isValid}
            >
              <Key className="w-3.5 h-3.5" />
              Generate key
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="px-6 pt-6 pb-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mb-4">
              <Key className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-base font-semibold text-zinc-100">
              Access key generated
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Copy this key now. For security, the complete key will only be
              shown once.
            </p>
          </div>

          <div className="px-6 pb-5 space-y-4">
            {/* Key display */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
              <p className="text-xs font-medium text-zinc-500 mb-2 font-mono tracking-wider uppercase">
                Secret key
              </p>
              <div className="flex items-center gap-3">
                <code className="flex-1 font-mono text-sm text-emerald-300 break-all select-all leading-relaxed">
                  {generatedKey}
                </code>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                onClick={handleCopy}
                className={`flex-1 ${copied ? "!bg-emerald-600 !border-emerald-500/50" : ""}`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy key
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="w-3.5 h-3.5" />
                Download
              </Button>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-3 p-3 bg-amber-500/8 border border-amber-500/20 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300/80 leading-relaxed">
                Save this credential somewhere secure. You won't be able to view
                the complete key again.
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                <span className="text-xs text-zinc-500">Name</span>
                <span className="text-xs text-zinc-300 font-medium">
                  {keyName}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                <span className="text-xs text-zinc-500">Employee</span>
                <span className="text-xs text-zinc-300">
                  {selectedEmp?.name}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-zinc-500">Permissions</span>
                <span className="text-xs text-zinc-300">
                  {permissions.length} granted
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-zinc-800 flex justify-end">
            <Button variant="secondary" onClick={handleClose}>
              Done
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
