import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Cherry, Coffee } from 'lucide-react';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

interface TimerSettings {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
}

function App() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>('pomodoro');

  const timerSettings: TimerSettings = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  useEffect(() => {
    let interval: number;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      new Audio(
        'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'
      )
        .play()
        .catch(() => {});
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(timerSettings[newMode]);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(timerSettings[mode]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const getProgressPercent = () => {
    const total = timerSettings[mode];
    return ((total - timeLeft) / total) * 100;
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage:
          'url("https://i.pinimg.com/originals/d3/63/d6/d363d683a7fee575c7431764bc83e094.gif")',
      }}
    >
      <div className="bg-black/30 backdrop-blur-sm p-8 rounded-3xl shadow-2xl text-white min-w-[380px]">
        <div className="flex items-center justify-center mb-8">
          {mode === 'pomodoro' ? (
            <Cherry className="w-8 h-8 text-pink-300 mr-2" />
          ) : (
            <Coffee className="w-8 h-8 text-pink-300 mr-2" />
          )}
          <h1 className="text-2xl font-semibold">
            桜 Pomodoro
          </h1>
        </div>

        <div className="flex justify-center space-x-2 mb-8">
          {(['pomodoro', 'shortBreak', 'longBreak'] as const).map(
            (timerMode) => (
              <button
                key={timerMode}
                onClick={() => switchMode(timerMode)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  mode === timerMode
                    ? 'bg-pink-500/40 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {timerMode === 'pomodoro'
                  ? '集中時間'
                  : timerMode === 'shortBreak'
                  ? '短い休憩'
                  : '長い休憩'}
              </button>
            )
          )}
        </div>

        <div className="relative">
          <div className="text-center mb-8">
            <div className="text-7xl font-bold mb-4 font-mono relative">
              {formatTime(timeLeft)}
              <div
                className="absolute bottom-0 left-0 h-1 bg-pink-500/50 transition-all duration-1000"
                style={{ width: `${getProgressPercent()}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={toggleTimer}
            className="px-8 py-3 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 transition-colors flex items-center space-x-2 text-lg font-medium"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>一時停止</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>長い休憩</span>
              </>
            )}
          </button>
          <button
            onClick={resetTimer}
            className="px-8 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center space-x-2 text-lg font-medium"
          >
            <RotateCcw className="w-5 h-5" />
            <span>リセット</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;