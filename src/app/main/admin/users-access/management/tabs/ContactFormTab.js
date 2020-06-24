import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Card, AppBar, Toolbar, CardContent, InputLabel, MenuItem, Grid, makeStyles, TextField} from '@material-ui/core';
import { TextFieldFormsy, SelectFormsy } from '@fuse';

import ReactPhoneInput from 'react-phone-input-mui';
import 'react-phone-input-mui/dist/style.css';
import userService from 'app/services/originServices/userService';
import * as Actions from '../store/actions';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
    field: {
        margin: '10px 0',
        boxSizing: 'initial !important',
        '& *': {
            boxSizing: 'initial !important',
        }
    },
    countryList: {
        ...theme.typography.body1,
        zIndex: '110 !important',
    },
}));

function ContactFormTab(props) {
    const { t } = useTranslation();
    const { data, setPhoneNumbers, phoneNumbers } = props;
    const dispatch = useDispatch();
    const classes = useStyles();
    const [cityFilter, setCityFilter] = useState(null);
    const [filtredCities, setFiltredCities] = useState(null);
    const [loading, setLoading] = useState(false);

    const countries = useSelector(({ userManager }) => userManager.countries);
    const regions = useSelector(({ userManager }) => userManager.regions);
    const cities = useSelector(({ userManager }) => userManager.cities);

    // Special traitment
    const loadingParent = props.loading;
    useEffect(() => {
        setLoading(loadingParent);
    }, [loadingParent])

    // Getting the Countries from db
    useEffect(() => {
        let mounted = true;
        if (!countries) {
            setLoading(true);
            userService
                .getCountries()
                    .then(response => {
                        if (mounted){
                            dispatch(Actions.setCountries(response));
                            setLoading(false);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        setLoading(false);
                    });
        }
        return () => { mounted = false }
    }, [countries, dispatch]);


    useEffect(() => {
        let mounted = true;
        if (!regions) {
            setLoading(true);
            userService
                .getRegions()
                    .then(response => {
                        if (mounted){
                            dispatch(Actions.setRegions(response));
                            setLoading(false);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        setLoading(false);
                    });
        }
        return ()=>{ mounted = false }
    }, [regions, dispatch]);

    
    useEffect(() => {
        let mounted = true;
        if (!cities) {
            setLoading(true);
            userService
                .getCities()
                    .then(response => {
                        if (mounted){
                            dispatch(Actions.setCities(response));
                            setLoading(false);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        setLoading(false);
                    });
        }
        return ()=>{ mounted = false }
    }, [cities, dispatch]);
    
    useEffect(() => {
        if (!data || !cities || !cityFilter) {
            return;
        } else if (regions) {
            const region = regions.find(el => el.region_id === cityFilter )
            setFiltredCities( cities.filter(city => city.province_code === region.short_name) );
        }
    }, [cities, cityFilter, data, regions]);

    useEffect(() => {
        if (data){
            setCityFilter(data.regionId)
        }
    }, [data])

    return (
        <>
            <Card className="w-full mb-16" style={{
                overflow: 'visible'
            }}>
                <AppBar position="static" elevation={0}>
                    <Toolbar className="pl-16 pr-8">
                        <Typography variant="subtitle1" color="inherit" className="flex-1">
                        {t("UserAddUpdatePage.PhoneNumbers")}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <CardContent>
                    <Grid container spacing={1} className="mt-8 mb-16 ">
                        <Grid item sm={6} >
                            <InputLabel>  {t("User.CellPhone")} </InputLabel>
                            <ReactPhoneInput
                                value={phoneNumbers.telCellulaire}
                                id="telCellulaire"
                                name="telCellulaire"
                                onChange={val=>setPhoneNumbers.setTelCellulaire(val)}
                                component={TextField}
                                defaultCountry={'ca'}
                                fullWidth
                                disabled={loading}
                                inputClass={classes.field}
                                dropdownClass={classes.countryList}
                                containerStyle={{
                                    width: '100%'
                                }}
                                inputExtraProps={{
                                    margin: 'normal',
                                    autoComplete: 'phone',
                                    name: 'telCellulaire'
                                }}
                            />
                        </Grid>
                        <Grid item sm={6}>
                            <InputLabel>{t("User.HomePhone")}</InputLabel>
                            <ReactPhoneInput
                                value={phoneNumbers.telDomicile}
                                onChange={val=>setPhoneNumbers.setTelDomicile(val)}
                                id="telDomicile"
                                name="telDomicile"
                                component={TextField}
                                disabled={loading}
                                defaultCountry={'ca'}
                                fullWidth
                                inputClass={classes.field}
                                dropdownClass={classes.countryList}
                                containerStyle={{
                                    width: '100%'
                                }}
                                inputExtraProps={{
                                    margin: 'normal',
                                    autoComplete: 'phone',
                                    name: 'telDomicile'
                                }}
                            />
                        </Grid>
                        <Grid item sm={6} >
                            <InputLabel>{t("User.OfficePhone")}</InputLabel>
                            <ReactPhoneInput
                                value={phoneNumbers.telBureau}
                                onChange={val=>setPhoneNumbers.setTelBureau(val)}
                                id="telBureau"
                                name="telBureau"
                                component={TextField}
                                disabled={loading}
                                defaultCountry={'ca'}
                                fullWidth
                                inputClass={classes.field}
                                dropdownClass={classes.countryList}
                                containerStyle={{
                                    width: '100%'
                                }}
                                inputExtraProps={{
                                    margin: 'normal',
                                    autoComplete: 'phone',
                                    name: 'telBureau'
                                }}
                            />
                        </Grid>
                        <Grid item sm={6}>
                            <InputLabel>{t("User.Fax")}</InputLabel>
                            <ReactPhoneInput
                                value={phoneNumbers.telFax}
                                onChange={val=>setPhoneNumbers.setTelFax(val)}
                                id="telFax"
                                name="telFax"
                                component={TextField}
                                disabled={loading}
                                defaultCountry={'ca'}
                                fullWidth
                                inputClass={classes.field}
                                dropdownClass={classes.countryList}
                                containerStyle={{
                                    width: '100%'
                                }}
                                inputExtraProps={{
                                    margin: 'normal',
                                    autoComplete: 'phone',
                                    name: 'telFax'
                                }}
                            />
                        </Grid>
                        <Grid item sm={12} >
                            <InputLabel> {t("User.PhoneOther")}</InputLabel>
                            <ReactPhoneInput
                                value={phoneNumbers.telAutre}
                                onChange={val=>setPhoneNumbers.setTelAutre(val)}
                                id="telAutre"
                                name="telAutre"
                                component={TextField}
                                defaultCountry={'ca'}
                                fullWidth
                                disabled={loading}
                                inputClass={classes.field}
                                dropdownClass={classes.countryList}
                                containerStyle={{
                                    width: '100%'
                                }}
                                inputExtraProps={{
                                    margin: 'normal',
                                    autoComplete: 'phone',
                                    name: 'telAutre'
                                }}
                            />
                            </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Card className="w-full mb-16" >
                <AppBar position="static" elevation={0}>
                    <Toolbar className="pl-16 pr-8">
                        <Typography variant="subtitle1" color="inherit" className="flex-1">
                            {t("UserAddUpdatePage.Address")}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <CardContent>
                    <Grid container spacing={1} className="mt-8 mb-16 ">
                        <Grid item xs={12}>
                            <TextFieldFormsy
                                className="w-full"
                                    label= {t("UserAddUpdatePage.Address")}
                                    fullWidth
                                    disabled={loading}
                                    value={data.address || null}
                                    id="address"
                                    name="address"
                                />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <SelectFormsy
                                className="w-full"
                                fullWidth
                                autoWidth
                                label= {t("Address.Region")}
                                id="regionId"
                                name="regionId"
                                value={data.regionId || ''}
                                disabled={loading}
                                onChange={ev => {
                                    setCityFilter(ev.target.value);
                                }}
                            >
                                {
                                    Array.isArray(regions) && regions.map(el=>{
                                        return <MenuItem key={el.region_id} value={el.region_id}>{el.long_name}</MenuItem>
                                    })
                                }
                            </SelectFormsy>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <SelectFormsy
                                className="w-full"
                                fullWidth
                                autoWidth
                                label={t("Address.City")}
                                disabled={loading || !Array.isArray(filtredCities) || filtredCities.length === 0}
                                id="cityId"
                                name="cityId"
                                value={(Array.isArray(filtredCities) && filtredCities.length !== 0 ? data.cityId : 0)}
                            >
                                {
                                    Array.isArray(filtredCities) ? filtredCities.map(item => {
                                        return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                    }) : (
                                        <MenuItem value={0}>{t("UserAddUpdatePage.Region")}</MenuItem>
                                    )
                                }
                            </SelectFormsy>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextFieldFormsy
                                className="w-full"
                                label={t("Address.ZipCode")}
                                fullWidth
                                validationErrors={{
                                    required: t("ValidationError.ZipCode") ,
                                }}
                                value={data.codePostal || ""}
                                id="codePostal"
                                name="codePostal"
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <SelectFormsy
                                label= "Pays"
                                className="w-full"
                                fullWidth
                                autoWidth
                                disabled
                                id="countryId"
                                name="countryId"
                                value={data.countryId || 40}
                            >
                                {
                                    Array.isArray(countries) && countries.map(el=>{
                                        return <MenuItem key={el.country_id} value={el.country_id}>{el.short_name}</MenuItem>
                                    })
                                }
                            </SelectFormsy>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    )
}

export default ContactFormTab;
