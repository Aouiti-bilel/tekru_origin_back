import React, {useEffect, useRef, useState} from 'react';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Formsy from 'formsy-react';
import {TextFieldFormsy, SelectFormsy} from '@fuse';
import ColorField from '@CatuFramework/components/ColorField';
import IconPickField from '@CatuFramework/components/IconPickField/IconPickField';
import SettingsIcon from '@material-ui/icons/Settings';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Tooltip from '@material-ui/core/Tooltip';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import {
    useSelector,
    useDispatch
} from 'react-redux';
import * as Actions from '../store/actions';
import { OriginConfigs } from 'app/main/origin/originConfigs';
import ContentDialog from './ContentDialog';

import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';

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

/**
 * Page style
 * @param {*} name 
 * @param {*} personName 
 * @param {*} theme 
 */
const useStyles = makeStyles(theme => ({
    authCheckbox: {
        padding: '5px',
    },
    authCheckboxFormGroup: {
        margin: '10px 0px',
        padding: '0px 5px',
    }
}));

function MenuItemEditomponent(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const formRef = useRef(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [edited, setIsEdited] = useState(false);
    const [authsAllSelected, setAuthsAllSelected] = useState(false);
    const [grid, setGrid] = useState({
        type: 12,
        typeAdd: false,
    })
    const item_reset = {
        id: 0,
        type: 1,
        external: false,
        title: '',
        url: null,
        color: null,
        icon: '',
        auth: [],
        module: '',
    };
    const {loading} = props;

    const [item, setItem] = useState({...item_reset});
    const {
        editableItem
    } = useSelector(({
        navMenuAdmin
    }) => navMenuAdmin);


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
        let auth = [];
        if (Array.isArray(item.auth) && item.auth.length > 0) {
            auth = item.auth.map(e => {
                return auths.find(x => x.niveau === e);
            });
        }
        
        if (item.id !== 0) {
            dispatch(Actions.updateItem({
                ...item,
                auth
            }));
        } else {
            dispatch(Actions.addItem({
                ...item,
                auth
            }));
        }
        setIsEdited(false);
    }

    const checked = (element) => {
        if (!Array.isArray(item.auth) || item.auth.length <= 0) {
            return false
        }
        return (item.auth.indexOf(element) > -1)
    }

    // Handle changes on the most of the form elements
    const handleChange = (event) => {
        const { value, name } = event.target;
        if (value !== item[name]) {
            const tmp = {};
            if ((!item.data || item.data.length <= 0) && (name === 'type' && value === 3)) {
                tmp.url = null;
                tmp.data = [];
            }
            setIsEdited(true);
            setItem({
                ...item,
                ...tmp,
                [name]: value,
            });
        }
    }

    // Handle changes on the most of the form elements
    const handleChangeAuth = (event) => {
        const value = parseInt(event.target.value);
        if (item.auth.indexOf(value) > -1) {
            setItem({
                ...item,
                auth: item.auth.filter(e => e !== value),
            });
        } else {
            setItem({
                ...item,
                auth: [...item.auth, value]
            });
        }
        setIsEdited(true);
    }

    // Handle changes on the most of the form elements
    const toggleSelectAllAuths = () => {
        setIsEdited(true);
        if (!authsAllSelected) {
            setItem({
                ...item,
                access: 'login',
                auth: auths.map(e => e.niveau),
            });
        } else {
            setItem({
                ...item,
                access: null,
                auth: [],
            });
        }
    }

    const openCategoryDialog = () => {
        if (item.id !== 0) {
            dispatch(Actions.openCategoryDialog());
        }
    }

    useEffect(() => {
        if (editableItem && typeof editableItem === 'object' && editableItem.id) {
            let reset = {
                color: '',
                icon: '',
                type: 1,
                url: editableItem.url,
            };
            // Special treatment by type
            switch (editableItem.type) {
                case 2: // This is a link
                    if (reset.url === '#') {
                        reset.url = null;
                    }
                    break;
                case 3: // This is a category
                    
                    break;
                default: // Module
                    reset.module = editableItem.url;
                    reset.url = editableItem.url;
                    const module_ = modules.find(item => item.url === editableItem.url);
                    if (module_) {
                        reset.access = module_.access;
                    }
                    break;
            }
            // auths
            const auth = editableItem.auth.map(item => item.niveau);
            // Don't reset if the same url
            if (editableItem.id === item.id) {
                console.log('editng same id');
                setItem({
                    ...reset,
                    ...editableItem,
                    auth,
                    url: reset.url, // force the url
                    ...item,
                });
            } else {
                setItem({
                    ...reset,
                    ...editableItem,
                    auth,
                    url: reset.url, // force the url
                });
                setIsEdited(false);
            }
            
        } else if (editableItem === null) {
            setItem({
                ...item_reset
            });
            setIsEdited(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editableItem]);

    useEffect(() => {
        switch (item.type) {
            case 2: // Link
                setGrid({
                    type: 9,
                    typeAdd: 3,
                }); break;
            case 3: // Category
                setGrid({
                    type: 10,
                    typeAdd: 2,
                }); break;
            default: // Module
                setGrid({
                    type: 12,
                    typeAdd: null,
                }); break;
        }
    }, [item]);

    useEffect(() => {
        // Auths
        if (auths && item.auth.length < auths.length) {
            setAuthsAllSelected(false);
        } else {
            setAuthsAllSelected(true);
        }
    }, [item, auths]);

    useEffect(() => {
        console.log(item);
    }, [item]);

    return (
        (item.id === 0) ? (
            <Typography variant="body1" component="p" gutterBottom className="mb-32 w-full">
               Merci de sélectionner un élément à modifier.
            </Typography>
        ) : (
            <Formsy
                onValidSubmit={handleSubmit}
                onValid={() => {setIsFormValid(true)}}
                onInvalid={() => {setIsFormValid(false)}}
                ref={formRef}
                className="px-16 flex flex-col justify-center w-full"
                id="form"
                aria-labelledby={`navigation-menu-item-form-${item.id}`}
            >
                <Typography variant="h5" component="h2" gutterBottom className="mb-32 w-full">
                    {`Édition de l'item ${item.title}`}
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={grid.type}>
                        <SelectFormsy
                            className="mb-16 w-full"
                            fullWidth
                            name="type"
                            id="type"
                            label="Type de lien"
                            autoComplete="off"
                            value={item.type}
                            onChange={handleChange}
                            disabled={item.type === 3}
                            required
                        >
                            {item_types.map(function (item) {
                                return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>;
                            })}
                        </SelectFormsy>
                    </Grid>
                    {
                        item.type === 2 && (
                            <Grid item xs={grid.typeAdd}>
                                <FormControlLabel
                                    value={item.external}
                                    control={
                                        <Switch
                                            name = "external"
                                            id = "external"
                                            disabled={loading}
                                            checked = {
                                                Boolean(item.external)
                                            }
                                            onChange = {() => {
                                                setIsEdited(true);
                                                setItem({
                                                    ...item,
                                                    external: !item.external,
                                                });
                                            }}
                                        />
                                    }
                                    label="Lien externe"
                                    labelPlacement="top"
                                />
                            </Grid>
                        )
                    }
                    {
                        item.type === 3 && (
                            <Grid item xs={grid.typeAdd}>
                                <ContentDialog update={(data) => {
                                    setItem({
                                        ...item,
                                        data,
                                        url: null,
                                    });
                                    dispatch(Actions.updateItem({
                                        id: item.id,
                                        data,
                                        url: null,
                                    }));
                                }} />
                                <Tooltip title="Configuration" aria-label="configuration">
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        aria-label="edit-category"
                                        id="edit-category"
                                        onClick={openCategoryDialog}
                                        disabled={(item.type !== 3 || item.id === 0 || loading)}
                                    >
                                        <SettingsIcon />
                                    </Button>
                                </Tooltip>
                            </Grid>
                        )
                    }
                </Grid>
                
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
                            onChange={(event) => {
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
                                    setIsEdited(true);
                                    setItem({
                                        ...item,
                                        ...tmp,
                                    })
                                }
                            }}
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
                    }}
                    validationErrors={{
                        maxLength: '30 caractères au maximum',
                    }}
                    required
                />

                {
                    item.type === 2 && (
                        <TextFieldFormsy
                            className="mb-16 w-full"
                            fullWidth
                            type="url"
                            name="url"
                            id="url"
                            label="Lien"
                            autoComplete="off"
                            value={item.url}
                            onChange={handleChange}
                            validations={{
                                maxLength: 180,
                                isUrl: true,
                            }}
                            validationErrors={{
                                maxLength: '180 caractères au maximum',
                                isUrl: 'Doit être un lien valide',
                            }}
                            disabled={loading}
                            required={item.type === 2}
                        />
                    )
                }

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <ColorField
                            className="mb-16 w-full"
                            fullWidth
                            type="input"
                            name="color"
                            id="color"
                            label="Couleur du lien"
                            value={ item.color }
                            disabled={loading}
                            onPick = {
                                (color) => {
                                    if (color !== item.color) {
                                        setIsEdited(true);
                                        setItem({
                                            ...item,
                                            color
                                        });
                                    }
                                }
                            }
                            validations={{
                                maxLength: 7,
                            }}
                            validationErrors={{
                                maxLength: '7 caractères au maximum',
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <IconPickField 
                            className = "mb-16 w-full" 
                            disabled={loading}
                            onPick = {
                                (icon) => {
                                    if (!item.icon || icon !== item.icon) {
                                        setIsEdited(true);
                                        setItem({
                                            ...item,
                                            icon
                                        });
                                    }
                                }
                            }
                            value={ item.icon }
                            name="icon"
                            id="icon"
                            label="Icone du lien"
                            cancelLabel="Annuler"
                            modalTitle="Sélectionner une icône"
                            pickLabel="Choisir"
                            searchLabel="Rechercher"
                            noIcons="Pas d'icone"
                        />
                    </Grid>
                </Grid>

                <FormControl required component="fieldset">
                    <FormLabel component="legend">Autorisation du lien</FormLabel>
                    <FormGroup className={classes.authCheckboxFormGroup}>
                        {
                            auths === null ? 'Chargement...' : (
                                <>
                                    {auths.map(e => (
                                        <FormControlLabel
                                            key={e.niveau}
                                            color = "primary"
                                            control={<Checkbox value={e.niveau} checked={checked(e.niveau)} className={classes.authCheckbox} onChange={handleChangeAuth} />}
                                            label={e.description}
                                        />
                                    ))}
                                    <FormControlLabel
                                        key={0}
                                        color = "primary"
                                        control={<Checkbox checked={authsAllSelected} className={classes.authCheckbox} onChange={toggleSelectAllAuths} />}
                                        label={'Tous'}
                                    />
                                </>
                            )
                        }
                        
                    </FormGroup>
                </FormControl>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    aria-label="submit"
                    id="submit"
                    value=""
                    disabled={!isFormValid || loading || !edited}
                >
                    Enregistrer l'élément
                </Button>
            </Formsy>
        )
    );
}
 
export default MenuItemEditomponent;
