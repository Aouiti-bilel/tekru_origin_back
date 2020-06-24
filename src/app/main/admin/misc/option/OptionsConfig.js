import React from 'react';
import { default as i18next } from 'i18next';

import fr_CA from './i18n/fr_CA';
import en_CA from './i18n/fr_CA';

i18next.addResourceBundle('fr-CA', 'optApp', fr_CA);
i18next.addResourceBundle('en-CA', 'optApp', { locale: en_CA });

export const OptionsPageConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth    : 'config',
    routes  : [
        {
            path     : '/admin/misc/options',
            component: React.lazy(() => import('./OptionsPage'))
        }
    ]
};