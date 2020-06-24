import React, {useRef, useState} from 'react';
import {
    Icon,
    IconButton,
    CircularProgress,
} from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as Actions from '../store/actions';
import userService from 'app/services/originServices/userService';
import * as FuseActions from 'app/store/actions';

function UserDeleteIconComponent(props) {
    const { t } = useTranslation();
    const valueRef = useRef(null);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    
    function handleClick() {
        setLoading(true);
        userService
            .delete(props.userId, true)
            .then(response => {
                setLoading(false);
                dispatch(
                    FuseActions.showMessage({
                        message: t('message.user_deleted'),
                        autoHideDuration: 3000,
                        variant: 'success' //success error info warning null
                    })
                );
                dispatch(Actions.deleteUser(props.userId));
                if (typeof props.handler === 'function') {
                    props.handler(props.userId);
                }
            })
            .catch(error => {
                setLoading(false);
                dispatch(
                    FuseActions.showMessage({
                        message: t('error.user_deleted'),
                        autoHideDuration: 3000,
                        variant: 'error' //success error info warning null
                    })
                );
                console.log(error);
            });
    }

    return (
        <IconButton
            ref={valueRef}
            onClick={handleClick}
            disabled={loading}
        >
            {loading ? <CircularProgress  style={{
                width: '25px', height: '25px'
            }} /> : <Icon>delete</Icon> }
        </IconButton>
    );
}
 
export default UserDeleteIconComponent;
