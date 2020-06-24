import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {InputAdornment, Typography, Radio, FormControlLabel, MenuItem, Card, AppBar, Toolbar, CardContent, Grid} from '@material-ui/core';
import {Email, AccountCircle} from '@material-ui/icons';
import {TextFieldFormsy, SelectFormsy, RadioGroupFormsy} from '@fuse';
import userService from 'app/services/originServices/userService';
import { setUsersLevels } from '../store/actions';
import DatePickerFormsy from '@CatuFramework/components/DatePickerFormsy';
import { useTranslation } from 'react-i18next';


export default ({ classes, data, setDate, date, loading}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const usersLevels = useSelector(({ userManager }) => userManager.usersLevels);

    useEffect(() => {
        if (!usersLevels) {
            userService
                .getLevels()
                    .then(response => {
                        dispatch(setUsersLevels(response));
                    })
                    .catch(error => {
                        console.log(error);
                    });
        }
    }, [usersLevels, dispatch]);

    return (
        <Card
            className="w-full mb-16"
        >
            <AppBar position="static" elevation={0}>
                <Toolbar className="pl-16 pr-8">
                    <Typography variant="subtitle1" color="inherit" className="flex-1">
                    { t("UserAddUpdatePage.Personnal_data") }
                    </Typography>
                </Toolbar>
            </AppBar>
            <CardContent>
                <Grid container spacing={1} className="mt-8 mb-16">
                    <Grid item sm={6}>
                        <TextFieldFormsy
                            required
                            disabled={loading}
                            label={t("User.FamilyName")}
                            validations={{
                                isSpecialWords: true,
                            }}
                            validationErrors={{
                                isSpecialWords: t("ValidationError.letters_only")  ,
                                isDefaultRequiredValue:   t("ValidationError.required") ,
                            }}
                            autoFocus
                            id="nomFamille"
                            name="nomFamille"
                            value={data.nomFamille || null}
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" className={classes.icons}>
                                        <AccountCircle />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item sm={6} >
                        <TextFieldFormsy
                            disabled={loading}
                            required
                            label={t("User.Name")}
                            validations={{
                                isSpecialWords: true
                            }}
                            validationErrors={{
                                isSpecialWords: t("ValidationError.letters_only") ,
                                isDefaultRequiredValue: t("ValidationError.required") ,
                            }}
                            id="prenom"
                            name="prenom"
                            value={data.prenom || null}
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" className={classes.icons}>
                                        <AccountCircle />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item sm={12}>
                        <TextFieldFormsy
                            disabled={loading}
                            className="mt-8 mb-16"
                            id="courriel"
                            required
                            name="courriel"
                            label={t("User.Email")}//à refaire
                            type="email"
                            value={data.courriel || null}
                            fullWidth
                            validations={{
                                isEmail: true,
                            }}
                            validationErrors={{
                                isEmail: t("ValidationError.Mail") ,
                                isDefaultRequiredValue: t("ValidationError.required"),
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" className={classes.icons}>
                                        <Email />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item  sm={6}>
                        <RadioGroupFormsy 
                            disabled={loading} 
                            label={t("User.Sexe")}
                            aria-label="sexe" 
                            name="sexe" 
                            value={data.sexe || ''} 
                            required 
                            validationErrors={{isDefaultRequiredValue: t("ValidationError.required")}}> 
                            <FormControlLabel
                                value="M"
                                disabled={loading}
                                control={<Radio color='default' />}
                                label={t("User.Man")}
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="F"
                                disabled={loading}
                                control={<Radio color='default' />}
                                label={t("User.Woman")}
                                labelPlacement="end"
                            />
                        </RadioGroupFormsy>
                    </Grid>
                    <Grid item sm={6}>
                        <DatePickerFormsy
                            disabled={loading}
                            name='dateFete'
                            fullWidth
                            disableToolbar
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label={t("User.Birthdate")}
                            value={data.dateFete}
                        />
                    </Grid>
                    <Grid item sm={12} xs={12}>
                        <SelectFormsy
                            className="w-full"
                            disabled={loading}
                            fullWidth
                            autoWidth   
                            name="niveau"
                            id="niveau"
                            label={t("User.AccessLevel")}
                            value={data.niveau || 1}
                            required
                        >
                            {
                                Array.isArray(usersLevels) && usersLevels.map(el=>{
                                    return <MenuItem key={el.niveau} value={el.niveau}>{el.description}</MenuItem>
                                })
                            }
                        </SelectFormsy>
                    </Grid>
                </Grid>
        </CardContent>
    </Card>
    )
}