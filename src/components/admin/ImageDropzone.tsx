import React, { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon
} from 'lucide-react';

interface ImageDropzoneProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  required?: boolean;
  helpText?: string;
}

export default function ImageDropzone({
  label,
  value,
  onChange,
  folder = 'tipe-rumah',
  required = false,
  helpText = 'Format: WebP, PNG, JPG (Maks. 5 MB)'
}: ImageDropzoneProps) {
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [useManualUrl, setUseManualUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadFile = async (file: File) => {
    // Validation
    const allowedTypes = ['image/webp', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg('Format file tidak didukung. Harap unggah WebP, JPEG, atau PNG.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Ukuran file terlalu besar (Maksimal 5 MB).');
      return;
    }

    setUploading(true);
    setErrorMsg('');

    try {
      // Clean filename
      const ext = file.name.split('.').pop() || 'webp';
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');
      const filePath = `${folder}/${cleanName}-${Date.now()}.${ext}`;

      const { data, error } = await supabase.storage
        .from('image')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('image')
        .getPublicUrl(data.path);

      if (publicUrlData?.publicUrl) {
        onChange(publicUrlData.publicUrl);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setErrorMsg(err.message || 'Gagal mengunggah gambar ke Supabase Storage.');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setUseManualUrl(!useManualUrl)}
          className="text-[11px] font-bold text-[#0E3B2E] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{useManualUrl ? 'Gunakan Upload File' : 'Input URL Manual'}</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {useManualUrl ? (
        <input
          type="url"
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://...supabase.co/storage/v1/object/public/image/..."
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E] text-xs"
        />
      ) : value ? (
        /* Image Preview Box */
        <div className="relative rounded-2xl border border-gray-200 bg-gray-50 p-3 flex items-center justify-between gap-4 group">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={value}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-xl border border-gray-200 bg-white shrink-0"
            />
            <div className="truncate text-xs">
              <p className="font-bold text-[#17201C] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                <span>Gambar Terpasang</span>
              </p>
              <p className="text-[11px] text-gray-400 truncate mt-0.5 max-w-xs">{value}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
            >
              Ganti Foto
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
              title="Hapus"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Drag and Drop Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-[#0E3B2E] bg-emerald-50/50 scale-[0.99]'
              : 'border-gray-300 hover:border-[#0E3B2E] bg-gray-50/50 hover:bg-white'
          }`}
        >
          {uploading ? (
            <div className="py-4 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 text-[#0E3B2E] animate-spin" />
              <p className="text-xs font-bold text-[#0E3B2E]">Mengunggah ke Supabase Storage...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#0E3B2E] flex items-center justify-center mb-1">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-[#17201C]">
                Tarik & Lepas gambar di sini, atau <span className="text-[#0E3B2E] underline">Pilih File</span>
              </p>
              <p className="text-[11px] text-gray-400">{helpText}</p>
            </div>
          )}
        </div>
      )}

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/webp,image/jpeg,image/png,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
