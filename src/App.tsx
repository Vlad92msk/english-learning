import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Settings } from "./components/Settings";
import { Card } from "./components/Card";
import { Navigation } from "./components/Navigation";
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
    Card as CardGet,
    Collection,
    Settings as SettingsType,
    SettingsfFrstSide,
    SettingsTypeEnum,
    Studying
} from "./types";
import { getData } from "./utils/getData";
import { updateData } from "./utils/updateData";
import { addData } from "./utils/addData";
import { deleteData } from "./utils/deleteData";
import { readLocalFileWithMeta } from "./utils/readExcel";
import Icon from "./components/Icon";
import { Table } from "./components/Table";


const appStyle = css(`
  background-color: #031525;
  height: calc(100dvh - 100px);
  display: flex;
  padding: 50px;
  flex-direction: column;
  column-gap: 30px;    
  position: relative;
      
  @media (max-width: 500px) {
      padding: 10px;
  }
`)
const settingsContainerStyle = (isCompact: boolean) => css`
    opacity: ${isCompact ? 0 : 1};
    position: fixed;
    top: 0;
    bottom: 0;
    background: #031525;
    padding: 20px;
    z-index: 999;
    transition: 1s;
    transform: ${isCompact ? 'translateX(-100%)' : 'translateX(0)'};
    display: flex;
    flex-direction: column;
    gap: 5%;
`

const settingsInitial: SettingsType = {
    lastView: Collection.VOCABULAR,
    isLearning: true,
    type: SettingsTypeEnum.SIDE_2,
    firstSide: SettingsfFrstSide.NATIVE,
    isRepeat: false,
    repeatTime: 60000,
}

const localStudyingInitial: Studying = {
    lastCardId: ''
}


