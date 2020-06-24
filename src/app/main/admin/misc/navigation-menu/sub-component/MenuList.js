import React, { useEffect, useState } from 'react';
import {
    useSelector
} from 'react-redux';
import SortableTree from 'react-sortable-tree';
import '../assets/style.css';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import {
    makeStyles
} from '@material-ui/core/styles';
import {
    useDispatch
} from 'react-redux';
import * as Actions from '../store/actions';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        margin: '50px 20px',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

export default function MenuList(props) {
    const [menu, setMenu] = useState(null);
    const dispatch = useDispatch();
    const classes = useStyles();
    const {loading} = props;
    const navMenuAdminData = useSelector(({
        navMenuAdmin
    }) => navMenuAdmin.data);

    const cleanTree = (data) => {
        return data.map(element => {
            if (typeof element.title === 'function') {
                element.title = element.title_;
            }
            if (element.expanded) {
                delete element.expanded;
            }
            if (element.children) {
                element.children = cleanTree(element.children);
            }
            return element;
        });
    }

    const handleTreeOnChange = treeData => {
        dispatch(Actions.updateData(cleanTree(treeData)));
    };

    const prepareToEditClick = item => {
        if (item) {
            const element = {...item}; // Prepare to edit
            if (item.parentNode) {
                element.parent = item.parentNode.id;
            }
            if (typeof element.title === 'function') {
                element.title = element.title_;
            }
            if (element.expanded) {
                delete element.expanded;
            }
            if (element.children && element.children.length > 0) {
                const children = element.children;
                element.children = [];
                for (let child of children) {
                    element.children.push(prepareToEditClick(child));
                }
            }
            return element;
        }
    };

    const handleEditClick = item => {
        if (item.node) {
            const element = {...prepareToEditClick(item.node)}; // Prepare to edit
            dispatch(Actions.editItem(element));
        }
    };

    const handleDeleteClick = item => {
        if (item.node) {
            const element = {...item.node}; // Prepare to edit
            if (item.parentNode) {
                element.parent = item.parentNode.id;
            }
            if (typeof element.title === 'function') {
                element.title = element.title_;
            }
            if (element.expanded) {
                delete element.expanded;
            }
            dispatch(Actions.deleteItem(element));
        }
    };

    const generateTitleDom = (item) => {
        if (item.color && item.color.indexOf("#") < 0) {
            item.color = '#'+item.color;
        }
        return (
            <div
                className="menu-item-title-box"
                style={{
                    color: item.color,
                }}
            >
                <Icon className="menu-item-title-box-icon">
                    {item.icon ? item.icon : ''}
                </Icon>
                <div className="menu-item-title-box-text">{item.title_}</div>
            </div>
        )
    }

    const handleMenuItemForTree = (element, parent=0) => {
        const item = {...element}; // Do not mutate the Redux state
        item.title_ = item.title;
        item.title = () => { return generateTitleDom(item) }
        if (parent) {
            item.parent = parent;
        }
        if (item.children && item.children.length > 0) {
            item.expanded = true;
            const children = item.children;
            item.children = [];
            for (let child of children) {
                item.children.push(handleMenuItemForTree(child, item.id));
            }
        }
        return item;
    }

    useEffect(() => {
        if (navMenuAdminData) {
            setMenu(navMenuAdminData.map(item => handleMenuItemForTree(item)));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navMenuAdminData]);

    useEffect(() => {
        setMenu(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        (menu !== null ? (
            (menu && menu.length > 0) ? (
                <SortableTree
                    treeData={menu}
                    onChange={handleTreeOnChange}
                    isVirtualized={false}
                    getNodeKey={({ node }) => node.id}
                    maxDepth={2}
                    generateNodeProps = {
                        rowInfo => ({
                            buttons: [ 
                                <IconButton 
                                    aria-label="edit"
                                    onClick = {
                                        () => handleEditClick(rowInfo)
                                    }
                                    disabled={loading}
                                    size="small"
                                >
                                    <Icon>edit</Icon>
                                </IconButton>,
                                <IconButton 
                                    aria-label="edit"
                                    onClick = {
                                        () => handleDeleteClick(rowInfo)
                                    }
                                    disabled={loading}
                                    size="small"
                                >
                                    <Icon>remove_circle</Icon>
                                </IconButton>,
                            ],
                        })
                    }
                />
            ) : (
                <div><i>Aucune donnée.</i></div>
            )
        ) : (
            <div className={classes.root}>
                Chargement...
                <LinearProgress variant="query" />
            </div>
        ))
        
    );
}