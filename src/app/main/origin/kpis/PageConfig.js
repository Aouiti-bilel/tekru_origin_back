import React from 'react';

export const KPIsPageConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    name    : 'Indicateurs de performance',
    auth    : 'login',
    routes  : [
        {
            path: '/kpis',
            component: React.lazy(() => import('./Page'))
        }
    ]
};
