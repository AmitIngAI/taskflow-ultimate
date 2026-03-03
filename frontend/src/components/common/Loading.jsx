const Loading = ({ fullScreen = false, size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  const Spinner = () => (
    <div className="flex flex-col items-center gap-3">
      <div className={`loader ${sizes[size]}`} />
      {text && <p className="text-gray-600 dark:text-gray-400">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-dark-900 flex items-center justify-center z-50">
        <Spinner />
      </div>
    );
  }

  return <Spinner />;
};

export default Loading;