import React from 'react';

export const AccessesConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth    : 'permissions',
    routes  : [ 
        {
            path     : '/admin/users-access/access/:level_id?',
            component: React.lazy(() => import('./AccessesPage'))
        }
    ]
};