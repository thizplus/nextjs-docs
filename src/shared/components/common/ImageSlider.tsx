"use client";

import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { cn } from "@/shared/lib/utils";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageSliderProps {
  images: {
    url: string;
    alt?: string;
  }[];
  imageHeight?: string;
  enableZoom?: boolean;
  className?: string;
}

export function ImageSlider({
  images,
  imageHeight = "180px",
  enableZoom = true,
  className,
}: ImageSliderProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    slides: {
      perView: 2,
      spacing: 8,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 3, spacing: 8 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 5, spacing: 8 },
      },
    },
  });

  if (!images || images.length === 0) {
    return (
      <div
        className={cn(
          "bg-muted rounded-lg flex items-center justify-center h-[180px]",
          className
        )}
      >
        <p className="text-muted-foreground">ไม่มีรูปภาพ</p>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    if (enableZoom) {
      setLightboxIndex(index);
      setIsLightboxOpen(true);
    }
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div className={cn("relative group", className)}>
      {/* Keen Slider */}
      <div ref={sliderRef} className="keen-slider rounded-lg">
        {images.map((image, index) => (
          <div
            key={index}
            className="keen-slider__slide"
          >
            <div
              className="bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              style={{ height: imageHeight }}
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.url}
                alt={image.alt || `Image ${index + 1}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                loading={index < 5 ? "eager" : "lazy"}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {loaded && instanceRef.current && images.length > 2 && (
        <>
          <button
            onClick={() => instanceRef.current?.prev()}
            disabled={currentSlide === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            disabled={
              currentSlide >=
              instanceRef.current.track.details.slides.length -
                Math.ceil(instanceRef.current.options.slides as number || 2)
            }
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Lightbox */}
      {enableZoom && isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute right-3 top-3 z-50 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox("prev");
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-50 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Main Image */}
          <div
            className="flex items-center justify-center w-full h-full p-12"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].alt || `Image ${lightboxIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox("next");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-50 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
