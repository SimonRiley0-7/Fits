"use client";
import { useState, useEffect } from "react";
import { FileUpload } from "./FileUpload";
import { Link as LinkIcon, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

interface Attributes {
  category: string;
  color: string;
  style: string;
  details: string;
}

export function UploadBox({ onAnalysisComplete }: { onAnalysisComplete: (attr: Attributes, url: string, budget?: string) => void }) {
  const [urlInput, setUrlInput] = useState("");
  const [budget, setBudget] = useState("");
  const [targetGender, setTargetGender] = useState("Auto-detect");
  const [analyzing, setAnalyzing] = useState(false);
  const [hasDna, setHasDna] = useState(false);

  useEffect(() => {
    fetch("/api/profile/check").then(res => res.json()).then(data => {
      if (data.hasDna) setHasDna(true);
    }).catch(() => {});
  }, []);

  const analyzeImage = async (imageUrl: string) => {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, targetGender })
      });
      
      if (!res.ok) throw new Error("Analysis failed");
      
      const data = await res.json();
      onAnalysisComplete(data, imageUrl, budget);
      toast.success("Image analyzed!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to analyze image");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;
    analyzeImage(urlInput);
  };

  return (
    <div className="card p-6 w-full max-w-xl mx-auto space-y-6">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h2 className="font-black text-2xl tracking-tighter uppercase flex items-center gap-2"><Sparkles className="text-p" size={20} /> FITS.</h2>
          
          {hasDna ? (
            <span className="text-[10px] font-bold uppercase tracking-widest bg-p/10 text-p px-3 py-1.5 border border-p/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Using Style DNA
            </span>
          ) : (
            <select 
              value={targetGender}
              onChange={(e) => setTargetGender(e.target.value)}
              className="text-xs font-semibold bg-bg-soft border border-border rounded-none px-2 py-1.5 focus:outline-none focus:border-tx cursor-pointer transition-colors"
            >
              <option value="Auto-detect">Auto-detect Gender</option>
              <option value="Men">Force: Men's</option>
              <option value="Women">Force: Women's</option>
            </select>
          )}
        </div>
        <p className="text-[10px] uppercase font-bold tracking-widest text-tx-muted mb-6">Upload a screenshot or paste an image URL to identify clothing attributes.</p>
        
        <div className="mb-6">
          <label className="text-[10px] uppercase font-bold tracking-widest text-tx-muted mb-2 block flex items-center justify-between">
            <span>Max Budget (₹)</span>
            <span className="opacity-50">Optional</span>
          </label>
          <input 
             type="number"
             placeholder="NO LIMIT"
             value={budget}
             onChange={(e) => setBudget(e.target.value)}
             className="w-full bg-bg border border-border rounded-none px-4 py-3 text-[10px] uppercase font-bold tracking-widest focus:outline-none focus:border-p transition-colors"
          />
        </div>
      </div>

      {analyzing ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 text-p animate-spin" />
          <p className="font-medium text-tx">Analyzing style and colors...</p>
        </div>
      ) : (
        <>
          <FileUpload onUpload={(url) => analyzeImage(url)} />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center"><span className="bg-bg-surface px-4 text-[9px] uppercase tracking-[0.2em] font-bold text-tx-muted">OR</span></div>
          </div>

          <form onSubmit={handleUrlSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-tx-muted" size={16} />
              <input 
                type="url" 
                placeholder="PASTE IMAGE URL HERE..." 
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full bg-bg border border-border rounded-none pl-12 pr-4 py-4 text-[10px] uppercase font-bold tracking-widest focus:outline-none focus:border-p transition-colors"
                required
              />
            </div>
            <button type="submit" className="bg-p text-white font-bold text-[10px] uppercase tracking-[0.2em] px-8 hover:bg-p-h transition-colors">ANALYZE</button>
          </form>
        </>
      )}
    </div>
  );
}
