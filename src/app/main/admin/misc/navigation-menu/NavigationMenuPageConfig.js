import React from 'react';

export const NavigationMenuPageConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth    : 'platform-admin',
    routes  : [
        {
            path     : '/admin/misc/navigation-menu',
            component: React.lazy(() => import('./NavigationMenuPage'))
        }
    ]
};