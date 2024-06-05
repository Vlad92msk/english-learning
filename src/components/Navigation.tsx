import React, { useCallback, useEffect, useState } from "react";
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../index";
import { Card as CardGET, Settings as SettingsGET, Studying } from "../types";

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
        height: 100%;
    }
    button:last-of-type {
        position: absolute;
        right: 0;
        width: 30%;
        height: 100%;
    }
`)

const boxStyle = css(`
    display: flex;
    align-items: center;
    gap: 5px;
`)

interface NavigationProps {
    lastCardId: string
    data: CardGET[]
    settings: SettingsGET
    cardUpdate: (id: string, data: Partial<CardGET>) => Promise<void>
    onUpdate: (id: string, data: Partial<Studying>) => Promise<void>
}
export const Navigation = React.memo((props: NavigationProps) => {
    const { cardUpdate, data, settings: { repeatTime, isRepeat }, lastCardId, onUpdate } = props;
    const currentIndex1 = (!lastCardId?.length) ? 0 : data?.findIndex(card => card.id === lastCardId) || 0
    const currentIndex = currentIndex1 < 0 ? 0 : currentIndex1

    const nextIndex = currentIndex === data?.length - 1 ? 0 : currentIndex + 1
    const prevIndex = currentIndex === 0 ? data?.length - 1 : currentIndex - 1

    const currentCard = data[currentIndex]

    const [audioURL, setAudioURL] = useState<string | null>(null);

    useEffect(() => {
        const fetchAudioURL = async () => {
            try {
                const url = await getDownloadURL(ref(storage, 'gs://english-learning-app-vlad.appspot.com/audio/electric_door_opening_2.mp3')); // Укажите путь к вашему звуковому файлу в Firebase Storage
                setAudioURL(url);
            } catch (error) {
                console.error("Error fetching audio URL:", error);
            }
        };

        fetchAudioURL();
    }, []);

    const handleNextCard = useCallback(() => {
        if (data.length > 0 && nextIndex && data[nextIndex].id) {
            onUpdate('latestStatus', {lastCardId: data[nextIndex].id})
        }
    }, [data, nextIndex, onUpdate])

    const handlePrevCard = useCallback(() => {
        if (data.length > 0 && prevIndex >= 0 && data[prevIndex].id) {
            onUpdate('latestStatus', {lastCardId: data[prevIndex].id})
        }
    }, [data, onUpdate, prevIndex])

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
        <span>{currentIndex + 1}/{data?.length}</span>
        <div css={navigationStyle}>
            <button onClick={handlePrevCard}>prev</button>
            <div css={boxStyle}>
                <span>Продолжаем учить?</span>
                <select
                    value={currentCard?.isLearning ? 'true' : 'false'}
                    onChange={(e) => cardUpdate(currentCard.id, {isLearning: e.target.value === 'true'})}
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
