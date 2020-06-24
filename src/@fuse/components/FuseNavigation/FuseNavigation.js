import React from 'react';
import {Divider, List} from '@material-ui/core';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import FuseNavVerticalGroup from './vertical/FuseNavVerticalGroup';
import FuseNavVerticalCollapse from './vertical/FuseNavVerticalCollapse';
import FuseNavVerticalItem from './vertical/FuseNavVerticalItem';
import FuseNavVerticalLink from './vertical/FuseNavVerticalLink';
import FuseNavHorizontalGroup from './horizontal/FuseNavHorizontalGroup';
import FuseNavHorizontalCollapse from './horizontal/FuseNavHorizontalCollapse';
import FuseNavHorizontalItem from './horizontal/FuseNavHorizontalItem';
import FuseNavHorizontalLink from './horizontal/FuseNavHorizontalLink';
import slugify from 'slugify';

function FuseNavigation(props) {
    const {navigation, layout, active, dense, className} = props;

    const handleServerMenuItems = (nodes) => {
        let data = [];
        if (nodes && nodes.length > 0)
            for (const node of nodes) {
                const {id} = node;
                node.id = "main-menu-"+id;
                node.type = 'collapse'
                if (node.children && node.children.length > 0) {
                    node.type = 'collapse';
                    node.children = handleServerMenuItems(node.children);
                    if (node.url && (node.url.startsWith('https://') || node.url.startsWith('http://'))) {
                        // this a link
                        if (!node.external) {
                            node.url = '/i/' + id + '-' + slugify(node.title).toLowerCase();
                        }
                    } else if (node.data && node.data.length > 0) {
                        node.url = '/category/' + id + '-' + slugify(node.title).toLowerCase();
                    } 
                } else if (node.url && (node.url.startsWith('https://') || node.url.startsWith('http://'))) {
                    // this a link
                    if (!node.external) {
                        node.type = 'item';
                        node.url = '/i/' + id + '-' + slugify(node.title).toLowerCase();
                    } else {
                        node.type = 'link';
                    }
                } else if (node.data !== null && Array.isArray(node.data) && (node.url === null || node.url === '#')) {
                    node.type = 'item';
                    node.url = '/category/' + id + '-' + slugify(node.title).toLowerCase();
                } else {
                    node.type = 'item';
                    node.exact = true;
                }
                // Setting the icon
                if (!node.icon) {
                    node.icon = 'arrow_forward_ios'; // Default icon
                }
                data.push(node); 
            }
        return data;
    }

    const navigationMenu = [{
        'id': 'applications',
        'title': 'Portail Origin',
        'type': 'group',
        'icon': 'apps',
        'children': handleServerMenuItems(JSON.parse(JSON.stringify(navigation))),
    }]

    const verticalNav = (
        <List className={clsx("navigation whitespace-no-wrap", className)}>
            {
                navigationMenu.map((item) => (

                    <React.Fragment key={item.id}>

                        {item.type === 'group' && (
                            <FuseNavVerticalGroup item={item} nestedLevel={0} active={active} dense={dense}/>
                        )}

                        {item.type === 'collapse' && (
                            <FuseNavVerticalCollapse item={item} nestedLevel={0} active={active} dense={dense}/>
                        )}

                        {item.type === 'item' && (
                            <FuseNavVerticalItem item={item} nestedLevel={0} active={active} dense={dense}/>
                        )}

                        {item.type === 'link' && (
                            <FuseNavVerticalLink item={item} nestedLevel={0} active={active} dense={dense}/>
                        )}

                        {item.type === 'divider' && (
                            <Divider className="my-16"/>
                        )}
                    </React.Fragment>
                ))
            }
        </List>
    );

    const horizontalNav = (
        <List className={clsx("navigation whitespace-no-wrap flex p-0", className)}>
            {
                navigation.map((item) => (

                    <React.Fragment key={item.id}>

                        {item.type === 'group' && (
                            <FuseNavHorizontalGroup item={item} nestedLevel={0} dense={dense}/>
                        )}

                        {item.type === 'collapse' && (
                            <FuseNavHorizontalCollapse item={item} nestedLevel={0} dense={dense}/>
                        )}

                        {item.type === 'item' && (
                            <FuseNavHorizontalItem item={item} nestedLevel={0} dense={dense}/>
                        )}

                        {item.type === 'link' && (
                            <FuseNavHorizontalLink item={item} nestedLevel={0} dense={dense}/>
                        )}

                        {item.type === 'divider' && (
                            <Divider className="my-16"/>
                        )}
                    </React.Fragment>
                ))
            }
        </List>
    );

    if ( navigation.length > 0 )
    {
        switch ( layout )
        {
            case 'horizontal':
            {
                return horizontalNav;
            }
            case 'vertical':
            default:
            {
                return verticalNav;
            }
        }
    }
    else
    {
        return null;
    }
}

FuseNavigation.propTypes = {
    navigation: PropTypes.array.isRequired
};

FuseNavigation.defaultProps = {
    layout: "vertical"
};

export default React.memo(FuseNavigation);
