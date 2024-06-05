import React from "react";
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useGetData } from "../hooks/useGetData";
import { Collection, Settings as SettingsGET, Card } from "../types";
import { uploadExcelData } from "../utils/uploadExcelData";

const settingsStyle = css(`
    grid-area: settings;
    display: flex;
    gap: 50px;
    justify-content: center;
    font-size: 13px;
`)

const settingsRowStyle = css`
    display: flex;
    gap: 10px;
`
const settingsGroupButtonsStyle = css`
    display: flex;
    gap: 50px;
    width: 70%;
`

const settingsBoxStyle = css`
    display: flex;
    gap: 5px;
    justify-content: space-between;
`

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
    margin-left: auto;
`

interface SettingsProps {
    cardType: Collection
}
export const Settings = (props: SettingsProps) => {
    const { cardType } = props;
    const { data: [settings], onUpdate } = useGetData<SettingsGET>(Collection.SETTINGS);
    const { onAdd } = useGetData<Card>(cardType);
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
                                    name="type"
                                    value="1_side"
                                    checked={settings?.type === '1_side'}
                                    onChange={() => onUpdate('ukHLQmUsw1eAof3mlxsU', {type: '1_side'})}
                                />
                                1 сторону
                            </label>
                            <label css={radioLabelStyle}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="2_side"
                                    checked={settings?.type === '2_side'}
                                    onChange={() => onUpdate('ukHLQmUsw1eAof3mlxsU', {type: '2_side'})}
                                />
                                2 стороны
                            </label>
                        </div>
                    </div>
                    {settings?.type === '2_side' && (
                        <div css={settingsBoxStyle}>
                            <span>Первая сторона</span>
                            <div css={radioGroupStyle}>
                                <label css={radioLabelStyle}>
                                    <input
                                        type="radio"
                                        name="firstSide"
                                        value="ru"
                                        checked={settings?.firstSide === 'ru'}
                                        onChange={() => onUpdate('ukHLQmUsw1eAof3mlxsU', {firstSide: 'ru'})}
                                    />
                                    ru
                                </label>
                                <label css={radioLabelStyle}>
                                    <input
                                        type="radio"
                                        name="firstSide"
                                        value="en"
                                        checked={settings?.firstSide === 'en'}
                                        onChange={() => onUpdate('ukHLQmUsw1eAof3mlxsU', {firstSide: 'en'})}
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
                                    name="isRepeat"
                                    value="true"
                                    checked={settings?.isRepeat === true}
                                    onChange={() => onUpdate('ukHLQmUsw1eAof3mlxsU', {isRepeat: true})}
                                />
                                Да
                            </label>
                            <label css={radioLabelStyle}>
                                <input
                                    type="radio"
                                    name="isRepeat"
                                    value="false"
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
                                    name="type"
                                    value="1_side"
                                    checked={settings?.isLearning === false}
                                    onChange={() => onUpdate('ukHLQmUsw1eAof3mlxsU', { isLearning: false  })}
                                />
                                Изученные
                            </label>
                            <label css={radioLabelStyle}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="2_side"
                                    checked={settings?.isLearning === true}
                                    onChange={() => onUpdate('ukHLQmUsw1eAof3mlxsU', { isLearning: true })}
                                />
                                Изучаемые
                            </label>
                        </div>
                    </div>
                </div>
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
}
