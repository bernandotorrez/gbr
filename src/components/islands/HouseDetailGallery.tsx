import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface HouseDetailGalleryProps {
  photos: string[];
  title: string;
}

export default function HouseDetailGallery({ photos, title }: HouseDetailGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!photos || photos.length === 0) return null;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, goNext, goPrev]);

  return (
    <>
      <div className="space-y-4">
        {/* Main Large Image */}
        <div
          className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-100 group cursor-zoom-in"
          onClick={() => openLightbox(activeIndex)}
        >
          <img
            src={photos[activeIndex]}
            alt={`${title} - Foto ${activeIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            Foto {activeIndex + 1} dari {photos.length}
          </div>
          {/* Zoom hint badge */}
          <div className="absolute bottom-3 right-3 bg-[#0E3B2E]/80 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            Klik untuk perbesar
          </div>
        </div>

        {/* Thumbnails */}
        {photos.length > 1 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
            {photos.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  activeIndex === idx
                    ? 'border-[#0E3B2E] ring-2 ring-[#0E3B2E]/30 scale-[1.02]'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                aria-label={`Lihat foto ${idx + 1}`}
              >
                <img
                  src={photo}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Overlay */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-10 transition-opacity duration-300"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-2 -right-2 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5 text-[#17201C]" />
            </button>

            {/* Counter */}
            <div className="absolute top-0 left-0 z-10 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              {lightboxIndex + 1} / {photos.length}
            </div>

            {/* Image */}
            <img
              src={photos[lightboxIndex]}
              alt={`${title} - Foto ${lightboxIndex + 1}`}
              className="max-h-[78vh] w-full object-contain rounded-2xl shadow-2xl"
            />

            {/* Navigation */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute left-2 sm:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
                  aria-label="Foto sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#17201C]" />
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-2 sm:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
                  aria-label="Foto berikutnya"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#17201C]" />
                </button>
              </>
            )}

            {/* Thumbnail strip in lightbox */}
            {photos.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto max-w-full pb-1 justify-center">
                {photos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className={`w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      lightboxIndex === idx
                        ? 'border-white ring-1 ring-white/50 scale-105'
                        : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                    aria-label={`Lihat foto ${idx + 1}`}
                  >
                    <img
                      src={photo}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Keyboard hint */}
            <p className="text-white/50 text-xs mt-3 text-center">
              Tekan <kbd className="bg-white/20 px-1.5 py-0.5 rounded text-xs font-mono">Esc</kbd> untuk menutup &middot; <kbd className="bg-white/20 px-1.5 py-0.5 rounded text-xs font-mono">←</kbd> <kbd className="bg-white/20 px-1.5 py-0.5 rounded text-xs font-mono">→</kbd> untuk navigasi
            </p>
          </div>
        </div>
      )}
    </>
  );
}
