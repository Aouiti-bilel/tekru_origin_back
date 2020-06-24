import React, { useEffect, useState } from 'react';
import {withStyles} from '@material-ui/core/styles';
import {FusePageSimple} from '@fuse';
import IframeComponent from '@CatuFramework/components/iFrameComponent';
import FuseUtils from '@fuse/FuseUtils';
import { Icon, Typography } from '@material-ui/core';
import {
    useSelector
} from 'react-redux';
import { searchNavTree } from '@CatuFramework/helpers/navTrees';
import { Link } from "react-router-dom";
import slugify from 'slugify';

const styles = theme => ({
    root: {
        minHeight: 'auto'
    },
    layoutRoot: {
        minHeight: 'auto'
    },
});

function IFrame(props) {
    const {classes} = props;
    const { params } = props.match
    const [url, setUrl] = useState();
    const [header, setHeader] = useState(null);
    const navigation = useSelector(({
        fuse
    }) => fuse.navigation);
    const userRole = useSelector(({auth}) => auth.user.role);

    useEffect(() => {
        if (params && params.id) {
            const id = params.id.split('-');
            const item = searchNavTree(navigation, parseInt(id[0]));
            if (item) {
                let permission = true;
                if (item.auth) {
                    permission = FuseUtils.hasPermission({
                        slug: item.auth,
                        permission: 'can_view'
                    }, userRole)
                }
                if (permission) {
                    if (!parseInt(id[1]) && item.url && (item.url.startsWith('https://') || item.url.startsWith('http://'))) {
                        setUrl(item.url);
                        setHeader(null);
                    } else if (item.data && item.data.length > 0) {
                        const category = item.data.find(item => item.id === parseInt(id[1]));
                        if (category && category.link && (category.link.startsWith('https://') || category.link.startsWith('http://'))) {
                            setHeader(genHeader(item, category.title));
                            setUrl(category.link);
                        }
                    }
                }
            }
            
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params, navigation, props]);

    const genHeader = (item, page_title) => {
        return (
            <div className="flex flex-1 items-center justify-between p-24">
                <div className="flex flex-col">
                    <div className="flex items-center">
                        <Icon className="text-18" color="action">{item.icon || 'adjust'}</Icon>
                        <Icon className="text-16" color="action">chevron_right</Icon>
                        <Typography
                            component={Link}
                            role="button"
                            to={`/category/${item.id}-${slugify(item.title).toLowerCase()}`}
                            color="textSecondary"
                        >
                            {item.title}
                        </Typography>
                        <Typography color="textSecondary" style={{
                            margin: '0px 5px',
                        }}>/</Typography>
                        <Typography color="textSecondary"><strong>{page_title}</strong></Typography>
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <FusePageSimple
            classes={{
                root: classes.layoutRoot
            }}
            header={header}
            content={
                <IframeComponent url={url} header={!!header} />
            }
        />
    )
}

export default withStyles(styles, {withTheme: true})(IFrame);