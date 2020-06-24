import React, { useEffect } from 'react';
import { List, ListItem, ListItemText, ListSubheader } from '@material-ui/core';
import withReducer from 'app/store/withReducer';
import {useDispatch, useSelector} from 'react-redux';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import {NavLinkAdapter} from '@fuse';
import { useTranslation } from "react-i18next";

function NewsBlockQuickPanel(props) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const data = useSelector(({newsBlockApp}) => newsBlockApp.data); 

    useEffect(() => {
        dispatch(Actions.getContents());
    }, [dispatch]);
    
    return (
        <List>
            <ListSubheader component="div">{t('news_block')}</ListSubheader>
            {data ? (
                data.length > 0 ? (
                    <div>
                        {data.slice(0, 3).map(element => (
                            <ListItem
                                key={element.id}
                                button 
                                component={NavLinkAdapter} 
                                to={'/news-block/content/'+element.id}
                                onClick = {
                                    (typeof props.closeFn === 'function') ? props.closeFn : ''
                                }
                            >
                                <ListItemText
                                    primary={element.title}
                                    secondary={element.excerpt.substring(0, 100) + (element.excerpt.length > 100 ? '...' : '')}
                                />
                            </ListItem>
                        ))}
                        <ListItem 
                            key={4} 
                            button 
                            component={NavLinkAdapter} 
                            to='/news-block'
                            onClick = {
                                (typeof props.closeFn === 'function') ? props.closeFn : ''
                            }
                        >
                            <ListItemText
                                primary='Lire plus'
                                inset
                            />
                        </ListItem>
                    </div>
                ) : (
                        <div className="mb-0 py-16 px-24">{t('error.no_content_found')}</div>
                )
            ) : (
                    <div className="mb-0 py-16 px-24">{t('loading')}</div>
            )}
        </List>
    );
}

export default withReducer('newsBlockApp', reducer)(NewsBlockQuickPanel);