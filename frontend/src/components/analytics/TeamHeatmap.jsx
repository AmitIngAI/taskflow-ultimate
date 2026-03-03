const TeamHeatmap = () => {
  const hours = ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm'];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  
  const getActivityColor = (value) => {
    if (value > 80) return 'bg-green-600';
    if (value > 60) return 'bg-green-500';
    if (value > 40) return 'bg-green-400';
    if (value > 20) return 'bg-green-300';
    return 'bg-gray-200 dark:bg-dark-700';
  };

  return (
    <div className="overflow-x-auto">
      <div className="inline-grid gap-1" style={{ gridTemplateColumns: `60px repeat(${hours.length}, 40px)` }}>
        <div></div>
        {hours.map(hour => (
          <div key={hour} className="text-xs text-center text-gray-600 dark:text-gray-400">
            {hour}
          </div>
        ))}
        
        {days.map(day => (
          <>
            <div key={day} className="text-xs flex items-center text-gray-600 dark:text-gray-400">
              {day}
            </div>
            {hours.map((hour, idx) => {
              const value = Math.random() * 100;
              return (
                <Tooltip key={`${day}-${hour}`} content={`${Math.round(value)}% active`}>
                  <div className={`h-8 rounded ${getActivityColor(value)} cursor-pointer hover:ring-2 ring-primary-500`} />
                </Tooltip>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
};

export default TeamHeatmap;