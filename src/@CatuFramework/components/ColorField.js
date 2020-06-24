import React, {useState, useEffect} from 'react';
import _ from '@lodash';
import { SketchPicker } from 'react-color'
import reactCSS from 'reactcss'
import InputAdornment from '@material-ui/core/InputAdornment';
import LensIcon from '@material-ui/icons/Lens';
import RemoveIcon from '@material-ui/icons/Remove';
import {TextFieldFormsy} from '@fuse';

function ColorField(props) {
    const importedProps = _.pick(props, [
        'autoComplete',
        'autoFocus',
        'children',
        'className',
        'defaultValue',
        'disabled',
        'FormHelperTextProps',
        'fullWidth',
        'id',
        'InputLabelProps',
        'inputProps',
        'InputProps',
        'inputRef',
        'label',
        'multiline',
        'name',
        'onBlur',
        'onChange',
        'onFocus',
        'placeholder',
        'required',
        'rows',
        'rowsMax',
        'select',
        'SelectProps',
        'type',
        'variant'
    ]);

    const [value, setValue] = useState(false)
    const [displayCP, displayColorPicker] = useState(false);

    const handleClick = () => {
        displayColorPicker(!displayCP);
    };

    const handleClose = () => {
        displayColorPicker(false);
    };

    const handleChange = (color) => {
        if (color && color.hex) {
            color = color.hex;
        }
        setValue(color);
        props.onPick((color ? color : ''));
    };

    useEffect(() => {
        if (props.value) {
            let defaultValue = props.value;
            if (typeof defaultValue === 'string') {
                defaultValue = defaultValue.toLowerCase();
                if (defaultValue.length === 6) {
                    defaultValue = "#" + defaultValue;
                }
            }
            setValue(defaultValue);
        }
        if (props.value === '' || props.value === null) {
            setValue(false);
        }
    }, [props]);

    const styles = reactCSS({
        'default': {
            color: {
                color: `${( (value && value.length > 0) ? value : '#ffffff' )}`,
                //border: '1px solid #ccc',
                background: 'rgba(0,0,0,0.78)',
                borderRadius: '10000px',
                cursor: 'pointer',
                fontSize: '15pt',
            },
            removeButton: {
                color: 'white',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '10000px',
                marginLeft: '5px',
                cursor: 'pointer',
                fontSize: '15pt',
            },
            swatch: {
                padding: '5px',
                background: '#fff',
                borderRadius: '1px',
                boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                display: 'inline-block',
                cursor: 'pointer',
            },
            popover: {
                position: 'absolute',
                zIndex: '102',
            },
            cover: {
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
            },
        },
    });

    return (
        <div>
            <TextFieldFormsy
                {...importedProps}
                value={value}
                autoComplete="off"
                InputProps= {
                    {  
                        
                        readOnly: true,
                        endAdornment: <InputAdornment position="end">
                            <LensIcon 
                                onClick={handleClick}
                                style={ styles.color }
                            />
                            <RemoveIcon
                                style={ styles.removeButton }
                                onClick={() => {
                                    handleChange(false);
                                }}
                            />
                        </InputAdornment>
                    }
                }
            />
            { displayCP && 
                <div style={ styles.popover }>
                    <div style={ styles.cover } onClick={ handleClose } />
                    <SketchPicker color={value} disableAlpha={props.disableAlpha ? props.disableAlpha : true} onChange={ handleChange } />
                </div> 
            }
        </div>
    );
}

export default ColorField;