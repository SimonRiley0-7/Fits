"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileText, Image as Img, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function FileUpload({ onUpload }: { onUpload: (url: string, file: any) => void }) {
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (accepted: File[]) => {
    setUploading(true);
    await toast.promise(
      Promise.all(accepted.map(async (file) => {
        const fd = new FormData(); fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const { url } = await res.json();
        const f = { name: file.name, url, type: file.type, size: file.size };
        setFiles((p) => [...p, f]);
        onUpload(url, f);
        return f;
      })),
      { loading: "Uploading...", success: "Uploaded!", error: "Upload failed" }
    );
    setUploading(false);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, disabled: uploading });

  return (
    <div className="space-y-3">
      <div {...getRootProps()} className={cn(
        "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200",
        isDragActive ? "border-p bg-p-soft scale-[1.01]" : "border-border hover:border-p/50 hover:bg-bg-soft",
        uploading && "pointer-events-none opacity-60"
      )}>
        <input {...getInputProps()} />
        <motion.div animate={isDragActive ? { scale:1.1 } : { scale:1 }} className="flex flex-col items-center gap-3">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
            isDragActive ? "bg-p text-white" : "bg-bg-soft text-tx-muted")}>
            <Upload size={22} />
          </div>
          <div>
            <p className="text-sm font-medium text-tx">{isDragActive ? "Drop it!" : "Drop files or click to upload"}</p>
            <p className="t-small mt-0.5">PNG, JPG, PDF up to 10MB</p>
          </div>
        </motion.div>
      </div>
      <AnimatePresence>
        {files.map((f) => (
          <motion.div key={f.url} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, x:-8 }}
            className="card-soft flex items-center gap-3 p-3">
            <div className="w-9 h-9 rounded-lg bg-p-soft flex items-center justify-center shrink-0">
              {f.type?.startsWith("image") ? <Img size={16} className="text-p" /> : <FileText size={16} className="text-p" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-tx truncate">{f.name}</p>
              <p className="t-small">{(f.size/1024).toFixed(0)} KB</p>
            </div>
            <CheckCircle size={18} className="text-green-500 shrink-0" />
            <button onClick={() => setFiles((p) => p.filter((x) => x.url !== f.url))}
              className="p-1 hover:bg-border rounded-md transition-colors">
              <X size={14} className="text-tx-muted" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
