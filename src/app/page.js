"use client"
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, MemoryRouter } from 'react-router-dom'; // MemoryRouter doesn’t rely on the DOM

// ******************** Components ********************
import HomeFooter from "./HomeFooter";
import HomeMallSection from "./HomeMallSection";

export default function Home() {

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Only set this after the component mounts on the client
  }, []);

  const Router = isClient ? BrowserRouter : MemoryRouter;

  return (
    <div
        style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Ensure the container takes up full height
      }}
    >
      <Router future={{ v7_startTransition: true }}>
        <main style={{ flex: '1', padding: '20px' }}>
          <HomeMallSection style={{ minWidth: '1050px' }} />
        </main>
        <HomeFooter />
      </Router>
    </div>
  );
}
