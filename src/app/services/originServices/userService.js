import { jwtService } from 'app/services/originServices';
import gql from 'graphql-tag'
import apolloService from '../apolloService'

const GrapQLString = {}
GrapQLString.access = `
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
`;
GrapQLString.BASIC_DATA = `
    prenom,
    nomFamille,
    courriel,
    fonction,
    actif,
    telCellulaire,
    individu,
    id_Emp,
    sexe,
    niveau {
        niveau,
        description,
    }
`;

class userService {
    getMyAccesses = () => {
        return new Promise((resolve, reject) => {
            apolloService.query({
                query: gql `
                    query me {
                        me {
                            ${GrapQLString.access}
                        }
                    }
                `,
                context: {
                    headers: {
                        'authorization': 'Bearer ' + jwtService.getAccessToken()
                    }
                },
                fetchPolicy: 'no-cache'
            }).then(response => {
                if (response.data.me && response.data.me.accesses) {
                    resolve(response.data.me.accesses);
                }
                resolve(null);
            }).catch(error => {
                reject(handleErros(error));
            });
        });
    };

    getAll = () => {
        return new Promise((resolve, reject) => {
            apolloService.query({
                query: gql `
                    query { 
                        users {
                            ${GrapQLString.BASIC_DATA}
                        }
                    } 
                `,
                context: {
                    headers: {
                        'authorization': 'Bearer ' + jwtService.getAccessToken()
                    }
                },
                fetchPolicy: 'no-cache'
            }).then(response => {
                const users = response.data.users.map(this.prepareDateToInterface);
                resolve(users);
            }).catch(error => {
                const r = []
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

    fetchOptinalData = (id, full = false) => {
        return new Promise((resolve, reject) => {
            apolloService.query({
                variables: {
                    ids: [id],
                },
                query: gql `
                    query ($ids: [Int]) {
                        users (ids: $ids){
                            ${full ? GrapQLString.BASIC_DATA : ''}
                            CommissionStandard, nb_Hres_Sem, TauxHoraire, telAutre,telDomicile, telFax, telBureau, codePostal, isMentor, mentor_Id_Emp, cityId, regionId, countryId, address, dateFete
                        }
                    }
                `,
                context: {
                    headers: {
                        'authorization': 'Bearer ' + jwtService.getAccessToken()
                    }
                },
                fetchPolicy: 'no-cache'
            }).then(response => {
                if (!response.data.users[0]) {
                    reject('NO_USER');
                }
                resolve(this.prepareDateToInterface(response.data.users[0]));
            }).catch(error => {
                const r = []
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

    up = (data) => {
        return new Promise((resolve, reject) => {
            apolloService.mutate({
                variables: {
                    data: data
                },
                mutation: gql `
                    mutation (
                        $data: UserInput!
                    ){
                        user(
                            item: $data
                        )
                    }
                `,
                context: {
                    headers: {
                        'authorization': 'Bearer ' + jwtService.getAccessToken(),
                    }
                }
            }).then(response => {
                resolve(parseInt(response.data.user));
            }).catch(error => {
                const r = []
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

    delete = (id, hard) => {
        id = parseInt(id);
        return new Promise((resolve, reject) => {
            apolloService.mutate({
                variables: {
                    id: id,
                    hard: hard
                },
                mutation: gql `
                    mutation (
                        $id: Int
                        $hard: Boolean
                    ){
                        deleteUser(
                            id: $id,
                            hard: $hard
                        )
                    }
                `,
                context: {
                    headers: {
                        'authorization': 'Bearer ' + jwtService.getAccessToken(),
                    }
                }
            }).then(response => {
                resolve(response.data.deleteUser);
            }).catch(error => {
                const r = []
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

    /**
     * @author Karim Bouhnek
     * method that gets mentors from db
     */
    getAllMentors = () => {
        return new Promise((resolve, reject) => {
            apolloService.query({
                query: gql `
                query{ 
                mentorUsers
                {NomEmploye, id_Emp}
                } 
                `,
                context: {
                    headers: {
                        'authorization': 'Bearer ' + jwtService.getAccessToken()
                    }
                },
                fetchPolicy: 'no-cache'
            }).then(response => {
                resolve(response.data.mentorUsers);
            }).catch(error => {
                const r = []
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


    getCountries = () => {
        return new Promise((resolve, reject) => {
            apolloService.query({
                query: gql `
                query{ 
                Countries
                {short_name, country_id}
                } 
                `,
                context: {
                    headers: {
                        'authorization': 'Bearer ' + jwtService.getAccessToken()
                    }
                },
                fetchPolicy: 'no-cache'
            }).then(response => {
                resolve(response.data.Countries);
            }).catch(error => {
                const r = []
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

    getRegions = () => {
        return new Promise((resolve, reject) => {
            apolloService.query({
                query: gql `
                query{ 
                Regions
                {region_id, long_name, short_name}
                } 
                `,
                context: {
                    headers: {
                        'authorization': 'Bearer ' + jwtService.getAccessToken()
                    }
                },
                fetchPolicy: 'no-cache'
            }).then(response => {
                resolve(response.data.Regions);
            }).catch(error => {
                const r = []
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

    getCities = (cityFilter) => {
        return new Promise((resolve, reject) => {
            apolloService.query({
                variables: {
                    cityFilter: cityFilter,
                },
                query: gql `
                query($cityFilter: Int){ 
                Cities(cityFilter: $cityFilter)
                {id, name, country, province_code}
                } 
                `,
                context: {
                    headers: {
                        'authorization': 'Bearer ' + jwtService.getAccessToken()
                    }
                },
                fetchPolicy: 'no-cache'
            }).then(response => {
                resolve(response.data.Cities);
            }).catch(error => {
                const r = []
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

    /**
     * @author Karim Bouhnek
     * method that gets access levels
     */
    getLevels = () => {
        return new Promise((resolve, reject) => {
            apolloService.query({
                query: gql `
                query{ 
                levels
                {niveau, description}
                } 
                `,
                context: {
                    headers: {
                        'authorization': 'Bearer ' + jwtService.getAccessToken()
                    }
                },
                fetchPolicy: 'no-cache'
            }).then(response => {
                resolve(response.data.levels);
            }).catch(error => {
                const r = []
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

    prepareDateToInterface = (raw) => {
        const data = {
            ...raw
        };
        if (typeof data.niveau === 'object') {
            data.description = data.niveau.description || null
            data.niveau = data.niveau.niveau || null;
        }
        return data;
    }
    
}

const handleErros = (error) => {
    const r = []
    if (error.graphQLErrors)
        for (const e of error.graphQLErrors) {
            r.push({
                code: e.extensions.code,
                message: e.message,
            });
        }
    return(r);
}

const instance = new userService();
export default instance;
