import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Typography,
    ListItem
} from '@material-ui/core';
import TimeAgo from 'react-timeago';
import frenchStrings from 'react-timeago/lib/language-strings/fr';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
    listImage: {
        width: '160px',
        height: '90px',
        backgroundColor: '#dadada',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }
});

export default (props) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [content, setContent] = useState(null);
    const formatter = buildFormatter(frenchStrings);

    function openContent () {
        if (typeof props.onContent === 'function') {
            props.onContent(content);
        }
    }

    useEffect(() => {
        const {content} = props;
        if (content.excerpt && content.excerpt.length > 180) {
            content.excerpt = content.excerpt.substring(0, 180) + "...";
        }
        content.publishedAt = new Date(content.publishedAt);
        const today = new Date();
        content.opacity = 1;
        content.toBePublishedFlag = false;
        if (parseInt(content.status) !== 1 || content.publishedAt.getTime() > today.getTime()) {
            content.opacity = 0.7;
            content.toBePublishedFlag = true;
        }
        setContent(content);
    }, [props]);

    if (!content) {
        return null;
    }

    return (
        <ListItem
            className={"border-solid border-b-1 py-16  px-0 sm:px-8"}
            onClick={(ev) => {
                ev.preventDefault();
                openContent();
            }}
            style={{
                opacity: content.opacity,
            }}
            dense
            button
        >
            <div className={classes.listImage} aria-label={content.title} style={{
                backgroundImage: `url(${(content.featured_image ? content.featured_image : 'assets/images/news-block/default-image.png' )})`
            }}></div>

            <div className="flex flex-1 flex-col relative overflow-hidden pl-8">

                <Typography
                    variant="subtitle1"
                    className="todo-title truncate"
                >
                    {content.title}
                </Typography>
                {
                    content.publishedAt && (
                        <Typography
                            color="textSecondary"
                            className="todo-notes truncate"
                        >
                            <strong>{content.toBePublishedFlag ? t('content_status.planned') : t('content_status.published') }:</strong> <TimeAgo date={content.publishedAt} formatter={formatter} /> ({content.publishedAt.toLocaleDateString()})
                        </Typography>

                    )
                }
                <Typography
                    variant="subtitle2"
                    className="todo-title truncate"
                >
                    {content.excerpt}
                </Typography>
            </div>
        </ListItem>
    );
}