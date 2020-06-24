import React, {useEffect, useRef, useState} from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInDataTable } from '../store/actions';

function UserCheckBoxComponent(props) {
    const valueRef = useRef(null);
    const dispatch = useDispatch();  
    const [id, setId] = useState(null);
    const [checked, check] = useState(false);
    const { selectedIds, data } = useSelector(({ userManager }) => userManager);

    useEffect(() => {
        setId(parseInt(props.id));
    }, [props]);

    useEffect(() => {
        if (id === 0) {
            check(selectedIds.length === data.length);
        } else {
            check(selectedIds.indexOf(id) >= 0);
        }
    }, [selectedIds, id, data.length]);
    
    function handleClick() {
        dispatch(selectUserInDataTable(id));
        if (typeof props.handler === 'function') {
            props.handler(id);
        }
    }

    return (
        <Checkbox
            ref={valueRef}
            onClick={handleClick}
            checked={checked}
        />
    );
}
 
export default UserCheckBoxComponent;
