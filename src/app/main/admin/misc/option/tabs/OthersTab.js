import React, {
    useEffect,
    useState,
} from 'react';
import {
    Typography,
    makeStyles,
    CircularProgress,
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {
    useDropzone
} from 'react-dropzone';
import { jwtService } from 'app/services/originServices';
import store from 'app/store';
import * as Actions from 'app/store/actions';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
    home_background_image: {
        maxWidth: '300px',
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
        padding: '40px',
        maxWidth: '300px',
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

function Tab(props) {
    const { t } = useTranslation();

    // Set the tab styles
    const classes = useStyles();

    // Set state using hooks
    //const [data, setData] = useState({ home_background_image: '' });
    const [bgImage, setBgImage] = useState('');
    const [sendingPicture, setSendingPicture] = useState(false);

    // Handel file upload
    const handelDropFile = (file) => {
        setSendingPicture(true);
        jwtService.updateConfigHomeBackgroundImageData(file[0])
            .then((response) => {
                // Update the preview file
                setBgImage(response);
                setSendingPicture(false);
                // Show a message
                store.dispatch(
                    Actions.showMessage({
                        message: t("optApp:profile_picture_updated_successfully"),
                        autoHideDuration: 3000,
                        variant: 'success' //success error info warning null
                    }));
            })
            .catch(error => {
                setSendingPicture(false);
                store.dispatch(Actions.showMessage({
                    message: t("error.upload.image"),
                    variant: 'error' //success error info warning null
                }));
            });
    };

    // When props.data changes, setData
    useEffect(() => {
        setBgImage(props.data.home_background_image);
    }, [props.data]);

    const {
        getRootProps,
        getInputProps
    } = useDropzone({
        accept: 'image/jpeg, image/png',
        maxSize: 2500000, // 2,5 MB max size
        multiple: false,
        noKeyboard: true,
        onDrop: handelDropFile
    });

    return (
        <div hidden={props.hidden}>
            <Typography variant="h6" className="mb-16">{props.pageTitle}</Typography>
            
            <label>{t("optApp:default_background_photo")}</label>

            <section className={classes.container}>
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
                    <p>{t("optApp:drag_an_image_file_here_or_click_on_it")}</p>
                    <em className={classes.containerEM}>({t("optApp:only_images_jpeg_png_are_accepted")})</em>
                </div>
            </section>
        </div>
    );
}

export default Tab;
