import React, { useEffect, useState } from "react";
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useWatch } from "../hooks/useWatch";
import { Collection, Settings, Studying, Card as CardGET } from "../types";
import { useGetData } from "../hooks/useGetData";

const cardContainerStyle = css`
  perspective: 10000px;
  height: 100%;
  position: relative;
`;

const cardStyle = (type: string) => css`
  width: 100%;
  height: calc(100% - 70px);
  position: absolute;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  border: 1px solid #435367;
  cursor: ${type === '1_side' ? 'pointer': 'default'};
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
  padding: 20px 0 5px 0;
  
  button {
    font-size: 10px!important;
  }
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
    overflow-y: auto;
  }
`;

const cardData2SideStyle = css`
  span {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-y: auto;
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

const metaRowStyle = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
const getCardDataStyle = (type: string, firstSide: string) => css`
  ${cardDataStyle};
  ${type === '1_side' && cardData1SideStyle};
  ${type === '2_side' && cardData2SideStyle};
  ${firstSide === 'ru' && cardDataFirstSideRuStyle};
  ${firstSide === 'en' && cardDataFirstSideEnStyle};
`;

interface CardProps {
    cardType: Collection
}

export const Card = (props: CardProps) => {
    const { cardType } = props;
    const [{ type, firstSide, isLearning } = { type: '', firstSide: '', isLearning: true }] = useWatch<Settings>(Collection.SETTINGS);
    const [{ lastCardId } = { lastCardId: 'rIH3KYFr8Jfc4oUbBTZE' }] = useWatch<Studying>(Collection.STUDYING);
    const [visible, setVisible] = useState(firstSide);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        if (firstSide.length) {
            setVisible(firstSide);
        }
    }, [firstSide]);

    const cards = useWatch<CardGET>(cardType, { isLearning });
    const {onRemove, onUpdate} = useGetData<CardGET>(cardType);

    if (!cards?.length) return null

    const currentIndex = lastCardId ? cards.findIndex(card => card.id === lastCardId) : 0;

    const { isIdiom, enValue, ruValue, isPhrasalVerb, id } = cards[currentIndex > 0 ? currentIndex : 0];
    const handleCardClick = () => {
        if (type === '1_side') {
            setVisible(prev => (prev === 'ru' ? 'en' : 'ru'));
            setIsFlipped(!isFlipped);
        }
    };

    return (
        <div css={cardContainerStyle}>
            <div css={metaRowStyle}>
                <div css={cardTagsStyle}>
                    {isPhrasalVerb && <span css={tagStyle}>#phrasal verb</span>}
                    {isIdiom && <span css={tagStyle}>#idiom</span>}
                </div>
                <div css={cardTagsStyle}>
                    <button onClick={() => { onUpdate(id, {isPhrasalVerb: !isPhrasalVerb}) }}>
                        {isPhrasalVerb ? 'no partial verb' : 'partial verb'}
                    </button>
                    <button onClick={() => { onUpdate(id, {isIdiom: !isIdiom}) }}>
                        {isIdiom ? 'no idiom' : 'idiom'}
                    </button>
                    <button onClick={() => onRemove(id)}>x</button>
                </div>
                {/*<div css={{ display: 'flex', gap: '5px', alignItems: 'center' }}>*/}
                {/*    <span css={{ fontSize: '10px' }}>Синонимы</span>*/}
                {/*    <select>*/}
                {/*        <option>word1</option>*/}
                {/*        <option>word2</option>*/}
                {/*        <option>word3</option>*/}
                {/*    </select>*/}
                {/*</div>*/}
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
