"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

interface ImageCarouselProps {
    images: {
        src: string;
        caption: string;
    }[];
    projectName: string;
}

export default function ImageCarousel({ images, projectName }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    if (!images || images.length === 0) return null;

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images.length]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images.length]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const openZoom = () => setIsZoomed(true);
    const closeZoom = () => setIsZoomed(false);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isZoomed) {
                if (e.key === "Escape") closeZoom();
                if (e.key === "ArrowLeft") goToPrevious();
                if (e.key === "ArrowRight") goToNext();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isZoomed, goToPrevious, goToNext]);

    // Prevent body scroll when zoomed
    useEffect(() => {
        if (isZoomed) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isZoomed]);

    return (
        <>
            <div className="project-hero-image">
                <div className="carousel-container">
                    <div className="project-image-wrapper" onClick={openZoom} style={{ cursor: "zoom-in" }}>
                        <Image
                            src={images[currentIndex].src}
                            alt={`${projectName} - ${images[currentIndex].caption}`}
                            width={1737}
                            height={921}
                            priority
                            className="project-screenshot"
                        />
                        {/* Zoom hint */}
                        <div className="zoom-hint">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" />
                                <path d="M11 8v6M8 11h6" />
                            </svg>
                            <span>Click to zoom</span>
                        </div>
                        <div className="project-image-caption">
                            <span className="caption-icon">📸</span>
                            <span>{images[currentIndex].caption}</span>
                        </div>
                    </div>

                    {images.length > 1 && (
                        <>
                            {/* Material Design Navigation Arrows */}
                            <button
                                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                                className="carousel-nav carousel-nav-prev"
                                aria-label="Previous image"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                                className="carousel-nav carousel-nav-next"
                                aria-label="Next image"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
                                </svg>
                            </button>

                            {/* Material Design Dot Indicators */}
                            <div className="carousel-dots">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`carousel-dot ${index === currentIndex ? "active" : ""}`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>

                            {/* Counter Badge */}
                            <div className="carousel-counter">
                                {currentIndex + 1} / {images.length}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Zoom Modal / Lightbox */}
            {isZoomed && (
                <div className="zoom-overlay" onClick={closeZoom}>
                    <div className="zoom-modal" onClick={(e) => e.stopPropagation()}>
                        {/* Close Button */}
                        <button className="zoom-close" onClick={closeZoom} aria-label="Close zoom">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                        </button>

                        {/* Zoomed Image */}
                        <div className="zoom-image-container">
                            <Image
                                src={images[currentIndex].src}
                                alt={`${projectName} - ${images[currentIndex].caption}`}
                                width={1920}
                                height={1080}
                                className="zoom-image"
                                priority
                            />
                        </div>

                        {/* Navigation in Zoom Mode */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={goToPrevious}
                                    className="zoom-nav zoom-nav-prev"
                                    aria-label="Previous image"
                                >
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={goToNext}
                                    className="zoom-nav zoom-nav-next"
                                    aria-label="Next image"
                                >
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
                                    </svg>
                                </button>
                            </>
                        )}

                        {/* Caption and Counter at Bottom */}
                        <div className="zoom-footer">
                            <div className="zoom-caption">{images[currentIndex].caption}</div>
                            {images.length > 1 && (
                                <div className="zoom-counter">{currentIndex + 1} / {images.length}</div>
                            )}
                        </div>

                        {/* Thumbnail Strip */}
                        {images.length > 1 && (
                            <div className="zoom-thumbnails">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`zoom-thumbnail ${index === currentIndex ? "active" : ""}`}
                                        aria-label={`View image ${index + 1}`}
                                    >
                                        <Image
                                            src={img.src}
                                            alt={img.caption}
                                            width={80}
                                            height={45}
                                            className="zoom-thumbnail-img"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
