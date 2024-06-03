import React, { useEffect, useState } from "react";
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useWatch } from "../hooks/useWatch";
import { Collection, Settings, Studying, Card as CardGET } from "../types";

const cardContainerStyle = css`
  perspective: 10000px;
  height: 100%;
  max-height: 90%;
  position: relative;
  overflow: hidden;
`;

const cardStyle = (type: string) => css`
  width: 99%;
  height: calc(100% - 70px);
  position: absolute;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  border: 1px solid #435367;
  cursor: ${type === '1_side' ? 'ew-resize': 'default'};
`;

const cardFlippedStyle = css`
  transform: rotateY(180deg);
`;

const cardItemStyle = css`
  width: 100%;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
`;

const cardFrontStyle = css`
  ${cardItemStyle};
  background-color: #0d2136;
`;

const cardBackStyle = css`
  ${cardItemStyle};
  background-color: #0d2136;
  transform: rotateY(180deg);
`;

const cardTagsStyle = css`
  display: flex;
  gap: 10px;
  padding: 20px 0;
`;

const cardDataStyle = css`
  display: flex;
  height: 100%;
`;

const cardDataFirstSideRuStyle = css`
  flex-direction: column;
`;

const cardDataFirstSideEnStyle = css`
  flex-direction: column-reverse;
`;

const cardData1SideStyle = css`
  position: relative;

  span {
    position: absolute;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const cardData2SideStyle = css`
  span {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
const tagStyle = css`
  padding: 5px;
  background: #0d2136;;
  border: 1px solid #435367;
  border-radius: 3px;
  font-weight: bold;
  font-size: 12px;
`;
const getCardDataStyle = (type: string, firstSide: string) => css`
  ${cardDataStyle};
  ${type === '1_side' && cardData1SideStyle};
  ${type === '2_side' && cardData2SideStyle};
  ${firstSide === 'ru' && cardDataFirstSideRuStyle};
  ${firstSide === 'en' && cardDataFirstSideEnStyle};
`;


export const Card = () => {
    const [{ type, firstSide } = { type: '', firstSide: '' }] = useWatch<Settings>(Collection.SETTINGS);
    const [{ lastCardId } = { lastCardId: 'rIH3KYFr8Jfc4oUbBTZE' }] = useWatch<Studying>(Collection.STUDYING);
    const [visible, setVisible] = useState(firstSide);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        if (firstSide.length) {
            setVisible(firstSide);
        }
    }, [firstSide]);

    const cards = useWatch<CardGET>(Collection.VOCABULAR, undefined, { field: 'dateAdded', direction: 'desc' });

    if (!cards?.length) return null

    const currentIndex = lastCardId ? cards.findIndex(card => card.id === lastCardId) : 0;
    const { isIdiom, enValue, ruValue, isPhrasalVerb } = cards[currentIndex];
    const handleCardClick = () => {
        if (type === '1_side') {
            setVisible(prev => (prev === 'ru' ? 'en' : 'ru'));
            setIsFlipped(!isFlipped);
        }
    };

    return (
        <div css={cardContainerStyle}>
            <div css={cardTagsStyle}>
                {isPhrasalVerb && <span css={tagStyle}>#phrasal verb</span>}
                {isIdiom && <span css={tagStyle}>#idiom</span>}
            </div>
            <div css={[cardStyle(type), isFlipped && cardFlippedStyle]} onClick={handleCardClick}>
                <div css={cardFrontStyle}>
                    <div css={getCardDataStyle(type, firstSide)}>
                        {type === '2_side' ? (
                            <>
                                <span>{ruValue}</span>
                                <span>{enValue}</span>
                            </>
                        ) : (
                            <>
                                {visible === 'ru' && <span>{ruValue}</span>}
                                {visible === 'en' && <span>{enValue}</span>}
                            </>
                        )}
                    </div>
                </div>
                <div css={cardBackStyle}>
                    <div css={getCardDataStyle(type, firstSide)}>
                        {type === '2_side' ? (
                            <>
                                <span>{enValue}</span>
                                <span>{ruValue}</span>
                            </>
                        ) : (
                            <>
                                {visible === 'ru' && <span>{ruValue}</span>}
                                {visible === 'en' && <span>{enValue}</span>}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
