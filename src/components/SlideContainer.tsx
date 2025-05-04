
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideContainerProps {
  slides: React.ReactNode[];
  showControls?: boolean;
}

const SlideContainer: React.FC<SlideContainerProps> = ({ 
  slides, 
  showControls = true 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const totalSlides = slides.length;

  const goToNextSlide = () => {
    if (currentSlide < totalSlides - 1 && !isTransitioning) {
      setDirection('next');
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(prev => prev + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlide > 0 && !isTransitioning) {
      setDirection('prev');
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(prev => prev - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
      goToNextSlide();
    } else if (e.key === 'ArrowLeft') {
      goToPrevSlide();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSlide, totalSlides, isTransitioning]);

  const progress = ((currentSlide + 1) / totalSlides) * 100;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background text-foreground">
      <div className="h-full w-full">
        {slides[currentSlide]}
      </div>
      
      <div 
        className="progress-bar" 
        style={{ width: `${progress}%` }}
      />
      
      {showControls && (
        <div className="nav-controls">
          <button 
            className="nav-arrow"
            onClick={goToPrevSlide}
            disabled={currentSlide === 0}
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            className="nav-arrow"
            onClick={goToNextSlide}
            disabled={currentSlide === totalSlides - 1}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
      
      <div className="fixed bottom-4 left-4 text-sm text-muted-foreground">
        {currentSlide + 1} / {totalSlides}
      </div>
    </div>
  );
};

export default SlideContainer;
