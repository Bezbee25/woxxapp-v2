'use client';

import React from 'react';

interface SectionMediaBackgroundProps {
  src: string;
  alt?: string;
  gradient?: string;
  videoSrc?: string;
}

export function SectionMediaBackground({
  src,
  alt = 'Arrière-plan WoxxApp',
  gradient = 'from-white/60 via-white/40 to-[#FFFDF9]/90',
  videoSrc,
}: SectionMediaBackgroundProps) {
  const mediaUrl = videoSrc || src;
  const isVideo = mediaUrl.endsWith('.webm') || mediaUrl.endsWith('.mp4');

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {isVideo ? (
        <video
          src={mediaUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center"
        />
      ) : (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover object-center"
        />
      )}
      <div className={`absolute inset-0 bg-gradient-to-b ${gradient} backdrop-blur-[0.5px]`}></div>
    </div>
  );
}
