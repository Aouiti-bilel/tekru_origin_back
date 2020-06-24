import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {FusePageSimple} from '@fuse';
import IframeComponent from '@CatuFramework/components/iFrameComponent';

const styles = () => ({
    root: {
        minHeight: 'auto'
    },
    layoutRoot: {
        minHeight: 'auto'
    },
});

function SeaFilesAdminPage (props) {
    const { classes } = props;
    const url = 'https://cloud.origin.expert/sysadmin/';
    
    return (
        <FusePageSimple
            classes={{
                root: classes.layoutRoot
            }}
            content={
                <IframeComponent url={url} />
            }
        />
    )
}

export default withStyles(styles, {withTheme: true})(SeaFilesAdminPage);