import axios from 'axios';
import jwtDecode from 'jwt-decode';
import FuseUtils from '@fuse/FuseUtils';
import gql from 'graphql-tag'
import apolloService from '../apolloService'

class jwtService extends FuseUtils.EventEmitter {
    
    init() {
        this.setInterceptors();
        this.handleAuthentication();
    }

    setInterceptors = () => {
        axios.interceptors.response.use(response => {
            return response;
        }, err => {
            return new Promise((resolve, reject) => {
                if ( err.response.status === 401 && err.config && !err.config.__isRetryRequest )
                {
                    // if you ever get an unauthorized response, logout the user
                    this.emit('onAutoLogout', 'Invalid access_token');
                    this.setSession(null);
                }
                throw err;
            });
        });
    };

    handleAuthentication = () => {
        // Get Token
        let access_token = this.getAccessToken();

        // If there is no access token emit()
        if ( !access_token ) {
            this.emit('onNoAccessToken');
            return;
        }

        // Verify the token
        if ( this.isAuthTokenValid(access_token) ) {
            this.setSession(access_token);
            this.emit('onAutoLogin', true);
        } else {
            this.setSession(null);
            this.emit('onAutoLogout', 'Session expirée, merci de se reconnecter');
        }
    };

    createUser = (data) => {
        return new Promise((resolve, reject) => {
            resolve(data);
        });
    };

    signInWithEmailAndPassword = async (email, password) => {
        return new Promise((resolve, reject) => {
            apolloService.mutate({
                variables: {
                    email: email,
                    password: password
                },
                mutation: gql `
                    mutation Login(
                        $email: String!
                        $password: String!
                    ){
                        login(
                            courriel: $email
                            pswd: $password
                        ) {
                            token
                            user {
                                id_Emp
                                courriel
                                nomFamille
                                prenom
                                sexe
                                fonction
                                picture
                                niveau {
                                    niveau
                                    description
                                }
                                accesses {
                                    id
                                    slug
                                    name
                                    can_view
                                    can_view_own
                                    can_edit
                                    can_create
                                    can_delete
                                }
                            }
                        }
                    }
                `
            }).then((response) => {
                if (response.data.login) {
                    this.setSession(response.data.login.token);
                    resolve(response.data.login.user);
                } else {
                    reject(response.data.error);
                }
            }).catch(error => {
                console.log(error);
                let r = {
                    email: null,
                    password: null
                };
                // Handel backend errors
                if (error.graphQLErrors[0]) {
                    switch (error.graphQLErrors[0].extensions.code) {
                        case 'USER_DEACTIVATED':
                            r.email = error.graphQLErrors[0].message;
                            break;
                        case 'INTERNAL_SERVER_ERROR':
                            r.email = 'Erreur au serveur.';
                            break;
                        default:
                            r.password = error.graphQLErrors[0].message;
                    }
                } else {
                    r.password = 'Server error.';
                }
                
                reject(r);
            });
        });
    };

    signInWithToken = () => {
        return new Promise((resolve, reject) => {
            apolloService.mutate({
                mutation: gql `
                    mutation token {
                        token {
                            token
                            user {
                                id_Emp
                                courriel
                                nomFamille
                                prenom
                                sexe
                                fonction
                                picture
                                niveau {
                                    niveau
                                    description
                                }
                                accesses {
                                    id
                                    slug
                                    name
                                    can_view
                                    can_view_own
                                    can_edit
                                    can_create
                                    can_delete
                                }
                            }
                        }
                    }
                `,
                context: {
                    headers: {
                        'authorization': 'Bearer ' + this.getAccessToken()
                    }
                }
            }).then(response => {
                if (response.data.token) {
                    this.setSession(response.data.token.token);
                    resolve(response.data.token.user);
                } else {
                    this.logout();
                    reject(response.data.error);
                }
            }).catch(error => {
                console.log(error);
                let e = '';
                // Handel backend errors
                if (error.graphQLErrors[0]) {
                    switch (error.graphQLErrors[0].extensions.code) {
                        case 'USER_DEACTIVATED':
                            e = error.graphQLErrors[0].message;
                            break;
                        default:
                            e = error.graphQLErrors[0].message;
                    }
                } else {
                    e = 'Server error.';
                }
                reject(e);
            });
        });
    };

