import React from 'react';

export const ProfilePageConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth    : 'login',
    routes  : [
        { 
            path     : '/users/profile',
            component: React.lazy(() => import('./ProfilePage'))
        }
    ]
};
