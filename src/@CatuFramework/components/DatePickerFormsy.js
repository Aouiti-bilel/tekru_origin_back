import React from 'react';
import {FormControl, FormHelperText, FormLabel, RadioGroup} from '@material-ui/core';
import {withFormsy} from 'formsy-react';
import _ from '@lodash';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

function DatePickerFormsy(props) {
    const importedProps = _.pick(props, [
        'autoComplete',
        'autoFocus',
        'children',
        'className',
        'disabled',
        'disableToolbar',
        'FormHelperTextProps',
        'format',
        'fullWidth',
        'id',
        'InputLabelProps',
        'inputProps',
        'InputProps',
        'inputRef',
        'label',
        'margin',
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
        'variant',
    ]);

    // An error message is returned only if the component is invalid
    const { errorMessage } = props

    const { value } = props;
    console.log(value);
    function changeValue(event, value) {
        console.log(event);
        props.setValue(event);
        if ( props.onChange ) {
            props.onChange(event);
        }
    }

    return (
        <MuiPickersUtilsProvider
            name={importedProps.name}
            utils={DateFnsUtils}
        >
            <KeyboardDatePicker
                {...importedProps}
                value={value}
                onChange={changeValue}
                error={Boolean(errorMessage)}
                helperText={errorMessage}
            />
        </MuiPickersUtilsProvider>
    );
}

export default React.memo(withFormsy(DatePickerFormsy));