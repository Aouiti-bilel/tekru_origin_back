import React from 'react';
import {TextField} from '@material-ui/core';
import {withFormsy} from 'formsy-react';
import _ from '@lodash';

function TextFieldFormsy(props)
{
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

    const { errorMessage } = props
    const { value } = props || '';

    function changeValue(event)
    {
        props.setValue(event.currentTarget.value);
        if ( props.onChange )
        {
            props.onChange(event);
        }
    }

    return (
        <TextField
            {...importedProps}
            onChange={changeValue}
            value={value}
            error={Boolean(errorMessage)}
            helperText={errorMessage}
        />
    );
}

export default React.memo(withFormsy(TextFieldFormsy));