    forgetPassword = (email) => {
        return new Promise((resolve, reject) => {
            apolloService.mutate({
                variables: {
                    email: email
                },
                mutation: gql `
                    mutation ForgetPassword(
                        $email: String!
                    ){
                        forgetpassword(
                            courriel: $email
                        )
                    }
                `
            }).then(response => {
                // TODO Verify the response
                resolve(true);
            }).catch(error => {
                let r = {
                    email: null
                };
                // Handel backend errors
                if (error.graphQLErrors[0]) {
                    switch (error.graphQLErrors[0].extensions.code) {
                        case 'INTERNAL_SERVER_ERROR':
                            r.email = 'Erreur au serveur.';
                            break;
                        default:
                            r.email = error.graphQLErrors[0].message;
                    }
                } else {
                    r.email = 'Server error.';
                }
                
                reject(r);
            });
        });
    };

    resetPassword = (token, password) => {
        return new Promise((resolve, reject) => {
            apolloService.mutate({
                variables: {
                    token: token,
                    password: password
                },
                mutation: gql `
                    mutation SetForgotPassword(
                        $token: String!
                        $password: String!
                    ){
                        setForgotPassword(
                            token: $token
                            newpassword: $password
                        )
                    }
                `
            }).then(response => {
                // TODO Verify the response
                resolve(true);
            }).catch(error => {
                let r = {
                    password: null
                };
                // Handel backend errors
                if (error.graphQLErrors[0]) {
                    r.password = error.graphQLErrors[0].message;
                } else {
                    r.password = 'Server error.';
                }
                
                reject(r);
            });
        });
    };

    editPassword = (oldpassword, password, password2) => {
        return new Promise((resolve, reject) => {
            apolloService.mutate({
                variables: {
                    oldpassword: oldpassword,
                    newpassword: password,
                    newpassword2: password2,
                },
                mutation: gql `
                    mutation SetNewPassword(
                        $oldpassword: String!
                        $newpassword: String!
                        $newpassword2: String!
                    ){
                        setNewPassword(
                            oldpassword: $oldpassword
                            newpassword: $newpassword
                            newpassword2: $newpassword2
                        )
                    }
                `
                ,context: {
                    headers: {
                        'authorization': 'Bearer ' + this.getAccessToken()
                    }
                }
            }).then(response => {
                // TODO test the return
                resolve(true);
            }).catch(error => {
                console.log(error);
                let r = {
                    oldpassword: null,
                    password: null
                };
                // Handel backend errors
                if (error.graphQLErrors[0]) {
                    if (error.graphQLErrors[0].extensions.code === 'NOT_AUTHENTICATED') {
                        r.oldpassword = error.graphQLErrors[0].message;
                    } else if (error.graphQLErrors[0].extensions.code === 'OLD_PASSWORD_NOT_OK') {
                        r.oldpassword = error.graphQLErrors[0].message;
                    } else {
                        r.password = error.graphQLErrors[0].message;
                    }
                } else {
                    r.password = 'Server error.';
                }
                reject(r);
            });
        });
    };

    updateUserData = (user) => {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    };

