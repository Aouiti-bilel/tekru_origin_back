import React, {useEffect, useRef, useState} from 'react';
import Switch from '@material-ui/core/Switch';
import { useDispatch } from 'react-redux';
import * as Actions from '../store/actions';
import userService from 'app/services/originServices/userService';

function UserSwitchComponent(props) {
    const valueRef = useRef(null);
    const dispatch = useDispatch();  
    const [value, setValue] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setValue(props.value);
    }, [props]);
    
    function handleChange() {
        setLoading(true);
        userService
            .delete(props.userId, false)
            .then(response => {
                setLoading(false);
                setValue(!value);
                dispatch(Actions.toggleUserActivation(props.userId));
                if (typeof props.handler === 'function') {
                    props.handler(props.userId);
                }
            })
            .catch(error => {
                setLoading(false);
                console.log(error);
            });
    }

    return (
        <Switch
            value="actif"
            checked={value}
            ref={valueRef}
            onChange = {handleChange}
            disabled={loading}
        />
    );
}
 
export default UserSwitchComponent;
