import React from 'react';

export const NewsPageConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    name    : 'Bloc de nouvelles',
    auth    : 'content',
    routes  : [
        {
            path: '/news-block/admin/',
            component: React.lazy(() => import('./PageAdmin'))
        },
        {
            path: '/news-block/content/:contentId-:contentSlug',
            component: React.lazy(() => import('./PageContent'))
        },
        {
            path: '/news-block/content/:contentId',
            component: React.lazy(() => import('./PageContent'))
        },
        {
            path: '/news-block/edit/:contentId',
            component: React.lazy(() => import('./PageContent'))
        },
        {
            path: '/news-block/create',
            component: React.lazy(() => import('./PageContent'))
        },
        {
            path: '/news-block',
            component: React.lazy(() => import('./Page'))
        },
    ]
};
