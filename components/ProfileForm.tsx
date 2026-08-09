"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export function ProfileForm({ initialData }: { initialData: any }) {
  const [formData, setFormData] = useState(initialData);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ style_dna: formData }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Style DNA saved!");
    } catch (err) {
      toast.error("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-bg-surface border border-border space-y-8 shadow-sm">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="t-label">I shop for</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-bg border border-border rounded-none px-4 py-3 focus:border-tx outline-none transition-colors">
            <option value="Men">Men's Clothing</option>
            <option value="Women">Women's Clothing</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="t-label">Preferred Fit</label>
          <select name="fitPreference" value={formData.fitPreference} onChange={handleChange} className="w-full bg-bg border border-border rounded-none px-4 py-3 focus:border-tx outline-none transition-colors">
            <option value="Slim">Slim Fit</option>
            <option value="Regular">Regular Fit</option>
            <option value="Relaxed">Relaxed / Baggy</option>
            <option value="Oversized">Oversized</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="t-label">Top Size</label>
          <select name="topSize" value={formData.topSize} onChange={handleChange} className="w-full bg-bg border border-border rounded-none px-4 py-3 focus:border-tx outline-none transition-colors">
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="t-label">Bottom Size (Waist/Letter)</label>
          <input 
            type="text" 
            name="bottomSize" 
            value={formData.bottomSize} 
            onChange={handleChange} 
            placeholder="e.g. 32, 34, or M"
            className="w-full bg-bg border border-border rounded-none px-4 py-3 focus:border-tx outline-none transition-colors placeholder:text-tx-faint"
          />
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <label className="t-label">My Style Vibe (Keywords)</label>
        <input 
          type="text" 
          name="vibe" 
          value={formData.vibe} 
          onChange={handleChange} 
          placeholder="e.g. Minimalist, Streetwear, Old Money, Goth, Y2K"
          className="w-full bg-bg border border-border rounded-none px-4 py-3 focus:border-tx outline-none transition-colors placeholder:text-tx-faint"
        />
        <p className="t-small mt-2">Iris will use this vibe when styling outfits for you.</p>
      </div>

      <div className="pt-8 border-t border-border flex justify-end">
        <button type="submit" disabled={saving} className="bg-tx text-bg font-medium px-8 py-3 rounded-none hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Save DNA
        </button>
      </div>
    </form>
  );
}
