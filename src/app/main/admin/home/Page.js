import React from 'react';
import {
    Card,
    CardContent,
    Icon,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Slide
} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import {FuseAnimate, FuseAnimateGroup} from '@fuse';
import clsx from 'clsx';
import { NavLinkAdapter } from '@fuse';
import adminMenuHelper from './adminMenuHelper';
import { useTranslation } from 'react-i18next';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles(theme => ({
    header: {
        background: 'linear-gradient(to right, ' + theme.palette.primary.dark + ' 0%, ' + theme.palette.primary.main + ' 100%)',
        color     : theme.palette.primary.contrastText
    },
    almostHidden: {
        opacity: '0.4',
    }
}));

function AdminHomePage() {
    const { t } = useTranslation();
    const classes = useStyles();
    const data = adminMenuHelper();

    return (
        <div className="w-full">

            <div className={clsx(classes.header, "flex flex-col items-center justify-center text-center p-16 sm:p-24 h-200 sm:h-300")}>

                <FuseAnimate animation="transition.slideUpIn" duration={400} delay={100}>
                    <Typography color="inherit" className="text-36 sm:text-56 font-light">
                        {t('administration')}
                    </Typography>
                </FuseAnimate>

                <FuseAnimate duration={400} delay={300}>
                    <Typography variant="subtitle1" color="inherit" className="opacity-75 mt-16 mx-auto max-w-512">
                        {t("administrationHome.home_sub_title")}
                    </Typography>
                </FuseAnimate>
            </div>

            <div>
                <FuseAnimateGroup
                    enter={{
                        animation: Transition.slideUpBigIn
                    }}
                    className="flex flex-wrap justify-center max-w-xl w-full mx-auto px-16 sm:px-24 py-32"
                >
                    {data.length > 0 ? data.map((category) => (
                        <div className="w-full max-w-512 pb-24 md:w-1/2 md:p-16" key={category.id}>
                            <Card elevation={1}>
                                <CardContent>
                                    <Typography className="font-bold px-16 pb-16 pt-8 strong" color="textPrimary">{category.title}</Typography>
                                    <List component="nav">
                                        {category.elements.map(item => (
                                            <ListItem 
                                                key={ item.id }
                                                button
                                                to={ item.url ? item.url : '#' }
                                                component={NavLinkAdapter}
                                                className={item.url ? '' : classes.almostHidden}
                                            >
                                                <ListItemIcon className="mr-0 min-w-40">
                                                    <Icon>{item.icon ? item.icon : 'settings'}</Icon>
                                                </ListItemIcon>
                                                <ListItemText primary={item.title}/>
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </div>
                    )) : (
                        <div className="w-full max-w-512 pb-24 md:w-1/2 md:p-16">
                            {t("error.access")}
                        </div>
                    )}
                </FuseAnimateGroup>
            </div>
        </div>
    );
}

export default AdminHomePage;
