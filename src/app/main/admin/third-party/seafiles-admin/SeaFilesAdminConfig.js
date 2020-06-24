import React from 'react';

export const SeaFilesAdminConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    name    : 'Sea Files Admin',
    routes  : [
        { 
            path     : '/admin/third-party/seafiles',
            component: React.lazy(() => import('./SeaFilesAdminPage'))
        }
    ]
};