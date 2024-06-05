import React from "react";
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Card, Settings as SettingsGET, SettingsfFrstSide, SettingsTypeEnum } from "../types";
import { uploadExcelData } from "../utils/uploadExcelData";

const settingsStyle = css(`
    grid-area: settings;
    display: flex;
    gap: 50px;
    justify-content: center;
    font-size: 13px;
    flex-wrap: wrap;
`)

const settingsRowStyle = css`
    display: flex;
    gap: 10px;
    text-wrap: nowrap;
`
const settingsGroupButtonsStyle = css`
    display: flex;
    gap: 50px;
`

const settingsBoxStyle = css`
    display: flex;
    gap: 5px;
    flex-direction: column;
    align-items: center;
    border-right: 1px solid #435367;
    margin-right: 5px;
    padding-right: 15px;
`

const radioGroupStyle = css`
    display: flex;
    gap: 10px;
`

const radioLabelStyle = css`
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
`
const uploadBoxStyle = css`
    margin-left: auto;
`

interface SettingsProps {
    settings: SettingsGET
    onAdd:  (data: Card) => Promise<void>
    onUpdate: (id: string, data: Partial<SettingsGET>) => Promise<void>
}
export const Settings = React.memo((props: SettingsProps) => {
    const { settings, onAdd, onUpdate } = props;
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await uploadExcelData<Card>(file, onAdd);
        }
    };

    return (
        <div css={settingsStyle}>
            <div css={settingsGroupButtonsStyle}>
                <div css={settingsRowStyle}>
                    <div css={settingsBoxStyle}>
                        <span>Показывать</span>
                        <div css={radioGroupStyle}>
                            <label css={radioLabelStyle}>
                                <input
                                    type="radio"
                                    checked={settings?.type === SettingsTypeEnum.SIDE_1}
                                    onChange={() => onUpdate('ukHLQmUsw1eAof3mlxsU', { type: SettingsTypeEnum.SIDE_1 })}
                                />
                                1 сторону
                            </label>
                            <label css={radioLabelStyle}>
                                <input
                                    type="radio"
                                    checked={settings?.type === SettingsTypeEnum.SIDE_2}
                                    onChange={() => onUpdate('ukHLQmUsw1eAof3mlxsU', { type: SettingsTypeEnum.SIDE_2 })}
                                />
                                2 стороны
                            </label>
                        </div>
                    </div>
                    {settings?.type === SettingsTypeEnum.SIDE_2 && (
                        <div css={settingsBoxStyle}>
                            <span>Первая сторона</span>
                            <div css={radioGroupStyle}>
                                <label css={radioLabelStyle}>
                                    <input
                                        type="radio"
                                        checked={settings?.firstSide === SettingsfFrstSide.NATIVE }
                                        onChange={() => onUpdate('ukHLQmUsw1eAof3mlxsU', { firstSide: SettingsfFrstSide.NATIVE })}
                                    />
                                    ru
                                </label>
                                <label css={radioLabelStyle}>
                                    <input
                                        type="radio"
                                        checked={settings?.firstSide === SettingsfFrstSide.LEARNING}
                                        onChange={() => onUpdate('ukHLQmUsw1eAof3mlxsU', { firstSide: SettingsfFrstSide.LEARNING })}
                                    />
                                    en
                                </label>
                            </div>
                        </div>
                    )}
                </div>
                <div css={settingsRowStyle}>
                    <div css={settingsBoxStyle}>
                        <span>Листать</span>
                        <div css={radioGroupStyle}>
                            <label css={radioLabelStyle}>
                                <input
                                    type="radio"
                                    checked={settings?.isRepeat === true}
                                    onChange={() => onUpdate('ukHLQmUsw1eAof3mlxsU', {isRepeat: true})}
                                />
                                Да
                            </label>
                            <label css={radioLabelStyle}>
                                <input
                                    type="radio"
                                    checked={settings?.isRepeat === false}
                                    onChange={() => onUpdate('ukHLQmUsw1eAof3mlxsU', {isRepeat: false})}
                                />
                                Нет
                            </label>
                        </div>
                    </div>
                    {settings?.isRepeat && (
                        <div css={settingsBoxStyle}>
                            <span>Каждые</span>
                            <select
                                value={settings?.repeatTime}
                                onChange={(e) => onUpdate('ukHLQmUsw1eAof3mlxsU', {repeatTime: Number(e.target.value)})}
                            >
                                <option value={200}>10 мин</option>
                                <option value={400}>20 мин</option>
                                <option value={600}>30 мин</option>
                                <option value={700}>40 мин</option>
                                <option value={1000}>50 мин</option>
                            </select>
                        </div>
                    )}
                </div>
                <div css={settingsRowStyle}>
                    <div css={settingsBoxStyle}>
                        <div css={radioGroupStyle}>
                            <label css={radioLabelStyle}>
                                <input
                                    type="radio"
                                    checked={settings?.isLearning === false}
                                    onChange={() => onUpdate('ukHLQmUsw1eAof3mlxsU', { isLearning: false  })}
                                />
                                Изучил
                            </label>
                            <label css={radioLabelStyle}>
                                <input
                                    type="radio"
                                    checked={settings?.isLearning === true}
                                    onChange={() => onUpdate('ukHLQmUsw1eAof3mlxsU', { isLearning: true })}
                                />
                                Учу
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div css={uploadBoxStyle}>
                <button onClick={() => {
                    onAdd({
                        isLearning: true,
                        enValue: '',
                        ruValue: '',
                        isIdiom: false,
                        isPhrasalVerb: false,
                        dateAdded: new Date(),
                    } as Card)
                }}>+</button>
            </div>
            <div css={uploadBoxStyle}>
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
