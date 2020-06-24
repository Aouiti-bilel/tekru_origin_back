import React, { useEffect, useState, Fragment } from 'react';
import {
    Icon,
    Typography,
    Button,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    CircularProgress,
} from '@material-ui/core';
import { FusePageSimple } from '@fuse';
import MenuItemEditomponent from './sub-component/MenuItemEditomponent';
import MenuList from './sub-component/MenuList';
import {
    makeStyles
} from '@material-ui/styles';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as Actions from './store/actions';
import * as MainActions from 'app/store/actions';
import reducer from './store/reducer';
import menusService from 'app/services/originServices/menusService';
import userService from 'app/services/originServices/userService';
import miscAdminService from 'app/services/originServices/miscAdminService';
import {
    DndProvider
} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import * as UserActions from 'app/auth/store/actions/user.actions';
import MenuItemDialog from './sub-component/MenuItemDialog';
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    header: {
        background: 'linear-gradient(to right, ' + theme.palette.primary.dark + ' 0%, ' + theme.palette.primary.main + ' 100%)',
        color: theme.palette.getContrastText(theme.palette.primary.main)
    },
    headerIcon: {
        position: 'absolute',
        top: -64,
        left: 0,
        opacity: .04,
        fontSize: 512,
        width: 512,
        height: 512,
        pointerEvents: 'none'
    },
    actionsButton: {
        marginRight: '10px',
        height: '32px',
    },
    confirmationButton: {
        minWidth: '170px'
    },
    circularProgress: {
        width: '20px !important',
        height: '20px !important',
    },

}));

function NavigationMenuPage(props) {
    const classes = useStyles(props);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const {
        data,
        synced,
        deletedItems,
        editableItem,
        createDialog,
    } = useSelector(({
        navMenuAdmin
    }) => navMenuAdmin);

    const searchNavTree = (nodes, matching) => {
        for (const node of nodes) {
            console.log(node.url, matching.url);
            const url = (node.url === '#' || node.url === '' ? null : node.url)
            if (node.title === matching.title && url === matching.url) {
                return node;
            } else if (node.children && node.children.length > 0) {
                let result = searchNavTree(node.children, matching);
                if (result) return result;
            }
        }
        return null;
    }

    const sumbmitMenu = () => {
        setLoading(true);
        if (data) {
            menusService.sync(data, deletedItems)
                .then((response) => {
                    dispatch(Actions.syncServer(true));
                    // Get the latest menu
                    menusService.get(true)
                        .then((response) => {
                            dispatch(Actions.setData(response));
                            if (editableItem && editableItem.id < 0) {
                                const editedElement_ = searchNavTree(response, editableItem);
                                dispatch(Actions.editItem({
                                    ...editableItem,
                                    id: editedElement_.id,
                                })); // Update the id of the current edited element
                            }
                        })
                        .catch(error => {
                            console.log(error)
                        });
                    // Update use accesses
                    userService.getMyAccesses()
                        .then((accesses) => {
                            dispatch(MainActions.updateNavigation(response)); // Update the main menu
                            dispatch(UserActions.updateAccesses(accesses)); // Refrech the access of 
                        })
                        .catch(error => {
                            console.log(error)
                        });
                    // Show message
                    dispatch(MainActions.showMessage({
                        message: "Le menu est mis à jour.",
                        variant: 'success' // success error info warning null
                    }));
                    setLoading(false);
                })
                .catch(error => {
                    console.log('menusService.sync', error);
                    dispatch(Actions.syncServer(false));
                    dispatch(MainActions.showMessage({
                        message: "Erreur lors de la mise à jour du menu.",
                        variant: 'error' // success error info warning null
                    }));
                    setLoading(false);
                });
            return;
        } else {
            setLoading(false);
        }
    }

    const handleSubmitMenu = () => {
        dispatch(MainActions.openDialog({
            children: (
                <Fragment>
                    <DialogTitle id="alert-dialog-title">Êtes-vous sûr?</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            En confirmant les modifications que vous avez apportées, tous les utilisateurs qui actualisent la page pourront voir le nouveau menu.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=> dispatch(MainActions.closeDialog())} color="primary" autoFocus>
                            Annuler
                        </Button>
                        <Button 
                            onClick={
                                () => {
                                    sumbmitMenu();
                                    dispatch(MainActions.closeDialog());
                                }
                            }
                            variant = "contained"
                            color="primary"
                        >
                            Confirmer
                        </Button>
                    </DialogActions>
                </Fragment>
                )
        }));
        return;
    }
    
    useEffect(() => {
        dispatch(Actions.resetApp());
        // Get users leveles
        miscAdminService.getLevels()
            .then(data => {
                dispatch(Actions.setLevels(data));
            })
            .catch(error => {
            });
        // Get the latest menu
        menusService.get(true)
            .then((response) => {
                dispatch(Actions.setData(response));
            })
            .catch(error => {
            });
    }, [dispatch]);

    return (
        <FusePageSimple
            header={
                <div className="flex flex-1 items-center justify-between p-24">
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <Icon className="text-18" color="action">build</Icon>
                            <Icon className="text-16" color="action">chevron_right</Icon>
                            <Typography
                                component={Link}
                                role="button"
                                to="/admin"
                                color="textSecondary"
                            >
                                Administration
                            </Typography>
                            <Typography color="textSecondary" style={{
                                margin: '0px 5px',
                            }}>/</Typography>
                            <Typography color="textSecondary"><strong>Gestion du menu latéral principal</strong></Typography>
                        </div>
                    </div>
                </div>
            }
            contentToolbar={
                <div className='px-24' >
                    <Button 
                        size="small"
                        className={classes.actionsButton}
                        onClick={() => {
                            dispatch(Actions.createItem());
                        }}
                        variant="outlined"
                        color="primary"
                        disabled={loading  || !data || createDialog}
                    >
                        Créer
                    </Button>
                    <Button
                        size="small"
                        className={classes.actionsButton+' '+classes.confirmationButton}
                        variant="outlined"
                        color="primary"
                        onClick={handleSubmitMenu}
                        disabled={synced || loading}
                    >
                        {
                            loading ? (
                                <CircularProgress className={classes.circularProgress} />
                            ) : (
                                'Entregister le menu'
                            )
                        }
                    </Button>
                    <MenuItemDialog></MenuItemDialog>
                </div>
            }
            content={
                <DndProvider backend = {HTML5Backend}>
                    <div className="md:flex max-w-2xl px-24">
                        <div className="flex flex-col flex-1 md:pr-32">
                            <div className="md:flex max-w-2xl">
                                <MenuList loading={loading}/>
                            </div>
                        </div>
                        <div className="flex flex-col flex-1 md:pr-32">
                            <MenuItemEditomponent loading={loading}/>
                        </div>
                    </div>
                </DndProvider>
            }
        />
    )
}

export default withReducer('navMenuAdmin', reducer)(NavigationMenuPage);