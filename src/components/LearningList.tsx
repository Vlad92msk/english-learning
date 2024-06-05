/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Card as CardGET, Collection } from "../types";
import { useWatch } from "../hooks/useWatch";

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
}
export const LearningList = (props: Props) => {
    const  { setCardType, cardType  } = props
    const sentences = useWatch<CardGET>(Collection.SENTENCES);
    const vocabular = useWatch<CardGET>(Collection.VOCABULAR);
    return (
        <div css={learningList}>
            <button css={buttonStyle(cardType === Collection.SENTENCES ? '#1c3249' : 'transparent' )} onClick={() => setCardType(Collection.SENTENCES)}>Предложения ({sentences?.length || 0})</button>
            <button css={buttonStyle(cardType === Collection.VOCABULAR ? '#1c3249' : 'transparent')} onClick={() => setCardType(Collection.VOCABULAR)}>Слова ({vocabular?.length || 0})</button>
        </div>
    );
};
