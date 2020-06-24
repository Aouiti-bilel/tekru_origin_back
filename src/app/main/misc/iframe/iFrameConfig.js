import React from 'react';

export const IFrameConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    name    : 'iFrame Module',
    routes  : [
        { 
            path     : '/i/:id',
            component: React.lazy(() => import('./iFramePage'))
        }
    ]
};