    getAccessData = () => {
        return new Promise((resolve, reject) => {
            apolloService.query({
                query: gql `
                    query {
                        levels {
                            niveau
                            description
                            accesses {
                                id
                                aid
                                name
                                slug
                                value
                                can_view
                                can_view_own
                                can_edit
                                can_create
                                can_delete
                            }
                        },
                        accesses {
                            id
                            name
                            slug
                        }
                    }
                `
                ,context: {
                    headers: {
                        'authorization': 'Bearer ' + this.getAccessToken()
                    }
                },
                fetchPolicy: 'no-cache'
            }).then(response => {
                resolve(response.data);
            }).catch(error => {
                let r = {
                    email: null
                };
                // Handel backend errors
                if (error.graphQLErrors[0]) {
                    r.email = error.graphQLErrors[0].message;
                } else {
                    r.email = 'Server error.';
                }

                reject(r);
            });
        });
    };

    updateAccess = (levelId, accessId, slug) => {
        return new Promise((resolve, reject) => {
            apolloService.mutate({
                variables: {
                    levelId: levelId,
                    accessId: accessId,
                    privilege: slug,
                },
                mutation: gql `
                    mutation ChangeAccess(
                        $levelId: Int!
                        $accessId: Int!
                        $privilege: String!
                    ){
                        changeAccess(
                            levelId: $levelId
                            accessId: $accessId
                            privilege: $privilege
                        )
                    }
                `,
                context: {
                    headers: {
                        'authorization': 'Bearer ' + this.getAccessToken()
                    }
                }
            }).then(response => {
                resolve(response);
            }).catch(error => {
                console.log(error);
                let e = 'Server error.';
                // Handel backend errors
                if (error.graphQLErrors[0]) {
                    e = error.graphQLErrors[0].message;
                }
                reject(e);
            });
        });
    };

    getAllieRHConfig = () => {
        return new Promise((resolve, reject) => {
            apolloService.query({
                query: gql `
                    query {
                        allierh {
                            url
                        }
                    }
                `,
                context: {
                    headers: {
                        'authorization': 'Bearer ' + this.getAccessToken()
                    }
                },
                fetchPolicy: 'no-cache'
            }).then(response => {
                resolve(response.data.allierh);
            }).catch(error => {
                console.log(error);
                let e = 'Server error.';
                // Handel backend errors
                if (error.graphQLErrors[0]) {
                    e = error.graphQLErrors[0].message;
                }
                reject(e);
            });
        });
    };

    /**
     * Get the options data
     * Calls the Apollo Server of Origin Backend
     */
    getConfigData = () => {
        return new Promise((resolve, reject) => {
            // Setting dynamicly the context
            // Note: this is important to access public option when user is not login in
            let context = {};
            const token = this.getAccessToken();
            if (token != null) {
                context = {
                    headers: {
                        'authorization': 'Bearer ' + (this.getAccessToken() || '')
                    }
                }
            }
            // Let's get the data
            apolloService.query({
                query: gql `
                    query {
                        options {
                            name
                            value
                        }
                    }
                `,
                context: context,
                fetchPolicy: 'no-cache'
            }).then(response => {
                let temp = {};
                // Render an object with option slugs
                response.data.options.forEach(element => {
                    temp[element.name] = element.value;
                });
                resolve(temp);
            }).catch(error => {
                console.log(error);
                let e = 'Server error.';
                // Handel backend errors
                if (error.graphQLErrors[0]) {
                    e = error.graphQLErrors[0].message;
                }
                reject(e);
            });
        });
    };

    /**
     * Update the options data
     * Calls the Apollo Server of Origin Backend
     */
    updateConfigData = (data) => {
        return new Promise((resolve, reject) => {
            apolloService.mutate({
                variables: {
                    options: data,
                },
                mutation: gql `
                    mutation UpdateOptions(
                        $options: [OptionInput]!
                    ){
                        updateOptions(
                            options: $options
                        )
                    }
                `,
                context: {
                    headers: {
                        'authorization': 'Bearer ' + this.getAccessToken()
                    }
                }
            }).then(response => {
                resolve(response);
            }).catch(error => {
                console.log(error);
                let e = 'Server error.';
                // Handel backend errors
                if (error.graphQLErrors[0]) {
                    e = error.graphQLErrors[0].message;
                }
                reject(e);
            });
        });
    };

