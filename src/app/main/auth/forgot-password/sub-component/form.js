import React, {useEffect, useRef, useState} from 'react';
import {Button, InputAdornment, Icon} from '@material-ui/core';
import {TextFieldFormsy} from '@fuse';
import Formsy from 'formsy-react';
import * as authActions from 'app/auth/store/actions';
import {useDispatch, useSelector} from 'react-redux';

function ForgetPasswordForm(props) {
    const dispatch = useDispatch();
    const formRef = useRef(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const forgetPassword = useSelector(({
        auth
    }) => {
        return auth.forgetpassword;
    });

    useEffect(() => {
        if (forgetPassword.error && forgetPassword.error.email) {
            formRef.current.updateInputsWithError({
                ...forgetPassword.error
            });
            disableButton();
        } 
        if (forgetPassword.success === true) {
            setTimeout(function () {
                enableButton();
            }, 3000);
        }
    }, [forgetPassword]);

    function disableButton() {
        setIsFormValid(false);
    }

    function enableButton() {
        setIsFormValid(true);
    }

    function handleSubmit(model) {
        dispatch(authActions.forgetPassword(model));
    }

    return (
        <Formsy
            onValidSubmit={handleSubmit}
            onValid={enableButton}
            onInvalid={disableButton}
            ref={formRef}
            className="flex flex-col justify-center w-full"
        >
            {forgetPassword.success !== true && 
            <TextFieldFormsy
                className="mb-16"
                autoFocus
                fullWidth
                type="email"
                name="email"
                label="Email"
                id="forgot-password-email"
                value=""
                validations={{
                    isEmail: true
                }}
                validationErrors={{
                    isEmail: 'Doit etre une adresse email valide',
                }}
                InputProps={{
                    endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">email</Icon></InputAdornment>
                }}
                variant="outlined"
                required
            /> }
            {forgetPassword.success !== true && 
            <Button
                type="submit"
                variant="contained"
                color="primary"
                id="forgot-password-button"
                className="w-224 mx-auto mt-16"
                aria-label="RESET"
                disabled={!isFormValid}
                value="legacy"
            >
                Envoyer
            </Button>}
            {forgetPassword.success === true && 
            <p className="mt-16 mb-32" id="forgot-password-success-message">Un email est envoyé à votre adresse email avec les étapes à suivre pour réinitialiser votre mot de passe</p>}

        </Formsy>
    );
}

export default ForgetPasswordForm;
