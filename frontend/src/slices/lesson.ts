import type { StateCreator } from "zustand";
import type { LessonSlice } from "../types/lesson";

export const createLessonSlice: StateCreator<LessonSlice> = () => ({
  lessons: [
    {
      id: 1,
      type: "notes",
      notes: `# Styling the Webpage
React Tutorial · 2.5 min read

React doesn't enforce a single way to style your components. You have several approaches to choose from — each with its own trade-offs depending on your project's scale, team preferences, and tooling.

---

## The four main approaches

- CSS stylesheets — Classic .css files imported into components. Simple and familiar.
- CSS Modules — Scoped class names per file. No naming conflicts across components.
- Inline styles — JS objects passed to the style prop. Good for dynamic values.
- Tailwind CSS — Utility classes directly in JSX. Fast to build, no context switching.

---

## CSS stylesheets

The most straightforward approach — write a .css file and import it. Styles are global by default, so naming discipline matters.

import './CourseCard.css';

function CourseCard() {
  return <div 
className="course-card">...</div>;
}

Note that React uses className instead of class — since class is a reserved word in JavaScript.

---

## CSS Modules

CSS Modules scope styles to the component automatically. The build tool transforms class names into unique identifiers, so .card in one file never clashes with .card in another.

import styles from './CourseCard.module.css';

function CourseCard() {
  return <div className={styles.card}>...</div>;
}

Your CourseCard.module.css file looks exactly like regular CSS — the module behavior is handled at build time.

---

## Inline styles

Pass a JavaScript object to the style prop. Property names are camelCased — background-color becomes backgroundColor. Best used for dynamic values, not full component styling.

function Badge({ color }) {
  return (
    <span style={{ backgroundColor: color, padding: '4px 8px' }}>
      New
    </span>
  );
}

---

## Tailwind CSS

Tailwind lets you style directly in JSX using utility classes. No separate stylesheet to maintain — the class names describe exactly what they do.

function CourseCard() {
  return (
    <div className="rounded-lg border p-4 hover:shadow-md">
      <h2 className="text-lg font-semibold text-gray-800">
        React Basics
      </h2>
    </div>
  );
}

Tailwind requires setup via npm install tailwindcss and a config file, but most modern React starters (like Vite + React) support it out of the box.

---

## Conditional styling

A common pattern is applying classes conditionally based on state or props. Use a template literal or a library like clsx to keep it clean:

function Button({ primary }) {
  return (
    <button className={\`btn \${primary ? 'btn-primary' : 'btn-secondary'}\`}>
      Click me
    </button>
  );
}

---

## Which approach should you use?

— Small projects or prototypes → plain CSS stylesheets or inline styles.
— Medium to large projects → CSS Modules to avoid naming conflicts.
— Utility-first workflows → Tailwind CSS for speed and consistency.
— Dynamic styles based on props/state → inline styles or CSS variables.

---

## What's next

With your components structured and styled, the next step is making them dynamic — passing data through props and managing local UI state with the useState hook.`,
      video: null,
      name: "Styling the Webpage",
      course: 2,
      duration: 150,
      sequence: 1,
      created_at: "2026-06-09 10:29:29.628101+00",
    },
    {
      id: 4,
      type: "notes",
      name: "Structuring the Webpage",
      video: null,
      notes: `# Structuring the Webpage
React Tutorial · 2 min read

In React, structuring a webpage means organizing your UI into a component tree — a hierarchy of components that mirrors the visual layout of your app.

---

## Thinking in components

Every webpage can be broken into distinct sections. Each box you can draw around a piece of UI is a candidate for its own component. The rule of thumb: if it's reusable or independently meaningful, extract it.

<App>
├── <Navbar />
├── <Hero />
├── <CourseList />
│     ├── <CourseCard />
│     ├── <CourseCard />
│     └── <CourseCard />
└── <Footer />

---

## The root entry point

React mounts your entire app through a single DOM node in index.html:

<div id="root"></div>

Your main.tsx bootstraps it:

import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

---

## Structuring the App component

App.tsx acts as the layout shell — it imports and arranges top-level components. Keep it thin: it should arrange, not implement.

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <CourseList />
      </main>
      <Footer />
    </div>
  );
}

---

## Key rules to remember

— Use semantic HTML inside JSX — <header>, <main>, <section>, <footer> over generic <div> everywhere.
— A component returns one root element — wrap siblings in a <div> or a Fragment (<>...</>).
— Nest components, not files — the folder structure should reflect the component tree logically.

---

## What's next

Once your structure is in place, the next step is passing data between components using props — so each piece of your UI knows what to render.`,
      sequence: 2,
      duration: 120,
      course: 2,
      created_at: "2026-06-09 07:12:59.600958+00",
    },
  ],
  lesson: {
    id: 1,
    type: "video",
    notes: `# Styling the Webpage
React Tutorial · 2.5 min read

React doesn't enforce a single way to style your components. You have several approaches to choose from — each with its own trade-offs depending on your project's scale, team preferences, and tooling.

---

## The four main approaches

- CSS stylesheets — Classic .css files imported into components. Simple and familiar.
- CSS Modules — Scoped class names per file. No naming conflicts across components.
- Inline styles — JS objects passed to the style prop. Good for dynamic values.
- Tailwind CSS — Utility classes directly in JSX. Fast to build, no context switching.

---

## CSS stylesheets

The most straightforward approach — write a .css file and import it. Styles are global by default, so naming discipline matters.

import './CourseCard.css';

function CourseCard() {
  return <div 
className="course-card">...</div>;
}

Note that React uses className instead of class — since class is a reserved word in JavaScript.

---

## CSS Modules

CSS Modules scope styles to the component automatically. The build tool transforms class names into unique identifiers, so .card in one file never clashes with .card in another.

import styles from './CourseCard.module.css';

function CourseCard() {
  return <div className={styles.card}>...</div>;
}

Your CourseCard.module.css file looks exactly like regular CSS — the module behavior is handled at build time.

---

## Inline styles

Pass a JavaScript object to the style prop. Property names are camelCased — background-color becomes backgroundColor. Best used for dynamic values, not full component styling.

function Badge({ color }) {
  return (
    <span style={{ backgroundColor: color, padding: '4px 8px' }}>
      New
    </span>
  );
}

---

## Tailwind CSS

Tailwind lets you style directly in JSX using utility classes. No separate stylesheet to maintain — the class names describe exactly what they do.

function CourseCard() {
  return (
    <div className="rounded-lg border p-4 hover:shadow-md">
      <h2 className="text-lg font-semibold text-gray-800">
        React Basics
      </h2>
    </div>
  );
}

Tailwind requires setup via npm install tailwindcss and a config file, but most modern React starters (like Vite + React) support it out of the box.

---

## Conditional styling

A common pattern is applying classes conditionally based on state or props. Use a template literal or a library like clsx to keep it clean:

function Button({ primary }) {
  return (
    <button className={\`btn \${primary ? 'btn-primary' : 'btn-secondary'}\`}>
      Click me
    </button>
  );
}

---

## Which approach should you use?

— Small projects or prototypes → plain CSS stylesheets or inline styles.
— Medium to large projects → CSS Modules to avoid naming conflicts.
— Utility-first workflows → Tailwind CSS for speed and consistency.
— Dynamic styles based on props/state → inline styles or CSS variables.

---

## What's next

With your components structured and styled, the next step is making them dynamic — passing data through props and managing local UI state with the useState hook.`,
    video: "https://youtu.be/rQACwgrYwKM",
    name: "Styling the Webpage",
    course: 2,
    duration: 290,
    sequence: 1,
    created_at: "2026-06-09 10:29:29.628101+00",
  },
});
