export interface SortOptions<T> {
    field: keyof T;
    direction: 'asc' | 'desc';
}

export const enum Collection {
    STUDYING = 'studying',
    SETTINGS = 'settings',
    VOCABULAR = 'vocabular',
    SENTENCES = 'sentences'
}

export interface Studying {
    lastCardId: string
}

export const enum SettingsTypeEnum {
    SIDE_1 = '1_side',
    SIDE_2 = '2_side'
}
export const enum SettingsfFrstSide {
    NATIVE = 'native',
    LEARNING = 'learning',
}
export interface Settings {
    type: SettingsTypeEnum
    isRepeat: boolean
    repeatTime: number
    firstSide: SettingsfFrstSide
    isLearning: boolean
    lastView: Collection.SENTENCES | Collection.VOCABULAR
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

