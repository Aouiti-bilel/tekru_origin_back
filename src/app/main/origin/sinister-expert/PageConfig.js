import React from 'react';

export const SinisterExpertPageConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    name    : 'Expert Sinistre',
    auth    : 'login',
    routes  : [
        {
            path: '/sinister-expert',
            component: React.lazy(() => import('./Page'))
        }
    ]
};
