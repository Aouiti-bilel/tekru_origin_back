import React from 'react';
import {
    AppBar,
    Card,
    CardContent,
    Toolbar,
    Typography,
} from '@material-ui/core';
import { FuseAnimateGroup } from '@fuse';
import { useSelector } from 'react-redux';
import EditPasswordForm from '../forms/EditMyPassword';

function AboutTab(props) {
    const user = useSelector(({auth}) => auth.user);
    return (
        <div className="md:flex max-w-2xl">

            <div className="flex flex-col flex-1 md:pr-32">
                <FuseAnimateGroup
                    enter={{
                        animation: "transition.slideUpBigIn"
                    }}
                >
                    <Card className="w-full mb-16">
                        <AppBar position="static" elevation={0}>
                            <Toolbar className="pl-16 pr-8">
                                <Typography variant="subtitle1" color="inherit" className="flex-1">
                                    Profil
                                </Typography>
                            </Toolbar>
                        </AppBar>

                        <CardContent>
                            <div className="mb-24">
                                <Typography className="font-bold mb-4 text-15">Role</Typography>
                                <Typography id="user-profile-level-name">{user.data.level.name}</Typography>
                            </div>

                            <div className="mb-24">
                                <Typography className="font-bold mb-4 text-15">Prénom</Typography>
                                <Typography id="user-profile-first-name">{user.data.firstName}</Typography>
                            </div>

                            <div className="mb-24">
                                <Typography className="font-bold mb-4 text-15">Nom de famille</Typography>
                                <Typography  id="user-profile-last-name">{user.data.lastName}</Typography>
                            </div>

                            <div className="mb-24">
                                <Typography className="font-bold mb-4 text-15">Courriel</Typography>
                                <Typography id="user-profile-email">{user.data.email}</Typography>
                            </div>

                            <div className="mb-24">
                                <Typography className="font-bold mb-4 text-15">Mot de passe</Typography>
                                <Typography>***********</Typography>
                            </div>

                        </CardContent>
                    </Card>
                </FuseAnimateGroup> 
            </div>
            <div className="flex flex-col md:w-320">
                <FuseAnimateGroup
                    enter={{
                        animation: "transition.slideUpBigIn"
                    }}
                >
                    <Card className="w-full mb-16">
                        <AppBar position="static" elevation={0}>
                            <Toolbar className="pl-16 pr-8">
                                <Typography variant="subtitle1" color="inherit" className="flex-1">
                                    Modifier mon Mot de passe
                                </Typography>
                            </Toolbar>
                        </AppBar>

                        <CardContent>
                            <EditPasswordForm {...props} />
                        </CardContent>
                    </Card>
                </FuseAnimateGroup>
            </div>
        </div>
    );
}

export default AboutTab;
