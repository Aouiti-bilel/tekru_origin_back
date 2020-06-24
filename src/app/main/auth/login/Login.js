import React from 'react'
import {Card, CardContent, Typography} from '@material-ui/core';
import {FuseAnimate} from '@fuse';
import {Link} from 'react-router-dom';
import clsx from 'clsx';
import JWTLoginTab from './tabs/JWTLoginTab';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    root: {
        background: 'linear-gradient(45deg, #0e0e0e, #272727);',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color     : theme.palette.primary.contrastText
    },
    h3welcome: {
        margin: '0px 0px 30px 0px',
    },
    pictogram: {
        maxWidth: '700px',
        margin: '50px 0px',
    }
}));

function Login() {
    const classes = useStyles();
    //const [bgImage, setBgImage] = React.useState('');

    /*React.useEffect(() => {
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
    style= {{
            backgroundImage: `url(${bgImage})`,
        }}
    */

    return (
        <div className={clsx(classes.root, "flex flex-col flex-1 flex-shrink-0 p-24 md:flex-row md:p-0")} >

            <div className="flex flex-col flex-grow-0 items-center text-white p-16 text-center md:p-128 md:items-start md:flex-shrink-0 md:flex-1 md:text-left">
                <FuseAnimate animation="transition.slideUpIn" delay={300}>
                    <Typography variant="h3" color="inherit" className={clsx(classes.h3welcome, "font-light")}>
                        Bienvenue dans l'Intranet d'Origin !
                    </Typography>
                </FuseAnimate>

                <FuseAnimate delay={400}>
                    <Typography variant="subtitle1" color="inherit" className="max-w-512 mt-16">
                        Voici un outil qui a été conçu pour vous afin de faciliter votre travail au quotidien ! N'hésitez pas à nous faire part de vos commentaires afin de le faire évoluer!
                    </Typography>
                </FuseAnimate>
                
                <FuseAnimate delay={500}>
                    <img src="assets/images/pictogram.svg" alt="Pictogram" className={clsx(classes.pictogram)} />
                </FuseAnimate>
            </div>

            <FuseAnimate animation={{translateX: [0, '100%']}}>

                <Card className="w-full max-w-400 mx-auto m-16 md:m-0" square>

                    <CardContent className="flex flex-col items-center justify-center p-32 md:p-48 md:pt-128 ">
                        <img className="w-200 mb-32" src="assets/images/logos/logo.svg" alt="Orign logo"/>
                        <Typography variant="h6" className="text-center md:w-full mb-48">CONNECTEZ-VOUS</Typography>

                        <JWTLoginTab/>

                        <div className="flex flex-col items-center justify-center pt-32">
                            <Link className="font-medium mt-8" id="forgot-password-link" to="/auth/forgot-password">Mot de passe oublié ?</Link>
                        </div>

                    </CardContent>
                </Card>
            </FuseAnimate>
        </div>
    )
} 

export default Login;
//<span className="font-medium">Je n'ai pas de compte?</span>
//<Link className="font-medium" to="/auth/register">Créer un compte</Link>