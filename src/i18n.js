import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import tr from './locales/tr.json';

const messages = {
    en,
    tr
};

const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'tr',
    messages
});

export default i18n;
