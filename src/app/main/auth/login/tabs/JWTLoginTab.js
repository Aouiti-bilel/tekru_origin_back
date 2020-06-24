import React, {useEffect, useRef, useState} from 'react';
import {Button, InputAdornment, Icon} from '@material-ui/core';
import {TextFieldFormsy} from '@fuse';
import Formsy from 'formsy-react';
import * as authActions from 'app/auth/store/actions';
import {useDispatch, useSelector} from 'react-redux';

function JWTLoginTab(props)
{
    const dispatch = useDispatch();
    const login = useSelector(({auth}) => {
        return auth.login;
    });

    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);
    const emailInput = useRef(null);

    useEffect(() => {
        if ( login.error && (login.error.email || login.error.password) )
        {
            formRef.current.updateInputsWithError({
                ...login.error
            });
            disableButton();
        }
    }, [login.error]);

    function disableButton() {
        setIsFormValid(false);
    }

    function enableButton() {
        setIsFormValid(true);
    }

    function handleSubmit(model) {
        dispatch(authActions.submitLogin(model));
    }

    // Reset error when changing any component of the form
    function handelChange() {
        formRef.current.updateInputsWithError({
            email: null,
            password: null
        });
    }

    /**
     * Trim all white space from the email input
     * Bug fix #18; https://gitlab.globetechnologie.com/origin-enquetes-technico-legales-inc/intranet-frontend/issues/18
     * 12/12/2019 by Mohamed Kharrat
     */
    function trimWhiteSpace(e) {
        emailInput.current.setValue(e.target.value.replace(/\s/g, ''));
    }

    return (
        <div className="w-full">
            <Formsy
                onValidSubmit={handleSubmit}
                onValid={enableButton}
                onInvalid={disableButton}
                onChange={handelChange}
                ref={formRef}
                className="flex flex-col justify-center w-full"
            >
                <TextFieldFormsy
                    className="mb-16"
                    type="email"
                    name="email"
                    label="Email"
                    id="login-email"
                    value=""
                    onChange={trimWhiteSpace}
                    ref={emailInput} // important for the space trim
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
                />

                <TextFieldFormsy
                    className="mb-16"
                    type="password"
                    name="password"
                    label="Password"
                    id="login-password"
                    value=""
                    // removing the validation due to the report #19 par Patric
                    // updated on the 11 dec 2019
                    /*validations={{
                        minLength: 4
                    }}
                    validationErrors={{
                        minLength: 'La longueur minimale des caractères est de 4'
                    }}*/
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
                    id="login-button"
                    className="w-full mx-auto mt-16 normal-case"
                    aria-label="LOG IN"
                    disabled={!isFormValid}
                    value="legacy"
                >
                    Login
                </Button>

            </Formsy>

        </div>
    );
}

export default JWTLoginTab;
