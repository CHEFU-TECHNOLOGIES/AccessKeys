import { useState } from "react";
import { Check, Copy, Download, Key, AlertTriangle } from "lucide-react";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import { useData } from "../context/DataContext";
import type { AccessKeyPermission } from "../context/DataContext";

const EXPIRY_OPTIONS = [
    { label: "7 days", value: "7d" },
    { label: "30 days", value: "30d" },
    { label: "90 days", value: "90d" },
    { label: "1 year", value: "1y" },
    { label: "Never", value: "never" },
    { label: "Custom date", value: "custom" },
];

const PERMISSION_OPTIONS: { label: string; value: AccessKeyPermission; description: string }[] = [
    { label: "Read", value: "read", description: "View messages and account data" },
    { label: "Write", value: "write", description: "Create, edit, and send" },
    { label: "Full access", value: "full", description: "Read and write access" },
];

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
    const { createKey } = useData();
    const [step, setStep] = useState<"form" | "success">("form");
    const [keyName, setKeyName] = useState("");
    const [expiry, setExpiry] = useState("90d");
    const [permission, setPermission] = useState<AccessKeyPermission>("full");
    const [customDate, setCustomDate] = useState("");
    const [generatedKey, setGeneratedKey] = useState("");
    const [copied, setCopied] = useState(false);
    const [generating, setGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!keyName.trim()) return;
        setGenerating(true);
        const expDate = expiry === "custom" ? customDate : getExpiryDate(expiry);
        const created = await createKey(keyName.trim(), expDate ? new Date(expDate).toISOString() : null, permission);
        setGeneratedKey(created.accessKey);
        setStep("success");
        setGenerating(false);
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(generatedKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const content = `Flow access key\n\nLabel: ${keyName}\nPermissions: ${PERMISSION_OPTIONS.find((option) => option.value === permission)?.label}\nKey: ${generatedKey}\nCreated: ${new Date().toISOString()}\n\nStore this credential securely. It will not be shown again.`;
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
            setKeyName("");
            setExpiry("90d");
            setPermission("full");
            setGeneratedKey("");
            setCopied(false);
        }, 200);
    };

    const isValid = keyName.trim();

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
                                Create a secure credential for a Flow integration.
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
                                        className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${expiry === opt.value
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
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                                Permissions
                            </label>
                            <div className="grid grid-cols-3 gap-1.5">
                                {PERMISSION_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setPermission(option.value)}
                                        className={`p-2.5 rounded-md text-left border transition-all ${permission === option.value
                                            ? "bg-violet-500/15 border-violet-500/50 text-violet-300"
                                            : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
                                            }`}
                                    >
                                        <span className="block text-xs font-medium">{option.label}</span>
                                        <span className="block text-[11px] text-zinc-500 mt-1 leading-tight">{option.description}</span>
                                    </button>
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
                            disabled={!isValid || generating}
                        >
                            <Key className="w-3.5 h-3.5" />
                            {generating ? "Generating..." : "Generate key"}
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
                                className={`flex-1 ${copied ? "bg-emerald-600! border-emerald-500/50!" : ""}`}
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
                                    Flow integration
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-xs text-zinc-500">Permissions</span>
                                <span className="text-xs text-zinc-300">
                                    {PERMISSION_OPTIONS.find((option) => option.value === permission)?.label}
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
