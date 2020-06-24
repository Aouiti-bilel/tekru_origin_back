import React, {useEffect, useState, useMemo} from 'react';
import withReducer from 'app/store/withReducer';
import {useDispatch, useSelector} from 'react-redux';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import {makeStyles} from '@material-ui/styles';
import { Icon, Typography } from '@material-ui/core';
import { FusePageSimple } from '@fuse';
import IconButton from '@material-ui/core/IconButton';
import BorderAllIcon from '@material-ui/icons/BorderAll';
import SortIcon from '@material-ui/icons/Sort';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ContentList from './components/ContentList'
import { DISPLAY_TYPES } from './ContentConst';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
    header: {
        background: 'linear-gradient(to right, ' + theme.palette.primary.dark + ' 0%, ' + theme.palette.primary.main + ' 100%)',
        color: theme.palette.getContrastText(theme.palette.primary.main)
    },
    headerIcon: {
        position: 'absolute',
        top: -64,
        left: 0,
        opacity: .04,
        fontSize: 512,
        width: 512,
        height: 512,
        pointerEvents: 'none'
    },
    actionsHeader: {
        textAlign: 'right',
        width: '100%',
        padding: '0px 24px',
    },
    displayToolbar: {
        width: '100%',
        textAlign: 'right',
        paddingRight: '50px',
    },
    displayToolbarTitle: {
        fontWeight: 'bold',
    },
    activeDisplayButton: {
        background: '#303030 !important',
        color: 'white !important',
        margin: '0px 5px',
    },
    disactiveDisplayButton: {
        margin: '0px 5px',
    },
    toolbarElement: {
        display: 'inline',
        marginLeft: '10px',
    },
    orderBySelect: {
        fontSize: 'small',
        padding: '5px 5px 5px 15px',
    },
}));

function Page (props) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { data, displayType } = useSelector(({newsBlockApp}) => newsBlockApp);
    
    const classes = useStyles(props);
    const [filteredData, setFilteredData] = useState(false);
    const [orderBy, setOrderBy] = useState('createdAt');
    const [asc, setAsc] = useState(false);

    useEffect(() => {
        dispatch(Actions.getContents());
    }, [dispatch]);
    
    useEffect(() => {
        if (data && data.length > 0) {
            const content = [...data];
            content.sort((a, b) => {
                let result;
                switch (orderBy) {
                    case 'updatedAt':
                        if (a.updatedAt === b.updatedAt) {
                            result = 0;
                        } else if (a.updatedAt > b.updatedAt) {
                            result = (asc ? 1 : -1);
                        } else {
                            result = (asc ? -1 : 1);
                        }
                        break;
                    case 'title':
                        if (a.title === b.title) {
                            result = 0;
                        } else if (a.title > b.title) {
                            result = (asc ? 1 : -1);
                        } else {
                            result = (asc ? -1 : 1);
                        }
                        break;
                    default: // publishedAt
                        if (a.publishedAt === b.publishedAt) {
                            result = 0;
                        } else if (a.publishedAt > b.publishedAt) {
                            result = (asc ? 1 : -1);
                        } else {
                            result = (asc ? -1 : 1);
                        }
                        break;
                }
                return result;
            });
            setFilteredData(content);
        }
    }, [orderBy, asc, data]);

    return (
        <FusePageSimple
            classes={{
                root: classes.layoutRoot
            }}
            header={
                <div className="flex flex-1 items-center justify-between p-24">
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <Icon className="text-18" color="action">bookmarks</Icon>
                            <Icon className="text-16" color="action">chevron_right</Icon>
                            <Typography color="textSecondary">{t("news_block")}</Typography>
                        </div>
                    </div>
                </div>
            }
            contentToolbar={
                <div className={'p-24 '+classes.displayToolbar}>
                    <div className={classes.toolbarElement}>
                        <span className={classes.displayToolbarTitle}>Trier par:</span>
                        <Select
                            id="order-by"
                            className={classes.orderBySelect}
                            value={orderBy}
                            onChange={({ target }) => {
                                const { value } = target;
                                setOrderBy(value);
                            }}
                        >
                            <MenuItem value={'createdAt'}>{t("creation_date")}</MenuItem>
                            <MenuItem value={'updatedAt'}>{t("update_date")}</MenuItem>
                            <MenuItem value={'title'}>{t("title")}</MenuItem>
                        </Select>
                        
                        <IconButton 
                            aria-label="display grid"
                            onClick={() => { setAsc(!asc) }}
                        >
                            <SortIcon
                                style={{
                                    transform: (asc ? 'rotate(180deg)' : ''),
                                }}
                            />
                        </IconButton>
                    </div>
                    |
                    <div className={classes.toolbarElement}>
                        <span className={classes.displayToolbarTitle}>{t('display_mode')}:</span>
                        <IconButton 
                            aria-label="display list"
                            disabled={displayType === DISPLAY_TYPES.LIST}
                            onClick = {
                                () => {
                                    dispatch(Actions.setDisplayType(DISPLAY_TYPES.LIST));
                                }
                            }
                            className={displayType === DISPLAY_TYPES.LIST ? classes.activeDisplayButton : classes.disactiveDisplayButton}
                        >
                            <FormatListBulletedIcon />
                        </IconButton>
                        |
                        <IconButton 
                            aria-label="display grid"
                            disabled={displayType === DISPLAY_TYPES.GRID}
                            onClick = {
                                () => {
                                    dispatch(Actions.setDisplayType(DISPLAY_TYPES.GRID));
                                }
                            }
                            className={displayType === DISPLAY_TYPES.GRID ? classes.activeDisplayButton : classes.disactiveDisplayButton}
                        >
                            <BorderAllIcon />
                        </IconButton>
                    </div>
                </div>
                
            }
            content={
                <div className="p-24">
                    {useMemo(() => (
                        filteredData ? (
                            filteredData.length > 0 ? (
                                    <ContentList data={filteredData} />
                                ) :
                                (
                                    <div className="flex flex-1 items-center justify-center">
                                        <Typography color="textSecondary" className="text-24 my-24">
                                            {t("error.no_content_found")}
                                        </Typography>
                                    </div>
                                )
                        ) : (
                            <div className="flex flex-1 items-center justify-center">
                                <Typography color="textSecondary" className="text-24 my-24">
                                    {t("loading")}
                                </Typography>
                            </div>
                        )
                        ), [filteredData, t])}
                </div> 
            }
        />
    )
}

export default withReducer('newsBlockApp', reducer)(Page);