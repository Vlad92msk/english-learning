export const speakText = (text: string, lang: 'en-US' | 'ru-RU' = 'en-US') => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang; // Установите язык озвучки
    utterance.rate = 1; // Скорость озвучивания (0.1 до 10)
    utterance.pitch = 1; // Высота озвучивания (0 до 2)
    utterance.volume = 1; // Громкость озвучивания (0 до 1)
    speechSynthesis.speak(utterance);
};
