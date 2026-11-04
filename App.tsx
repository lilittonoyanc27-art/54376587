import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Trophy,
  ArrowRight,
  Languages,
  Eye,
  EyeOff,
  Flame,
  Award,
} from 'lucide-react';
import { PASAPALABRA_QUESTIONS, QuestionItem, checkAnswer } from './questions';
import { sounds } from './audio';

type QuestionStatus = 'idle' | 'passed' | 'correct' | 'incorrect';

interface LetterState {
  id: number;
  letter: string;
  status: QuestionStatus;
  userAnswer?: string;
}

export default function App() {
  // Game states
  const totalQuestions = PASAPALABRA_QUESTIONS.length;
  const [lettersState, setLettersState] = useState<LetterState[]>(() =>
    PASAPALABRA_QUESTIONS.map((q) => ({
      id: q.id,
      letter: q.letter,
      status: 'idle',
    }))
  );

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [isArmenianAlwaysVisible, setIsArmenianAlwaysVisible] = useState<boolean>(false);
  const [revealedTranslations, setRevealedTranslations] = useState<Record<number, boolean>>({});
  const [revealedAnswerIds, setRevealedAnswerIds] = useState<Record<number, boolean>>({});

  // 20 minutes = 1200 seconds
  const INITIAL_TIME = 20 * 60;
  const [timeRemaining, setTimeRemaining] = useState<number>(INITIAL_TIME);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showVocabList, setShowVocabList] = useState<boolean>(false);
  const [feedbackToast, setFeedbackToast] = useState<{
    type: 'correct' | 'incorrect' | 'passed' | 'revealed';
    text: string;
    subText?: string;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const currentQuestion: QuestionItem = PASAPALABRA_QUESTIONS[currentIndex];

  // Sync mute state
  const toggleMute = () => {
    sounds.isMuted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Scores
  const correctCount = useMemo(
    () => lettersState.filter((l) => l.status === 'correct').length,
    [lettersState]
  );
  const incorrectCount = useMemo(
    () => lettersState.filter((l) => l.status === 'incorrect').length,
    [lettersState]
  );
  const passedCount = useMemo(
    () => lettersState.filter((l) => l.status === 'passed').length,
    [lettersState]
  );
  const pendingCount = useMemo(
    () => lettersState.filter((l) => l.status === 'idle' || l.status === 'passed').length,
    [lettersState]
  );

  // Check if all answered (correct or incorrect)
  const isComplete = pendingCount === 0;

  // Sound and complete trigger
  useEffect(() => {
    if (isComplete && !isGameFinished) {
      setIsGameFinished(true);
      setIsTimerRunning(false);
      sounds.playVictory();
    }
  }, [isComplete, isGameFinished]);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTimerRunning && !isGameFinished && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setIsGameFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, isGameFinished, timeRemaining]);

  // Focus input automatically on question change
  useEffect(() => {
    if (!isGameFinished) {
      inputRef.current?.focus();
    }
  }, [currentIndex, isGameFinished]);

  // Helper to find the next playable index
  const getNextPlayableIndex = useCallback(
    (fromIndex: number): number => {
      for (let step = 1; step <= totalQuestions; step++) {
        const nextIdx = (fromIndex + step) % totalQuestions;
        const st = lettersState[nextIdx].status;
        if (st === 'idle' || st === 'passed') {
          return nextIdx;
        }
      }
      return fromIndex; // None remaining
    },
    [lettersState, totalQuestions]
  );

  // Toggle armenian translation for specific question
  const toggleArmenianForCurrent = () => {
    setRevealedTranslations((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const isArmenianShowing =
    isArmenianAlwaysVisible || !!revealedTranslations[currentQuestion.id];

  const currentLetter = lettersState[currentIndex];
  const isCurrentAnswerRevealed =
    !!revealedAnswerIds[currentQuestion.id] ||
    currentLetter?.status === 'correct' ||
    currentLetter?.status === 'incorrect';

  // Keydown handler for quick Pasapalabra (Space or Alt+P)
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' && userInput.trim() === '') {
      e.preventDefault();
      handlePasapalabra();
    }
  };

  // Submit Answer
  const handleCheckAnswer = () => {
    const trimmed = userInput.trim();
    if (!trimmed) {
      handlePasapalabra();
      return;
    }

    const isCorrect = checkAnswer(trimmed, currentQuestion);

    // Update state
    setLettersState((prev) =>
      prev.map((item, idx) =>
        idx === currentIndex
          ? {
              ...item,
              status: isCorrect ? 'correct' : 'incorrect',
              userAnswer: trimmed,
            }
          : item
      )
    );

    // Always reveal answer card details on check
    setRevealedAnswerIds((prev) => ({
      ...prev,
      [currentQuestion.id]: true,
    }));
    setRevealedTranslations((prev) => ({
      ...prev,
      [currentQuestion.id]: true,
    }));

    if (isCorrect) {
      sounds.playCorrect();
      setFeedbackToast({
        type: 'correct',
        text: `¡Correcto! ✅ ${currentQuestion.answerSpanish}`,
        subText: currentQuestion.answerArmenian,
      });
      setUserInput('');

      // Auto-advance only on correct after brief feedback
      setTimeout(() => {
        const nextIdx = getNextPlayableIndex(currentIndex);
        if (nextIdx !== currentIndex) {
          setCurrentIndex(nextIdx);
        }
      }, 700);
    } else {
      sounds.playIncorrect();
      // If incorrect: DO NOT auto-advance! Let the player see the correct answer and click "Next question"
      setFeedbackToast({
        type: 'incorrect',
        text: `❌ Սխալ պատասխան: ${trimmed}`,
        subText: `Ճիշտ պատասխանն էր՝ ${currentQuestion.answerSpanish} (${currentQuestion.answerArmenian})`,
      });
    }

    setTimeout(() => {
      setFeedbackToast((prev) => (prev ? null : prev));
    }, 4000);
  };

  // Pasapalabra (Pass turn)
  const handlePasapalabra = () => {
    sounds.playPasapalabra();

    setLettersState((prev) =>
      prev.map((item, idx) =>
        idx === currentIndex && item.status === 'idle'
          ? { ...item, status: 'passed' }
          : item
      )
    );

    setFeedbackToast({
      type: 'passed',
      text: `🔄 Pasapalabra! (${currentQuestion.letter})`,
      subText: 'Անցանք հաջորդ հարցին, կվերադառնանք շրջանի վերջում',
    });

    setUserInput('');
    const nextIdx = getNextPlayableIndex(currentIndex);
    setCurrentIndex(nextIdx);

    setTimeout(() => {
      setFeedbackToast((prev) => (prev ? null : prev));
    }, 2000);
  };

  // Dedicated "Ответ / Պատասխան" button:
  // Shows the answer right here on the current question and DOES NOT mark it as incorrect (status remains as is)!
  const handleShowAnswer = () => {
    // Gentle neutral chime
    sounds.playPasapalabra();

    // Note: lettersState is NOT modified! The letter is NOT counted as incorrect.
    // It remains in its current state (idle or passed).

    // Reveal answer and armenian translation for this question
    setRevealedAnswerIds((prev) => ({
      ...prev,
      [currentQuestion.id]: true,
    }));
    setRevealedTranslations((prev) => ({
      ...prev,
      [currentQuestion.id]: true,
    }));

    setFeedbackToast({
      type: 'revealed',
      text: `💡 Պատասխանը՝ ${currentQuestion.answerSpanish}`,
      subText: `${currentQuestion.answerArmenian} — Կարգավիճակը չի փոխվել (չի հաշվվել որպես սխալ)`,
    });

    // CRITICAL: DOES NOT auto-advance and DOES NOT penalize with incorrect status!
  };

  // Explicit advance button to go to the next question
  const handleGoToNextQuestion = () => {
    setUserInput('');
    const nextIdx = getNextPlayableIndex(currentIndex);
    if (nextIdx !== currentIndex) {
      setCurrentIndex(nextIdx);
    } else {
      // All questions resolved
      setIsGameFinished(true);
      setIsTimerRunning(false);
      sounds.playVictory();
    }
  };

  // Insert Spanish special characters into input
  const insertChar = (char: string) => {
    setUserInput((prev) => prev + char);
    inputRef.current?.focus();
  };

  // Restart Game
  const handleRestart = () => {
    setLettersState(
      PASAPALABRA_QUESTIONS.map((q) => ({
        id: q.id,
        letter: q.letter,
        status: 'idle',
      }))
    );
    setCurrentIndex(0);
    setUserInput('');
    setTimeRemaining(INITIAL_TIME);
    setIsTimerRunning(true);
    setIsGameFinished(false);
    setRevealedTranslations({});
    setRevealedAnswerIds({});
    setFeedbackToast(null);
  };

  // Format time mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Speak question
  const handlePronounceQuestion = () => {
    sounds.speakSpanish(currentQuestion.spanishQuestion);
  };

  // Speak word
  const handlePronounceWord = (word: string) => {
    sounds.speakSpanish(word);
  };

  return (
    <div className="min-h-screen bg-radial from-slate-900 via-slate-950 to-black text-slate-100 flex flex-col justify-between overflow-x-hidden">
      {/* Top Bar Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-2xl select-none">⚽</span>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent">
                PASAPALABRA
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">
                Fútbol 🇪🇸 Español ↔ 🇦🇲 Հայերեն
              </p>
            </div>
          </div>

          {/* Quick Info & Action Bar */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Armenian Always Toggle */}
            <button
              onClick={() => setIsArmenianAlwaysVisible(!isArmenianAlwaysVisible)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                isArmenianAlwaysVisible
                  ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title="Միշտ ցուցադրել հայերեն թարգմանությունը"
            >
              <Languages className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Միշտ հայերեն</span>
              <span>{isArmenianAlwaysVisible ? 'ON' : 'OFF'}</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleMute}
              className="p-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title={isMuted ? 'Միացնել ձայնը' : 'Անջատել ձայնը'}
              aria-label="Toggle Sound"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>

            {/* Vocabulary Review Modal Opener */}
            <button
              onClick={() => setShowVocabList(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Բառարան (27)</span>
            </button>

            {/* Restart Button */}
            <button
              onClick={handleRestart}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-rose-950/50 hover:text-rose-300 text-slate-300 transition-colors"
              title="Վերսկսել խաղը"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Վերսկսել</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12">
        {/* Left Side: Iconic Rosco Circle */}
        <div className="w-full max-w-[480px] sm:max-w-[540px] aspect-square relative flex items-center justify-center p-2 select-none">
          {/* Stadium Pitch Center Glow */}
          <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-sky-950/40 via-emerald-950/20 to-blue-900/30 blur-2xl pointer-events-none" />
          <div className="absolute inset-16 rounded-full border border-sky-500/10 border-dashed animate-spin [animation-duration:120s] pointer-events-none" />

          {/* Letter Circles positioned along radial perimeter */}
          {lettersState.map((item, index) => {
            // Position around 360 degrees, with index 0 (A) at the very top (-90 deg)
            const angle = (index / totalQuestions) * 2 * Math.PI - Math.PI / 2;
            // Radius in percentage from center (43% keeps bubbles inside container)
            const radius = 43;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);
            const isCurrent = index === currentIndex;

            // Status styling
            let statusStyle =
              'bg-gradient-to-b from-sky-500 to-blue-800 text-white shadow-md shadow-sky-950/60 border border-sky-400/40';
            let statusIcon = null;

            if (item.status === 'correct') {
              statusStyle =
                'bg-gradient-to-b from-emerald-400 to-green-700 text-white shadow-md shadow-emerald-900/80 border border-emerald-300/60';
              statusIcon = '✓';
            } else if (item.status === 'incorrect') {
              statusStyle =
                'bg-gradient-to-b from-rose-500 to-red-800 text-white shadow-md shadow-rose-950/80 border border-rose-400/50';
              statusIcon = '✕';
            } else if (item.status === 'passed') {
              statusStyle =
                'bg-gradient-to-b from-amber-400 to-yellow-600 text-slate-950 font-black shadow-md shadow-amber-950/70 border border-yellow-200/70';
              statusIcon = '•';
            }

            return (
              <button
                key={item.letter}
                onClick={() => setCurrentIndex(index)}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute w-8 h-8 sm:w-10 sm:h-10 rounded-full flex flex-col items-center justify-center font-extrabold text-sm sm:text-base transition-all duration-300 ${statusStyle} ${
                  isCurrent
                    ? 'scale-125 sm:scale-130 ring-4 ring-amber-400 animate-pulse-ring z-20 font-black shadow-xl shadow-amber-500/50'
                    : 'hover:scale-110 z-10'
                }`}
                title={`Буква ${item.letter} (${item.status})`}
              >
                <span>{item.letter}</span>
                {statusIcon && (
                  <span className="text-[9px] -mt-1 opacity-90 leading-none">
                    {statusIcon}
                  </span>
                )}
              </button>
            );
          })}

          {/* Center Info in the Rosco: Score TV badge */}
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center text-center p-4 z-0">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">
              {currentQuestion.rule}
            </span>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/40 mb-2 animate-gentle-bounce">
              {currentQuestion.letter}
            </div>
            <p className="text-[12px] text-amber-200/90 font-medium font-armenian line-clamp-1">
              {currentQuestion.ruleArmenian}
            </p>
            <div className="flex items-center justify-center gap-3 mt-2 text-xs font-mono font-semibold">
              <span className="text-emerald-400">✓ {correctCount}</span>
              <span className="text-slate-500">|</span>
              <span className="text-rose-400">✕ {incorrectCount}</span>
              <span className="text-slate-500">|</span>
              <span className="text-yellow-400">🔄 {passedCount}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Active Question, Spanish / Armenian Translation, Input */}
        <div className="w-full lg:max-w-xl flex flex-col gap-4">
          {/* Feedback Toast Notification */}
          {feedbackToast && (
            <div
              className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200 ${
                feedbackToast.type === 'correct'
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-100'
                  : feedbackToast.type === 'incorrect'
                  ? 'bg-rose-950/80 border-rose-500/60 text-rose-100'
                  : feedbackToast.type === 'revealed'
                  ? 'bg-sky-950/80 border-sky-500/60 text-sky-100'
                  : 'bg-amber-950/80 border-amber-500/60 text-amber-100'
              }`}
            >
              <div>
                <p className="font-bold text-sm sm:text-base">
                  {feedbackToast.text}
                </p>
                {feedbackToast.subText && (
                  <p className="text-xs sm:text-sm font-armenian opacity-90 mt-0.5">
                    {feedbackToast.subText}
                  </p>
                )}
              </div>
              <button
                onClick={() => setFeedbackToast(null)}
                className="text-xs opacity-70 hover:opacity-100 p-1"
              >
                ✕
              </button>
            </div>
          )}

          {/* The Main Question Card */}
          <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
            {/* Top rule header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-bold text-xs uppercase tracking-wider border border-amber-500/30">
                  {currentQuestion.rule}
                </span>
                <span className="text-xs text-slate-400 font-armenian">
                  {currentQuestion.ruleArmenian}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePronounceQuestion}
                  className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition-colors"
                  title="Լսել իսպաներեն հարցի արտասանությունը"
                  aria-label="Pronounce Question"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Clickable Spanish Question Container */}
            <div
              onClick={toggleArmenianForCurrent}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleArmenianForCurrent();
                }
              }}
              className="group cursor-pointer rounded-xl p-3.5 bg-gradient-to-r from-slate-950/80 to-slate-900/60 hover:from-slate-950 hover:to-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all duration-200"
            >
              <div className="flex items-center justify-between text-xs text-amber-400/90 font-medium mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span>🇪🇸</span> Español (Սեղմեք թարգմանության համար)
                </span>
                <span className="text-[11px] flex items-center gap-1 text-slate-400 group-hover:text-amber-300 transition-colors">
                  {isArmenianShowing ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" /> Փակել
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" /> Տեսնել հայերենը
                    </>
                  )}
                </span>
              </div>
              <p className="text-base sm:text-lg font-semibold text-slate-100 leading-relaxed group-hover:text-white transition-colors">
                {currentQuestion.spanishQuestion}
              </p>
            </div>

            {/* Armenian Translation Box (Opens on click of Spanish or button) */}
            {isArmenianShowing ? (
              <div className="mt-3.5 p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-100 font-armenian animate-in fade-in duration-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <span>🇦🇲</span> Հայերեն թարգմանություն
                  </span>
                  <span className="text-[11px] text-amber-300/80">
                    Պատասխանի հուշում՝ {currentQuestion.answerArmenian}
                  </span>
                </div>
                <p className="text-sm sm:text-base font-medium text-amber-100 leading-relaxed">
                  {currentQuestion.armenianQuestion}
                </p>
              </div>
            ) : (
              <div
                onClick={toggleArmenianForCurrent}
                className="mt-2.5 text-center py-2 px-3 rounded-lg border border-dashed border-slate-800 hover:border-amber-500/40 text-xs text-slate-400 hover:text-amber-300 cursor-pointer font-armenian transition-colors"
              >
                👉 Սեղմեք այստեղ կամ հարցի վրա՝ հայերեն թարգմանությունը տեսնելու համար
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCheckAnswer();
              }}
              className="mt-5 flex flex-col gap-3"
            >
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder={`Պատասխանը իսպաներենով (${currentQuestion.letter}...)`}
                  disabled={isGameFinished}
                  autoComplete="off"
                  spellCheck="false"
                  className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-slate-950 border-2 border-slate-700 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 text-slate-100 text-base sm:text-lg font-medium placeholder:text-slate-500 outline-none transition-all"
                />

                {userInput && (
                  <button
                    type="button"
                    onClick={() => setUserInput('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs px-1.5 py-0.5 rounded bg-slate-800"
                  >
                    Մաքրել
                  </button>
                )}
              </div>

              {/* Spanish Special Characters Keyboard helper */}
              <div className="flex items-center justify-between gap-1 text-xs">
                <span className="text-slate-400 text-[11px] hidden sm:inline">
                  Հատուկ տառեր՝
                </span>
                <div className="flex items-center gap-1.5">
                  {['á', 'é', 'í', 'ó', 'ú', 'ñ'].map((char) => (
                    <button
                      key={char}
                      type="button"
                      onClick={() => insertChar(char)}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 font-bold text-xs sm:text-sm text-slate-200 border border-slate-700 transition-colors flex items-center justify-center active:scale-95"
                    >
                      {char}
                    </button>
                  ))}
                </div>
              </div>

              {/* Answer Card Display (Shown after clicking Ответ or submitting an answer) */}
              {isCurrentAnswerRevealed ? (
                <div className="mt-2 p-4 rounded-2xl bg-slate-950/95 border-2 border-amber-500/50 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-2">
                    <span className="flex items-center gap-1.5 uppercase tracking-wide">
                      <span>⚽</span> ՃԻՇՏ ՊԱՏԱՍԽԱՆԸ / RESPUESTA:
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePronounceWord(currentQuestion.answerSpanish)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-amber-500/30"
                      title="Լսել իսպաներեն արտասանությունը"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Լսել արտասանությունը</span>
                    </button>
                  </div>

                  <div className="flex items-baseline gap-3 flex-wrap mb-2.5">
                    <span className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
                      {currentQuestion.answerSpanish}
                    </span>
                    <span className="text-slate-600 text-lg font-bold">—</span>
                    <span className="text-lg sm:text-xl font-bold text-emerald-400 font-armenian">
                      {currentQuestion.answerArmenian}
                    </span>
                  </div>

                  {currentQuestion.explanationEs && (
                    <p className="text-xs sm:text-sm text-slate-300 pt-2 border-t border-slate-800">
                      <span className="text-slate-500 font-semibold">🇪🇸 </span>{currentQuestion.explanationEs}
                    </p>
                  )}
                  {currentQuestion.explanationHy && (
                    <p className="text-xs sm:text-sm text-amber-200/90 font-armenian mt-1">
                      <span className="text-slate-500 font-semibold">🇦🇲 </span>{currentQuestion.explanationHy}
                    </p>
                  )}

                  {lettersState[currentIndex]?.userAnswer && lettersState[currentIndex].userAnswer !== '(Պատասխանը բացահայտված է / Ответ)' && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
                      <span>Ձեր պատասխանը՝</span>
                      <span
                        className={
                          lettersState[currentIndex].status === 'correct'
                            ? 'text-emerald-400 font-bold'
                            : 'text-rose-400 font-bold'
                        }
                      >
                        {lettersState[currentIndex].userAnswer}
                      </span>
                    </div>
                  )}

                  {/* Action buttons in revealed state */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {/* If still unsubmitted, user can still submit their typed answer */}
                    {(lettersState[currentIndex].status === 'idle' || lettersState[currentIndex].status === 'passed') && (
                      <button
                        type="submit"
                        disabled={isGameFinished}
                        className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md shadow-emerald-950/40"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Ստուգել (Enter)</span>
                      </button>
                    )}

                    {/* Advance to next question manually */}
                    <button
                      type="button"
                      onClick={handleGoToNextQuestion}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-sky-950/60 flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      <span>Հաջորդ հարց ➔ (Siguiente pregunta)</span>
                    </button>

                    {/* Hide answer if player wants to test memory */}
                    <button
                      type="button"
                      onClick={() => {
                        setRevealedAnswerIds((prev) => ({
                          ...prev,
                          [currentQuestion.id]: false,
                        }));
                      }}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                      title="Թաքցնել պատասխանը"
                    >
                      Թաքցնել
                    </button>
                  </div>
                </div>
              ) : (
                /* Action Buttons when answer is not yet revealed */
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                  {/* Submit / Check */}
                  <button
                    type="submit"
                    disabled={isGameFinished}
                    className="px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Ստուգել (Enter)</span>
                  </button>

                  {/* Pasapalabra */}
                  <button
                    type="button"
                    onClick={handlePasapalabra}
                    disabled={isGameFinished}
                    className="px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-md shadow-amber-950/50 flex items-center justify-center gap-2 active:scale-95 transition-all"
                    title="Բաց թողնել և վերադառնալ շրջանի վերջում"
                  >
                    <span>🔄 Pasapalabra</span>
                  </button>

                  {/* Dedicated "Ответ / Պատասխան" button:
                      Reveals the answer and stays on the current question! */}
                  <button
                    type="button"
                    onClick={handleShowAnswer}
                    disabled={isGameFinished}
                    className="px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-md shadow-indigo-950/50 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                    title="Ցույց տալ ճիշտ պատասխանը (առանց հաջորդ հարց անցնելու)"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-300" />
                    <span>💡 Պատասխան / Ответ</span>
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Quick Guidance */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <span>
              💡 Եթե պատասխանը սխալ է, խաղը շարունակվում է մինչև բոլոր 27 տառերը։
            </span>
            <span>20 րոպե խաղաժամանակ</span>
          </div>
        </div>
      </main>

      {/* Bottom TV Studio Scoreboard HUD */}
      <footer className="border-t border-slate-800 bg-slate-950/90 backdrop-blur-md sticky bottom-0 z-30 py-3 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* TV Style Indicator Circles */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Correct Score Bubble */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-emerald-950/60">
                {correctCount}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-emerald-400">ՃԻՇՏ</div>
                <div className="text-[11px] text-slate-400">Aciertos</div>
              </div>
            </div>

            {/* Errors Bubble */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-rose-950/60">
                {incorrectCount}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-rose-400">ՍԽԱԼ</div>
                <div className="text-[11px] text-slate-400">Fallos</div>
              </div>
            </div>

            {/* Pending Bubble */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-sky-600 to-blue-500 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-sky-950/60">
                {pendingCount}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-sky-400">ՄՆԱՑ</div>
                <div className="text-[11px] text-slate-400">Pendientes</div>
              </div>
            </div>
          </div>

          {/* Center 20-min Countdown Timer */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
                timeRemaining < 120
                  ? 'bg-rose-950/70 border-rose-500 text-rose-300 animate-pulse'
                  : 'bg-slate-900 border-slate-700 text-amber-300'
              }`}
            >
              <span className="text-xs font-semibold text-slate-400 uppercase">
                ԺԱՄԱՆԱԿ
              </span>
              <span className="font-mono text-xl sm:text-2xl font-black tabular-nums tracking-wider">
                {formatTime(timeRemaining)}
              </span>
            </div>

            {/* Play/Pause Timer */}
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title={isTimerRunning ? 'Դադարեցնել' : 'Շարունակել'}
            >
              {isTimerRunning ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 text-emerald-400" />
              )}
            </button>
          </div>

          {/* Jump next / fast buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const next = (currentIndex + 1) % totalQuestions;
                setCurrentIndex(next);
              }}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              <span>Հաջորդ տառ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>

      {/* Complete / Game Over Modal */}
      {isGameFinished && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center shadow-2xl relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/30">
              <Trophy className="w-10 h-10" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
              Խաղն ավարտվեց! 🎉
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Pasapalabra Fútbol — Դուք ավարտեցիք բոլոր 27 տառերի փուլը
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/40">
                <div className="text-2xl font-black text-emerald-400">
                  {correctCount}
                </div>
                <div className="text-xs text-emerald-200/80 font-medium">
                  Ճիշտ (Aciertos)
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/40">
                <div className="text-2xl font-black text-rose-400">
                  {incorrectCount}
                </div>
                <div className="text-xs text-rose-200/80 font-medium">
                  Սխալ (Fallos)
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700">
                <div className="text-2xl font-black text-amber-400">
                  {Math.round((correctCount / totalQuestions) * 100)}%
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  Արդյունք
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleRestart}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Խաղալ նորից (Jugar de nuevo)</span>
              </button>

              <button
                onClick={() => setShowVocabList(true)}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span>Դիտել բոլոր 27 բառերը</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vocabulary / Dictionary Review Drawer */}
      {showVocabList && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <span>⚽</span> Բառարան և հարցեր (27 preguntas de fútbol)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Սեղմեք ցանկացած տողի վրա՝ իսպաներեն արտասանությունը լսելու համար
                </p>
              </div>
              <button
                onClick={() => setShowVocabList(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Question List */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
              {PASAPALABRA_QUESTIONS.map((q, idx) => {
                const st = lettersState[idx]?.status;
                return (
                  <div
                    key={q.letter}
                    className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full font-black text-sm flex items-center justify-center shrink-0 ${
                            st === 'correct'
                              ? 'bg-emerald-500 text-slate-950'
                              : st === 'incorrect'
                              ? 'bg-rose-500 text-white'
                              : st === 'passed'
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-sky-600 text-white'
                          }`}
                        >
                          {q.letter}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-amber-300 text-base">
                              {q.answerSpanish}
                            </span>
                            <span className="text-slate-500">—</span>
                            <span className="font-semibold text-emerald-400 font-armenian text-sm">
                              {q.answerArmenian}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              ({q.rule})
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePronounceWord(q.answerSpanish)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition-colors shrink-0"
                        title="Լսել բառի արտասանությունը"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500 font-medium block mb-0.5">
                          🇪🇸 Español:
                        </span>
                        <p className="text-slate-300">{q.spanishQuestion}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium font-armenian block mb-0.5">
                          🇦🇲 Հայերեն:
                        </span>
                        <p className="text-slate-300 font-armenian">
                          {q.armenianQuestion}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
              <button
                onClick={() => setShowVocabList(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors"
              >
                Փակել
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
