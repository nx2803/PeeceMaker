export default function Loading() {
  return (
    <main className="relative w-screen h-screen overflow-hidden inset-0 z-0 bg-linear-to-tr from-[#e0f5ff] via-[#ffe9c5] to-[#e0f5ff] text-black font-sans selection:bg-orange-100 dark:text-white flex items-center justify-center">
      {/* Dark mode overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-zinc-950/80 mix-blend-multiply hidden dark:block" />
      
      {/* Glassmorphism Skeleton Wrapper */}
      <div className="relative z-20 flex flex-col items-center justify-center w-[90%] md:w-3/4 h-[80%] bg-white/20 backdrop-blur-2xl border border-white/50 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden dark:bg-zinc-600/40 dark:border-zinc-400/10 p-8 space-y-8 animate-pulse">
        
        {/* Skeleton Header */}
        <div className="w-full flex justify-between items-center mb-10">
          <div className="w-48 h-12 bg-white/30 rounded-3xl dark:bg-zinc-500/30" />
          <div className="w-24 h-12 bg-orange-400/50 rounded-full" />
        </div>

        {/* Skeleton Map/Content Area */}
        <div className="w-full h-full bg-white/30 rounded-[30px] dark:bg-zinc-500/30 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
             {/* Spinning / Pulsing icon placeholder */}
             <div className="w-16 h-16 border-4 border-orange-400/50 border-t-orange-400 rounded-full animate-spin" />
             <p className="text-orange-400/80 font-black tracking-widest uppercase">Loading Heaven...</p>
          </div>
        </div>

        {/* Skeleton Bottom Nav */}
        <div className="w-64 h-20 bg-white/30 rounded-[40px] dark:bg-zinc-500/30 mx-auto mt-auto" />
      </div>
    </main>
  );
}
