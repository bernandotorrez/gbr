import React, { useState } from 'react';

interface HouseDetailGalleryProps {
  photos: string[];
  title: string;
}

export default function HouseDetailGallery({ photos, title }: HouseDetailGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Main Large Image */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-100 group">
        <img
          src={photos[activeIndex]}
          alt={`${title} - Foto ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full">
          Foto {activeIndex + 1} dari {photos.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {photos.map((photo, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
              activeIndex === idx
                ? 'border-[#047857] ring-2 ring-[#047857]/30 scale-[1.02]'
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
    </div>
  );
}
