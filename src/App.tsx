/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-[#0ff] font-mono relative overflow-hidden uppercase">
      {/* Overlays */}
      <div className="static-bg"></div>
      <div className="scanlines"></div>
      
      {/* Header */}
      <header className="w-full p-4 border-b-4 border-[#f0f] bg-black z-10 relative flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-[#f0f] text-4xl animate-pulse font-bold">&gt;_</span>
          <h1 className="text-4xl font-bold text-[#0ff] glitch tracking-widest" data-text="SYS.OP.SNAKE_V0.9">
            SYS.OP.SNAKE_V0.9
          </h1>
        </div>
        <div className="text-3xl text-[#f0f] border-2 border-[#0ff] p-2 bg-black shadow-[4px_4px_0px_#0ff]">
          DATA_HARVESTED: {score.toString().padStart(4, '0')}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-8 p-8 z-10 relative max-w-7xl mx-auto w-full h-full mt-4">
        
        {/* Left/Top: Music Player & Diagnostics */}
        <div className="w-full lg:w-96 flex-shrink-0 flex flex-col gap-8 order-2 lg:order-1 tear">
          <div className="border-4 border-[#0ff] p-4 bg-black relative shadow-[8px_8px_0px_#f0f]">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#f0f] animate-pulse"></div>
            <h2 className="text-[#f0f] text-2xl mb-4 glitch" data-text="AUDIO_LINK_ESTABLISHED">AUDIO_LINK_ESTABLISHED</h2>
            <MusicPlayer />
          </div>
          
          <div className="border-4 border-[#f0f] p-4 bg-black shadow-[8px_8px_0px_#0ff]">
            <h3 className="text-[#0ff] text-2xl mb-4 border-b-2 border-[#0ff] pb-2">DIAGNOSTICS</h3>
            <ul className="space-y-4 text-2xl">
              <li className="flex justify-between"><span className="text-[#f0f]">MEM_SECTOR:</span> <span className="animate-pulse text-white">CORRUPTED</span></li>
              <li className="flex justify-between"><span className="text-[#f0f]">NET_UPLINK:</span> <span>UNSTABLE</span></li>
              <li className="flex justify-between"><span className="text-[#f0f]">BIOMASS:</span> <span className="text-[#0ff]">DETECTED</span></li>
              <li className="flex justify-between"><span className="text-[#f0f]">THREAT_LVL:</span> <span className="text-red-500 animate-bounce">CRITICAL</span></li>
            </ul>
          </div>
        </div>

        {/* Center/Right: Game */}
        <div className="flex-1 w-full flex justify-center order-1 lg:order-2">
          <div className="w-full max-w-2xl border-8 border-[#0ff] p-2 bg-black relative shadow-[-10px_10px_0px_#f0f]">
            <div className="absolute -inset-2 border-2 border-[#f0f] animate-pulse pointer-events-none"></div>
            <SnakeGame onScoreChange={setScore} />
          </div>
        </div>

      </main>
    </div>
  );
}
