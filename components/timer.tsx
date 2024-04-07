import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';

const Timer: React.FC<{
  duration: number;
  setIsFinished: Dispatch<SetStateAction<boolean>>;
}> = ({ duration, setIsFinished }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    let timer: any;
    const startTimer = () => {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            setIsFinished(true);
            clearInterval(timer);
            return 0;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000); // Update every 1 second

      // Cleanup function to clear the timer when component unmounts
      return () => clearInterval(timer);
    };

    // Start the timer when the component mounts
    startTimer();

    // Clear the timer when the component unmounts
    return () => clearInterval(timer);
  }, [duration, setIsFinished]);

  return (
    <div className="mx-8 text-4xl text-slate-600">
      <div>{timeLeft}</div>
    </div>
  );
};

export default Timer;
