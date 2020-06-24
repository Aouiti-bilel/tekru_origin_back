import React, {useEffect, useRef, useState} from 'react';
import {Button, InputAdornment, Icon} from '@material-ui/core';
import {TextFieldFormsy} from '@fuse';
import Formsy from 'formsy-react';
import * as authActions from 'app/auth/store/actions';
import {useDispatch, useSelector} from 'react-redux';

function ResetPasswordForm(props) {
    const dispatch = useDispatch();
    const formRef = useRef(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const resetpassword = useSelector(({
        auth
    }) => {
        return auth.resetpassword;
    });

    const propsSplit = props.location.pathname.split('reset-password/'); // Get the last part of the URL
    const token = propsSplit[propsSplit.length - 1];

    useEffect(() => {
        if (resetpassword.error && resetpassword.error.password) {
            formRef.current.updateInputsWithError({
                ...resetpassword.error
            });
            disableButton();
        }
        if (resetpassword.success === true) {
            disableButton();
            setTimeout(function () {
                props.history.push(`/login`);
            }, 3000);
        }
    }, [resetpassword, props]);
    
    function disableButton() {
        setIsFormValid(false);
    }

    function enableButton() {
        setIsFormValid(true);
    }

    function handleSubmit(model) {
        dispatch(authActions.resetPassword(model));
    }

    return (
        <Formsy
            onValidSubmit={handleSubmit}
            onValid={enableButton}
            onInvalid={disableButton}
            ref={formRef}
            className="flex flex-col justify-center w-full"
        >
            {resetpassword.success === true && 
                <div className="MuiFormControl-root MuiTextField-root mb-16 MuiFormControl-fullWidth"><p>Votre mot de passe a été réinitialisé, vous serez redirigé à la page de connexion.</p></div>
            }
            <TextFieldFormsy
                className="mb-16"
                autoFocus
                fullWidth
                type="password"
                name="password"
                label="Nouveau mot de passe"
                id="reset-password-password"
                value=""
                validations={{
                    minLength: 5,
                    maxLength: 25,
                    matchRegexp: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/,
                }}
                validationErrors={{
                    minLength: '5 caractères au minimum',
                    maxLength: '25 caractères au maximum',
                    matchRegexp: 'Doit être un mot de passe plus sécuritaire (au moins 1 lettre, 1 chiffre et 1 caractère spécial)',
                }}
                InputProps={{
                    endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">email</Icon></InputAdornment>
                }}
                variant="outlined"
                required
            />
            
            <TextFieldFormsy
                className="mb-16"
                autoFocus
                fullWidth
                type="password"
                name="password2"
                label="Confirmez mot de passe"
                id="reset-password-password2"
                value=""
                validations={{
                    equalsField: 'password'
                }}
                validationErrors={{
                    equalsField: 'Les mots passe ne sont pas les memes.',
                }}
                InputProps={{
                    endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">email</Icon></InputAdornment>
                }}
                variant="outlined"
                required
            />

            <TextFieldFormsy
                type="hidden"
                name="token"
                id="reset-password-token"
                value={token}
                validations={{
                    minLength: 30
                }}
                validationErrors={{
                    minLength: '',
                }}
                variant = "outlined"
            />

            <Button
                type="submit"
                variant="contained"
                color="primary"
                id="reset-password-button"
                className="w-224 mx-auto mt-16"
                aria-label="RESET"
                disabled={!isFormValid}
                value="legacy"
            >
                Envoyer
            </Button>

        </Formsy>
    );
}

export default ResetPasswordForm;
