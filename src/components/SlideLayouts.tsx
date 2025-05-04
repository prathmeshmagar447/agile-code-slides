
import React, { ReactNode } from 'react';

// Title Slide Layout
interface TitleSlideProps {
  title: string;
  subtitle?: string;
  presenter?: string;
  date?: string;
  background?: string;
  notes?: string;
}

export const TitleSlide: React.FC<TitleSlideProps> = ({
  title,
  subtitle,
  presenter,
  date,
  background,
  notes
}) => {
  return (
    <div className="slide animate-fade-in" style={background ? { backgroundImage: background } : {}}>
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {title}
        </h1>
        {subtitle && <p className="text-xl sm:text-2xl mb-8 max-w-2xl mx-auto">{subtitle}</p>}
        
        <div className="mt-auto">
          {presenter && <p className="text-lg font-medium">{presenter}</p>}
          {date && <p className="text-muted-foreground">{date}</p>}
        </div>
      </div>
      {notes && <div className="speaker-notes">{notes}</div>}
    </div>
  );
};

// Section Slide Layout
interface SectionSlideProps {
  title: string;
  background?: string;
  notes?: string;
}

export const SectionSlide: React.FC<SectionSlideProps> = ({
  title,
  background,
  notes
}) => {
  return (
    <div className="slide animate-fade-in" style={background ? { backgroundImage: background } : {}}>
      <div className="flex items-center justify-center h-full p-8">
        <h2 className="text-5xl sm:text-6xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {title}
        </h2>
      </div>
      {notes && <div className="speaker-notes">{notes}</div>}
    </div>
  );
};

// Content Slide Layout
interface ContentSlideProps {
  title: string;
  children: ReactNode;
  notes?: string;
}

export const ContentSlide: React.FC<ContentSlideProps> = ({
  title,
  children,
  notes
}) => {
  return (
    <div className="slide animate-fade-in">
      <div className="flex flex-col h-full p-8">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8">{title}</h2>
        <div className="flex-grow overflow-auto">
          {children}
        </div>
      </div>
      {notes && <div className="speaker-notes">{notes}</div>}
    </div>
  );
};

// Split Slide Layout (Left-Right)
interface SplitSlideProps {
  title: string;
  left: ReactNode;
  right: ReactNode;
  notes?: string;
}

export const SplitSlide: React.FC<SplitSlideProps> = ({
  title,
  left,
  right,
  notes
}) => {
  return (
    <div className="slide animate-fade-in">
      <div className="flex flex-col h-full p-8">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8">{title}</h2>
        <div className="flex flex-col md:flex-row gap-8 flex-grow overflow-auto">
          <div className="flex-1 min-w-0">{left}</div>
          <div className="flex-1 min-w-0">{right}</div>
        </div>
      </div>
      {notes && <div className="speaker-notes">{notes}</div>}
    </div>
  );
};

// Code Slide Layout
interface CodeSlideProps {
  title: string;
  code: string;
  language?: string;
  description?: string;
  notes?: string;
}

export const CodeSlide: React.FC<CodeSlideProps> = ({
  title,
  code,
  language = 'javascript',
  description,
  notes
}) => {
  return (
    <div className="slide animate-fade-in">
      <div className="flex flex-col h-full p-8">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h2>
        {description && <p className="mb-6 text-muted-foreground">{description}</p>}
        <div className="flex-grow overflow-auto">
          <pre className="code-block language-{language}">
            <code>{code}</code>
          </pre>
        </div>
      </div>
      {notes && <div className="speaker-notes">{notes}</div>}
    </div>
  );
};

// End Slide Layout
interface EndSlideProps {
  title?: string;
  message?: string;
  contact?: string;
  notes?: string;
}

export const EndSlide: React.FC<EndSlideProps> = ({
  title = "Thank You!",
  message,
  contact,
  notes
}) => {
  return (
    <div className="slide animate-fade-in">
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <h2 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {title}
        </h2>
        {message && <p className="text-xl sm:text-2xl mb-8 max-w-2xl mx-auto">{message}</p>}
        {contact && <p className="text-lg text-muted-foreground">{contact}</p>}
      </div>
      {notes && <div className="speaker-notes">{notes}</div>}
    </div>
  );
};
