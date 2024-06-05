import React, { useMemo, useState } from "react";
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
    const [cardType, setCardType] = useState<Collection>(Collection.VOCABULAR);

    const {
        data: [settings = { type: SettingsTypeEnum.SIDE_1, firstSide: SettingsfFrstSide.NATIVE, isLearning: true, isRepeat: false, repeatTime: 10000 }],
        onUpdate: settingsUpdate,
        isLoading: settingsLoading,
    } = useGetData<SettingsType>(Collection.SETTINGS);

    const {
        data: [{ lastCardId } = { lastCardId: 'rIH3KYFr8Jfc4oUbBTZE' }],
        onUpdate: studyingOnUpdate,
        isLoading: studyingIsLoading,
    } = useGetData<Studying>(Collection.STUDYING);

    const {
        data: sentencesData,
        onRemove: sentencesOnRemove,
        onUpdate: sentencesOnUpdate,
        onAdd: sentencesOnAdd,
        isLoading: sentencesIsLoading,
    } = useGetData<CardGet>(Collection.SENTENCES, { isLearning: settings.isLearning });

    const {
        data: vocabularData,
        onRemove: vocabularOnRemove,
        onUpdate: vocabularOnUpdate,
        onAdd: vocabularOnAdd,
        isLoading: vocabularIsLoading,
    } = useGetData<CardGet>(Collection.VOCABULAR, { isLearning: settings.isLearning });


    const isSentences = useMemo(() => cardType === Collection.SENTENCES, [cardType]);
    const currentData = useMemo(() => isSentences ? sentencesData : vocabularData, [isSentences, sentencesData, vocabularData]);
    const currentOnRemove = useMemo(() => isSentences ? sentencesOnRemove : vocabularOnRemove, [isSentences, sentencesOnRemove, vocabularOnRemove]);
    const currentOnUpdate = useMemo(() => isSentences ? sentencesOnUpdate : vocabularOnUpdate, [isSentences, sentencesOnUpdate, vocabularOnUpdate]);
    const currentOnAdd = useMemo(() => isSentences ? sentencesOnAdd : vocabularOnAdd, [isSentences, sentencesOnAdd, vocabularOnAdd]);

    const commonSettings = useMemo(() => ({
        isRepeat: settings.isRepeat,
        repeatTime: settings.repeatTime,
        isLearning: settings.isLearning,
        type: settings.type,
        firstSide: settings.firstSide,
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
                cardType={cardType}
                setCardType={setCardType}
            />
            <Settings
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


