import React, {
    useEffect,
    useState,
    useCallback
} from 'react';
import {
    makeStyles,
    CircularProgress,
    Button
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import {
    useDropzone
} from 'react-dropzone';
import { contentService } from 'app/services/originServices';
import store from 'app/store';
import * as Actions from 'app/store/actions';
import * as CmsActions from '../store/actions';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
    home_background_image: {
        maxWidth: '300px',
    },
    rootDropContainer: {
        position: 'relative',
    },
    removeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        minWidth: '0px',
        color: '#e01b1b',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'sans-serif',
        '> em': {
            fontSize: '.8rem'
        }
    },
    containerEM: {
        fontSize: ".8rem"
    },
    dropzone: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '162px 40px',
        margin: '15px 0px',
        borderWidth: '2px',
        borderRadius: '2px',
        borderColor: '#d5d5d5',
        borderStyle: 'dashed',
        backgroundColor: '#fafafa',
        color: 'black',
        boxShadow: 'inset 0 0 0 1000px rgba(255, 255, 255, 0.67)',
        outline: 'none',
        textAlign: 'center',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'border .24s ease-in-out, color .24s ease-in-out, box-shadow .24s ease-in-out',
        '&:hover': {
            color: '#424242',
            borderColor: '#424242',
            boxShadow: 'inset 0 0 0 1000px rgba(255, 255, 255, 1)',
            borderStyle: 'solid',
        },
        '&:focus': {
            borderColor: '#2196f3',
        },
    },
    "container_disabled": {
        opacity: 0.6
    },
}));

function CoverImageEditor(props) {
    const { t } = useTranslation();
    // Set the tab styles
    const classes = useStyles();

    // Set state using hooks
    const [bgImage, setBgImage] = useState(false);
    const [sendingPicture, setSendingPicture] = useState(false);

    let { post_id } = props;

    // Handel file upload
    const handelDropFile = useCallback(
        (file) => {
            setSendingPicture(true);
            if (!file[0]) {
                setSendingPicture(false);
                store.dispatch(Actions.showMessage({
                    message: t("error.upload.file_size"),
                    variant: 'error',
                }));
                return false;
            }
            contentService.uploadImage(file[0], post_id, 'cover-image')
                .then((response) => {
                    setSendingPicture(false);
                    // Show a message
                    store.dispatch(
                        Actions.showMessage({
                            message: t("success.upload.image"),
                            autoHideDuration: 3000,
                            variant: 'success' //success error info warning null
                        }));
                    // Dispatch data 
                    store.dispatch(CmsActions.updateContent(post_id, response, 'featured_image'));
                    store.dispatch(CmsActions.updateContent(post_id, Date.now(), 'updatedAt'));
                })
                .catch(error => {
                    setSendingPicture(false);
                    store.dispatch(Actions.showMessage({
                        message: (error[0] !== undefined ? error[0].message : t("error.upload.image")),
                        variant: 'error' //success error info warning null
                    }));
                });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [post_id],
    );

    const handelImageRemoval = () => {
        setSendingPicture(true);
        let data = { 
            id: post_id,
            featured_image: null
         }
        contentService.up(data)
            .then((response) => {
                setSendingPicture(false);
                // Show a message
                store.dispatch(
                    Actions.showMessage({
                        message: t('success.image.deleted'),
                        autoHideDuration: 3000,
                        variant: 'success' //success error info warning null
                    }));
                // Dispatch data 
                store.dispatch(CmsActions.updateContent(post_id, null, 'featured_image'));
            })
            .catch(error => {
                setSendingPicture(false);
                store.dispatch(Actions.showMessage({
                    message: (error[0] !== undefined ? error[0].message : t("error.image.deleted")),
                    variant: 'error' //success error info warning null
                }));
            });
    }

    // When props.data changes, setData
    useEffect(() => {
        setBgImage(props.image);
        
    }, [props.image]);

    const {
        getRootProps,
        getInputProps
    } = useDropzone({
        accept: 'image/jpeg, image/png',
        maxSize: (2.5 * 1080 * 1080), // 2,5 MB max size
        multiple: false,
        noKeyboard: true,
        onDrop: handelDropFile
    });
    
    return (
        <div className={classes.rootDropContainer}>
            {( bgImage && <Button className={classes.removeButton} onClick={handelImageRemoval}>
                <RemoveCircleIcon />
            </Button> )}
            <div {...getRootProps({className: classes.dropzone})} style={{
                backgroundImage: `url(${bgImage})`
            }}>
                <input {...getInputProps()} id="options-edit-background-image" />
                {!sendingPicture && <CloudUploadIcon style={{
                    fontSize: '4rem'
                }} />}
                {sendingPicture && <CircularProgress style={{
                    fontSize: '4rem'
                }} />}
                <p>{t("drag_an_image_file_here_or_click_on_it")}</p>
                <em className={classes.containerEM}>{t("only_images_jpeg_png_are_accepted")}</em>
            </div>
        </div>
        
    );
}

export default CoverImageEditor;