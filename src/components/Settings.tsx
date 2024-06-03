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
    flex-direction: column;
    gap: 10px;
`

const settingsBoxStyle = css`
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: space-between;
`

export const Settings = () => {
    const { data: [settings], onUpdate } = useGetData<SettingsGET>(Collection.SETTINGS);
    const { onAdd } = useGetData<Card>(Collection.VOCABULAR);
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

    return <div css={settingsStyle}>
        <div css={settingsRowStyle}>
            <div css={settingsBoxStyle}>
                <span>Показывать</span>
                {/*@ts-ignore*/}
                <select value={settings?.type} onChange={(e) => onUpdate('ukHLQmUsw1eAof3mlxsU', {type: e.target.value})}>
                    <option value={'1_side'}>1 сторону</option>
                    <option value={'2_side'}>2 стороны</option>
                </select>
            </div>
            {
                settings?.type === '2_side' && (
                    <div css={settingsBoxStyle}>
                        <span>Первая сторона</span>
                        {/*@ts-ignore*/}
                        <select value={settings?.firstSide} onChange={(e) => onUpdate('ukHLQmUsw1eAof3mlxsU', {firstSide: e.target.value})}>
                            <option value={'ru'}>ru</option>
                            <option value={'en'}>en</option>
                        </select>
                    </div>
                )
            }
        </div>
        <div css={settingsRowStyle}>
            <div css={settingsBoxStyle}>
                <span>Листать</span>
                <select
                    value={settings?.isRepeat ? 'true' : 'false'}
                    onChange={(e) => onUpdate('ukHLQmUsw1eAof3mlxsU', { isRepeat: e.target.value === 'true' })}
                >
                    <option value={'true'}>Да</option>
                    <option value={'false'}>Нет</option>
                </select>
            </div>
            <div>
                {
                    settings?.isRepeat && (
                        <>
                            <span>Каждые</span>
                            <select
                                value={settings?.repeatTime}
                                onChange={(e) => onUpdate('ukHLQmUsw1eAof3mlxsU', { repeatTime: Number(e.target.value) })}
                            >
                                <option value={200}>10 мин</option>
                                <option value={400}>20 мин</option>
                                <option value={600}>30 мин</option>
                                <option value={700}>40 мин</option>
                                <option value={1000}>50 мин</option>
                            </select>
                        </>
                    )
                }
            </div>
        </div>
        <div css={settingsRowStyle}>
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
}
