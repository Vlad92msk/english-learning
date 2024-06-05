import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  flex-direction: column;
  border: 1px solid #435367;
  background: #0d2136;
  
  button {
  z-index: 1;
    max-width: 50px;
    place-self: flex-end;
    border: 0!important;
    font-weight: 100!important;
    font-size: 10px!important;
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

const getCardDataStyle = (type: string, firstSide: string) => css`
  display: flex;
  height: 100%;
  flex-direction: column;
  ${type === SettingsTypeEnum.SIDE_1 && cardData1SideStyle};
  ${type === SettingsTypeEnum.SIDE_2 && cardData2SideStyle};
  ${firstSide === SettingsfFrstSide.NATIVE && cardDataFirstSideRuStyle};
  ${firstSide === SettingsfFrstSide.LEARNING && cardDataFirstSideEnStyle};
`;

interface CardProps {
    settings: SettingsGET
    lastCardId: string
    data: CardGET[]
    onRemove: (id: string) => Promise<void>
    onUpdate: (id: string, data: Partial<CardGET>) => Promise<void>
}

export const Card = React.memo((props: CardProps) => {
    const { data, lastCardId, onUpdate, onRemove, settings: { firstSide, type } } = props;
    const [visible, setVisible] = useState(firstSide);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isChangeNative, setIsChangeNative] = useState(false);
    const [isChangeLearning, setIsChangeLearning] = useState(false);


    const currentCard = useMemo(() => {
        if (data.length === 0) {
            return { isIdiom: false, enValue: '', ruValue: '', isPhrasalVerb: false, id: '' };
        }

        const currentIndex = lastCardId ? data.findIndex(card => card.id === lastCardId) : 0;
        return data[currentIndex >= 0 ? currentIndex : 0];
    }, [data, lastCardId]);

    const { isIdiom, enValue, ruValue, isPhrasalVerb, id } = currentCard;

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


    const nativeValueComponent = useMemo(() => {
        if (isChangeNative) {
            return (
                <div css={cardDataStyle}>
                    <input
                        onClick={event => event.stopPropagation()}
                        value={nativeValue}
                        onChange={event => setNativeValue(event.target.value)}
                    />
                    <button onClick={(event) => {
                        event.stopPropagation();
                        onUpdate(id, { ruValue: nativeValue });
                        setIsChangeNative(false);
                    }}>ok</button>
                </div>
            );
        }

        return (
            <div css={cardDataStyle}>
                <button onClick={(event) => { event.stopPropagation(); setIsChangeNative(true) }}>set</button>
                <span>{nativeValue}</span>
            </div>
        );
    }, [id, isChangeNative, nativeValue, onUpdate]);

    const learningValueComponent = useMemo(() => {
        if (isChangeLearning) {
            return (
                <div css={cardDataStyle}>
                    <input
                        onClick={event => event.stopPropagation()}
                        value={learningValue}
                        onChange={event => setLearningValue(event.target.value)}
                    />
                    <button onClick={(event) => {
                        event.stopPropagation();
                        onUpdate(id, { enValue: learningValue });
                        setIsChangeLearning(false);
                    }}
                    >
                        ok
                    </button>
                </div>
            );
        }

        return (
            <div css={cardDataStyle}>
                <button onClick={(event) => { event.stopPropagation(); setIsChangeLearning(true) }}>set</button>
                <span>{learningValue}</span>
            </div>
        );
    }, [id, isChangeLearning, learningValue, onUpdate]);

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
                    <button onClick={() => onRemove(id)}>x</button>
                </div>
            </div>
            <div css={[cardStyle(type), isFlipped && cardFlippedStyle]} onClick={handleCardClick}>
                <div css={cardFrontStyle}>
                    <div css={getCardDataStyle(type, firstSide)}>
                        {type === SettingsTypeEnum.SIDE_2 ? (
                            <>
                                {nativeValueComponent}
                                {learningValueComponent}
                            </>
                        ) : (
                            <>
                                {visible === SettingsfFrstSide.NATIVE && nativeValueComponent}
                                {visible === SettingsfFrstSide.LEARNING && learningValueComponent}
                            </>
                        )}
                    </div>
                </div>
                <div css={cardBackStyle}>
                    <div css={getCardDataStyle(type, firstSide)}>
                        {type === SettingsTypeEnum.SIDE_2 ? (
                            <>
                                {learningValueComponent}
                                {nativeValueComponent}
                            </>
                        ) : (
                            <>
                                {visible === SettingsfFrstSide.NATIVE && nativeValueComponent}
                                {visible === SettingsfFrstSide.LEARNING && learningValueComponent}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});
