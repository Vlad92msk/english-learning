import React, { useCallback, useEffect, useState } from "react";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Card as CardGET } from "../types";
import { speakText } from "../utils/speakText";
import Icon from "./Icon";


const cardPanelStyle = css`
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
    right: 0;
    transform: translateX(calc(100% + 10px));
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

const cardDataButtonsStyle = css(`
    z-index: 1;
position: absolute;
right: 0;
  transform: translateX(10px);
    place-self: flex-end;
    right: 0!important;
    top: 0!important;
    display: flex;
    gap: 5px;
    justify-content: end;
    flex-direction: column;
    
    button {
        position: relative;
        border: 0!important;
        font-weight: 100!important;
        font-size: 10px!important;  
        width: 50%;
    }
    
`)
const copyButtonStyle = css`
    bottom: 0
`
const voiceButtonStyle = css`
    bottom: 50%;
    transform: translateY(50%);
`

interface CardPanelProps {
    isChangeNative?: boolean
    initialValue: string
    onUpdateCard: (id: string, updatedData: Partial<CardGET>) => void
    id: string
    lang?: 'en-US' | 'ru-RU'
}

export const CardPanel = (props: CardPanelProps) => {
    const { initialValue,  onUpdateCard, id, lang =  'en-US' } = props;
    const [currentValue, setCurrentValue] = useState(initialValue);

    useEffect(() => {
        if (currentValue !== initialValue) {
            setCurrentValue(initialValue)
        }
    }, [initialValue]);

    const [isChangeNative, setIsChangeNative] = useState(false);

    const handleVoice = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        speakText(currentValue, lang);
    },[currentValue, lang])

    const handleCopyNative = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        navigator.clipboard.writeText(currentValue).then(() => {
            console.log('Текст скопирован в буфер обмена');
        }).catch(err => {
            console.error('Ошибка при копировании текста:', err);
        });
    }, [currentValue])


    if (isChangeNative) {
        return (
            <div css={cardPanelStyle}>
                <input
                    onClick={event => event.stopPropagation()}
                    value={currentValue}
                    onChange={event => setCurrentValue(event.target.value)}
                />
                <div css={cardDataButtonsStyle}>
                    <button onClick={(event) => {
                        event.stopPropagation();
                        setCurrentValue(initialValue);
                        setIsChangeNative(false);
                    }}
                    >
                        x
                    </button>
                    <button onClick={(event) => {
                        event.stopPropagation();
                        onUpdateCard(id, {ruValue: currentValue});
                        setIsChangeNative(false);
                    }}>
                        ok
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div css={cardPanelStyle}>
            <button onClick={(event) => {
                event.stopPropagation();
                setIsChangeNative(true)
            }}>
                <Icon name={'pencil'} />
            </button>
            <button css={copyButtonStyle} onClick={(e) => handleCopyNative(e)}>
                <Icon  name="copy"/>
            </button>
            <button css={voiceButtonStyle} onClick={(e) => handleVoice(e)}>
                <Icon  name="sound"/>
            </button>
            <span>{currentValue}</span>
        </div>
    );

}
