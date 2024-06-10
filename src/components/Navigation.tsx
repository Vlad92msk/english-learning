import React, { useCallback, useEffect, useMemo, useState } from "react";
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../index";
import { Card as CardGET, Settings as SettingsGET, Studying } from "../types";
import Icon from "./Icon";
// import { Icon } from "./Icon";

const navigationStyleMain = css(`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    
    span {
        font-size: 10px;
    }
`)

const navigationStyle = css(`
    width: 100%;
    font-size: 13px;
    grid-area: navigation;
    display: flex;
    align-items: center;
    justify-content: center;
    
    button:first-of-type {
        position: absolute;
        left: 0;
        width: 30%;
        height: 130%;
    }
    button:last-of-type {
        position: absolute;
        right: 0;
        width: 30%;
        height: 130%;
    }
`)

const boxStyle = css(`
    display: flex;
    align-items: center;
    gap: 5px;
`)

interface NavigationProps {
    lastCardId?: string
    cards: CardGET[]
    settings: SettingsGET
    onCardUpdate: (id: string, updatedData: Partial<CardGET>) => void
    onStudyingUpdate: (updatedStudying: Studying) => void
}
export const Navigation = React.memo((props: NavigationProps) => {
    const { onCardUpdate, cards, settings: { repeatTime, isRepeat }, lastCardId, onStudyingUpdate } = props;

  const { currentCard, nextIndex, prevIndex, currentIndex } = useMemo(() => {
      const currentIndex1 = (!lastCardId?.length) ? 0 : cards?.findIndex(card => card.id === lastCardId) || 0
      const currentIndex = currentIndex1 < 0 ? 0 : currentIndex1

      const nextIndex = currentIndex === cards?.length - 1 ? 0 : currentIndex + 1
      const prevIndex = currentIndex === 0 ? cards?.length - 1 : currentIndex - 1

      const currentCard = cards[currentIndex]

      return ({
          currentCard,
          nextIndex,
          prevIndex,
          currentIndex
      })
  },[cards, lastCardId])


    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
    const audioContextRef = React.useRef<AudioContext | null>(null);

    useEffect(() => {
        const fetchAudioBuffer = async () => {
            try {
                // @ts-ignore
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                audioContextRef.current = audioContext;
                const response = await fetch('/audio/next.mp3'); // Локальный путь к аудиофайлу
                const arrayBuffer = await response.arrayBuffer();
                const buffer = await audioContext.decodeAudioData(arrayBuffer);
                setAudioBuffer(buffer);
            } catch (error) {
                console.error("Error fetching audio buffer:", error);
            }
        };

        fetchAudioBuffer();
    }, []);

    const playSound = useCallback(() => {
        if (audioBuffer && audioContextRef.current) {
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);
            source.start(0);
            console.log("Playing sound");
        } else {
            console.error("AudioBuffer or AudioContext is not available");
        }
    }, [audioBuffer]);


    const handleNextCard = useCallback(() => {
        if (cards.length > 0 && nextIndex && cards[nextIndex].id) {
            onStudyingUpdate({ lastCardId: cards[nextIndex].id });
            playSound();
        }
    }, [cards, nextIndex, onStudyingUpdate, playSound]);

    const handlePrevCard = useCallback(() => {
        if (cards.length > 0 && prevIndex >= 0 && cards[prevIndex].id) {
            onStudyingUpdate({ lastCardId: cards[prevIndex].id });
            playSound();
        }
    }, [cards, onStudyingUpdate, prevIndex, playSound]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout | null = null;

        if (isRepeat && repeatTime > 100) {
            timeoutId = setTimeout(() => {
                handleNextCard();
            }, repeatTime);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [handleNextCard, isRepeat, repeatTime]);

    return <div css={navigationStyleMain}>
        <span>{currentIndex + 1}/{cards?.length}</span>
        <div css={navigationStyle}>
            <button onClick={handlePrevCard}>
                <Icon  name="arrow-left-sharp"/>
            </button>
            <div css={boxStyle}>
                <span>Продолжаем учить?</span>
                <select
                    value={currentCard?.isLearning ? 'true' : 'false'}
                    onChange={(e) => onCardUpdate(currentCard.id, {isLearning: e.target.value === 'true'})}
                >
                    <option value='true'>Да</option>
                    <option value='false'>Нет</option>
                </select>
            </div>
            <button onClick={handleNextCard}>
                <Icon  name="arrow-right-sharp"/>
            </button>
        </div>
    </div>
})
