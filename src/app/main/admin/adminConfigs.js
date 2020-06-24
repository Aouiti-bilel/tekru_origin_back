import { AccessesConfig } from './users-access/accesses/AccessesConfig';
import { UserManagementConfig } from './users-access/management/UserManagementConfig';
import { OptionsPageConfig } from './misc/option/OptionsConfig';
import { NavigationMenuPageConfig } from './misc/navigation-menu/NavigationMenuPageConfig';
import { SeaFilesAdminConfig } from './third-party/seafiles-admin/SeaFilesAdminConfig';
import { AdminHomeConfig } from './home/PageConfig';

export const AdminConfigs = [
    // User
    AccessesConfig,
    UserManagementConfig,
    // Misc
    OptionsPageConfig,
    NavigationMenuPageConfig,
    // Third party
    SeaFilesAdminConfig,
    // Home !important to be last
    AdminHomeConfig,
];
