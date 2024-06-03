export interface SortOptions<T> {
    field: keyof T;
    direction: 'asc' | 'desc';
}

export const enum Collection {
    STUDYING = 'studying',
    SETTINGS = 'settings',
    VOCABULAR = 'vocabular'
}

export interface Studying {
    lastCardId: string
}

export interface Settings {
    type: '1_side' | '2_side'
    isRepeat: boolean
    repeatTime: number
    firstSide: 'ru' | 'en'
}

export interface Card {
    id: string;
    ruValue: string
    enValue: string
    isLearning: boolean
    isPhrasalVerb: boolean
    isIdiom: boolean
    dateAdded: Date
}

