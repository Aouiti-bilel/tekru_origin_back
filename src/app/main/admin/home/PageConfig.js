import React from 'react';

export const AdminHomeConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth    : 'login',
    routes  : [
        {
            path     : '/admin/home',
            component: React.lazy(() => import('./Page'))
        },
        {
            path     : '/admin',
            component: React.lazy(() => import('./Page'))
        },
    ]
};
