import React, {useEffect, useState} from 'react';
import { Typography } from '@material-ui/core';
import { TextFieldFormsy } from '@fuse';
import { useTranslation } from 'react-i18next';

function Tab(props) {
    const { t } = useTranslation();

    const [data, setData] = useState({
        email_defautl_sender_name: '',
        email_default_address: '',
        email_subject_prefix: '',
    });

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    return (
        <div hidden={props.hidden}>
            <Typography variant="h6" className="mb-16">{t("email")}</Typography>
            
            <TextFieldFormsy
                className="mb-16"
                fullWidth
                type="input"
                name="email_defautl_sender_name"
                id="options-edot-default-sender-name"
                label={t("optApp:default_sender_name")}
                value={data.email_defautl_sender_name}
                validations={{
                    // TODO: Add a regex to the name
                    maxLength: 50
                }}
                validationErrors={{
                    maxLength: t("error.form.maxLength", { N: 50 }),
                }}
                required
            />

            <TextFieldFormsy
                className="mb-16"
                fullWidth
                type="input"
                name="email_default_address"
                id="options-edit-default-address"
                label={t("optApp:default_email_address")}
                value={data.email_default_address}
                validations={{
                    isEmail: true
                }}
                validationErrors={{
                    isEmail: t("error.form.email")
                }}
                required
            />

            <TextFieldFormsy
                className="mb-16"
                fullWidth
                type="input"
                name="email_subject_prefix"
                id="options-edit-email-subject-prefix"
                label={t("optApp:email_subject_prefix")}
                value={data.email_subject_prefix}
                validations={{
                    // TODO: Add a regex to the name
                    maxLength: 25
                }}
                validationErrors={{
                    maxLength: t("error.form.maxLength", { N: 25 }),
                }}
                required
            />
        </div>
    );
}

export default Tab;
