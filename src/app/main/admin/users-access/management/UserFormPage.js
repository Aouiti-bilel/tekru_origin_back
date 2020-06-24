import React, {useEffect, useState, useRef} from 'react';
import {Button, Typography, Avatar, CircularProgress, Grid} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import {FuseAnimate, FusePageSimple} from '@fuse';
import {useDispatch, useSelector} from 'react-redux';
import Formsy from 'formsy-react';
import userService from 'app/services/originServices/userService';
import * as Actions  from './store/actions';
import reducer from "./store/reducer";
import withReducer from "app/store/withReducer";
import PersonalFormTab from './tabs/PersonalFormTab'
import ContactFormTab from './tabs/ContactFormTab'
import ProfessionalFormTab from './tabs/ProfessionalFormTab';
import { updateUserOptinalData } from './store/actions';
import * as FuseActions from 'app/store/actions';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Link } from "react-router-dom";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useTranslation } from 'react-i18next';


const useStyles = makeStyles(theme => ({
    layoutHeader: {
        height                        : 145,
        minHeight                     : 145,
        [theme.breakpoints.down('md')]: {
            height   : 220,
            minHeight: 220,
        }
    },
    editDiv: {
        background: '#00000080',
        position: 'absolute',
        width: '100%',
        height: '40%',
        textAlign: 'center',
        bottom: 0,
        color: theme.palette.common.white,
        transition: '0.3s',
        '&:hover': {
            background: '#00000080',
            height: '100%',
        },
        'span': {
            fontSize: theme.typography.subtitle1.fontSize,
        },
    },
    input: {
        display: 'none',
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.grey[800],
        color: theme.palette.common.white,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    buttonRightGrid: {
        textAlign: 'right',
        marginBottom: '18px'
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
        display: 'inline-block'
    },
    buttonProgress: {
        color: theme.palette.common.white,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    icons: {
        color: 'rgba(0, 0, 0, 0.54)',
        marginRight: '11px',
    }
}));

function UserFormPage(props) {
    const { t } = useTranslation();
    const form = useRef();
    const dispatch = useDispatch();
    const classes = useStyles(props);
    const [loading, setLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    const [date, setDate] = useState(null)
    const [user, setUser] = useState({});
    const [telCellulaire, setTelCellulaire] = useState("")
    const [telDomicile, setTelDomicile] = useState("")
    const [telBureau, setTelBureau] = useState("")
    const [telAutre, setTelAutre] = useState("")
    const [telFax, setTelFax] = useState("");

    const users = useSelector(({ userManager }) => userManager.data);

    const standardComission = useSelector(({ userManager }) => userManager.standardComission);
    const weeklyHours = useSelector(({ userManager }) => userManager.weeklyHours);

    useEffect(() => {
        const { match } = props;
        const { params } = match;
        if (params.uid) {
            setUserLoading(true);
            const uid = parseInt(params.uid);
            if (users && users.length > 0) {
                console.log('Yes users, lets filter');  //DEBUG
                const user_ = users.find(item => item.id_Emp === uid);
                console.log('user', user_);  //DEBUG
                if (user_) {
                    if (!user_._loadedFlag) {
                        userService.fetchOptinalData(user_.id_Emp)
                            .then(response => {
                                dispatch(updateUserOptinalData(user_.id_Emp, response));
                                setUser(beforeSetUserHook({
                                    ...user_,
                                    ...response,
                                }));
                                setUserLoading(false);
                            })
                            .catch(error => {
                                throw error;
                            });
                    } else {
                        setUser(beforeSetUserHook(user_));
                    }
                }
                setUserLoading(false);
            } else {
                userService.fetchOptinalData(uid, true)
                    .then(response => {
                        setUser(beforeSetUserHook(response));
                        dispatch(updateUserOptinalData(uid, response));
                        setUserLoading(false);
                    })
                    .catch(error => {
                        if (error === 'NO_USER') {
                            props.history.push('/admin/users/add');
                            setUserLoading(false);
                        }
                    });
            }
        }
    }, [props, dispatch, users]);

    const beforeSetUserHook = (user) => {
        if (!user) {
            return user;
        }
        // Setting the date
        let dateFete = null;
        if (user.dateFete) {
            if (/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(user.dateFete)) {
                dateFete = new Date(user.dateFete);
            } else {
                dateFete = new Date(parseInt(user.dateFete))
            }
        }

        //setDate(dateFete_);
        setTelAutre(user.telAutre || '');
        setTelBureau(user.telBureau || '');
        setTelCellulaire(user.telCellulaire || '');
        setTelDomicile(user.telDomicile || '');
        setTelFax(user.telFax || ''     );

        dispatch(Actions.setWeeklyHours(user.nb_Hres_Sem));
        dispatch(Actions.setStandardCommission(parseInt(user.CommissionStandard*100)));

        return {
            ...user,
            dateFete,
        };
    }


    /**
     * @author Karim bouhnek
     * @author Selim Manai
     * @version 2.0
     * Submiting the user
     */
    function submitForm(model){
        setLoading(true); // Disable all the form
        const data = {
            id_Emp: user.id_Emp,
            ...model, // Protect the user state from mutation
            CommissionStandard : parseInt(standardComission)/100,
            nb_Hres_Sem : weeklyHours,
            telAutre,
            telCellulaire,
            telDomicile,
            telFax,
            telBureau
        }
        // Prepare the data for submit
        data.isMentor = Boolean(data.isMentor) ? 1 : 0;
        data.regionId = data.regionId ? data.regionId : null;
        data.cityId = data.cityId ? data.cityId : null;
        data.TauxHoraire = parseFloat(data.TauxHoraire);

        userService.up(data)
            .then((response) => { // TODO id user
                let message = t("umApp:message.user_added");
                if (!data.id_Emp){
                    dispatch(Actions.addUser(data));
                    message = t("umApp:message.user_updated")
                } else {
                    dispatch(Actions.updateUser(data));
                }
                
                dispatch(
                    FuseActions.showMessage({
                        message,
                        autoHideDuration: 3000,
                        variant: 'success' //success error info warning null
                    })
                );
                userService
                    .getAll()
                    .then(response => {
                        //console.log(response);
                        dispatch(Actions.setUsers(response));
                        props.history.push('/admin/users/list');
                        setLoading(false);
                    })
                    .catch(error => {
                        setLoading(false);
                        console.log(error);
                    });
            }).catch((error) => {
                console.log(error)
                dispatch(
                    FuseActions.showMessage({
                        message: t("umApp:error.user_submit_error"),
                        autoHideDuration: 3000,
                        variant: 'error' //success error info warning null
                    })
                );
                setLoading(false);
            }
        );
    }

    return (
        <FusePageSimple 
            classes={{
                header : classes.layoutHeader,
                toolbar: "px-16 sm:px-24"
            }}
            header={
                <div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-end">
                    <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
                        <Button
                            variant="outlined"
                            color="default"
                            component={Link}
                            to="/admin/users/list"
                            children={<ArrowBackIcon/>}
                        />
                        <FuseAnimate animation="transition.expandIn" delay={300}>
                            <Avatar className="md:mx-24 w-96 h-96" src="assets/images/avatars/profile.jpg" >
                                {
                                    /*<input
                                        accept="image/*"
                                        className={classes.input}
                                        id="contained-button-file"
                                        type="file"
                                        ref={fileInput}
                                        onChange={handleEditProfileImage}
                                    />
                                    <label htmlFor="contained-button-file">
                                        <Button
                                            color="primary" hidden={!(user && user.id_Emp)} component="span" className={classes.editDiv}>
                                            Modifier
                                        </Button>
                                    </label>*/
                                }
                            </Avatar>
                        </FuseAnimate>
                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                            <Typography variant="h4" color="inherit">{user && user.id_Emp? t("umApp:edit_user") : t("edit_user:create_user")}</Typography>
                        </FuseAnimate>
                        {
                            //<ProfilePictureAvatar form = { user }/>
                        }
                    </div>
                    
                </div>
            }
            content={
                userLoading ? 
                    (
                        <div style={{padding: '100px 50px', textAlign: 'center'}}>
                            <div style={{marginBottom: '30px'}}>{t('loading')}</div>
                            <LinearProgress variant="query" color="secondary"  />
                        </div>
                    ) : (
                        <Formsy
                            id="form"
                            ref={form}
                            onValidSubmit={submitForm}
                            className="pt-0 p-16 sm:p-24 sm:pt-0 max-w-2xl"
                        >
                            <Grid container spacing={1}>
                                <Grid item sm={10} >
                                    
                                </Grid>
                                <Grid item sm={3} className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start my-12">
                                    <Button
                                        className="whitespace-no-wrap"
                                        variant="outlined"
                                        disabled={loading}
                                        type='submit'
                                        style={{
                                            width: '170px',
                                        }}
                                    >
                                        {loading ? <CircularProgress  style={{
                                            width: '25px', height: '25px'
                                        }} /> : t("save") }
                                    </Button>
                                </Grid>
                            </Grid>
                            <PersonalFormTab
                                data={user}
                                classes={classes}
                                loading={loading}
                                date = { date }
                                setDate = { setDate }
                            />
                            <ContactFormTab
                                setPhoneNumbers= {{
                                    setTelAutre,
                                    setTelBureau,
                                    setTelCellulaire,
                                    setTelDomicile,
                                    setTelFax
                                }}
                                phoneNumbers= {{
                                    telAutre,
                                    telBureau,
                                    telCellulaire,
                                    telDomicile,
                                    telFax
                                }}
                                data={user}
                                classes={classes}
                                loading={loading}
                            />
                            <ProfessionalFormTab
                                data={user}
                                classes={classes}
                                loading={loading}
                            />
                            <Grid container spacing={1}>
                                <Grid item sm={10} >
                                    
                                </Grid>
                                <Grid item sm={3} className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start my-12">
                                    <Button
                                        className="whitespace-no-wrap"
                                        variant="outlined"
                                        disabled={loading}
                                        type='submit'
                                        style={{
                                            width: '170px',
                                        }}
                                    >
                                        {loading ? <CircularProgress  style={{
                                            width: '25px', height: '25px'
                                        }} /> : t("save")  }
                                    </Button>
                                </Grid>
                            </Grid>
                        </Formsy>
                    )
            }
            innerScroll
        />
    )
}
export default withReducer("userManager", reducer)(UserFormPage);