    /**
     * Update the background photo option data
     * This function uploads and updates the option
     * Calls the Apollo Server of Origin Backend
     */
    updateConfigHomeBackgroundImageData = (file) => {
        return new Promise((resolve, reject) => {
            apolloService.mutate({
                variables: {
                    file
                },
                mutation: gql `
                    mutation (
                        $file: Upload!
                    ){
                        updateHomeBackgroundImageOption(
                            file: $file
                        )
                    }
                `,
                context: {
                    headers: {
                        'authorization': 'Bearer ' + this.getAccessToken(),
                    }
                }
            }).then(response => {
                resolve(response.data.updateHomeBackgroundImageOption);
            }).catch(error => {
                console.log(error);
                let e = 'Server error.';
                // Handel backend errors
                if (error.graphQLErrors[0]) {
                    e = error.graphQLErrors[0].message;
                }
                reject(e);
            });
        });
    };

    /**
     * Edit and update profile picture of the user
     * Calls the Apollo Server of Origin Backend
     */
    updateProfilePicture = (file) => {
        return new Promise((resolve, reject) => {
            apolloService.mutate({
                variables: {
                    file
                },
                mutation: gql `
                    mutation setProfilePicture(
                        $file: Upload!
                    ){
                        setProfilePicture(
                            file: $file
                        )
                    }
                `,
                context: {
                    headers: {
                        'authorization': 'Bearer ' + this.getAccessToken(),
                    }
                }
            }).then(response => {
                resolve(response.data.setProfilePicture);
            }).catch(error => {
                console.log(error);
                let e = 'Server error.';
                // Handel backend errors
                if (error.graphQLErrors[0]) {
                    e = error.graphQLErrors[0].message;
                }
                reject(e);
            });
        });
    };

    /**
     * Upload misc files
     */
    uploadImage = (file, attachedTo, attachtedId=0) => {
        return new Promise((resolve, reject) => {
            apolloService.mutate({
                variables: {
                    file,
                    attachedTo,
                    attachtedId,
                },
                mutation: gql `
                    mutation uploadImage(
                        $file: Upload!
                        $attachedTo: String!
                        $attachtedId: Int!
                    ){
                        uploadImage(
                            file: $file
                            attachedTo: $attachedTo
                            attachtedId: $attachtedId
                        )
                    }
                `,
                context: {
                    headers: {
                        'authorization': 'Bearer ' + this.getAccessToken(),
                    }
                }
            }).then(response => {
                resolve(response.data.uploadImage);
            }).catch(error => {
                const r = []
                if (error.graphQLErrors)
                    for (const e of error.graphQLErrors) {
                        r.push({
                            code: e.extensions.code,
                            message: e.message,
                        });
                    }
                reject(r);
            });
        });
    };

    logout = () => {
        this.setSession(null);
    };

    setSession = (access_token) => {
        // TODO verify is can add a global AUTH to Apollo Client
        if ( access_token ) {
            localStorage.setItem('jwt_access_token', access_token);
        } else {
            localStorage.removeItem('jwt_access_token');
        }
    };

    isAuthTokenValid = access_token => {
        if ( !access_token ) {
            return false;
        }

        let response = false;

        try {
            const decoded = jwtDecode(access_token);
            const currentTime = Date.now() / 1000;
            if (decoded.exp >= currentTime) {
                response = true;
            } 
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.log (error)
            }
        }
        
        return response;
    };

    getAccessToken = () => {
        return window.localStorage.getItem('jwt_access_token');
    };

    getAuthHeaders = () => {
        return {
            'authorization': 'Bearer ' + this.getAccessToken(),
        }
    };

    handleErros = (errors) => {
        const r = []
        if (errors.graphQLErrors)
            for (const e of errors.graphQLErrors) {
                r.push({
                    code: e.extensions.code,
                    message: e.message,
                });
            }
        return(r);
    };
}

const instance = new jwtService();

export default instance;
