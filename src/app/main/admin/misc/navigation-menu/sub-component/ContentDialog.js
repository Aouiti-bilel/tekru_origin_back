import React, {useEffect, useState} from 'react';
import {
    Slide,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from 'react-redux';
import Category from './CategoryComponent'
import * as Actions from '../store/actions';
import update from 'immutability-helper'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default (props) => {
    const dispatch = useDispatch();
    const [categories, setCategories] = useState([]);
    const [dialog, showDialog] = useState(false);

    const newItem = {
        title: '',
        image: '',
        color_text: null,
        color_background: null,
        link: '',
        external: false,
        isNew: true,
    }

    const {
        editableItem,
        categoryDialog
    } = useSelector(({navMenuAdmin}) => navMenuAdmin);

    const creatNew = () => {
        setCategories([...categories, newItem]);
    }

    const moveCard = (dragIndex, hoverIndex) => {
        const dragCard = categories[dragIndex]
        setCategories(
            update(categories, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragCard],
                ],
            })
        )
    }

    const deleteCard = (index) => {
        setCategories(
            categories.filter((category, i) => i !== index)
        )
    }
    
    const updateCard = (card, index) => {
        setCategories(
            categories.map((category, i) => {
                if (index === i) {
                    return card;
                } else {
                    return category;
                }
            })
        )
    }

    const closeAndSave = () => {
        dispatch(Actions.closeCategoryDialog());
        if (typeof props.update === 'function') {
            props.update(categories.filter(category => {
                return ( category.title && category.link );
            }));
        }
    }

    useEffect(() => {
        showDialog(Boolean(categoryDialog) && !!editableItem);
    }, [categoryDialog, editableItem]);
    
    useEffect(() => {
        if (editableItem && Array.isArray(editableItem.data) && editableItem.data.length > 0) {
            setCategories([...editableItem.data]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editableItem]);

    const useStyles = makeStyles({
        card: {
            maxWidth: 400,
            minHeight: 240,
            margin: '0px 10px 10px 10px',
            boxShadow: 'none',
            border: '3px dashed #8e8d8d',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fbfbfb',
            color: '#8e8d8d',
            cursor: 'pointer',
            transition: '0.2s',
            '&:hover': {
                background: '#e4e4e4',
                borderColor: '#424242',
                color: '#424242',
            }
        },
        addIcon: {
            fontSize: '6em',
        }
    });
    const classes = useStyles();

    return (
        (dialog && (
            <Dialog
                fullWidth={true}
                maxWidth={'lg'}
                TransitionComponent={Transition}
                onClose={closeAndSave}
                open={dialog}
            >
                <DialogTitle>
                    {
                        `Configuration de la page de catégorie(s) « ${editableItem.title} »`
                    }
                </DialogTitle>
                <DialogContent>
                    <div className="flex flex-wrap py-24">
                        {
                            categories.map((category, i) => {
                                return (
                                    <Category
                                        key={i}
                                        index={i}
                                        isNew={category.isNew}
                                        category={category}
                                        moveCard={moveCard}
                                        deleteCard={deleteCard}
                                        updateCard={updateCard}
                                    />
                                )
                            })
                        }
                        <Box 
                            m={1}
                            onClick={creatNew} 
                            className={`${classes.card} rounded w-full sm:w-1/2 lg:w-1/4 flex flex-col`} 
                        >
                            <AddCircleIcon className={classes.addIcon} />
                        </Box>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        type="button"
                        aria-label={props.cancelLabel}
                        label={props.cancelLabel}
                        onClick={creatNew}
                    >
                        Ajouter une catégorie
                    </Button>
                    <Button
                        variant="outlined"
                        type="button"
                        aria-label={props.pickLabel}
                        //disabled={!selected}
                        onClick={closeAndSave}
                    >
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>
        ))
    );
}
