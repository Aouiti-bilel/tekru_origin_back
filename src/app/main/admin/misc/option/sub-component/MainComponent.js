import React, {useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import { jwtService } from 'app/services/originServices';
import { Tabs, Tab, Button, makeStyles } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import Formsy from 'formsy-react';
import { useTranslation } from "react-i18next";

// import the tabs
import GeneralTab from "../tabs/GeneralTab";
import EmailTab from "../tabs/EmailTab";
import OthersTab from "../tabs/OthersTab";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

function MainComponent(props) {
    const { t } = useTranslation();

    // Set the tab styles
    const classes = useStyles();

    // States and hooks for the Tab Component
    const tabRef = useRef(null);
    const [index, setIndex] = useState(0);

    // The data state
    const [data, setData] = useState([]);

    // Form states and refs
    const formRef = useRef(null);
    const [isFormValid, setIsFormValid] = useState(false);

    // Handle tab change
    function handleTabChange(event, newValue) {
        setIndex(newValue);
    }

    // Returns the tab ids and classes
    function getTabPropsAfterChange(index) {
        return {
            id: `vertical-tab-${index}`,
            'aria-controls': `vertical-tabpanel-${index}`,
        };
    }

    // Disable or Enable button of the form
    function disableButton() { setIsFormValid(false); }
    function enableButton() { setIsFormValid(true); }


    // Handle the submit
    const [success, setSuccess] = useState(false);
    const buttonClassname = clsx({
        [classes.buttonSuccess]: success,
        //className="w-224 mx-auto mt-16"
    }, 'w-224 mx-auto mt-16');
    console.log(buttonClassname);

    function handleSubmit(model) {
        // Get the model and verify the data
        let temp = [];
        setSuccess(false);
        setIsFormValid(false)
        for (let index in data) {
            if (data[index] !== model[index] && model[index] !== undefined) {
                temp.push({
                    name: index,
                    value: model[index]
                });
            }
        }
        if (temp.length === 0) {
            setSuccess(false);
            setIsFormValid(true)
            return false; // No changes, so exit
        }
        // Send the data
        jwtService.updateConfigData(temp)
            .then(response => {
                setSuccess(true);
                setIsFormValid(true)
                console.log(response);
            }).catch(error => {
                console.log(error);
                setSuccess(false);
                setIsFormValid(true)
            });
    }

    useEffect(() => {
        // Get the data
        jwtService.getConfigData().then(response => {
            setData(response);
        }).catch(error => {
            console.log(error);
        });
    }, [setData]);

    return (
        <div className="md:flex max-w-2xl">
            <Tabs
                ref={tabRef}
                orientation="vertical"
                value={index}
                variant="scrollable"
                onChange={handleTabChange}
                aria-label="VerticalTabsOptions"
                className={classes.tabs}
            >
                <Tab label={t("misc")} {...getTabPropsAfterChange(0)} />
                <Tab label={t("email")} {...getTabPropsAfterChange(1)} />
                <Tab label={t("others")} {...getTabPropsAfterChange(2)} />
            </Tabs>
            
            <Formsy
                onValidSubmit={handleSubmit}
                onValid={enableButton}
                onInvalid={disableButton}
                ref={formRef}
                className="px-16 flex flex-col justify-center w-full"
                role="tabpanel"
                id={`vertical-tabpanel-${index}`}
                aria-labelledby={`vertical-tab-${index}`}
            >
                <GeneralTab hidden={index !== 0} data={data} />
                <EmailTab hidden={index !== 1} data={data} />
                <OthersTab hidden={index !== 2} data={data} pageTitle={t("others")} />
                
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    aria-label="EDIT"
                    id="options-submit-button"
                    value="legacy"
                    disabled={!isFormValid}
                    className={buttonClassname}
                >
                    {t('save')}
                </Button>
            </Formsy>
        
        </div>
    );
}
 
export default MainComponent;
