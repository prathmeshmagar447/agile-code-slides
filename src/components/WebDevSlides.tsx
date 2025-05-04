
import React from 'react';
import { 
  TitleSlide, 
  SectionSlide, 
  ContentSlide, 
  SplitSlide, 
  CodeSlide, 
  EndSlide 
} from './SlideLayouts';
import CodeHighlight from './CodeHighlight';
import DiagramComponent from './DiagramComponent';

const modernReactCode = `// Modern React Component with Hooks
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const res = await fetch(\`/api/users/\${userId}\`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUser();
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;
  
  return (
    <div className="profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}`;

const asyncAwaitCode = `// Using async/await with error handling
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    
    if (!response.ok) {
      throw new Error(\`HTTP error: \${response.status}\`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Could not fetch data:', error);
    // Handle the error appropriately
    throw error;
  }
}

// Usage with proper error handling
async function handleSubmit() {
  try {
    const result = await fetchData();
    processResult(result);
  } catch (error) {
    showErrorMessage("Failed to load data. Please try again.");
  }
}`;

const modernCSSCode = `/* Modern CSS with custom properties and logical properties */
:root {
  --primary-color: #5046e4;
  --secondary-color: #f0f4f8;
  --font-main: 'Inter', system-ui, sans-serif;
  --spacing-unit: 4px;
  --border-radius: 8px;
}

.card {
  font-family: var(--font-main);
  padding-block: calc(var(--spacing-unit) * 4);
  padding-inline: calc(var(--spacing-unit) * 6);
  margin-block-end: calc(var(--spacing-unit) * 4);
  border-radius: var(--border-radius);
  background-color: var(--secondary-color);
  box-shadow: 0 4px 6px hsl(0 0% 0% / 0.1);
  
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: calc(var(--spacing-unit) * 4);
}

/* Using modern selectors */
.card:has(:focus-visible) {
  outline: 2px solid var(--primary-color);
}

/* Using container queries */
@container (min-width: 700px) {
  .card {
    grid-template-columns: 1fr 2fr;
  }
}`;

