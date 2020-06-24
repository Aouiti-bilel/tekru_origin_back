import React, {useEffect, useState} from 'react';
import {Collapse, Icon, IconButton, ListItem, ListItemText} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import {
    //NavLinkAdapter,
    FuseUtils
} from '@fuse';
import {withRouter} from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useDispatch, useSelector} from 'react-redux';
import * as Actions from 'app/store/actions';
import FuseNavVerticalGroup from './FuseNavVerticalGroup';
import FuseNavVerticalItem from './FuseNavVerticalItem';
import FuseNavBadge from './../FuseNavBadge';
import FuseNavVerticalLink from './FuseNavVerticalLink';

const useStyles = makeStyles(theme => ({
    root: {
        padding : 0,
        '&.open': {
            backgroundColor: 'rgba(0,0,0,.08)'
        }
    },
    item: {
        height      : 40,
        width       : 'calc(100% - 16px)',
        borderRadius: '0 20px 20px 0',
        paddingRight: 12,
        color       : theme.palette.text.primary,
        '&.square'  : {
            width       : '100%',
            borderRadius: '0'
        }
    }
}));

function needsToBeOpened(location, item)
{
    return location && isUrlInChildren(item, location.pathname)
}

function isUrlInChildren(parent, url)
{
    if ( !parent.children )
    {
        return false;
    }

    for ( let i = 0; i < parent.children.length; i++ )
    {
        if ( parent.children[i].children )
        {
            if ( isUrlInChildren(parent.children[i], url) )
            {
                return true;
            }
        }

        if ( parent.children[i].url === url || url.includes(parent.children[i].url) )
        {
            return true;
        }
    }

    return false;
}

function FuseNavVerticalCollapse(props) {
    const userRole = useSelector(({auth}) => auth.user.role);
    const dispatch = useDispatch();
    const classes = useStyles(props);
    const [open, setOpen] = useState(() => needsToBeOpened(props.location, props.item));
    const {item, nestedLevel, active} = props;
    let paddingValue = 40 + (nestedLevel * 16);
    const listItemPadding = nestedLevel > 0 ? 'pl-' + (paddingValue > 80 ? 80 : paddingValue) : 'pl-24';

    useEffect(() => {
        if ( needsToBeOpened(props.location, props.item) )
        {
            setOpen(true);
        }
    }, [props.location, props.item]);

    function handleClick() {
        setOpen(!open);
    }
    
    function handleClickTo(url, hasAccess) {
        if (!hasAccess) {
            setOpen(!open);
            return false;
        }
        dispatch(Actions.navbarCloseMobile());
        props.history.push(url);
    }

    const hasAccess = FuseUtils.hasPermission(item.auth, userRole);

    // Check if the children has the permissions
    let childrenPermissions = true;
    item.children.forEach(element => {
        childrenPermissions = childrenPermissions && FuseUtils.hasPermission(element.auth, userRole);
    });
    return (
        <ul className={clsx(classes.root, open && "open")}>

            {(hasAccess || childrenPermissions) && (<ListItem
                button
                className={clsx(classes.item, listItemPadding, 'list-item', active)}
            >
            
                {item.icon && (
                    <Icon 
                        style={{
                            color: (item.color ? item.color : null)
                        }}
                        className="text-16 flex-shrink-0 mr-16" 
                        color="action"
                        onClick={() => {
                            handleClickTo(item.url, hasAccess)
                        }}
                    >
                        {item.icon}
                    </Icon>
                )}
                <ListItemText 
                    className="list-item-text" 
                    primary={item.title} 
                    classes={{primary: 'text-14'}}
                    onClick={() => {
                        handleClickTo(item.url, hasAccess)
                    }}
                    style={{
                        color: (item.color ? item.color : null)
                    }}
                />
                {item.badge && (
                    <FuseNavBadge className="mr-4" badge={item.badge}/>
                )}
                
                {childrenPermissions && (<IconButton onClick={handleClick} disableRipple className="w-16 h-16 p-0">
                    <Icon className="text-16 arrow-icon" color="inherit">
                        {open ? 'expand_less' : 'expand_more'}
                    </Icon>
                </IconButton>)}
            </ListItem>)}

            {item.children && (
                <Collapse in={open} className="collapse-children">
                    {
                        item.children.map((item) => (

                            <React.Fragment key={item.id}>

                                {item.type === 'group' && (
                                    <FuseNavVerticalGroup item={item} nestedLevel={nestedLevel + 1} active={active}/>
                                )}

                                {item.type === 'collapse' && (
                                    <NavVerticalCollapse item={item} nestedLevel={nestedLevel + 1} active={active}/>
                                )}

                                {item.type === 'item' && (
                                    <FuseNavVerticalItem item={item} nestedLevel={nestedLevel + 1} active={active}/>
                                )}

                                {item.type === 'link' && (
                                    <FuseNavVerticalLink item={item} nestedLevel={nestedLevel + 1} active={active}/>
                                )}

                            </React.Fragment>
                        ))
                    }
                </Collapse>
            )}
        </ul>
    );
}

FuseNavVerticalCollapse.propTypes = {
    item: PropTypes.shape(
        {
            id      : PropTypes.string.isRequired,
            title   : PropTypes.string,
            icon    : PropTypes.string,
            children: PropTypes.array
        })
};
FuseNavVerticalCollapse.defaultProps = {};

const NavVerticalCollapse = withRouter(React.memo(FuseNavVerticalCollapse));

export default NavVerticalCollapse;
