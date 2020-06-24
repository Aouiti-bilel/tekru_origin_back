import React, { useState, useRef} from 'react';
import {Button, Typography, Fade, Modal, Grid, CircularProgress} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import ReactCrop from 'react-image-crop';
import {useDispatch} from 'react-redux';
import { showMessage } from 'app/store/actions';
import * as AuthActions from 'app/auth/store/actions';
import store from 'app/store';
import { jwtService } from 'app/services/originServices';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
    layoutHeader: {
        height                        : 320,
        minHeight                     : 320,
        [theme.breakpoints.down('md')]: {
            height   : 240,
            minHeight: 240,
        }
    },
    editDiv: {
        background: '#00000080',
        position: 'absolute',
        width: '100%',
        height: '40%',
        textAlign: 'center',
        bottom: 0,
        color: theme.palette.common.white,
        transition: '0.3s',
        '&:hover': {
            background: '#00000080',
            height: '100%',
        },
        'span': {
            fontSize: theme.typography.subtitle1.fontSize,
        },
    },
    input: {
        display: 'none',
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.grey[800],
        color: theme.palette.common.white,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    buttonRightGrid: {
        textAlign: 'right',
        marginBottom: '18px'
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
        display: 'inline-block'
    },
    buttonProgress: {
        color: theme.palette.common.white,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));

function ProfilePictureAvatar(props) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const classes = useStyles(props);
    const fileInput = useRef();
    const [profileImage, setProfileImage] = useState(null);
    const [open, setOpen] = useState(false);
    const [imageRef, setImageRef] = useState(null);
    const [cropButtonState, setCropButtonState] = useState(false);
    const [crop, setCrop] = useState({
        aspect: 1 / 1,
        width: 200,
        height: 200,
    });

    // Handling the input[file]
    /*function handleEditProfileImage(e) {
        if (e.target.files && e.target.files.length > 0) {
            handleOpen(); // Open the modal
            const reader = new FileReader();
            reader.addEventListener("load", () =>
                setProfileImage(reader.result)
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    }*/

    // Dynamicly update the crop state
    function onCropChange(crop) {
        setCrop(crop);
    };

    // Set the image state for cropping later
    function onImageLoaded(image) {
        setImageRef(image);
    };

    // Verify then crop the image
    function genAndSendCropedImage() {
        setCropButtonState(true); // disable send button
        // Verify image and data
        if (imageRef && crop.width && crop.height) {
            // Config
            const image = imageRef;
            const fileName = "profile-picture.jpeg";
            // Let's crop
            const canvas = document.createElement("canvas");
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            canvas.width = crop.width;
            canvas.height = crop.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height
            );

            return new Promise((resolve, reject) => {
                canvas.toBlob(blob => {
                    if (!blob) {
                        store.dispatch(
                            showMessage({
                                message:  t("error.crop") ,
                                autoHideDuration: 3000,
                                variant: 'error' //success error info warning null
                            }));
                            setCropButtonState(false); // disable send button
                        //reject(new Error('Canvas is empty'));
                        return;
                    }
                    blob.name = fileName;
                    let fileUrl;
                    window.URL.revokeObjectURL(fileUrl);
                    fileUrl = window.URL.createObjectURL(blob);

                    // Post th image
                    blob.filename = blob.name;
                    blob.mimetype = blob.type;
                    blob.encoding = 'UTF-8';
                    
                    jwtService.updateProfilePicture(blob)
                        .then((response) => {
                            handleClose(); // Close the mandal
                            // dispatch the profile picture
                            dispatch(AuthActions.updateUserProfilePicture(response));
                            store.dispatch(
                                showMessage({
                                    message: t('success.upload.image'),
                                    autoHideDuration: 3000,
                                    variant: 'success' //success error info warning null
                                }));
                            
                        })
                        .catch(error => {
                            store.dispatch(showMessage({
                                message: error,
                                variant: 'error' //success error info warning null
                            }));
                            setCropButtonState(false); // disable send button
                        });

                    resolve(fileUrl);
                }, "image/jpeg", 0.95);
            });
        }
    }

    const handleClose = () => {
        // Resets
        fileInput.current.value = null; // Reset the file input
        setImageRef(null);
        setProfileImage(null)
        setCropButtonState(false); // activate send button
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                id="user-profile-crop-image-modal"
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <Typography variant="h6" gutterBottom={true}>{t('crop')}</Typography>
                            </Grid>
                            <Grid item className={classes.buttonRightGrid} xs={6}>
                                <div className={classes.wrapper}>
                                    <Button 
                                        variant="outlined"
                                        onClick={genAndSendCropedImage} 
                                        disabled={cropButtonState}
                                        id="user-profile-crop-image-modal-button"
                                    >
                                        {t('crop')}
                                    </Button>
                                    {cropButtonState && <CircularProgress size={24} className={classes.buttonProgress} />}
                                </div>
                            </Grid>
                        </Grid>
                        
                        <ReactCrop 
                            src={profileImage}
                            crop={crop}
                            onChange={onCropChange}
                            onImageLoaded={onImageLoaded}
                            keepSelection={true}
                            imageStyle = {
                                {
                                    maxWidth: '50vw',
                                    maxHeight: '80vh'
                                }
                            }
                        />
                    </div>
                </Fade>
            </Modal>
        </>
    )
}

export default ProfilePictureAvatar;
