"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Wand2, Plus, X, Loader2, Sparkles, UploadCloud } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useState } from "react";

const FILTERS = ["All", "Tops", "Bottoms", "Shoes", "Accessories"];

export function WardrobeClient({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);
  const [activeFilter, setActiveFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/wardrobe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: id })
      });
      if (!res.ok) throw new Error();
      setItems(items.filter(item => item.id !== id));
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const filteredItems = items.filter(item => {
    if (activeFilter === "All") return true;
    const cat = (item.category || "").toLowerCase();
    if (activeFilter === "Tops") return ["shirt", "t-shirt", "jacket", "sweater", "hoodie", "top"].some(c => cat.includes(c));
    if (activeFilter === "Bottoms") return ["pants", "jeans", "shorts", "skirt", "trousers"].some(c => cat.includes(c));
    if (activeFilter === "Shoes") return ["shoes", "sneakers", "boots", "sandals"].some(c => cat.includes(c));
    if (activeFilter === "Accessories") return ["watch", "belt", "hat", "cap", "sunglasses"].some(c => cat.includes(c));
    return true;
  });

  if (!items || items.length === 0) {
    return (
      <>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col items-center justify-center h-[60vh] text-center"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-32 h-32 text-border mb-8">
            <path d="M12 2v20M6 10l6-8 6 8M6 10v12M18 10v12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2 className="font-display text-4xl mb-4">Your closet is waiting</h2>
          <p className="t-body text-tx-muted mb-8 max-w-sm">Grab your first piece or add what you already own.</p>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/grab" className="btn-primary rounded-none">
              Grab something
            </Link>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-p text-white px-5 py-2.5 rounded-none text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-4 h-4" />
              Add Piece
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {isAddModalOpen && (
            <AddItemModal 
              onClose={() => setIsAddModalOpen(false)} 
              onAdd={(newItem: any) => {
                setItems([newItem, ...items]);
                setIsAddModalOpen(false);
              }} 
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters with Layout Animation and Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`relative px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-colors ${
                activeFilter === f ? 'text-bg' : 'text-tx-muted hover:text-tx'
              }`}
            >
              {activeFilter === f && (
                <motion.div
                  layoutId="activeFilterIndicator"
                  className="absolute inset-0 bg-tx rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{f}</span>
            </button>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-p text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4" />
          Add Piece
        </motion.button>
      </div>

      {/* Grid with Layout and AnimatePresence */}
      <motion.div 
        layout
        className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item: any, i: number) => (
            <motion.div 
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)", transition: { duration: 0.2 } }}
              transition={{ 
                type: "spring", 
                bounce: 0.3,
                duration: 0.6,
                delay: i * 0.05 
              }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative group break-inside-avoid bg-bg-surface rounded-lg overflow-hidden flex flex-col cursor-pointer"
            >
              {/* Image */}
              <div className="w-full bg-bg relative">
                <img 
                  src={item.image_url} 
                  alt={item.category || "Clothing item"} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Amber border overlay (hover state) */}
                <div className="absolute inset-0 border border-tx/10 opacity-0 group-hover:opacity-100 group-hover:border-tx/30 transition-all duration-300 pointer-events-none z-10 rounded-lg" />
                
                {/* Hover Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 z-20">
                  <Link 
                    href={`/dashboard/style?item=${encodeURIComponent(item.category || 'item')}`} 
                    title="Complete this outfit"
                    className="w-8 h-8 rounded-full bg-bg/80 backdrop-blur-md border border-border flex items-center justify-center text-tx hover:text-p hover:border-p shadow-xl transition-colors"
                  >
                    <Wand2 className="w-4 h-4" />
                  </Link>
                  <button onClick={(e) => { e.preventDefault(); handleDelete(item.id); }} className="w-8 h-8 rounded-full bg-bg/80 backdrop-blur-md border border-border flex items-center justify-center text-tx hover:text-red-500 hover:border-red-500 shadow-xl transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content Bottom */}
              <div className="p-4 flex flex-col gap-2 bg-gradient-to-b from-transparent to-bg-surface/50">
                <p className="font-body font-medium text-tx capitalize line-clamp-1">
                  {item.brand ? `${item.brand} ` : ''}{item.color} {item.category}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-tx/5 text-tx-muted px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
                {/* One-Click Complete This Outfit */}
                <Link
                  href={`/dashboard/style?item=${encodeURIComponent(item.category || 'item')}`}
                  className="mt-1 w-full flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-p border border-p/30 hover:border-p hover:bg-p/5 rounded-lg py-2 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Sparkles className="w-3 h-3" /> Complete this outfit
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Add Item Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <AddItemModal 
            onClose={() => setIsAddModalOpen(false)} 
            onAdd={(newItem: any) => {
              setItems([newItem, ...items]);
              setIsAddModalOpen(false);
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddItemModal({ onClose, onAdd }: { onClose: () => void, onAdd: (item: any) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [brand, setBrand] = useState("");
  
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setPreview(URL.createObjectURL(f));
      
      // Auto-tag immediately
      try {
        setIsAnalyzing(true);
        // First upload the image to get a URL for OpenAI
        const formData = new FormData();
        formData.append("file", f);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const { url } = await uploadRes.json();
        
        if (!url) throw new Error("Upload failed");
        
        // Save the uploaded url to avoid re-uploading on save
        setPreview(url);

        // Analyze image
        const aiRes = await fetch("/api/analyze-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: url })
        });
        const data = await aiRes.json();
        
        if (data.items && data.items.length > 0) {
          const item = data.items[0];
          setCategory(item.category || "");
          setColor(item.color || "");
          toast.success("Iris successfully tagged your item!");
        }
      } catch (e) {
        toast.error("Auto-tagging failed, you can enter details manually.");
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleSave = async () => {
    if (!file) return toast.error("Please select an image");
    if (!category) return toast.error("Category is required");

    try {
      setIsSaving(true);
      let imageUrl = preview;
      
      // Upload if not already uploaded during auto-tag
      if (!imageUrl || imageUrl.startsWith("blob:")) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const { url } = await uploadRes.json();
        imageUrl = url;
        setIsUploading(false);
      }

      // Save to DB
      const res = await fetch("/api/wardrobe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: imageUrl,
          category,
          color,
          brand
        })
      });

      if (!res.ok) throw new Error("Failed to save");
      
      const { item } = await res.json();
      toast.success("Added to wardrobe");
      onAdd(item);
    } catch (e) {
      toast.error("Failed to add item");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-bg-surface border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display text-2xl font-bold">Add to Wardrobe</h2>
          <button onClick={onClose} className="p-2 bg-bg hover:bg-border rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Image Upload Area */}
          {!preview ? (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border hover:border-p rounded-xl cursor-pointer bg-bg transition-colors group">
              <UploadCloud className="w-10 h-10 text-tx-muted group-hover:text-p mb-4 transition-colors" />
              <span className="font-medium">Click to upload photo</span>
              <span className="text-xs text-tx-muted mt-1">JPEG, PNG, WEBP</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          ) : (
            <div className="relative w-full h-64 rounded-xl overflow-hidden bg-bg border border-border group">
              <img src={preview} alt="Preview" className="w-full h-full object-contain" />
              
              {/* Analyzing Overlay */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-p animate-spin" />
                  <span className="font-bold text-p animate-pulse">Iris is analyzing...</span>
                </div>
              )}

              {/* Hover Change Photo */}
              {!isAnalyzing && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="bg-bg text-tx px-4 py-2 rounded-full text-sm font-medium cursor-pointer hover:bg-p hover:text-white transition-colors">
                    Change Photo
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-tx-muted mb-2">Category *</label>
              <input 
                type="text" placeholder="e.g. Jacket, Sneakers, T-Shirt"
                value={category} onChange={e => setCategory(e.target.value)}
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-p transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-tx-muted mb-2">Color</label>
                <input 
                  type="text" placeholder="e.g. Navy Blue"
                  value={color} onChange={e => setColor(e.target.value)}
                  className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-p transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-tx-muted mb-2">Brand</label>
                <input 
                  type="text" placeholder="e.g. Zara"
                  value={brand} onChange={e => setBrand(e.target.value)}
                  className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-p transition-colors"
                />
              </div>
            </div>
          </div>

        </div>

        <div className="p-6 border-t border-border bg-bg flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 font-medium hover:bg-bg-surface rounded-xl transition-colors">Cancel</button>
          <button 
            onClick={handleSave}
            disabled={isUploading || isSaving || !file || !category}
            className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50 min-w-[120px]"
          >
            {(isUploading || isSaving) && <Loader2 className="w-4 h-4 animate-spin" />}
            {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Add Item"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
