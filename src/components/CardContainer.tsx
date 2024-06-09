import { Card as CardGET, SettingsfFrstSide, SettingsTypeEnum } from "../types";
import React, { useCallback, useMemo, useState } from "react";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { CardPanel } from "./CardPanel";


const cardStyle = (type: string) => css`
  width: 100%;
  height: calc(100% - 70px);
  position: absolute;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  gap: 10px;
  cursor: ${type === SettingsTypeEnum.SIDE_1 ? 'pointer' : 'default'};
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
`;

const cardBackStyle = css`
  ${cardItemStyle};
  transform: rotateY(180deg);
`;

const cardData1SideStyle = css`
  position: relative;

  span {
    position: absolute;
    height: calc(100% - 24px);
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

const cardDataFirstSideRuStyle = css`
  flex-direction: column;
  gap: 5px;
`;

const cardDataFirstSideEnStyle = css`
  flex-direction: column-reverse;
  gap: 5px;
`;

const getCardDataStyle = (type: string, firstSide: string) => css`
  display: flex;
  height: 100%;
  flex-direction: column;
  ${type === SettingsTypeEnum.SIDE_1 && cardData1SideStyle};
  ${type === SettingsTypeEnum.SIDE_2 && cardData2SideStyle};
  ${firstSide === SettingsfFrstSide.NATIVE && cardDataFirstSideRuStyle};
  ${firstSide === SettingsfFrstSide.LEARNING && cardDataFirstSideEnStyle};
`;

interface CardContainerProps {
    card: CardGET
    type:  SettingsTypeEnum
    firstSide: SettingsfFrstSide
    ruValue: string
    enValue: string
    onUpdateCard: (id: string, updatedData: Partial<CardGET>) => void
}

export const CardContainer = (props: CardContainerProps) => {
    const { type, firstSide, ruValue, enValue, onUpdateCard, card } = props
    const { id } = card
// console.log('card', card)


    const [visible, setVisible] = useState(firstSide);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleCardClick = useCallback(() => {
        if (type === SettingsTypeEnum.SIDE_1) {
            setVisible(prev => (prev === SettingsfFrstSide.NATIVE ? SettingsfFrstSide.LEARNING : SettingsfFrstSide.NATIVE));
            setIsFlipped(!isFlipped);
        }
    }, [isFlipped, type]);

    const commonPanels = useMemo(() => ({
        native: (
            <CardPanel
                initialValue={ruValue}
                lang={'ru-RU'}
                onUpdateCard={onUpdateCard}
                id={id}
            />
        ),
        learning: (
            <CardPanel
                initialValue={enValue}
                lang={'ru-RU'}
                id={id}
                onUpdateCard={onUpdateCard}
            />
        ),
    }), [enValue, ruValue, onUpdateCard, id]);


    const currentPanel = useMemo(() => ({
        [SettingsTypeEnum.SIDE_2]: <>
            {commonPanels[SettingsfFrstSide.NATIVE]}
            {commonPanels[SettingsfFrstSide.LEARNING]}
        </>,
        [SettingsTypeEnum.SIDE_1]: <>
            {commonPanels[visible]}
        </>,
    }), [commonPanels, visible]);

    return (
        <div css={[cardStyle(type), isFlipped && cardFlippedStyle]} onClick={handleCardClick}>
            <div css={cardFrontStyle}>
                <div css={getCardDataStyle(type, firstSide)}>
                    {currentPanel[type]}
                </div>
            </div>
            <div css={cardBackStyle}>
                <div css={getCardDataStyle(type, firstSide)}>
                    {currentPanel[type]}
                </div>
            </div>
        </div>
    )
}