const WebDevSlides: React.FC = () => {
  return (
    <>
      {/* Title Slide */}
      <TitleSlide
        title="Modern Web Development Best Practices"
        subtitle="Building Better Web Applications in 2025"
        presenter="Presented by Web Dev Expert"
        date="May 4, 2025"
        notes="Introduction slide. Welcome the audience and briefly mention your background."
      />

      {/* Section Slide */}
      <SectionSlide
        title="What We'll Cover"
        notes="Briefly outline the agenda for the presentation."
      />

      {/* Content Slide - Agenda */}
      <ContentSlide title="Agenda">
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center text-primary-foreground font-bold shrink-0">1</div>
            <div>
              <h3 className="text-xl font-semibold">Modern JavaScript Practices</h3>
              <p className="text-muted-foreground">Async/await, destructuring, modules, and more</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center text-primary-foreground font-bold shrink-0">2</div>
            <div>
              <h3 className="text-xl font-semibold">React Best Practices</h3>
              <p className="text-muted-foreground">Hooks, components, state management, performance</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center text-primary-foreground font-bold shrink-0">3</div>
            <div>
              <h3 className="text-xl font-semibold">Modern CSS Techniques</h3>
              <p className="text-muted-foreground">CSS Variables, Grid, Flexbox, Container Queries</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center text-primary-foreground font-bold shrink-0">4</div>
            <div>
              <h3 className="text-xl font-semibold">Web Performance</h3>
              <p className="text-muted-foreground">Core Web Vitals, Optimization Techniques</p>
            </div>
          </div>
        </div>
      </ContentSlide>

      {/* Section Slide */}
      <SectionSlide
        title="Modern JavaScript"
        notes="This section covers modern JavaScript features and patterns."
      />

      {/* Code Slide */}
      <CodeSlide
        title="Async/Await Pattern"
        code={asyncAwaitCode}
        language="javascript"
        description="Modern approach to handling asynchronous operations"
        notes="Explain the benefits of async/await over Promise chains and callbacks."
      />

      {/* Split Slide - Modern JS Features */}
      <SplitSlide
        title="Modern JavaScript Features"
        left={
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Key Features</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span>Destructuring assignment</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span>Optional chaining (?.) and nullish coalescing (??)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span>ES modules (import/export)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span>Rest/spread operators</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span>Template literals</span>
              </li>
            </ul>
          </div>
        }
        right={
          <CodeHighlight
            code={`// Destructuring
const { name, age } = user;
const [first, ...rest] = array;

// Optional chaining
const username = user?.profile?.username;

// Nullish coalescing
const count = data?.count ?? 0;

// Spread syntax
const newObj = { ...obj, newProp: 'value' };
const newArray = [...array, newItem];

// Template literals
const greeting = \`Hello, \${name}!\`;`}
            language="javascript"
            fileName="modern-js-features.js"
          />
        }
        notes="Highlight how these features make code more readable and maintainable."
      />

      {/* Section Slide */}
      <SectionSlide
        title="React Best Practices"
        notes="This section covers React best practices and patterns."
      />

      {/* Content Slide - React Hooks */}
      <ContentSlide title="React Hooks Best Practices">
        <div className="space-y-6">
          <div className="p-4 border border-border rounded-lg bg-card">
            <h3 className="text-xl font-semibold mb-3">1. Custom Hooks for Reusable Logic</h3>
            <p className="text-muted-foreground">Extract reusable logic into custom hooks - keeping components clean and focused on presentation.</p>
            <div className="mt-3 p-3 bg-muted rounded-md">
              <code className="text-sm">
                {`const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  return { value, onChange: (e) => setValue(e.target.value) };
}`}
              </code>
            </div>
          </div>
          
          <div className="p-4 border border-border rounded-lg bg-card">
            <h3 className="text-xl font-semibold mb-3">2. Dependencies Array Management</h3>
            <p className="text-muted-foreground">Always properly manage useEffect dependencies to prevent infinite loops and stale closures.</p>
            <div className="mt-3 p-3 bg-muted rounded-md">
              <code className="text-sm">
                {`// Good ✓
useEffect(() => {
  fetchData(userId);
}, [userId, fetchData]);

// Bad ✗
useEffect(() => {
  fetchData(userId);
}, []); // Missing dependencies`}
              </code>
            </div>
          </div>
          
          <div className="p-4 border border-border rounded-lg bg-card">
            <h3 className="text-xl font-semibold mb-3">3. Memoization</h3>
            <p className="text-muted-foreground">Use React.memo, useMemo, and useCallback appropriately to prevent unnecessary renders.</p>
          </div>
        </div>
      </ContentSlide>

      {/* Code Slide - Modern React Component */}
      <CodeSlide
        title="Modern React Component"
        code={modernReactCode}
        language="javascript"
        description="Using functional components with hooks"
        notes="Explain how hooks have simplified state management in React components."
      />

      {/* Split Slide - React Architecture */}
      <SplitSlide
        title="React Application Architecture"
        left={
          <DiagramComponent
            width={400}
            height={300}
            title="Component Hierarchy"
            boxes={[
              { x: 100, y: 20, width: 200, height: 50, label: "App", color: "#5046e4" },
              { x: 20, y: 120, width: 150, height: 50, label: "Header", color: "#38bdf8" },
              { x: 230, y: 120, width: 150, height: 50, label: "Main Content", color: "#38bdf8" },
              { x: 20, y: 220, width: 150, height: 50, label: "Footer", color: "#38bdf8" },
              { x: 180, y: 220, width: 100, height: 50, label: "ProductList", color: "#6366f1" },
              { x: 300, y: 220, width: 100, height: 50, label: "Cart", color: "#6366f1" }
            ]}
            arrows={[
              { startX: 200, startY: 70, endX: 95, endY: 120, label: "props" },
              { startX: 200, startY: 70, endX: 305, endY: 120, label: "props" },
              { startX: 95, startY: 170, endX: 95, endY: 220, label: "props" },
              { startX: 305, startY: 170, endX: 230, endY: 220, label: "props" },
              { startX: 305, startY: 170, endX: 350, endY: 220, label: "props" }
            ]}
          />
        }
        right={
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Best Practices</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                <span>Separate concerns with container/presentational components</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                <span>Choose appropriate state management (Context API, Redux, Zustand)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                <span>Create cohesive component APIs with prop validation</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                <span>Implement code splitting for better performance</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                <span>Use TypeScript for type safety and better developer experience</span>
              </li>
            </ul>
          </div>
        }
        notes="Discuss the importance of component architecture in React applications."
      />
      
      {/* Section Slide */}
      <SectionSlide
        title="Modern CSS"
        notes="This section covers modern CSS techniques and best practices."
      />

      {/* Code Slide - Modern CSS */}
      <CodeSlide
        title="Modern CSS Techniques"
        code={modernCSSCode}
        language="css"
        description="Using CSS variables, logical properties, and modern selectors"
        notes="Highlight the benefits of CSS variables for theming and maintenance."
      />

      {/* Content Slide - CSS Features */}
      <ContentSlide title="Modern CSS Features">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-border rounded-lg bg-card">
            <h3 className="text-xl font-semibold mb-2">CSS Grid</h3>
            <p className="text-muted-foreground mb-3">Two-dimensional layout system for the web.</p>
            <div className="grid grid-cols-3 gap-2 h-32">
              <div className="bg-primary/20 rounded flex items-center justify-center">1</div>
              <div className="bg-primary/30 rounded flex items-center justify-center">2</div>
              <div className="bg-primary/40 rounded flex items-center justify-center">3</div>
              <div className="bg-primary/50 rounded flex items-center justify-center col-span-2">4</div>
              <div className="bg-primary/60 rounded flex items-center justify-center">5</div>
            </div>
          </div>
          
          <div className="p-4 border border-border rounded-lg bg-card">
            <h3 className="text-xl font-semibold mb-2">Flexbox</h3>
            <p className="text-muted-foreground mb-3">One-dimensional layout method for arranging items.</p>
            <div className="flex gap-2 h-32 flex-wrap">
              <div className="bg-accent/20 rounded p-4 flex-1 flex items-center justify-center">A</div>
              <div className="bg-accent/40 rounded p-4 flex-2 flex items-center justify-center">B</div>
              <div className="bg-accent/60 rounded p-4 flex-1 flex items-center justify-center">C</div>
            </div>
          </div>
          
          <div className="p-4 border border-border rounded-lg bg-card">
            <h3 className="text-xl font-semibold mb-2">Container Queries</h3>
            <p className="text-muted-foreground">Style elements based on the size of their container, not just the viewport.</p>
          </div>
          
          <div className="p-4 border border-border rounded-lg bg-card">
            <h3 className="text-xl font-semibold mb-2">:has() Selector</h3>
            <p className="text-muted-foreground">Select elements based on their content or descendants.</p>
          </div>
        </div>
      </ContentSlide>

      {/* Section Slide */}
      <SectionSlide
        title="Web Performance"
        notes="This section covers web performance optimization techniques."
      />

      {/* Split Slide - Core Web Vitals */}
      <SplitSlide
        title="Core Web Vitals"
        left={
          <DiagramComponent
            width={400}
            height={300}
            boxes={[
              { x: 50, y: 20, width: 300, height: 60, label: "Core Web Vitals", color: "#5046e4" },
              { x: 50, y: 120, width: 300, height: 40, label: "LCP: Largest Contentful Paint", color: "#ef4444" },
              { x: 50, y: 180, width: 300, height: 40, label: "FID: First Input Delay", color: "#3b82f6" },
              { x: 50, y: 240, width: 300, height: 40, label: "CLS: Cumulative Layout Shift", color: "#10b981" }
            ]}
            arrows={[
              { startX: 200, startY: 80, endX: 200, endY: 120 },
              { startX: 200, startY: 80, endX: 200, endY: 180 },
              { startX: 200, startY: 80, endX: 200, endY: 240 }
            ]}
          />
        }
        right={
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-2">Impact on User Experience</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-[#ef4444] mt-2"></div>
                <div>
                  <span className="font-medium">LCP: </span>
                  <span>Measures loading performance. Should be &lt; 2.5s</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-[#3b82f6] mt-2"></div>
                <div>
                  <span className="font-medium">FID: </span>
                  <span>Measures interactivity. Should be &lt; 100ms</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-[#10b981] mt-2"></div>
                <div>
                  <span className="font-medium">CLS: </span>
                  <span>Measures visual stability. Should be &lt; 0.1</span>
                </div>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="font-medium mb-1">Business Impact:</h4>
              <p className="text-muted-foreground">Google uses Core Web Vitals as ranking signals, affecting SEO and conversion rates.</p>
            </div>
          </div>
        }
        notes="Explain how Core Web Vitals affect user experience and SEO."
      />

      {/* Content Slide - Performance Optimization */}
      <ContentSlide title="Performance Optimization Techniques">
        <div className="space-y-6">
          <div className="p-4 border border-border rounded-lg bg-card">
            <h3 className="text-xl font-semibold mb-2">Code Splitting</h3>
            <p className="text-muted-foreground mb-2">Split your code into smaller chunks to reduce initial load time.</p>
            <CodeHighlight
              code={`// React.lazy for component code splitting
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <React.Suspense fallback={<Loading />}>
      <LazyComponent />
    </React.Suspense>
  );
}`}
              language="javascript"
              fileName="code-splitting.jsx"
              lineNumbers={false}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg bg-card">
              <h3 className="text-lg font-semibold mb-2">Image Optimization</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <span>Use modern formats (WebP, AVIF)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <span>Implement responsive images</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <span>Apply lazy loading</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 border border-border rounded-lg bg-card">
              <h3 className="text-lg font-semibold mb-2">Caching Strategies</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <span>HTTP caching headers</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <span>Service Workers for offline support</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <span>React Query for server state caching</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="p-4 border border-border rounded-lg bg-card">
            <h3 className="text-xl font-semibold mb-2">Bundle Size Optimization</h3>
            <p className="text-muted-foreground mb-3">Techniques to reduce JavaScript bundle size.</p>
            <div className="text-sm grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2 bg-muted rounded">✓ Tree shaking unused code</div>
              <div className="p-2 bg-muted rounded">✓ Use lightweight dependencies</div>
              <div className="p-2 bg-muted rounded">✓ Dynamic imports</div>
              <div className="p-2 bg-muted rounded">✓ Minification & compression</div>
            </div>
          </div>
        </div>
      </ContentSlide>

      {/* End Slide */}
      <EndSlide
        title="Thank You!"
        message="Questions? Feel free to reach out."
        contact="@webdevexpert • example@email.com"
        notes="Thank the audience for their attention and invite questions."
      />
    </>
  );
};

export default WebDevSlides;
