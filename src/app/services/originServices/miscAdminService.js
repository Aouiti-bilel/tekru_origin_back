import { jwtService } from 'app/services/originServices';
import gql from 'graphql-tag'
import apolloService from '../apolloService'

class miscAdminService {
    getLevels = () => {
        return new Promise((resolve, reject) => {
            apolloService.query({
                query: gql `
                    query Levels {
                        levels {
                            niveau
                            description
                        }
                    }
                `,
                context: {
                    headers: jwtService.getAuthHeaders()
                }
            }).then(response => {
                resolve(response.data.levels);
            }).catch(error => {
                reject(jwtService.handleErros(error));
            });
        });
    };
}

const instance = new miscAdminService();

export default instance;
