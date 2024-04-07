'use client';

import { useEffect, useState } from 'react';
import { texts } from '@/lib/text';
import {
  calculateSpeed,
  calculateAccuracy,
  calculateConsistency,
} from '@/lib/metrics';
import Timer from './timer';

function getRandomElement(arr: string[]) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

const Textarea = () => {
  const time_in_seconds = 15;

  // text to be typed
  const text = getRandomElement(texts);
  const words = text.split(' ');

  // start the timer
  const [start, setStart] = useState(false);

  // end the test
  const [isFinished, setIsFinished] = useState(false);

  // progression
  const [activeWord, setActiveWord] = useState(0);
  const [activeChar, setActiveChar] = useState(0);

  // evaluate
  const [correctWords, setCorrectWords] = useState<number>(0);
  const [correctChars, setCorrectChars] = useState(0);

  // speed
  const [wpm, setWpm] = useState<number[]>([]);
  const [timeElapsed, setTimeElapsed] = useState<number>(1);

  useEffect(() => {
    let timer: any;
    const setTimer = () => {
      if (start) {
        timer = setInterval(() => {
          setTimeElapsed((prev) => prev + 1);
          setWpm((prev) => [
            ...prev,
            calculateSpeed(correctWords, timeElapsed),
          ]);
          console.log(wpm);
        }, 1000);
      }
    };
    setTimer();

    if (isFinished) {
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  }, [start, timeElapsed, correctWords, isFinished, wpm]);

  useEffect(() => {
    const ignoreKeys = ['Control', 'Alt', 'AltGraph', 'Shift', 'Enter'];
    const handleKeyDown = (event: KeyboardEvent) => {
      setStart(true);

      if (!ignoreKeys.includes(event.key)) {
        if (event.key == ' ') {
          if (activeWord >= 0 && activeChar != 0) {
            setActiveWord((prev) => prev + 1);
            setActiveChar(0);
            setCorrectChars(0);
          }
          if (activeWord >= words.length - 1) {
            setIsFinished(true);
          }
        } else {
          const word = document.getElementsByClassName('word')[activeWord];
          const letter = word.getElementsByClassName('letter')[activeChar];
          if (event.key == words[activeWord][activeChar]) {
            setCorrectChars((prev) => prev + 1);
            letter.classList.add('text-green-400');
          } else {
            if (activeChar >= words[activeWord].length) {
              const extraLetter = document.createElement('span');
              extraLetter.appendChild(document.createTextNode(event.key));
              extraLetter.classList.add(
                'inline',
                'letter',
                'text-red-400',
                'underline'
              );
              word.insertBefore(
                extraLetter,
                word.getElementsByClassName('letter')[activeChar - 1]
                  .nextSibling
              );
              setCorrectChars(0);
            } else {
              letter.classList.add('text-red-400');
              setCorrectChars(0);
            }
          }
          if (correctChars == words[activeWord].length - 1) {
            setCorrectWords((prev) => prev + 1);
          }

          setActiveChar((prev) => prev + 1);
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    if (isFinished) {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    activeWord,
    activeChar,
    words,
    isFinished,
    correctChars,
    correctWords,
    start,
  ]);

  return (
    <div className="flex flex-col font-mono h-full w-full">
      {!isFinished && (
        <Timer
          duration={time_in_seconds}
          start={start}
          setIsFinished={setIsFinished}
        />
      )}
      <section className="p-4 font-mono text-2xl m-8 text-justify">
        {!isFinished ? (
          text.split(' ').map((word, wordIndex) => (
            <div key={wordIndex} className="inline word">
              {word.split('').map((letter, letterIndex) => (
                <span
                  key={`${wordIndex}-${letterIndex}`}
                  className="inline letter"
                >
                  {letter}
                </span>
              ))}{' '}
            </div>
          ))
        ) : (
          <>
            <div className="text-xl">Done!</div>
            <div className="text-yellow-300 text-3xl">{`Speed: ${calculateSpeed(
              correctWords,
              time_in_seconds
            )} wpm`}</div>
            <div>{`Correct words typed: ${correctWords} / ${words.length}`}</div>
            <div>{`Accuracy: ${calculateAccuracy(
              correctWords,
              activeWord,
              activeChar
            )}%`}</div>
            <div>{`Consistency: ${calculateConsistency(wpm)}%`}</div>
          </>
        )}
      </section>
    </div>
  );
};

export default Textarea;
