import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Card as CardGET, Settings as SettingsGET, SettingsfFrstSide, SettingsTypeEnum } from "../types";

const cardContainerStyle = css`
  perspective: 10000px;
  height: 100%;
  position: relative;
  span {
  pointer-events: none
  }
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

const cardDataButtonsStyle = css(`
    z-index: 1;
    max-width: 70px;
    width: 100%;
    place-self: flex-end;
    position: absolute;
    right: 0!important;
    top: 0!important;
    display: flex;
    gap: 5px;
    justify-content: end;
    
    button {
        position: relative;
        border: 0!important;
        font-weight: 100!important;
        font-size: 10px!important;  
        width: 50%;
    }
    
`)

const cardDataStyle = css`
  display: flex;
  height: 100%;
  flex-direction: column;
  border: 1px solid #435367;
  background: #0d2136;
  position: relative;
  
  input {
    width: calc(100% - 100px);
  }
  
  button {
    position: absolute;
    z-index: 1;
    border: 0!important;
    font-weight: 100!important;
    font-size: 10px!important;  
    width: 40px;
    right: 0
  }
    
  span {
    font-size: 2em!important;
     position: absolute;
     background: #0d2136;
     position: absolute;
     left: 0;
     right: 0;
     top: 0;
     bottom: 0;
     text-align: center;
     
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

const copyButtonStyle = css`
    bottom: 0
`

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
    lastCardId?: string
    cards: CardGET[]
    onRemoveCard: (id: string) => Promise<void>
    onUpdateCard: (id: string, updatedData: Partial<CardGET>) => void
}

export const Card = React.memo((props: CardProps) => {
    const { cards, lastCardId, onUpdateCard, onRemoveCard, settings: { firstSide, type } } = props;
    const [visible, setVisible] = useState(firstSide);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isChangeNative, setIsChangeNative] = useState(false);
    const [isChangeLearning, setIsChangeLearning] = useState(false);


    const currentCard = useMemo(() => {
        if (cards.length === 0) {
            return { isIdiom: false, enValue: '', ruValue: '', isPhrasalVerb: false, id: '' };
        }
        const currentIndex = lastCardId ? cards.findIndex(card => card.id === lastCardId) : 0;

        return cards[currentIndex >= 0 ? currentIndex : 0];
    }, [cards, lastCardId]);

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
        onUpdateCard(id, { isPhrasalVerb: !isPhrasalVerb });
    }, [id, isPhrasalVerb, onUpdateCard]);

    const handleUpdateIdiom = useCallback(() => {
        onUpdateCard(id, { isIdiom: !isIdiom });
    }, [id, isIdiom, onUpdateCard]);

    const handleCardClick = useCallback(() => {
        if (type === SettingsTypeEnum.SIDE_1) {
            setVisible(prev => (prev === SettingsfFrstSide.NATIVE ? SettingsfFrstSide.LEARNING : SettingsfFrstSide.NATIVE));
            setIsFlipped(!isFlipped);
        }
    }, [isFlipped, type]);

    const handleCopyNative = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        navigator.clipboard.writeText(nativeValue).then(() => {
            console.log('Текст скопирован в буфер обмена');
        }).catch(err => {
            console.error('Ошибка при копировании текста:', err);
        });
    }, [nativeValue])

    const handleCopyLearning = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        navigator.clipboard.writeText(learningValue).then(() => {
            console.log('Текст скопирован в буфер обмена');
        }).catch(err => {
            console.error('Ошибка при копировании текста:', err);
        });
    }, [learningValue])


    const nativeValueComponent = useMemo(() => {
        if (isChangeNative) {
            return (
                <div css={cardDataStyle}>
                    <input
                        onClick={event => event.stopPropagation()}
                        value={nativeValue}
                        onChange={event => setNativeValue(event.target.value)}
                    />
                    <div css={cardDataButtonsStyle}>
                        <button onClick={(event) => {
                            event.stopPropagation();
                            setNativeValue(ruValue);
                            setIsChangeNative(false);
                        }}
                        >
                            x
                        </button>
                        <button onClick={(event) => {
                            event.stopPropagation();
                            onUpdateCard(id, {ruValue: nativeValue});
                            setIsChangeNative(false);
                        }}>
                            ok
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div css={cardDataStyle}>
                <button onClick={(event) => {
                    event.stopPropagation();
                    setIsChangeNative(true)
                }}>
                    set
                </button>
                <button css={copyButtonStyle} onClick={(e) => handleCopyNative(e)}>copy</button>
                <span>{nativeValue}</span>
            </div>
        );
    }, [handleCopyNative, id, isChangeNative, nativeValue, onUpdateCard, ruValue]);

    const learningValueComponent = useMemo(() => {
        if (isChangeLearning) {
            return (
                <div css={cardDataStyle}>
                    <input
                        onClick={event => event.stopPropagation()}
                        value={learningValue}
                        onChange={event => setLearningValue(event.target.value)}
                    />
                    <div css={cardDataButtonsStyle}>
                    <button onClick={(event) => {
                        event.stopPropagation();
                        setLearningValue(enValue);
                        setIsChangeLearning(false);
                    }}
                    >
                        x
                    </button>
                    <button onClick={(event) => {
                        event.stopPropagation();
                        onUpdateCard(id, {enValue: learningValue});
                        setIsChangeLearning(false);
                    }}
                    >
                        ok
                    </button>
                        </div>
                </div>
            );
        }

        return (
            <div css={cardDataStyle}>
                <button onClick={(event) => {
                    event.stopPropagation();
                    setIsChangeLearning(true)
                }}>
                    set
                </button>
                <button css={copyButtonStyle} onClick={(e) => handleCopyLearning(e)}>copy</button>
                <span>{learningValue}</span>
            </div>
        );
    }, [handleCopyLearning, enValue, id, isChangeLearning, learningValue, onUpdateCard]);


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
