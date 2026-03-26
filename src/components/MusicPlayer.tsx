import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "ERR_NO_SIGNAL",
    artist: "GHOST_IN_MACHINE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "6:12"
  },
  {
    id: 2,
    title: "MEMORY_LEAK",
    artist: "NULL_POINTER",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "7:05"
  },
  {
    id: 3,
    title: "STATIC_VOID",
    artist: "KERNEL_PANIC",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "5:44"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.log("Audio play failed:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div className="w-full bg-black text-[#0ff] font-mono">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      <div className="flex items-center gap-4 mb-6 border-b-2 border-[#f0f] pb-4">
        <div className={`w-16 h-16 bg-[#f0f] flex items-center justify-center text-black ${isPlaying ? 'animate-spin' : ''}`}>
          <Disc className="w-10 h-10" />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-[#0ff] text-3xl truncate uppercase">{currentTrack.title}</h3>
          <p className="text-[#f0f] text-xl truncate uppercase">{currentTrack.artist}</p>
        </div>
        <button onClick={toggleMute} className="text-[#0ff] hover:text-[#f0f] transition-colors p-2 border-2 border-[#0ff] hover:border-[#f0f]">
          {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
        </button>
      </div>

      {/* Progress Bar */}
      <div 
        className="h-6 w-full bg-gray-900 border-2 border-[#0ff] mb-6 cursor-pointer relative overflow-hidden"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-[#f0f] transition-all duration-100"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-0 h-full w-2 bg-white animate-pulse"></div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button 
          onClick={prevTrack}
          className="text-[#0ff] hover:text-black hover:bg-[#0ff] transition-colors p-2 border-2 border-[#0ff]"
        >
          <SkipBack size={32} />
        </button>
        <button 
          onClick={togglePlay}
          className="w-20 h-20 flex items-center justify-center border-4 border-[#f0f] text-[#f0f] hover:bg-[#f0f] hover:text-black transition-colors shadow-[4px_4px_0px_#0ff] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
        >
          {isPlaying ? <Pause size={40} /> : <Play size={40} className="ml-2" />}
        </button>
        <button 
          onClick={nextTrack}
          className="text-[#0ff] hover:text-black hover:bg-[#0ff] transition-colors p-2 border-2 border-[#0ff]"
        >
          <SkipForward size={32} />
        </button>
      </div>
    </div>
  );
}
