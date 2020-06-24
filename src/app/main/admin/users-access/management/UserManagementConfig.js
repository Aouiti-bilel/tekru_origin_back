import React from 'react';
import {Redirect} from 'react-router-dom';
import { default as i18next } from 'i18next';
import fr_CA from './i18n/fr_CA'; 
import en_CA from './i18n/fr_CA';

i18next.addResourceBundle('fr_CA', 'umApp', fr_CA);
i18next.addResourceBundle('en_CA', 'umApp', { locale: en_CA });

export const UserManagementConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth    : 'users',
    routes  : [ 
        {
            path     : '/admin/users/add',
            component: React.lazy(() => import('./UserFormPage'))
        },
        {
            path     : '/admin/users/list',
            component: React.lazy(() => import('./UserManagementPage'))
        },
        {
            path     : '/admin/users/edit/:uid',
            component: React.lazy(() => import('./UserFormPage'))
        },
        {
            path     : '/admin/users/edit',
            component: React.lazy(() => import('./UserFormPage'))
        },
        {
            path     : '/admin/users',
            component: () => <Redirect to="/admin/users/list"/>
        }
    ]
};