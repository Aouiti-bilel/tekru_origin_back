import React, {useEffect, useState} from 'react';
import {InputAdornment, Typography, MenuItem, InputLabel, Card, AppBar, Toolbar, CardContent, Grid} from '@material-ui/core';
import {TextFieldFormsy, FuseAnimateGroup, SelectFormsy, CheckboxFormsy} from '@fuse';
import userService from 'app/services/originServices/userService';
import ProfessionnalDataSlider from '../components/ProfessionnalDataSlider'
import { useTranslation } from 'react-i18next';

function DonnéesProfessionnellesTab(props) {
    const { data, loading } = props;
    const [mentors, setMentors] = useState([]);
    const { t } = useTranslation();

    
    useEffect(() => {
        let mounted = true
        if (mounted){
            userService
            .getAllMentors()
            .then(response => {
                setMentors(response);
            })
            .catch(error => {
                console.log(error);
            });
        }
        return ()=>{ mounted = false } 
    }, [])

    return (
        <FuseAnimateGroup
            enter={{
                animation: "transition.slideUpBigIn"
            }}
            >
            <Card className="w-full mb-16">
                <AppBar position="static" elevation={0}>
                    <Toolbar className="pl-16 pr-8">
                        <Typography variant="subtitle1" color="inherit" className="flex-1">
                        {t("UserAddUpdatePage.Professionnal_data")}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <CardContent>
                    <Grid container spacing={3} className="mt-16 mb-16">
                        <Grid item sm={6} xs={12}>
                            <InputLabel>{t("User.HoursPerWeek")}</InputLabel>
                            <ProfessionnalDataSlider
                                loading = {loading}
                                usage = { 'weeklyHours' }
                            />
                        </Grid>
                        <Grid item sm={6} xs={12} className="mb-40">
                            <TextFieldFormsy
                                disabled = {loading}
                                required
                                validationErrors={{isDefaultRequiredValue: t("ValidationError.required")}}
                                label={t("ValidationError.required")}
                                id="TauxHoraire"
                                name="TauxHoraire"
                                value={data.TauxHoraire}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                                }}
                                fullWidth
                            />
                        </Grid>                   
                        <Grid item sm={6} xs={12}>
                            <InputLabel >{t("User.StandardComission")}</InputLabel>
                            <ProfessionnalDataSlider
                                loading = {loading}
                                usage = { 'standardComission' }
                            />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextFieldFormsy
                                disabled = {loading}
                                required
                                label={t("User.Function")}
                                id="fonction"
                                name="fonction"
                                value={data.fonction}
                                validations={{
                                    isSpecialWords: true
                                }}
                                validationErrors={{
                                    required: t("ValidationError.required"),
                                    isDefaultRequiredValue: t("ValidationError.required")
                                }}
                                fullWidth
                            />
                        </Grid>                  
                        <Grid item sm={6} xs={12}>
                            <CheckboxFormsy
                                disabled = {loading}
                                name="isMentor"
                                value={Boolean(data.isMentor)}
                                label={t("User.IsMentor")}
                            />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <SelectFormsy
                                disabled = {loading}
                                label={t("User.MentoredBy")}
                                className="w-full"
                                fullWidth
                                autoWidth   
                                id="mentor_Id_Emp"
                                name="mentor_Id_Emp"
                                value={data.mentor_Id_Emp || 0}
                            >
                                <MenuItem value={0} key={0}>{t("Global.None")}</MenuItem>
                                {
                                    mentors.map(el=>{
                                        return <MenuItem value={el.id_Emp} key={el.id_Emp}>{el.NomEmploye}</MenuItem>
                                    })
                                }
                            </SelectFormsy>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </FuseAnimateGroup>
                                
    )
}

export default DonnéesProfessionnellesTab
