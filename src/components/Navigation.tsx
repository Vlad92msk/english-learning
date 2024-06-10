import React, { useCallback, useEffect, useMemo, useRef } from "react";
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Card as CardGET, Settings as SettingsGET, Studying } from "../types";
import Icon from "./Icon";

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
    
     @media (max-width: 500px) {
        flex-direction: column;
    }
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

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const playSound = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0; // В случае, если аудио уже играет
            audioRef.current.play().catch(error => console.error("Audio play failed:", error));
        }
    }, []);

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
        <audio ref={audioRef} src="/audio/next.mp3" preload="auto"></audio>
        <span>{currentIndex + 1}/{cards?.length}</span>
        <div css={navigationStyle}>
            <button onClick={handlePrevCard}>
                <Icon name="arrow-left-sharp"/>
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
                <Icon name="arrow-right-sharp"/>
            </button>
        </div>
    </div>
})
