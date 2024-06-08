import React, { useMemo } from "react";
import { LearningList } from "./components/LearningList";
import { Settings } from "./components/Settings";
import { Card } from "./components/Card";
import { Navigation } from "./components/Navigation";
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
    Card as CardGet,
    Collection,
    Settings as SettingsType,
    SettingsfFrstSide, SettingsTypeEnum, Studying
} from "./types";
import { useGetData } from "./hooks/useGetData";



const appStyle = css(`
  background-color: #031525;
  height: calc(100dvh - 100px);
  display: grid;
  padding: 50px;
  grid-template:
        "learning-list settings" auto
        "learning-list card" 1fr
        "learning-list navigation" 65px
        /auto          1fr ;
  column-gap: 30px;        
`)



function App() {
    const {
        data: [settings = { type: SettingsTypeEnum.SIDE_1, firstSide: SettingsfFrstSide.NATIVE, isLearning: true, isRepeat: false, repeatTime: 300000, lastView: Collection.VOCABULAR }],
        onUpdate: settingsUpdate,
    } = useGetData<SettingsType>(Collection.SETTINGS);

    const {
        data: [{ lastCardId: lastCardIdSentencs } = { lastCardId: '' }, {lastCardId: lastCardIdVocabular} = { lastCardId: '' }],
        onUpdate: studyingOnUpdate,
    } = useGetData<Studying>(Collection.STUDYING);

    const {
        data: sentencesData,
        onRemove: sentencesOnRemove,
        onUpdate: sentencesOnUpdate,
        onAdd: sentencesOnAdd,
    } = useGetData<CardGet>(Collection.SENTENCES, { isLearning: settings.isLearning });

    const {
        data: vocabularData,
        onRemove: vocabularOnRemove,
        onUpdate: vocabularOnUpdate,
        onAdd: vocabularOnAdd,
    } = useGetData<CardGet>(Collection.VOCABULAR, { isLearning: settings.isLearning });

    const isSentences = useMemo(() => settings.lastView === Collection.SENTENCES, [settings.lastView]);

    const currentData = useMemo(() => isSentences ? sentencesData : vocabularData, [isSentences, sentencesData, vocabularData]);
    const currentOnRemove = useMemo(() => isSentences ? sentencesOnRemove : vocabularOnRemove, [isSentences, sentencesOnRemove, vocabularOnRemove]);
    const currentOnUpdate = useMemo(() => isSentences ? sentencesOnUpdate : vocabularOnUpdate, [isSentences, sentencesOnUpdate, vocabularOnUpdate]);
    const currentOnAdd = useMemo(() => isSentences ? sentencesOnAdd : vocabularOnAdd, [isSentences, sentencesOnAdd, vocabularOnAdd]);
    const lastCardId = useMemo(() => isSentences ? lastCardIdSentencs : lastCardIdVocabular, [isSentences, lastCardIdSentencs, lastCardIdVocabular]);

    const commonSettings: SettingsType = useMemo(() => ({
        isRepeat: settings.isRepeat,
        repeatTime: settings.repeatTime,
        isLearning: settings.isLearning,
        type: settings.type,
        firstSide: settings.firstSide,
        lastView: settings.lastView
    }), [settings]);

    // console.log('cardType', cardType)
    // console.log('sentencesData', sentencesData)
    // console.log('vocabularData', vocabularData)
    // console.log('currentData', currentData)

    return (
        <div css={appStyle}>
            <LearningList
                sentencesCount={sentencesData.length || 0}
                vocabularCount={vocabularData.length || 0}
                cardType={commonSettings.lastView}
                onUpdateSettings={settingsUpdate}
                isLearning={settings.isLearning}
            />
            <Settings
                cardType={commonSettings.lastView}
                settings={commonSettings}
                onUpdate={settingsUpdate}
                onAdd={currentOnAdd}
            />
            <Card
                settings={commonSettings}
                lastCardId={lastCardId}
                data={currentData}
                onRemove={currentOnRemove}
                onUpdate={currentOnUpdate}
            />
            <Navigation
                cardType={commonSettings.lastView}
                lastCardId={lastCardId}
                onUpdate={studyingOnUpdate}
                data={currentData}
                cardUpdate={currentOnUpdate}
                settings={commonSettings}
            />
        </div>
    );
}
export default App;


