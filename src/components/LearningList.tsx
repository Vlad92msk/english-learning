/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Collection } from "../types";
import React from "react";

const learningList = css(`
    grid-area: learning-list;
    display: flex;
    flex-direction: column;
    gap: 5px;
 `)

const buttonStyle = (color: string) => css(`
    background: ${color}!important;
`)
interface Props {
    cardType: Collection
    setCardType:  React.Dispatch<React.SetStateAction<Collection>>
    sentencesCount: number
    vocabularCount: number
}
export const LearningList = React.memo((props: Props) => {
    const  { setCardType, cardType, vocabularCount, sentencesCount  } = props
    return (
        <div css={learningList}>
            <button
                css={buttonStyle(cardType === Collection.SENTENCES ? '#1c3249' : 'transparent' )}
                onClick={() => setCardType(Collection.SENTENCES)}
            >
                Предложения ({sentencesCount})
            </button>
            <button
                css={buttonStyle(cardType === Collection.VOCABULAR ? '#1c3249' : 'transparent')}
                onClick={() => setCardType(Collection.VOCABULAR)}
            >
                Слова ({vocabularCount})
            </button>
        </div>
    );
});
