import React, {useEffect, useRef, useState} from 'react';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Formsy from 'formsy-react';
import {TextFieldFormsy, SelectFormsy} from '@fuse';
import Dialog from '@material-ui/core/Dialog';
import {
    useSelector,
    useDispatch
} from 'react-redux';
import * as Actions from '../store/actions';
import { OriginConfigs } from 'app/main/origin/originConfigs';
import { addValidationRule } from 'formsy-react'

/**
 * Data for the form
 *  */
const modules = OriginConfigs.map((item) => {
    const url = item.routes[(item.routes.length) - 1].path;
    return {
        name: item.name,
        url,
        slug: url.slice(1),
        access: item.auth,
    }
});

const item_types = [{
    name: 'Lien vers un module',
    value: 1
}, {
    name: 'Vers un lien web',
    value: 2
}, {
    name: 'Lien vers une page de catégories',
    value: 3
}];

function MenuItemEditomponent(props) {
    const dispatch = useDispatch();
    const formRef = useRef(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const {
        data,
        createDialog,
    } = useSelector(({
        navMenuAdmin
    }) => navMenuAdmin);

    const resetItem = {
        id: 0,
        type: 1,
        external: false,
        title: '',
        url: null,
        color: null,
        icon: '',
        module: '',
    };

    const [item, setItem] = useState({...resetItem});

    // The auths
    const authorizations = useSelector(({navMenuAdmin}) => navMenuAdmin.levels);
    let auths = null;
    for (let e in authorizations) {
        if (!auths) { auths = [] }
        auths.push({
            niveau: authorizations[e].niveau,
            description: authorizations[e].description
        });
    }

    const handleSubmit = () => {
        setLoading(true);
        const tmp = { ...item };
        tmp.auth = [auths.find(x => x.niveau === 1)]; // Admin has access by default
        switch (item.type) {
            case 3: // Category
                tmp.data = [];
                tmp.url = null;
                break;
            case 2: // Link
                tmp.url = null;
                break;
            default: // Module
                break;
        }
        dispatch(Actions.addItem(tmp));
        setLoading(false);
    }

    // Handle type changes
    const handleChange = (event) => {
        const { value, name } = event.target;
        if (value !== item[name]) {
            const tmp = {};
            setItem({
                ...item,
                ...tmp,
                [name]: value,
            });
        }
    }

    // Handle type and name changes
    const handleModuleChange = (event) => {
        const { value } = event.target;
        if (value !== item.url) {
            const tmp = {
                module: value,
                url: value,
            }
            const mod = modules.find(item => item.url === value);
            if (!item.title) {
                tmp.title = mod.name;
            }
            tmp.access = mod.access;
            setItem({
                ...item,
                ...tmp,
            })
        }
    }

    addValidationRule('isNotExistingName', function (values, value) {
        const names = (data ? data.map(item => item.title.toLowerCase()) : []);
        return names.indexOf(value.toLowerCase()) < 0;
    });

    useEffect(() => {
        if (createDialog) {
            setItem({...resetItem});
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createDialog]);

    return (
        <Dialog
            open={Boolean(createDialog)}
            fullWidth={true}
            onClose = {
                () => {
                    dispatch(Actions.closeDialog())
                }
            }>
                <div className="flex flex-col w-full">
                    <Formsy
                        onValidSubmit={handleSubmit}
                        onValid={() => {setIsFormValid(true)}}
                        onInvalid={() => {setIsFormValid(false)}}
                        ref={formRef}
                        className="p-24 flex flex-col justify-center w-full"
                        id="form"
                    >
                        <Typography variant="h5" component="h2" gutterBottom className="mb-32 w-full">
                            Création d'un nouveau item
                        </Typography>

                        <SelectFormsy
                            className="mb-16 w-full"
                            fullWidth
                            name="type"
                            id="type"
                            label="Type de lien"
                            autoComplete="off"
                            value={item.type}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        >
                            {item_types.map(function (item) {
                                return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>;
                            })}
                        </SelectFormsy>
                        
                        {
                            item.type === 1 && (
                                <SelectFormsy
                                    className="mb-16 w-full"
                                    fullWidth
                                    name="module"
                                    id="module"
                                    label="Module de lien"
                                    autoComplete="off"
                                    value={item.module}
                                    onChange={handleModuleChange}
                                    disabled={loading}
                                    required={(item.type === 1)}
                                >
                                    {modules.map(function (item) {
                                        return <MenuItem key={item.slug} value={item.url}>{item.name}</MenuItem>;
                                    })}
                                </SelectFormsy>
                            )
                        }

                        <TextFieldFormsy
                            className="mb-16 w-full"
                            fullWidth
                            type="input"
                            name="title"
                            id = "title"
                            label="Nom du lien"
                            autoComplete="off"
                            value={item.title}
                            onChange={handleChange}
                            disabled={loading}
                            validations={{
                                maxLength: 30,
                                isNotExistingName: true,
                            }}
                            validationErrors={{
                                required: 'Ce champs est obligatoire.',
                                maxLength: '30 caractères au maximum',
                                isNotExistingName: 'Ce nom existe déja',
                            }}
                            required
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            aria-label="submit"
                            id="submit"
                            value=""
                            disabled={!isFormValid || loading}
                        >
                            Créer l'élément
                        </Button>
                    </Formsy>
                </div>
        </Dialog>
    )
}
 
export default MenuItemEditomponent;
