import React from 'react';
import { default as i18next } from 'i18next';

import fr_CA from './i18n/fr_CA';
import en_CA from './i18n/fr_CA';

i18next.addResourceBundle('fr-CA', 'dashApp', fr_CA);
i18next.addResourceBundle('en-CA', 'dashApp', { locale: en_CA });

export const DashboardConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    name    : 'Tableau de bord',
    auth    : 'login',
    routes  : [
        {
            path: '/dashboard',
            component: React.lazy(() => import('./Dashboard'))
        }
    ]
};
