import React, { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import {
  UploadCloud,
  X,
  Loader2,
  Plus,
  Link as LinkIcon,
  AlertCircle,
  Images
} from 'lucide-react';

interface MultiImageDropzoneProps {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  helpText?: string;
}

export default function MultiImageDropzone({
  label,
  values = [],
  onChange,
  folder = 'tipe-rumah/galeri',
  helpText = 'Pilih satu atau beberapa foto (WebP, JPG, PNG, Maks. 5 MB per foto)'
}: MultiImageDropzoneProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [manualUrlInput, setManualUrlInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setUploading(true);
    setUploadCount(fileArray.length);
    setErrorMsg('');

    const newUrls: string[] = [];

    for (const file of fileArray) {
      const allowedTypes = ['image/webp', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setErrorMsg(`Format ${file.name} tidak didukung. Lewati.`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg(`Ukuran ${file.name} melebihi 5 MB. Lewati.`);
        continue;
      }

      try {
        const ext = file.name.split('.').pop() || 'webp';
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-');
        const filePath = `${folder}/${cleanName}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;

        const { data, error } = await supabase.storage
          .from('image')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from('image')
            .getPublicUrl(data.path);

          if (publicUrlData?.publicUrl) {
            newUrls.push(publicUrlData.publicUrl);
          }
        }
      } catch (err: any) {
        console.error('Error uploading file in gallery:', err);
      }
    }

    if (newUrls.length > 0) {
      onChange([...values, ...newUrls]);
    }
    setUploading(false);
    setUploadCount(0);
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    const updated = values.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleAddManualUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrlInput.trim()) return;
    onChange([...values, manualUrlInput.trim()]);
    setManualUrlInput('');
    setShowManualInput(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <Images className="w-4 h-4 text-[#0E3B2E]" />
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            {label} ({values.length} foto)
          </label>
        </div>
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-[11px] font-bold text-[#0E3B2E] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showManualInput ? 'Batal Tambah URL' : '+ Tambah URL Manual'}</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {showManualInput && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl flex gap-2">
          <input
            type="url"
            value={manualUrlInput}
            onChange={(e) => setManualUrlInput(e.target.value)}
            placeholder="https://...supabase.co/storage/v1/object/public/image/..."
            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0E3B2E]"
          />
          <button
            type="button"
            onClick={handleAddManualUrl}
            className="px-4 py-2 bg-[#0E3B2E] text-white rounded-xl text-xs font-bold hover:bg-[#07241C] transition-colors cursor-pointer"
          >
            Tambahkan
          </button>
        </div>
      )}

      {/* Gallery Grid of Uploaded Photos */}
      {values.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {values.map((url, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 group aspect-4/3 shadow-xs"
            >
              <img
                src={url}
                alt={`Galeri ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                Foto #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemovePhoto(idx)}
                className="absolute top-1.5 right-1.5 w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
                title="Hapus foto dari galeri"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Add more button tile in grid */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-4/3 border-2 border-dashed border-gray-300 hover:border-[#0E3B2E] rounded-2xl flex flex-col items-center justify-center gap-1.5 text-gray-500 hover:text-[#0E3B2E] bg-gray-50/50 hover:bg-emerald-50/20 transition-all cursor-pointer"
          >
            <Plus className="w-6 h-6" />
            <span className="text-xs font-bold">+ Tambah Foto</span>
          </button>
        </div>
      )}

      {/* Main Drag and Drop Zone if empty or for bulk upload */}
      {values.length === 0 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            if (e.dataTransfer.files) handleUploadFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-[#0E3B2E] bg-emerald-50/50 scale-[0.99]'
              : 'border-gray-300 hover:border-[#0E3B2E] bg-gray-50/50 hover:bg-white'
          }`}
        >
          {uploading ? (
            <div className="py-4 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 text-[#0E3B2E] animate-spin" />
              <p className="text-xs font-bold text-[#0E3B2E]">Mengunggah {uploadCount} foto galeri...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#0E3B2E] flex items-center justify-center mb-1">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-[#17201C]">
                Tarik & Lepas foto-foto galeri di sini, atau <span className="text-[#0E3B2E] underline">Pilih Banyak File</span>
              </p>
              <p className="text-[11px] text-gray-400">{helpText}</p>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input with multiple allowed */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/webp,image/jpeg,image/png,image/svg+xml"
        onChange={(e) => {
          if (e.target.files) handleUploadFiles(e.target.files);
        }}
        className="hidden"
      />
    </div>
  );
}
