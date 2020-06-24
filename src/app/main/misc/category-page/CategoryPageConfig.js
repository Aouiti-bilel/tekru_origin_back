import React from 'react';

export const CategoryPageConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    name    : 'Category page Module',
    routes  : [
        { 
            path     : '/category/:id',
            component: React.lazy(() => import('./CategoryPage'))
        }
    ]
};