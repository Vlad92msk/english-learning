import React, { useCallback, useEffect, useMemo, useState } from "react";
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Card as CardGET, Settings as SettingsGET, SettingsfFrstSide, SettingsTypeEnum } from "../types";

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
  cursor: ${type === SettingsTypeEnum.SIDE_1 ? 'pointer': 'default'};
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
  ${type === SettingsTypeEnum.SIDE_1 && cardData1SideStyle};
  ${type === SettingsTypeEnum.SIDE_2 && cardData2SideStyle};
  ${firstSide === SettingsfFrstSide.NATIVE && cardDataFirstSideRuStyle};
  ${firstSide === SettingsfFrstSide.LEARNING && cardDataFirstSideEnStyle};
`;

interface CardProps {
    settings: SettingsGET
    lastCardId: string
    data: CardGET[]
    onRemove:  (id: string) => Promise<void>
    onUpdate: (id: string, data: Partial<CardGET>) => Promise<void>
}

export const Card = React.memo((props: CardProps) => {
    const { data, lastCardId, onUpdate, onRemove, settings: { isLearning, firstSide, type } } = props;
    const [visible, setVisible] = useState(firstSide);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        if (firstSide.length) {
            setVisible(firstSide);
        }
    }, [firstSide]);

    const cards = useMemo(() => {
        return data.filter(({ isLearning: learning }) => learning === isLearning);
    }, [data, isLearning]);

    const currentCard = useMemo(() => {
        if (cards.length === 0) {
            return { isIdiom: false, enValue: '', ruValue: '', isPhrasalVerb: false, id: '' };
        }

        const currentIndex = lastCardId ? cards.findIndex(card => card.id === lastCardId) : 0;
        return cards[currentIndex >= 0 ? currentIndex : 0];
    }, [cards, lastCardId]);

    const { isIdiom, enValue, ruValue, isPhrasalVerb, id } = currentCard;

    const handleUpdatePartialVerbs = useCallback(() => {
        onUpdate(id, { isPhrasalVerb: !isPhrasalVerb });
    }, [id, isPhrasalVerb, onUpdate]);

    const handleUpdateIdiom = useCallback(() => {
        onUpdate(id, { isIdiom: !isIdiom });
    }, [id, isIdiom, onUpdate]);

    const handleCardClick = useCallback(() => {
        if (type === SettingsTypeEnum.SIDE_1) {
            setVisible(prev => (prev === SettingsfFrstSide.NATIVE ? SettingsfFrstSide.LEARNING : SettingsfFrstSide.NATIVE));
            setIsFlipped(!isFlipped);
        }
    }, [isFlipped, type]);

    return (
        <div css={cardContainerStyle}>
            <div css={metaRowStyle}>
                <div css={cardTagsStyle}>
                    {isPhrasalVerb && <span css={tagStyle}>#phrasal verb</span>}
                    {isIdiom && <span css={tagStyle}>#idiom</span>}
                </div>
                <div css={cardTagsStyle}>
                    <button onClick={handleUpdatePartialVerbs}>
                        {isPhrasalVerb ? 'no partial verb' : 'partial verb'}
                    </button>
                    <button onClick={handleUpdateIdiom}>
                        {isIdiom ? 'no idiom' : 'idiom'}
                    </button>
                    <button onClick={() => onRemove(id)}>x</button>
                </div>
            </div>
            <div css={[cardStyle(type), isFlipped && cardFlippedStyle]} onClick={handleCardClick}>
                <div css={cardFrontStyle}>
                    <div css={getCardDataStyle(type, firstSide)}>
                        {type === SettingsTypeEnum.SIDE_2 ? (
                            <>
                                <span>{ruValue}</span>
                                <span>{enValue}</span>
                            </>
                        ) : (
                            <>
                                {visible === SettingsfFrstSide.NATIVE && <span>{ruValue}</span>}
                                {visible === SettingsfFrstSide.LEARNING && <span>{enValue}</span>}
                            </>
                        )}
                    </div>
                </div>
                <div css={cardBackStyle}>
                    <div css={getCardDataStyle(type, firstSide)}>
                        {type === SettingsTypeEnum.SIDE_2 ? (
                            <>
                                <span>{enValue}</span>
                                <span>{ruValue}</span>
                            </>
                        ) : (
                            <>
                                {visible === SettingsfFrstSide.NATIVE && <span>{ruValue}</span>}
                                {visible === SettingsfFrstSide.LEARNING && <span>{enValue}</span>}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
})
