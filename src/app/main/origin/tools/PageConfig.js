import React from 'react';

export const ToolsPageConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    name    : 'Outils',
    auth    : 'login',
    routes  : [
        {
            path: '/tools',
            component: React.lazy(() => import('./Page'))
        }
    ]
};
