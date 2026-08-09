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
          <div className="w-20 h-20 rounded-full bg-p/10 flex items-center justify-center border border-p/20 mb-8">
             <Sparkles className="w-8 h-8 text-p opacity-80" />
          </div>
          <h2 className="font-black text-4xl uppercase tracking-tighter mb-4 text-tx">Your closet is waiting</h2>
          <p className="text-tx-muted mb-8 max-w-sm uppercase tracking-widest text-[10px] font-bold leading-relaxed">Grab your first piece or add what you already own.</p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/dashboard/grab" className="group relative bg-bg-surface text-tx px-10 py-4 font-bold text-xs tracking-widest uppercase border border-border hover:border-p/50 transition-all">
              <div className="absolute inset-0 bg-p/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span>GRAB SOMETHING</span>
            </Link>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-p text-white px-10 py-4 text-xs tracking-widest uppercase font-bold hover:bg-p-h transition-colors border border-p"
            >
              <Plus className="w-4 h-4" />
              ADD PIECE
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
    <div className="space-y-12">
      {/* Filters with Layout Animation and Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`relative px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors border ${
                activeFilter === f ? 'text-p border-p bg-p/5' : 'text-tx-muted border-border hover:border-tx/30 bg-bg-surface hover:text-tx'
              }`}
            >
              <span className="relative z-10">{f}</span>
            </button>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-3 bg-p text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest border border-p hover:bg-p-h transition-colors shadow-[0_0_20px_rgba(212,121,58,0.2)]"
        >
          <Plus className="w-4 h-4" />
          ADD PIECE
        </motion.button>
      </div>

      {/* Grid with Layout and AnimatePresence */}
      <motion.div 
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item: any, i: number) => (
            <motion.div 
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)", transition: { duration: 0.2 } }}
              transition={{ 
                type: "spring", 
                bounce: 0.3,
                duration: 0.6,
                delay: i * 0.05 
              }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="relative group aspect-[3/4] bg-bg-surface overflow-hidden flex flex-col cursor-pointer border border-border shadow-xl"
            >
              {/* Image */}
              <div className="absolute inset-0 w-full h-full bg-bg">
                <img 
                  src={item.image_url} 
                  alt={item.category || "Clothing item"} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent opacity-80" />
                
                {/* GenZ Tech UI overlay on cards */}
                <div className="absolute bottom-3 left-3 right-3 p-3 bg-bg/90 backdrop-blur-xl border border-border flex flex-col gap-1 transition-transform duration-300 transform group-hover:-translate-y-1">
                   <div className="text-p text-[10px] uppercase tracking-widest mb-1 line-clamp-1">{item.brand ? `${item.brand} ` : ''}{item.category}</div>
                   <div className="text-tx text-[10px] tracking-wider uppercase">{item.color || 'STANDARD'}</div>
                </div>
                
                {/* Hover Actions (Top Right) */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 z-20">
                  <Link 
                    href={`/dashboard/style?item_id=${item.id}&item_name=${encodeURIComponent(item.category || 'item')}`} 
                    title="Complete this outfit"
                    className="w-10 h-10 bg-bg/90 backdrop-blur-md border border-border flex items-center justify-center text-tx hover:text-p hover:border-p shadow-xl transition-colors"
                  >
                    <Wand2 className="w-4 h-4" />
                  </Link>
                  <button onClick={(e) => { e.preventDefault(); handleDelete(item.id); }} className="w-10 h-10 bg-bg/90 backdrop-blur-md border border-border flex items-center justify-center text-tx hover:text-red-500 hover:border-red-500 shadow-xl transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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
        className="absolute inset-0 bg-bg/90 backdrop-blur-xl"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-bg-surface/80 backdrop-blur-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-border bg-bg/50">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 flex items-center justify-center border border-p/30 bg-p/10">
               <UploadCloud className="w-4 h-4 text-p" />
             </div>
             <h2 className="font-black text-xl uppercase tracking-tighter text-tx">Add to Wardrobe</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-bg hover:border-p border border-transparent transition-colors"><X className="w-5 h-5 text-tx" /></button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Image Upload Area */}
          {!preview ? (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border hover:border-p cursor-pointer bg-bg transition-colors group">
              <UploadCloud className="w-8 h-8 text-tx-muted group-hover:text-p mb-4 transition-colors" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-tx">Click to upload photo</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-tx-muted mt-2">JPEG, PNG, WEBP</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          ) : (
            <div className="relative w-full h-64 overflow-hidden bg-bg border border-border group">
              <img src={preview} alt="Preview" className="w-full h-full object-contain" />
              
              {/* Analyzing Overlay */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-bg/90 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-p/20 blur-xl rounded-full" />
                    <Sparkles className="w-8 h-8 text-p animate-pulse relative z-10" />
                  </div>
                  <span className="font-bold text-[10px] tracking-[0.2em] uppercase text-p animate-pulse">Iris Vision Active</span>
                </div>
              )}

              {/* Hover Change Photo */}
              {!isAnalyzing && (
                <div className="absolute inset-0 bg-bg/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="bg-p text-white px-6 py-3 border border-p text-[10px] tracking-widest uppercase font-bold cursor-pointer hover:bg-p-h transition-colors">
                    CHANGE PHOTO
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-p mb-3">Category *</label>
              <input 
                type="text" placeholder="e.g. Jacket, Sneakers, T-Shirt"
                value={category} onChange={e => setCategory(e.target.value)}
                className="w-full bg-bg border border-border px-5 py-4 text-sm focus:outline-none focus:border-p transition-colors text-tx placeholder:text-tx-muted/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-tx-muted mb-3">Color</label>
                <input 
                  type="text" placeholder="e.g. Navy Blue"
                  value={color} onChange={e => setColor(e.target.value)}
                  className="w-full bg-bg border border-border px-5 py-4 text-sm focus:outline-none focus:border-p transition-colors text-tx placeholder:text-tx-muted/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-tx-muted mb-3">Brand</label>
                <input 
                  type="text" placeholder="e.g. Zara"
                  value={brand} onChange={e => setBrand(e.target.value)}
                  className="w-full bg-bg border border-border px-5 py-4 text-sm focus:outline-none focus:border-p transition-colors text-tx placeholder:text-tx-muted/50"
                />
              </div>
            </div>
          </div>

        </div>

        <div className="p-6 border-t border-border bg-bg/50 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-4 text-[10px] tracking-widest uppercase font-bold text-tx-muted hover:text-tx transition-colors">Cancel</button>
          <button 
            onClick={handleSave}
            disabled={isUploading || isSaving || !file || !category}
            className="flex items-center justify-center gap-3 bg-p text-white px-8 py-4 text-[10px] tracking-widest uppercase font-bold border border-p hover:bg-p-h disabled:opacity-50 disabled:hover:bg-p transition-colors min-w-[140px]"
          >
            {(isUploading || isSaving) && <Loader2 className="w-3 h-3 animate-spin" />}
            {isUploading ? "UPLOADING..." : isSaving ? "SAVING..." : "ADD ITEM"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
