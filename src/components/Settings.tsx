import React, { useCallback } from "react";
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Card, Collection, Settings as SettingsGET, SettingsfFrstSide, SettingsTypeEnum } from "../types";
import { uploadExcelData } from "../utils/uploadExcelData";
import { downloadExcel } from "../utils/downloadExcel";

const settingsStyle = css(`
    display: flex;
    gap: 10px;
    font-size: 13px;
    flex-direction: column;
    height: 100%;
    gap: 5%;
`)


const radioGroupStyle = css`
    display: flex;
    gap: 10px;
    flex-direction: column;
`

const radioLabelStyle = css`
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
`
const uploadBoxStyle = css`
    gap: 10px;
    display: flex;
    width: 100%;
    justify-content: space-around;
    margin-top: auto;
    height: 50px;
    
    > * {
        flex-grow: 1;
        height: 100%;
    }
`

const boxStyle = css(`
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 150px;
    height: 62px;
    margin-right: 5px;
    padding-right: 15px;
    
    button {
        flex-grow: 1
    }
 `)

const boxGroupStyle = css(`
    width: 100%;
    justify-content: start;
    display: flex;
    gap: 20px;
`)


const learningButtonStyle = (active: boolean) => css(`
    background: ${active ? 'rgba(4,162,187,0.42)' : 'transparent'}!important;
`)

const buttonStyle = (color?: string) => css(`
    background: ${color}!important;
`)

interface SettingsProps {
    isTableView: boolean
    setIsTableView: React.Dispatch<React.SetStateAction<boolean>>
    onUpdateSettings: (updatedSettings: Partial<SettingsGET>) => void
    sentencesCount: number
    vocabularCount: number
    isLearning: boolean
    cardType: Collection
    settings: SettingsGET
    onAddNewCard:  (data: Card) => Promise<void>
    onSettingsUpdate: (updatedSettings: Partial<SettingsGET>) => void
    cards: Card[]
}
export const Settings = React.memo((props: SettingsProps) => {
    const {
        settings,
        onAddNewCard,
        onSettingsUpdate,
        cardType,
        onUpdateSettings,
        isLearning,
        vocabularCount,
        sentencesCount,
        cards,
        setIsTableView,
        isTableView
    } = props;
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleDownloadExcel = () => {
        downloadExcel(cards)
    };

    const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await uploadExcelData<Card>(file, cardType, cards);
        }
    }, [cardType, cards])

    return (
        <div css={settingsStyle}>
            <div css={boxGroupStyle}>
                <div css={boxStyle}>
                    <button css={learningButtonStyle(isLearning)}
                            onClick={() => onUpdateSettings({isLearning: true})}>Учу
                    </button>
                    <button css={learningButtonStyle(!isLearning)}
                            onClick={() => onUpdateSettings({isLearning: false})}>Выучил
                    </button>
                </div>
                <div css={boxStyle}>
                    <button
                        css={buttonStyle(cardType === Collection.SENTENCES ? '#1c3249' : 'transparent')}
                        onClick={() => onUpdateSettings({lastView: Collection.SENTENCES})}
                    >
                        Предложения ({sentencesCount})
                    </button>
                    <button
                        css={buttonStyle(cardType === Collection.VOCABULAR ? '#1c3249' : 'transparent')}
                        onClick={() => onUpdateSettings({lastView: Collection.VOCABULAR})}
                    >
                        Слова ({vocabularCount})
                    </button>
                </div>
            </div>
            <div css={boxGroupStyle}>
                <div css={boxStyle}>
                    <span>Показывать</span>
                    <div css={radioGroupStyle}>
                        <label css={radioLabelStyle}>
                            <input
                                type="radio"
                                checked={settings?.type === SettingsTypeEnum.SIDE_1}
                                onChange={() => onSettingsUpdate({type: SettingsTypeEnum.SIDE_1})}
                            />
                            1 сторону
                        </label>
                        <label css={radioLabelStyle}>
                            <input
                                type="radio"
                                checked={settings?.type === SettingsTypeEnum.SIDE_2}
                                onChange={() => onSettingsUpdate({type: SettingsTypeEnum.SIDE_2})}
                            />
                            2 стороны
                        </label>
                    </div>
                </div>
                {settings?.type === SettingsTypeEnum.SIDE_2 && (
                    <div css={boxStyle}>
                        <span>Первая сторона</span>
                        <div css={radioGroupStyle}>
                            <label css={radioLabelStyle}>
                                <input
                                    type="radio"
                                    checked={settings?.firstSide === SettingsfFrstSide.NATIVE}
                                    onChange={() => onSettingsUpdate({firstSide: SettingsfFrstSide.NATIVE})}
                                />
                                ru
                            </label>
                            <label css={radioLabelStyle}>
                                <input
                                    type="radio"
                                    checked={settings?.firstSide === SettingsfFrstSide.LEARNING}
                                    onChange={() => onSettingsUpdate({firstSide: SettingsfFrstSide.LEARNING})}
                                />
                                en
                            </label>
                        </div>
                    </div>
                )}
            </div>
            <div css={boxGroupStyle}>
                <div css={boxStyle}>
                    <span>Листать</span>
                    <div css={radioGroupStyle}>
                        <label css={radioLabelStyle}>
                            <input
                                type="radio"
                                checked={settings?.isRepeat === true}
                                onChange={() => onSettingsUpdate({isRepeat: true})}
                            />
                            Да
                        </label>
                        <label css={radioLabelStyle}>
                            <input
                                type="radio"
                                checked={settings?.isRepeat === false}
                                onChange={() => onSettingsUpdate({isRepeat: false})}
                            />
                            Нет
                        </label>
                    </div>
                </div>
                {settings?.isRepeat && (
                    <div css={boxStyle}>
                        <span>Каждые</span>
                        <select
                            value={settings?.repeatTime}
                            onChange={(e) => onSettingsUpdate({repeatTime: Number(e.target.value)})}
                        >
                            <option value={300000}>5 мин</option>
                            <option value={600000}>10 мин</option>
                            <option value={1200000}>20 мин</option>
                            <option value={1800000}>30 мин</option>
                            <option value={2400000}>40 мин</option>
                        </select>
                    </div>
                )}
            </div>
            <div css={boxGroupStyle}>
                <button css={{ background: isTableView ? 'transparent!important' : 'rgba(4,162,187,0.42)!important' }} onClick={() => setIsTableView(() => false)}>Карточки</button>
                <button css={{ background: isTableView ? 'rgba(4,162,187,0.42)!important' : 'transparent!important' }} onClick={() => setIsTableView(() => true)}>Таблица</button>
            </div>
            <div css={uploadBoxStyle}>
                <button onClick={() => {
                    onAddNewCard({
                        isLearning: true,
                        enValue: '',
                        ruValue: '',
                        isIdiom: false,
                        isPhrasalVerb: false,
                        dateAdded: new Date(),
                    } as Card)
                }}>+
                </button>
                <button onClick={handleDownloadExcel}>Скачать файл</button>
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    style={{display: 'none'}}
                />
                <button onClick={handleButtonClick}>Загрузить файл</button>
            </div>
        </div>
    );
})
