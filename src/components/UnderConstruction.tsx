const UnderConstruction = ({ title }: { title: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-sky-50 via-violet-50 to-rose-50 dark:from-slate-950 dark:to-indigo-950">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-xl text-center border border-white/60 dark:border-slate-700">
        
        <div className="text-6xl mb-4">
          🚧
        </div>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
          {title}
        </h1>

        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          This feature is currently under construction and will be available soon.
        </p>

        <div className="mt-6">
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full animate-pulse" />
          </div>

          <p className="text-xs text-slate-400 mt-2">
            Building something beautiful for you ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;