import { Card as CardGET, Card } from "../types";
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useCallback, useEffect, useState } from "react";

const tableStyle = css`
  height: 100%;
  max-height: 80vh;
  width: 100%;
  position: relative;
  overflow: auto;
  margin-bottom: 20px;
  margin-top: 20px;
  
  textarea {
      width: 100%;
      max-width: 100%;
      height: 100%;
      max-height: 100%;
}
  input {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  table {
    min-width: 900px;
    border-collapse: collapse;
    width: 100%;
  }
  
  th {
    font-size: 13px;
  }

  th, td {
    border: 1px solid #d3e1fe; /* Добавлено для лучшей видимости ячеек */
    padding: 8px; /* Добавлено для внутреннего отступа ячеек */
    font-weight: normal;
    height: 40px;
    
    ::first-letter {
        text-transform: uppercase;
    }
  }
  
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  -ms-overflow-style: none;  /* IE и Edge */
  scrollbar-width: none;  /* Firefox */
`;

const tableHeaderStyle = css`
  position: sticky;
  top: 0;
  width: 100%;
  background-color: #031525;
`;

const columnRuStyle = css`
`;

const columnEnStyle = css`
`;

const columnStatusStyle = css`
  width: 80px;
  text-align: center;
`;

const columnVerbStyle = css`
  width: 80px;
  text-align: center;
`;

const columnIdiomStyle = css`
  width: 80px;
  text-align: center;
`;

const changeBoxStyle = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 5px;
  
  > * {
   flex-grow: 1; 
   min-width: 49%;
  }
`;

interface TableProps {
    cards: Card[]
    onUpdateCard: (id: string, updatedData: Partial<CardGET>) => void
}

export const Table = (props: TableProps) => {
    const { cards, onUpdateCard } = props;

    const [filteredCards, setFilteredCards] = useState(cards);
    useEffect(() => {
        setFilteredCards(cards);
    }, [cards]);

    const [editingCell, setEditingCell] = useState<{ id: string; field: keyof Card } | null>(null);
    const [editValue, setEditValue] = useState<string | boolean | undefined>();

    const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        setFilteredCards(cards.filter(({ enValue, ruValue }) =>
            enValue.toLowerCase().includes(value) || ruValue.toLowerCase().includes(value)
        ));
    };

    const handleCellClick = useCallback((id: string, field: keyof Card, value: string | boolean) => {
        setEditingCell({ id, field });
        setEditValue(value);
    }, []);

    const handleCancel = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        event.preventDefault();
        setEditingCell(null);
        setEditValue(undefined);
    }, []);

    const handleSave = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        event.preventDefault();
        if (editingCell) {
            onUpdateCard(editingCell.id, { [editingCell.field]: editValue });
            setEditingCell(null);
            setEditValue(undefined);
        }
    }, [editValue, editingCell, onUpdateCard]);

    const renderEditableCell = useCallback((id: string, field: keyof Card, value: string | boolean) => {

        if (editingCell?.id === id && editingCell.field === field) {

            return (
                <div css={changeBoxStyle}>
                    {typeof value === 'boolean' ? (
                        <input
                            type="checkbox"
                            checked={editValue as boolean}
                            onChange={(e) => setEditValue(e.target.checked)}
                        />
                    ) : (
                        <textarea
                            value={editValue as string}
                            onChange={(e) => setEditValue(e.target.value)}
                        />
                    )}
                    <button onClick={handleCancel}>Отменить</button>
                    <button onClick={handleSave}>Ок</button>
                </div>
            );
        }
        let result

        if (typeof value === 'string') {
            result = value
        } else {
            result = value ? 'да' : ''
        }

        return result;
    }, [editValue, editingCell, handleCancel, handleSave])

    return (
        <div css={tableStyle}>
            <input onChange={handleFilter} placeholder="Поиск..." />
            <table>
                <thead css={tableHeaderStyle}>
                <tr>
                    <th css={columnEnStyle}>en</th>
                    <th css={columnRuStyle}>ru</th>
                    <th css={columnStatusStyle}>еще учу?</th>
                    <th css={columnVerbStyle}>фр глагол?</th>
                    <th css={columnIdiomStyle}>идиома?</th>
                </tr>
                </thead>
                <tbody>
                {filteredCards.map(({ isIdiom, enValue, ruValue, isPhrasalVerb, id, isLearning }) => (
                    <tr key={id}>
                        <td css={columnEnStyle} onClick={() => handleCellClick(id, "enValue", enValue)}>
                            {renderEditableCell(id, "enValue", enValue)}
                        </td>
                        <td css={columnRuStyle} onClick={() => handleCellClick(id, "ruValue", ruValue)}>
                            {renderEditableCell(id, "ruValue", ruValue)}
                        </td>
                        <td css={columnStatusStyle} onClick={() => handleCellClick(id, "isLearning", isLearning)}>
                            {renderEditableCell(id, "isLearning", isLearning)}
                        </td>
                        <td css={columnVerbStyle} onClick={() => handleCellClick(id, "isPhrasalVerb", isPhrasalVerb)}>
                            {renderEditableCell(id, "isPhrasalVerb", isPhrasalVerb)}
                        </td>
                        <td css={columnIdiomStyle} onClick={() => handleCellClick(id, "isIdiom", isIdiom)}>
                            {renderEditableCell(id, "isIdiom", isIdiom)}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