function App() {
    const [localSettings, setLocalSettings] = useState<{ initial: SettingsType, changed: SettingsType }>({ changed: settingsInitial, initial: settingsInitial });
    const [localStudying, setLocalStudying] = useState<{
        initial: { [Collection.VOCABULAR]: Studying, [Collection.SENTENCES]: Studying },
        changed: { [Collection.VOCABULAR]: Studying, [Collection.SENTENCES]: Studying }
    }>({
        changed: { [Collection.VOCABULAR]: localStudyingInitial, [Collection.SENTENCES]: localStudyingInitial },
        initial: { [Collection.VOCABULAR]: localStudyingInitial, [Collection.SENTENCES]: localStudyingInitial }
    });
    const [localSentences, setLocalSentences] = useState<CardGet[]>([]);
    const [localVocabular, setLocalVocabular] = useState<CardGet[]>([]);


    // Function to fetch and set all initial data
    useEffect(() => {
        let isMounted = true; // флаг отмены

        const fetchData = async () => {
            let sentences: CardGet[];
            let vocabular: CardGet[];

            let settings: SettingsType[];
            let studying: Studying[];
                try {
                    settings = await getData<SettingsType>(Collection.SETTINGS);
                } catch (error) {
                    // console.error("Error fetching sentences from database:", error);
                    settings = [settingsInitial];
                }

                try {
                    studying = await getData<Studying>(Collection.STUDYING);
                } catch (error) {
                    // console.error("Error fetching sentences from database:", error);
                    studying = [localStudyingInitial];
                }

                try {
                    sentences = await getData<CardGet>(Collection.SENTENCES, { isLearning: settings[0].isLearning });
                } catch (error) {
                    // console.error("Error fetching sentences from database:", error);
                    sentences = await readLocalFileWithMeta<CardGet>("mock/sentences.xlsx");
                }

                try {
                    vocabular = await getData<CardGet>(Collection.VOCABULAR, { isLearning: settings[0].isLearning });
                } catch (error) {
                    // console.error("Error fetching vocabular from database:", error);
                    vocabular = await readLocalFileWithMeta<CardGet>("mock/vocabular.xlsx");
                }

                if (isMounted) {
                    setLocalSettings({ initial: settings[0], changed: settings[0] });
                    setLocalStudying({ initial: { [Collection.VOCABULAR]: studying[0], [Collection.SENTENCES]: studying[0] }, changed: { [Collection.VOCABULAR]: studying[0], [Collection.SENTENCES]: studying[0] } });
                    setLocalSentences(sentences);
                    setLocalVocabular(vocabular);
                }

        };

        fetchData();

        return () => {
            isMounted = false; // отменяем монтирование
        };
    }, []);

    // Update local settings
    const handleSettingsUpdate = useCallback((updatedSettings: Partial<SettingsType>) => {
        setLocalSettings(prev => ({ ...prev, changed: {...prev.changed, ...updatedSettings } }));
    }, []);

    // Update local studying progress
    const handleStudyingUpdate = useCallback((updatedStudying: Partial<Studying>) => {
        setLocalStudying(prev => ({
            ...prev,
            changed: {
                ...prev.changed,
                [localSettings.changed.lastView]:
                    {
                        ...prev.changed[localSettings.changed.lastView],
                        ...updatedStudying
                    }
            }
        }));
    }, [localSettings.changed.lastView]);

    // Update local sentences data
    const handleSentencesUpdate = useCallback((id: string, updatedData: Partial<CardGet>) => {
        setLocalSentences(prev => prev.map(item => item.id === id ? { ...item, ...updatedData } : item));
        updateData<CardGet>(Collection.SENTENCES, id, updatedData);
    }, []);

    // Update local vocabular data
    const handleVocabularUpdate = useCallback((id: string, updatedData: Partial<CardGet>) => {
        setLocalVocabular(prev => prev.map(item => item.id === id ? { ...item, ...updatedData } : item));
        updateData(Collection.VOCABULAR, id, updatedData);
    }, []);

    // Update database periodically
    useEffect(() => {
        const interval = setInterval(() => {
            if (JSON.stringify(localSettings.changed) !== JSON.stringify(localSettings.initial)) {
                updateData(Collection.SETTINGS, 'settings', localSettings.changed);
            }

            if (JSON.stringify(localStudying.changed) !== JSON.stringify(localStudying.initial)) {
                updateData(Collection.STUDYING, localSettings.changed.lastView, localStudying.changed[localSettings.changed.lastView]);
            }
        }, 300000); // 5 minutes

        return () => clearInterval(interval);
    }, [localSettings, localStudying]);


    const { currentCards, onUpdateCards } = useMemo(() => {
        if (localSettings.changed?.lastView === Collection.SENTENCES) return (
            {
                currentCards: localSentences.filter(({ isLearning }) => isLearning === localSettings.changed.isLearning),
                onUpdateCards: handleSentencesUpdate
            }
        )
        else return (
            {
                currentCards: localVocabular.filter(({isLearning}) => isLearning === localSettings.changed.isLearning),
                onUpdateCards: handleVocabularUpdate
            }
        )
    }, [handleSentencesUpdate, handleVocabularUpdate, localSentences, localSettings.changed.isLearning, localSettings.changed?.lastView, localVocabular]);

    const [isCompact, setCompact] = useState(true)
    const [isFocus, setIsFocus] = useState(false)
    const [isTableView, setIsTableView] = useState(false)

    return (
        <>
            <div css={appStyle}>
                <div css={{ display: 'flex', gap: '1rem' }}>
                    <button css={{width: 'fit-content', display: 'flex'}} onClick={() => setCompact(prev => !prev)}>
                        <Icon name='menu-burger'/>
                    </button>
                    {!isTableView && (
                        <button
                            css={{
                                display: 'flex',
                                position: isFocus ? 'fixed' : 'relative',
                                left: isFocus ? '50vw' : 0,
                                transform: isFocus ? 'translateX(-50%)' : 'translateX(0)',
                                zIndex: isFocus ? 2000 : 99,
                                top: isFocus ? '20px' : 0,
                                background: isFocus ? '#0d2136!important' : 'transparent',
                                width: isFocus ? '100px' : 'fit-content',
                                height: isFocus ? '30px' : 'fit-content',
                            }}
                            onClick={() => setIsFocus(prev => !prev)}
                        >
                            <Icon name='focus'/>
                        </button>
                    )}
                </div>
                {!isTableView && (
                    <button
                        css={{position: 'absolute', left: '50%', display: 'flex', borderWidth: '0!important'}}
                        onClick={() => handleSettingsUpdate({isRepeat: !localSettings.changed.isRepeat})}
                    >
                        <Icon name={localSettings.changed.isRepeat ? 'pause' : 'play'}/>
                    </button>
                )}
                {isTableView ? (
                    <Table cards={currentCards} onUpdateCard={onUpdateCards}/>
                ) : (
                    <Card
                        isFocus={isFocus}
                        settings={localSettings.changed}
                        lastCardId={localStudying.changed[localSettings.changed.lastView].lastCardId}
                        cards={currentCards}
                        onRemoveCard={(id) => deleteData(localSettings.changed.lastView, id)}
                        onUpdateCard={onUpdateCards}
                    />
                )}
                <div css={{ display: (isFocus || isTableView) ? 'none' : 'block', pointerEvents: isFocus ? 'none' : 'auto' }}>
                    <Navigation
                        lastCardId={localStudying.changed[localSettings.changed.lastView].lastCardId}
                        onStudyingUpdate={handleStudyingUpdate}
                        cards={currentCards}
                        onCardUpdate={onUpdateCards}
                        settings={localSettings.changed}
                    />
                </div>
            </div>
            <div css={settingsContainerStyle(isCompact)}>
                <button css={{marginLeft: 'auto!important'}} onClick={() => setCompact(prev => !prev)}>x</button>
                <Settings
                    isTableView={isTableView}
                    setIsTableView={setIsTableView}
                    cards={currentCards}
                    sentencesCount={localSentences.length || 0}
                    vocabularCount={localVocabular.length || 0}
                    onUpdateSettings={handleSettingsUpdate}
                    isLearning={localSettings.changed?.isLearning}
                    cardType={localSettings.changed.lastView}
                    settings={localSettings.changed}
                    onSettingsUpdate={handleSettingsUpdate}
                    onAddNewCard={(data) => addData(localSettings.changed.lastView, data)}
                />
            </div>
        </>
    )
        ;
}

export default App;


