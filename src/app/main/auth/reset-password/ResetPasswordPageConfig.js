import ResetPasswordPage from './ResetPasswordPage';

export const ResetPasswordPageConfig = {
    settings: {
        layout: {
            config: {
                navbar: {
                    display: false
                },
                toolbar: {
                    display: false
                },
                footer: {
                    display: false
                },
                leftSidePanel: {
                    display: false
                },
                rightSidePanel: {
                    display: false
                }
            }
        }
    },
    auth: 'onlyGuest',
    routes  : [
        {
            path     : '/auth/reset-password',
            component: ResetPasswordPage
        }
    ]
};
