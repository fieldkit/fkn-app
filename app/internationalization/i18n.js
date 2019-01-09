import RNLanguages from 'react-native-languages';
import i18n from 'i18n-js';

import en from './translations/en.json';
import es from './translations/es.json';
import pt from './translations/pt.json';
import fr from './translations/fr.json';

i18n.locale = RNLanguages.language;

i18n.fallbacks = true;
i18n.translations = { pt, en, es, fr};

export default i18n;
