import React, {useEffect, useState, useRef} from 'react';
import { jwtService } from 'app/services/originServices';
import ReactTable from "react-table";
import AccessSwitchComponent from './AccessSwitchComponent';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import { FuseAnimate } from '@fuse';
import { Icon, List, ListItem, ListItemText, ListSubheader, Divider } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
    leftsideAccessBar: {
        backgroundColor: '#000', 
    },
    listItem: {
        color: 'inherit!important',
        textDecoration: 'none!important',
        height: 40,
        width: 'calc(100% - 16px)',
        borderRadius: '0 20px 20px 0',
        paddingLeft: 24,
        paddingRight: 12,
        '& .list-item-icon': {
            marginRight: 16
        }
    }
}));

function AccessComponent(props) {
    const { t } = useTranslation();
    const classes = useStyles(props);
    const tableRef = useRef(null);
    const [accesses, setAccesses] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [pageSize] = useState(25);

    // handle access value
    function handleChange(data) {
        console.log(data);
        // Update the data in server
        jwtService.updateAccess(data.level, data.access, data.slug).then(response => {
            console.log(response);
        }).catch(error => {
            console.log(error);
        });
    };

    // Render the AccessSwitchComponent
    function renderAccessSwitchComponent(row) {
        return (
            <div style={{ textAlign: "center", width: '100%' }}>
                <AccessSwitchComponent
                    value   = { row.value }
                    ids     = {
                        {
                            access: row.original.id,
                            level: row.original.level,
                            slug: row.column.id
                        }
                    }
                    handler = { handleChange }
                />
            </div>
        )
    }

    useEffect(() => {
        // Get the first level by default
        if (selectedLevel === null && props.levels !== undefined && props.levels[0] !== undefined) {
            setSelectedLevel(props.levels[0].niveau);
        }
        // Get the level accesses 
        const level = props.levels.find(x => x.niveau === selectedLevel);
        const temp = [];
        console.log(level, props.accesstemplate);
        if (level !== undefined) {
            // Add the level to the array
            level.accesses.forEach(element => {
                element.level = level.niveau;
            });
            // Add --
            props.accesstemplate.forEach(element => {
                let a = level.accesses.find(x => x.slug === element.slug);
                if (a === undefined) {
                    element.aid = 0;
                    element.can_create = false;
                    element.can_delete = false;
                    element.can_edit = false;
                    element.can_view = false;
                    element.can_view_own = false;
                } else {
                    element.aid = a.aid;
                    element.can_create = a.can_create;
                    element.can_delete = a.can_delete;
                    element.can_edit = a.can_edit;
                    element.can_view = a.can_view;
                    element.can_view_own = a.can_view_own;
                }
                element.value = false;
                element.level = level.niveau;
                temp.push(element);
            });
            setAccesses(temp);
        }
    }, [selectedLevel, props.levels, props.accesstemplate]);

    return (
        <div className="p-16 sm:p-24">
            <Grid container spacing={3}>
                <Grid item md={3}>
                    <FuseAnimate animation="transition.slideLeftIn" delay={200}>
                        <List>
                            <ListSubheader>
                                {t("level", { count: (props.levels || []).length })}
                            </ListSubheader>
                            {(props.levels || []).map(level => (
                                <ListItem
                                    key = {
                                        level.niveau
                                    }
                                    id = {
                                        level.niveau
                                    }
                                    button
                                    className={classes.listItem}
                                    selected = {
                                        selectedLevel === level.niveau ||
                                        (level.niveau === props.defaultLevel && selectedLevel === 0)
                                    }
                                    onClick = {
                                        event => setSelectedLevel(level.niveau)
                                    }
                                >
                                    <Icon className="list-item-icon text-16" color="action">label</Icon>
                                    <ListItemText className="truncate pr-0" primary={level.description} disableTypography={true}/>
                                </ListItem>
                            ))}
                            <Divider/>
                        </List>
                    </FuseAnimate>
                </Grid>
                <Grid item md={9}>
                    <ReactTable
                        data = { accesses }
                        ref = { tableRef }
                        defaultPageSize = { pageSize }
                        columns={[
                            {
                                Header      : t("access"),
                                accessor    : "name",
                                width       : 300,
                            },
                            {
                                Header      : t("accesses.can_view"),
                                accessor    : "can_view",
                                Cell        : row => renderAccessSwitchComponent(row),
                            },
                            {
                                Header      : t("accesses.can_view_own"),
                                accessor    : "can_view_own",
                                Cell        : row => renderAccessSwitchComponent(row),
                            },
                            {
                                Header      : t("accesses.can_create"),
                                accessor    : "can_create",
                                Cell        : row => renderAccessSwitchComponent(row),
                            },
                            {
                                Header      : t("accesses.can_edit"),
                                accessor    : "can_edit",
                                Cell        : row => renderAccessSwitchComponent(row),
                            },
                            {
                                Header      : t("accesses.can_delete"),
                                accessor    : "can_delete",
                                Cell        : row => renderAccessSwitchComponent(row),
                            },
                        ]}
                    />
                </Grid>
            </Grid>
        </div> 
    );
}
 
export default AccessComponent;
