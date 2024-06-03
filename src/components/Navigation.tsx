import React, { useEffect, useState } from "react";
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../index";
import { useGetData } from "../hooks/useGetData";
import { Card, Collection, Settings, Studying } from "../types";
import { useWatch } from "../hooks/useWatch";

const navigationStyle = css(`
    font-size: 13px;
    grid-area: navigation;
    display: flex;
    align-items: center;
    gap: 50px;
    justify-content: space-between;
    
    button {
        width: 30%;
        height: 100%;
    }
`)

const boxStyle = css(`
    display: flex;
    align-items: center;
    gap: 5px;
`)

export const Navigation = () => {
    const [{ isRepeat, repeatTime } = { isRepeat: false, repeatTime: 0 } ] = useWatch<Settings>(Collection.SETTINGS)
    const { onUpdate } = useGetData<Studying>(Collection.STUDYING);
    const { onUpdate: vocabularUpdate } = useGetData<Card>(Collection.VOCABULAR);
    const cards = useWatch<Card>(Collection.VOCABULAR)
    const [{ lastCardId } = { lastCardId: 'rIH3KYFr8Jfc4oUbBTZE' }] = useWatch<Studying>(Collection.STUDYING)
    const currentIndex = (!lastCardId?.length) ? 0 : cards?.findIndex(card => card.id === lastCardId) || 0

    const nextIndex = currentIndex === cards?.length - 1 ? 0 : currentIndex + 1
    const prevIndex = currentIndex === 0 ? cards?.length - 1 : currentIndex - 1

    const currentCard = cards[currentIndex]

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

    const handleNextCard = () => {
        onUpdate('latestStatus', {lastCardId: cards[nextIndex].id})
    }
    const handlePrevCard = () => {
        onUpdate('latestStatus', {lastCardId: cards[prevIndex].id})
    }

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

    return <div css={navigationStyle}>
        <button onClick={handlePrevCard}>prev</button>
        <div css={boxStyle}>
            <span>Продолжаем учить?</span>
            <select
                value={currentCard?.isLearning ? 'true' : 'false'}
                onChange={(e) => vocabularUpdate(currentCard.id, { isLearning: e.target.value === 'true' })}
            >
                <option value='true'>Да</option>
                <option value='false'>Нет</option>
            </select>
        </div>
        <button onClick={handleNextCard}>
            next
        </button>
    </div>
}
