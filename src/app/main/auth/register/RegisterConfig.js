import Register from './Register';

export const RegisterConfig = {
    settings: {
        layout: {
            config: {
                navbar        : {
                    display: false
                },
                toolbar       : {
                    display: false
                },
                footer        : {
                    display: false
                },
                leftSidePanel : {
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
            path     : '/auth/register',
            component: Register
        }
    ]
};

