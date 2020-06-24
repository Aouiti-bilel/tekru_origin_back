import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import { SelectFormsy } from '@fuse';
import { useTranslation } from 'react-i18next';

function Tab(props) {
    const { t } = useTranslation();

    // Set state using hooks
    const [data, setData] = useState({
        token_life: '30d',
    });

    // When props.data changes, setData
    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    // Token life options 
    const token_life_choses = [
        {
            name: t("calendar.nMonth", {count: 1}),
            value: '30d'
        }, {
            name: t("calendar.nWeek", { count: 2 }),
            value: '15d'
        }, {
            name: t("calendar.nWeek", { count: 1 }),
            value: '7d'
        }, {
            name: t("calendar.nDay", { count: 1 }),
            value: '1d'
        }
    ];

    const token_life_choses_ = token_life_choses.map(function (item) {
        return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>;
    });

    return (
        <div hidden={props.hidden}>
            <Typography variant="h6" className="mb-16">{t("misc")}</Typography>
            
            <SelectFormsy
                className="mb-16 w-full"
                fullWidth
                name="token_life"
                id="options-edit-token-life"
                label={t("optApp:lifetime_of_sessions")}
                value={data.token_life  || ''}
                required
            >
                {token_life_choses_}
            </SelectFormsy>
        </div>
    );
}

export default Tab;
