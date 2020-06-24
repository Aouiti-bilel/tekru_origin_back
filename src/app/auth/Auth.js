import React, {Component} from 'react';
import {FuseSplashScreen} from '@fuse';
import {connect} from 'react-redux';
import * as userActions from 'app/auth/store/actions';
import {bindActionCreators} from 'redux';
import * as Actions from 'app/store/actions';
import { jwtService } from 'app/services/originServices';

class Auth extends Component {

    state = {
        waitAuthCheck: true
    }

    componentDidMount() {
        return Promise.all([
            this.jwtCheck(),
            this.props.setNavigation()
        ]).then(() => {
            this.setState({waitAuthCheck: false})
        })
    }

    jwtCheck = () => new Promise(resolve => {
        jwtService.on('onAutoLogin', () => {
            this.props.showMessage({message: 'Connexion à Origin'});
            jwtService.signInWithToken()
                .then(user => {
                    this.props.setUserData(user);
                    resolve();
                    this.props.showMessage({message: 'Bienvenu chez Origin'});
                })
                .catch(error => {
                    this.props.showMessage({message: error});
                    resolve();
                })
        });

        jwtService.on('onAutoLogout', (message) => {
            if ( message ) {
                this.props.showMessage({message});
            }
            this.props.logout();
            resolve();
        });

        jwtService.on('onNoAccessToken', () => {
            resolve();
        });

        jwtService.init();
        return Promise.resolve();
    })

    render() {
        return this.state.waitAuthCheck ? <FuseSplashScreen/> : <React.Fragment children={this.props.children}/>;
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
            logout             : userActions.logoutUser,
            setUserData        : userActions.setUserData,
            showMessage        : Actions.showMessage,
            hideMessage        : Actions.hideMessage,
            setNavigation      : Actions.setNavigation
        },
        dispatch);
}

export default connect(null, mapDispatchToProps)(Auth);
