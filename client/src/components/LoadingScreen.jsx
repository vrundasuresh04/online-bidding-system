const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center bg-[#0b0f19]/80 backdrop-blur-sm min-h-screen">
      <div className="relative flex justify-center items-center">
        <div className="absolute animate-ping w-16 h-16 rounded-full bg-indigo-500/30"></div>
        <div className="relative w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <div className="absolute text-indigo-400 font-bold text-lg animate-pulse">$</div>
      </div>
    </div>
  );
};

export default LoadingScreen;
