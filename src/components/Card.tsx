import React, { useCallback, useEffect, useMemo, useState } from "react";
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Card as CardGET, Settings as SettingsGET } from "../types";
import { CardContainer } from "./CardContainer";

const cardContainerStyle = css`
  perspective: 10000px;
  height: 100%;
  position: relative;
  span {
  pointer-events: none
  }
`;



const cardTagsStyle = css`
  display: flex;
  gap: 10px;
  padding: 20px 0 5px 0;
  
  button {
    font-size: 10px!important;
  }
`;


const tagStyle = css`
  padding: 5px;
  background: #0d2136;
  border: 1px solid #435367;
  border-radius: 3px;
  font-weight: bold;
  font-size: 12px;
`;

const metaRowStyle = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;




const defaultCard: CardGET = {
    isIdiom: false,
    enValue: '',
    ruValue: '',
    isPhrasalVerb: false,
    id: '',
    isLearning: true,
    dateAdded: new Date()
}

interface CardProps {
    settings: SettingsGET
    lastCardId?: string
    cards: CardGET[]
    onRemoveCard: (id: string) => Promise<void>
    onUpdateCard: (id: string, updatedData: Partial<CardGET>) => void
}

export const Card = React.memo((props: CardProps) => {
    const { cards, lastCardId, onUpdateCard, onRemoveCard, settings: { firstSide, type } } = props;

    const { isIdiom, enValue, ruValue, isPhrasalVerb, id, dateAdded, isLearning } = useMemo(() => {
        if (cards.length === 0) return defaultCard;

        const currentIndex = lastCardId ? cards.findIndex(card => card.id === lastCardId) : 0;

        return cards[currentIndex >= 0 ? currentIndex : 0];
    }, [cards, lastCardId]);


    const [nativeValue, setNativeValue] = useState(ruValue);
    const [learningValue, setLearningValue] = useState(enValue);

    useEffect(() => {
        if (ruValue !== nativeValue) {
            setNativeValue(ruValue)
        }
    }, [ruValue]);

    useEffect(() => {
        if (enValue !== learningValue) {
            setLearningValue(enValue)
        }
    }, [enValue]);

    const handleUpdatePartialVerbs = useCallback(() => {
        onUpdateCard(id, { isPhrasalVerb: !isPhrasalVerb });
    }, [id, isPhrasalVerb, onUpdateCard]);

    const handleUpdateIdiom = useCallback(() => {
        onUpdateCard(id, { isIdiom: !isIdiom });
    }, [id, isIdiom, onUpdateCard]);

    return (
        <div css={cardContainerStyle}>
            <div css={metaRowStyle}>
                <div css={cardTagsStyle}>
                    {isPhrasalVerb && <span css={tagStyle}>#phrasal verb</span>}
                    {isIdiom && <span css={tagStyle}>#idiom</span>}
                </div>
                <div css={cardTagsStyle}>
                    <button onClick={handleUpdatePartialVerbs}>
                        {isPhrasalVerb ? 'no phrasal verb' : 'phrasal verb'}
                    </button>
                    <button onClick={handleUpdateIdiom}>
                        {isIdiom ? 'no idiom' : 'idiom'}
                    </button>
                    <button onClick={() => onRemoveCard(id)}>x</button>
                </div>
            </div>
            <CardContainer
                card={{ isIdiom, enValue, ruValue, isPhrasalVerb, id, dateAdded, isLearning }}
                type={type}
                ruValue={ruValue}
                enValue={enValue}
                onUpdateCard={onUpdateCard}
                firstSide={firstSide}
            />
        </div>
    );
});
