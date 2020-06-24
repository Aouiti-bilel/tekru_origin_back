import React, {useEffect, useRef, useState} from 'react';
import Switch from '@material-ui/core/Switch';

function AccessSwitchComponent(props) {
    const valueRef = useRef(null);
    let [value, setValue] = useState(false);

    useEffect(() => {
        setValue(props.value);
    }, [props]);
    
    function handleChange() {
        props.handler(props.ids);
        setValue(!value);
    }

    return (
        <Switch
            checked={value}
            ref={valueRef}
            onChange = {
                () => handleChange()
            }
        />
    );
}
 
export default AccessSwitchComponent;
