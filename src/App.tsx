import React, { useState } from "react";
import { LearningList } from "./components/LearningList";
import { Settings } from "./components/Settings";
import { Card } from "./components/Card";
import { Navigation } from "./components/Navigation";
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Collection } from "./types";

const appStyle = css(`
  background-color: #031525;
  height: calc(100dvh - 100px);
  display: grid;
  padding: 50px;
  grid-template:
        "learning-list settings" auto
        "learning-list card" 1fr
        "learning-list navigation" 50px
        /auto          1fr ;
  column-gap: 30px;        
`)


function App() {
    const [cardType, setCardType] = useState<Collection>(Collection.VOCABULAR)
    return (
        <div css={appStyle}>
            <LearningList cardType={cardType} setCardType={setCardType} />
            <Settings cardType={cardType} />
            <Card cardType={cardType} />
            <Navigation cardType={cardType} />
        </div>

    );
}

export default App;


