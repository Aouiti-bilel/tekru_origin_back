import React from 'react';

export const ClientsPageConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    name    : 'Clients',
    auth    : 'login',
    routes  : [
        {
            path: '/clients',
            component: React.lazy(() => import('./Page'))
        }
    ]
};
