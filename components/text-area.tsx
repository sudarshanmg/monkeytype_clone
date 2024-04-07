'use client';

import { useEffect, useState } from 'react';
import { texts } from '@/lib/text';
import classes from './text-area.module.css';
import Timer from './timer';

const Textarea = () => {
  const text = texts[0];
  const words = text.split(' ');
  const char_count: number[] = [];

  text.split(' ').map((word) => {
    char_count.push(word.length);
  });

  const time = 15000;
  const [activeWord, setActiveWord] = useState(0);
  const [activeChar, setActiveChar] = useState(0);
  const [start, setStart] = useState(false);
  const [correctWords, setCorrectWords] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const ignoreKeys = ['Control', 'Alt', 'AltGraph'];
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
            letter.classList.add(classes.correct);
          } else {
            if (activeChar >= words[activeWord].length) {
              const extraLetter = document.createElement('span');
              extraLetter.appendChild(document.createTextNode(event.key));
              extraLetter.classList.add('inline', 'letter', classes.incorrect);
              word.insertBefore(
                extraLetter,
                word.getElementsByClassName('letter')[activeChar - 1]
                  .nextSibling
              );
              setCorrectChars(0);
            } else {
              letter.classList.add(classes.incorrect);
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
  }, [activeWord, activeChar, words, isFinished, correctChars]);

  return (
    <div className="flex flex-col font-mono h-full w-full">
      {!isFinished && start && (
        <Timer duration={5} setIsFinished={setIsFinished} />
      )}
      <section className="p-4 font-mono text-2xl m-8 text-justify">
        {!isFinished ? (
          texts.map((text, index) => (
            <div key={index}>
              {text.split(' ').map((word, wordIndex) => (
                <div key={wordIndex} className="inline word">
                  {word.split('').map((letter, letterIndex) => (
                    <span key={letterIndex} className="inline letter">
                      {letter}
                    </span>
                  ))}{' '}
                </div>
              ))}
            </div>
          ))
        ) : (
          <>
            <div className="text-xl">Done!</div>
            <div className="text-yellow-300 text-3xl">{`Speed: ${
              (correctWords * 60) / 15
            } wpm`}</div>
            <div>{`Correct words typed: ${correctWords} / ${words.length}`}</div>
            <div>{`Accuracy: ${
              (correctWords /
                (activeWord == 0
                  ? activeWord + 1
                  : activeChar == 0
                  ? activeWord
                  : activeWord + 1)) *
              100
            }%`}</div>
          </>
        )}
      </section>
    </div>
  );
};

export default Textarea;
