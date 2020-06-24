import React, {useEffect, useRef, useState} from 'react';
import {Button, InputAdornment, Icon} from '@material-ui/core';
import {TextFieldFormsy} from '@fuse';
import Formsy from 'formsy-react';
import * as authActions from 'app/auth/store/actions';
import {useDispatch, useSelector} from 'react-redux';

function EditPasswordForm(props) {
    const dispatch = useDispatch();
    const formRef = useRef(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const editPassword = useSelector(({
        auth
    }) => {
        return auth.editpassword;
    });

    useEffect(() => {
        //console.log(editPassword);
        if (editPassword.error) {
            formRef.current.updateInputsWithError({
                ...editPassword.error
            });
            disableButton();
        }
        if (editPassword.success) {
            disableButton();
        }
    }, [editPassword, props]);

    function disableButton() {
        setIsFormValid(false);
    }

    function enableButton() {
        setIsFormValid(true);
    }

    function handleSubmit(model) {
        dispatch(authActions.editPassword(model));
    }

    const passwordValidation = {
        validations: {
            minLength: 5,
            maxLength: 25,
            matchRegexp: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/,
        },
        errors: {
            minLength: '5 caractères au minimum',
            maxLength: '25 caractères au maximum',
            matchRegexp: 'Doit être un mot de passe plus sécuritaire (au moins 1 lettre, 1 chiffre et 1 caractère spécial)',
        }
    }

    return (
        <Formsy
            onValidSubmit={handleSubmit}
            onValid={enableButton}
            onInvalid={disableButton}
            ref={formRef}
            className="flex flex-col justify-center w-full"
        >
            {
                editPassword.success &&
                <div className="MuiFormControl-root MuiTextField-root mb-16 MuiFormControl-fullWidth"><p>Votre mot de passe a été réinitialisé.</p></div>
            }
            <TextFieldFormsy
                className="mb-16"
                autoFocus
                fullWidth
                type="password"
                name="oldpassword"
                label="Ancien mot de passe"
                id="user-profile-edit-password-oldpassword"
                value=""
                validationErrors={{
                    required: 'Ce champs est obligatoire'
                }}
                InputProps={{
                    endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">vpn_key</Icon></InputAdornment>
                }}
                variant="outlined"
                required
            />

            <TextFieldFormsy
                className="mb-16"
                autoFocus
                fullWidth
                type="password"
                name="password"
                label="Nouveau mot de passe"
                id="user-profile-edit-password-password"
                value=""
                validations={passwordValidation.validations}
                validationErrors={passwordValidation.errors}
                InputProps={{
                    endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">vpn_key</Icon></InputAdornment>
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
                id="user-profile-edit-password-password2"
                value=""
                validations={{
                    equalsField: 'password'
                }}
                validationErrors={{
                    equalsField: 'Les mots passe ne sont pas les mêmes.',
                }}
                InputProps={{
                    endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">vpn_key</Icon></InputAdornment>
                }}
                variant="outlined"
                required
            />

            <Button
                type="submit"
                variant="contained"
                color="primary"
                className="w-224 mx-auto mt-16"
                aria-label="save"
                id="user-profile-edit-password-button"
                disabled={!isFormValid}
            >
                Enregistrer
            </Button>

        </Formsy>
    );
}

export default EditPasswordForm;
