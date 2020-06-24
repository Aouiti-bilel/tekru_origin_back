import React from 'react';
import { Redirect } from 'react-router-dom';
import { FuseUtils } from '@fuse';
import { AuthConfigs } from 'app/main/auth/authConfigs';
import { UsersConfigs } from '../main/users/usersConfigs';
import { AdminConfigs } from '../main/admin/adminConfigs';
import { OriginConfigs } from '../main/origin/originConfigs';
import { MiscConfigs } from '../main/misc/miscConfigs';

const routeConfigs = [
    ...AuthConfigs,
    ...UsersConfigs,
    ...AdminConfigs,
    ...OriginConfigs,
    ...MiscConfigs,
];

const routes = [
    ...FuseUtils.generateRoutesFromConfigs(routeConfigs), {
        path     : '/',
        component: () => <Redirect to="/dashboard"/>
    }
];

export default routes;
