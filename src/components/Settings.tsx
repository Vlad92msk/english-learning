import React from "react";
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Card, Collection, Settings as SettingsGET, SettingsfFrstSide, SettingsTypeEnum } from "../types";
import { uploadExcelData } from "../utils/uploadExcelData";

const settingsStyle = css(`
    grid-area: settings;
    display: flex;
    gap: 10px;
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
    gap: 10px;
    flex-wrap: wrap;
`

const settingsBoxStyle = css`
    display: flex;
    gap: 5px;
    flex-direction: column;
    align-items: center;
    border-right: 1px solid #435367;
    margin-right: 5px;
    padding-right: 15px;
    width: 150px;
    height: 62px;
    justify-content: center;
`

const radioGroupStyle = css`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
`

const radioLabelStyle = css`
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
`
const uploadBoxStyle = css`
    margin-left: auto;
    gap: 10px;
    display: flex;
`

interface SettingsProps {
    cardType: Collection
    settings: SettingsGET
    onAdd:  (data: Card) => Promise<void>
    onUpdate: (id: string, data: Partial<SettingsGET>) => Promise<void>
}
export const Settings = React.memo((props: SettingsProps) => {
    const { settings, onAdd, onUpdate, cardType } = props;
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await uploadExcelData<Card>(file, cardType);
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
                                <option value={300000}>5 мин</option>
                                <option value={600000}>10 мин</option>
                                <option value={1200000}>20 мин</option>
                                <option value={1800000}>30 мин</option>
                                <option value={2400000}>40 мин</option>
                            </select>
                        </div>
                    )}
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
                }}>+
                </button>
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
