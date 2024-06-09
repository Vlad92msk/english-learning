import React, { useCallback, useEffect, useState } from "react";
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../index";
import { Card as CardGET, Collection, Settings as SettingsGET, Studying } from "../types";

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

    const currentIndex1 = (!lastCardId?.length) ? 0 : cards?.findIndex(card => card.id === lastCardId) || 0
    const currentIndex = currentIndex1 < 0 ? 0 : currentIndex1

    const nextIndex = currentIndex === cards?.length - 1 ? 0 : currentIndex + 1
    const prevIndex = currentIndex === 0 ? cards?.length - 1 : currentIndex - 1

    const currentCard = cards[currentIndex]

    const [audioURL, setAudioURL] = useState<string | null>(null);

    useEffect(() => {
        const fetchAudioURL = async () => {
            try {
                const url = await getDownloadURL(ref(storage, 'gs://english-learning-app-vlad.appspot.com/audio/next.mp3')); // Укажите путь к вашему звуковому файлу в Firebase Storage
                setAudioURL(url);
            } catch (error) {
                console.error("Error fetching audio URL:", error);
            }
        };

        fetchAudioURL();
    }, []);

    const handleNextCard = useCallback(() => {
        if (cards.length > 0 && nextIndex && cards[nextIndex].id) {
            onStudyingUpdate({lastCardId: cards[nextIndex].id})
        }
    }, [cards, nextIndex, onStudyingUpdate])

    const handlePrevCard = useCallback(() => {
        if (cards.length > 0 && prevIndex >= 0 && cards[prevIndex].id) {
            onStudyingUpdate({ lastCardId: cards[prevIndex].id })
        }
    }, [cards, onStudyingUpdate, prevIndex])

    useEffect(() => {
        if (!audioURL) return;

        const audio = new Audio(audioURL);
        let timeoutId: NodeJS.Timeout | null = null;

        if (isRepeat && repeatTime > 100) {
            timeoutId = setTimeout(() => {
                handleNextCard();
                audio.play();
            }, repeatTime);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [audioURL, handleNextCard, isRepeat, repeatTime]);

    return <div css={navigationStyleMain}>
        <span>{currentIndex + 1}/{cards?.length}</span>
        <div css={navigationStyle}>
            <button onClick={handlePrevCard}>prev</button>
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
                next
            </button>
        </div>
    </div>
})
