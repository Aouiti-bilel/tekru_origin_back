import React from 'react';
import {makeStyles} from '@material-ui/styles';
import {FuseAnimate} from '@fuse';
import clsx from 'clsx';
import {Link} from 'react-router-dom';
import {Typography, Card, CardContent} from '@material-ui/core';
import ResetPasswordForm from './sub-component/form';
import { jwtService } from 'app/services/originServices';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.primary.dark,
        backgroundImage: 'url(assets/images/backgrounds/light-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color : theme.palette.primary.contrastText
    }
}));

function ResetPasswordPage(props) {
    const classes = useStyles();
    const [bgImage, setBgImage] = React.useState('');

    React.useEffect(() => {
        // Get the data
        jwtService.getConfigData().then(response => {
            // set the SRC
            try {
                var image = new Image();
                // if loading image is good
                image.onload = function () {
                    setBgImage(response.home_background_image);
                }
                // if image erro
                image.onerror = function () {
                    setBgImage('assets/images/backgrounds/light-bg.jpg');
                }
                image.src = response.home_background_image;
            } catch (err) {
                return false;
            }
        }).catch(error => {
            console.log(error);
        });
    }, []);
    
    return ( 
        <div className={clsx(classes.root, "flex flex-col flex-auto flex-shrink-0 items-center justify-center p-32")} style={{
            backgroundImage: `url(${bgImage})`,
        }}>
            <div className="flex flex-col items-center justify-center w-full">

                <FuseAnimate animation="transition.expandIn">

                    <Card className="w-full max-w-384">

                        <CardContent className="flex flex-col items-center justify-center p-32">

                            <div className="w-128 m-32">
                                <img src="assets/images/logos/logo.svg" alt="Origin logo"/>
                            </div>

                            <Typography variant="h6" className="mt-16 mb-32">RÉINITIALISER VOTRE MOT DE PASSE</Typography>

                            <ResetPasswordForm {...props} />

                            <div className="flex flex-col items-center justify-center pt-32 pb-24">
                                <Link className="font-medium" to="/login">Retourner à la page de connexion</Link>
                            </div>

                        </CardContent>
                    </Card>
                </FuseAnimate>
            </div>
        </div>
    );
}

export default ResetPasswordPage;
