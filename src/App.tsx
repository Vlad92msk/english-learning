import React from "react";
import { LearningList } from "./components/LearningList";
import { Settings } from "./components/Settings";
import { Card } from "./components/Card";
import { Navigation } from "./components/Navigation";
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const appStyle = css(`
  background-color: #031525;
  height: calc(100dvh - 100px);
  display: grid;
  padding: 50px;
  grid-template:
        "learning-list settings" auto
        "learning-list card" 1fr
        "learning-list navigation" 50px
        /auto          1fr ;`)
function App() {
    return (
        <div css={appStyle}>
            <LearningList />
            <Settings />
            <Card />
            <Navigation />
        </div>

    );
}

export default App;


