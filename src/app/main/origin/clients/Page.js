import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import { Icon, Typography } from '@material-ui/core';
import { FusePageSimple } from '@fuse';

const styles = theme => ({
    layoutRoot: {}
});

class Page extends Component {

    render()
    {
        const {classes} = this.props;
        return (
            <FusePageSimple
                classes={{
                    root: classes.layoutRoot
                }}
                header={
                    <div className="flex flex-1 items-center justify-between p-24">
                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <Icon className="text-18" color="action">group</Icon>
                                <Icon className="text-16" color="action">chevron_right</Icon>
                                <Typography color="textSecondary">Clients</Typography>
                            </div>
                        </div>
                    </div>
                }
                /*contentToolbar={
                    <div className="px-24"><h4>Content Toolbar</h4></div>
                }*/
                content={
                    <div className="p-24">À venir</div> 
                }
            />
        )
    }
}

export default withStyles(styles, {
    withTheme: true
})(Page);