import { FuseUtils } from '@fuse';

function adminMenuHelper() {
    const data = [];
    const row_data = [
        {
            'id'              : 'origin-modules',
            'title'           : 'Modules Origin',
            'elements'        : [
                {
                    'id'    : 'admin-origin-modules-users-manager',
                    'title' : 'Tableau de bord',
                    'auth'  : 'platform-admin',
                    'icon'  : 'dashboard',
                    'url'   : ''
                },
                {
                    'id'    : 'admin-origin-modules-sinister-expert',
                    'title' : 'Expert Sinistre',
                    'auth'  : 'platform-admin',
                    'icon'  : 'donut_large',
                    'url'   : '' //sinister-expert
                },
                {
                    'id'    : 'admin-origin-modules-kpis',
                    'title' : 'Indicateurs de performance',
                    'auth'  : 'platform-admin',
                    'icon'  : 'multiline_chart',
                    'url'   : ''
                },
            ]
        },
        {
            'id'              : 'third-party-modules-modules',
            'title'           : 'Modules tiers',
            'elements'        : [
                {
                    'id'    : 'admin-third-party-modules-seafiles',
                    'title' : 'Seafiles',
                    'auth'  : 'platform-admin',
                    'icon'  : 'description',
                    'url'   : '/admin/third-party/seafiles'
                },
                {
                    'id'    : 'admin-third-party-modules-news-block',
                    'title' : 'Bloc de nouvelles',
                    'auth'  : 'platform-admin',
                    'icon'  : 'bookmarks',
                    'url'   : '/news-block/admin'
                },
            ]
        },
        {
            'id'              : 'users-access',
            'title'           : 'Utilisateurs et accès',
            'elements'        : [
                {
                    'id'    : 'admin-users-access-users-manager',
                    'title' : 'Gestion des utilisateurs',
                    'auth'  : 'users',
                    'icon'  : 'supervised_user_circle',
                    'url'   : ''
                }, {
                    'id'    : 'admin-users-access-accesses',
                    'title' : 'Gestion des droits utilisateurs',
                    'auth'  : 'permissions',
                    'icon'  : 'supervised_user_circle',
                    'url'   : '/admin/users-access/access'
                }
            ]
        },
        {
            'id'              : 'general-settings',
            'title'           : 'Paramètres généraux',
            'elements'        : [
                {
                    'id'    : 'admin-general-settings-navigation-menu',
                    'title' : 'Menu latéral principal',
                    'auth'  : 'platform-admin',
                    'icon'  : '',
                    'url'   : '/admin/misc/navigation-menu'
                }, {
                    'id'    : 'admin-general-settings-notifications',
                    'title' : 'Paramètres des notifications',
                    'auth'  : 'platform-admin',
                    'icon'  : '',
                    'url'   : ''
                }, {
                    'id'    : 'admin-general-settings-options',
                    'title' : 'Configuration',
                    'auth'  : 'config',
                    'icon'  : 'settings',
                    'url'   : '/admin/misc/options'
                }
            ]
        },
    ];

    // Verify for the Permission
    for (let category of row_data) {
        if (category.elements && category.elements.length > 0) {
            let tmp = [];
            for (let item of category.elements) {
                if (FuseUtils.hasPermission(item.auth)) {
                    tmp.push(item);
                } else {
                    // tmp.push({...item, url: ''});
                }
            }
            if (tmp.length > 0) {
                category.elements = tmp;
                data.push(category);
            }
        }
    }

    return data;
}

export default adminMenuHelper;
