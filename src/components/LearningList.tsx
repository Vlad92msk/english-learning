/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const learningList = css(`
 grid-area: learning-list;
 `)

export const LearningList = () => {
    return (
        <div
            css={learningList}
        >
            LearningList
        </div>
    );
};
