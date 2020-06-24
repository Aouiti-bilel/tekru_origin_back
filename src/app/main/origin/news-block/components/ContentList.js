import React from 'react';
import { FuseAnimateGroup } from '@fuse';
import List from '@material-ui/core/List';
import NewsCardItem from './listItems/NewsCardItem';
import NewsListItem from './listItems/NewsListItem';
import { withRouter } from 'react-router-dom'
import { DISPLAY_TYPES } from '../ContentConst';
import {useSelector} from 'react-redux';

export default withRouter((props) => {
    const { data, history } = props;
    const { displayType } = useSelector(({newsBlockApp}) => newsBlockApp);

    const openContent = (content) => {
        const url = content.id + (content.slug ? '-' + content.slug : '');
        history.push('/news-block/content/' + url);
    }
    
    const editContent = (content) => {
        history.push('/news-block/edit/' + content.id);
    }

    return (
        displayType === DISPLAY_TYPES.GRID ? (
            <FuseAnimateGroup
                    enter={{
                        animation: "transition.slideUpBigIn"
                    }}
                    className="flex flex-wrap py-24"
                >
                    {
                        data.map((content) => {
                            return (
                                <NewsCardItem
                                    onContent={openContent}
                                    editContent={editContent}
                                    content={content}
                                    key={content.id}
                                    isAdmin={false}
                                    className="w-full rounded-8 shadow-none border-1 mb-16"
                                />
                            )
                        })
                    }
            </FuseAnimateGroup>
        ) : (
            <List className="py-24">
                <FuseAnimateGroup
                    enter={{
                        animation: "transition.slideUpBigIn"
                    }}
                >
                    {
                        data.map((content) => (
                            <NewsListItem 
                                onContent={openContent}
                                editContent={editContent}
                                content={content}
                                key={content.id}
                            />
                        ))
                    }
                </FuseAnimateGroup>
            </List>
        )
    )
})