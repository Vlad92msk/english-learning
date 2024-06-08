/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Collection, Settings as SettingsGET } from "../types";
import React from "react";

const learningList = css(`
    grid-area: learning-list;
    display: flex;
    flex-direction: column;
    gap: 5px;
 `)

const boxStyle = css(`
    display: flex;
    flex-direction: column;
    gap: 5px;
 `)

const learningButtonsStyle = css(`
    display: flex;
    gap: 5px;
    margin-bottom: 20px;
    
    button {
        flex-grow: 1
    }
 `)

const learningButtonStyle = (active: boolean) => css(`
    background: ${active ? 'rgba(4,162,187,0.42)' : 'transparent'}!important;
`)

const buttonStyle = (color?: string) => css(`
    background: ${color}!important;
`)
interface Props {
    cardType: Collection
    onUpdateSettings: (id: string, data: Partial<SettingsGET>) => Promise<void>
    sentencesCount: number
    vocabularCount: number
    isLearning: boolean
}
export const LearningList = React.memo((props: Props) => {
    const  { cardType, vocabularCount, sentencesCount, onUpdateSettings, isLearning  } = props
    return (
        <div css={learningList}>
            <div css={learningButtonsStyle}>
                <button css={learningButtonStyle(isLearning)} onClick={() => onUpdateSettings('ukHLQmUsw1eAof3mlxsU', {isLearning: true})}>Учу</button>
                <button css={learningButtonStyle(!isLearning)} onClick={() => onUpdateSettings('ukHLQmUsw1eAof3mlxsU', {isLearning: false})}>Выучил</button>
            </div>
            <div css={boxStyle}>
                <button
                    css={buttonStyle(cardType === Collection.SENTENCES ? '#1c3249' : 'transparent')}
                    onClick={() => onUpdateSettings('ukHLQmUsw1eAof3mlxsU', { lastView: Collection.SENTENCES })}
                >
                    Предложения ({sentencesCount})
                </button>
                <button
                    css={buttonStyle(cardType === Collection.VOCABULAR ? '#1c3249' : 'transparent')}
                    onClick={() => onUpdateSettings('ukHLQmUsw1eAof3mlxsU', { lastView: Collection.VOCABULAR })}
                >
                    Слова ({vocabularCount})
                </button>
            </div>
        </div>
    );
});
