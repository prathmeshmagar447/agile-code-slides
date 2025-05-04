
import React from 'react';
import SlideContainer from '../components/SlideContainer';
import WebDevSlides from '../components/WebDevSlides';

const Index = () => {
  const slideComponents = [
    <WebDevSlides key="web-dev-slides" />
  ].flat();

  return (
    <div className="min-h-screen w-screen overflow-hidden bg-background text-foreground">
      <SlideContainer slides={slideComponents} />
    </div>
  );
};

export default Index;
