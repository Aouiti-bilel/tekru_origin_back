import React, {
    useState,
    useEffect
} from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    makeStyles
} from '@material-ui/core';
import {TextFieldFormsy} from '@fuse';
import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from '@material-ui/core/Icon';
import localIcons from './icons-db.json';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
    },
    iconsGrid: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    iconsItem: {
        textAlign: 'center',
        width: '25%',
        flexGrow: 1,
        marginBottom: 10,
        position: 'relative',
        height: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#e8e6e6'
        }
    },
    iconsItemSelected: {
        backgroundColor: '#e8e6e6'
    },
    iconsItemCaption: {
        textTransform: 'uppercase',
        fontSize: 10,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        position: 'relative',
        zIndex: 2,
        maxWidth: 100
    },
    iconsItemIcon: {
        color: 'rgb(117, 117, 117)',
        fontSize: 48,
        width: 48,
        height: 48,
        marginBottom: 10
    },
    removeButton: {
        color: 'rgba(0,0,0,0.3)',
        marginLeft: '2px',
        cursor: 'pointer',
    },
    previewButton: {
        cursor: 'pointer',
    },
}));

export default function IconPickField(props) {
    const classes = useStyles();
    props = {
        cancelLabel: 'Cancel',
        label: 'Pick icon',
        modalTitle: 'Pick an icon',
        pickLabel: 'Pick',
        searchLabel: 'Search',
        niIcons: 'No icons',
        ...props
    }

    let defaultValue = false;
    if (props.value) {
        defaultValue = props.value.toLowerCase();
    }
    const [open, openDialog] = useState(false);
    const [icons] = useState(localIcons);
    const [filteredData, setFilteredData] = useState([]);
    const [selected, setSelected] = useState(defaultValue);
    const [search, setSearch] = useState('');

	function handleOpen() {
        openDialog(true);
	};

	function handleClose() {
        openDialog(false);
	};

	function pickAndClose() {
		handleClose();
    }
    
    const handleChange = (icon) => {
        if (icon && typeof icon === "string") {
            icon = icon.toLowerCase();
            setSelected(icon);
            props.onPick(icon);
        } else {
            setSelected(false);
            props.onPick(false);
        }
    };

    useEffect(() => {
        const getFilteredArray = () => {
            if (search.length === 0) { return icons; }
            return icons.filter(function (item) {
                const searches = item.name.split('_').map(icon => icon.search(search.toLowerCase()) !== -1);
                return searches.indexOf(true) > -1;
            });
        }
        setFilteredData(getFilteredArray());
    }, [search, icons]);
    
    useEffect(() => {
        if (props.value) {
            setSelected(props.value.toLowerCase());
        }
        if (props.value === null || props.value === '') {
            setSelected(false);
        }
    }, [props]);

    return (
        <div>
            <TextFieldFormsy
                className="mb-16"
                fullWidth
                type="input"
                autoComplete="off"
                name={props.name}
                required={props.required}
                value={(selected ? selected : '')}
                label={props.label} 
                InputProps={
                    {
                        readOnly: true,
                        endAdornment: <InputAdornment position="end">
                            <Icon
                                onClick={handleOpen}
                                className={classes.previewButton}
                            >
                                {selected ? selected.toLowerCase() : 'lens'}
                            </Icon>
                            <Icon
                                className={ classes.removeButton }
                                onClick={() => {
                                    handleChange(false);
                                }}
                            >
                                remove_circle
                            </Icon>
                        </InputAdornment>
                    }
                }
            />

            <Dialog
                open={open}
                fullWidth={true}
                onClose={handleClose}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    {props.modalTitle}
                    <div>
                        <TextField
                            type="text"
                            fullWidth
                            label={ props.searchLabel }
                            value={search}
                            onChange={(event) => {setSearch(event.target.value)}}
                            InputProps= {{
                                endAdornment: <InputAdornment position="end">
                                    <Icon>search</Icon>
                                </InputAdornment>
                            }}
                        />
                    </div>
                </DialogTitle>
                <DialogContent className={classes.iconsGrid} >
                    {
                        filteredData.length > 0
                        ? filteredData.map((icon, index) => {
                            let classname_ = classes.iconsItem;
                            if (selected && icon.name === selected) {
                                classname_ = classname_ + " " + classes.iconsItemSelected;
                            }
                            return (
                                <div key={index} className={classname_} onClick={() => handleChange(icon.name)}>
                                    <Icon className={classes.iconsItemIcon}>{icon.name}</Icon>
                                    <div className={classes.iconsItemCaption}>{icon.name.split('_').join(' ')}</div>
                                </div>
                            );
                        })
                        : props.noIcons
                    }
                </DialogContent>
                <DialogActions>
                    <Button
                        type="button"
                        aria-label={props.cancelLabel}
                        label={props.cancelLabel}
                        onClick={handleClose}
                    >
                        {props.cancelLabel}
                    </Button>
                    <Button
                        variant="outlined"
                        type="button"
                        aria-label={props.pickLabel}
                        disabled={!selected}
                        onClick={pickAndClose}
                    >
                        {props.pickLabel}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}