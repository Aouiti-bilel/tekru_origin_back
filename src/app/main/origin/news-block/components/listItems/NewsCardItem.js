import React, {useEffect, useState} from 'react';
import { Card, Typography } from '@material-ui/core';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch} from 'react-redux';
import * as Actions from '../../store/actions';
import FuseUtils from '@fuse/FuseUtils';
import TimeAgo from 'react-timeago';
import frenchStrings from 'react-timeago/lib/language-strings/fr';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
    card: {
        maxWidth: 345,
    },
    hiddenCard: {
        opacity: '50%',
    },
    media: {
        height: 250,
    },
});

export default (props) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const statusTxt = [t('content_status.published'), t('content_status.draft'), t('content_status.hidden')];
    const formatter = buildFormatter(frenchStrings);
    const [content, setContent] = useState({...props.content});
    const [isAdmin, setIsAdmin] = useState(props.isAdmin);
    
    function openContent () {
        if (typeof props.onContent === 'function') {
            props.onContent(content);
        }
    }

    function editContent () {
        if (typeof props.editContent === 'function') {
            props.editContent(content);
        }
    }

    function deleteContent() {
        dispatch(Actions.deleteContent(content.id));
    }
    
    useEffect(() => {
        const {
            content,
            isAdmin
        } = props;
        setIsAdmin(isAdmin);
        
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

    return (
        <div className="w-full sm:w-1/2 lg:w-1/4 sm:p-16 flex flex-col">
            <Card className={classes.card + (content.status === 3 ? ' '+classes.hiddenCard : '')}>
                <CardActionArea onClick={isAdmin ? editContent : openContent}>
                    <CardMedia
                        className={classes.media}
                        image={(content.featured_image ? content.featured_image : 'assets/images/news-block/default-image.png' )}
                        title={content.title}
                    />
                    <CardContent>
                        {
                            isAdmin && FuseUtils.hasPermission({slug: 'content', permission: 'can_edit'}) ? (
                                <Typography variant="body2" color="textSecondary" component="p">
                                    <strong>{t("status")}:</strong> {statusTxt[content.status-1]}
                                </Typography>
                            ) : ( '' )
                        }
                        <Typography gutterBottom variant="h5" component="h2">
                            {content.title}
                        </Typography>
                        {
                            content.publishedAt && (
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    component="p"
                                >
                                    <strong>{content.toBePublishedFlag ? t('content_status.planned') : t('content_status.published')}:</strong> <TimeAgo date={content.publishedAt} formatter={formatter} /> {typeof content.publishedAt.toLocaleDateString === 'function' ? '(' + content.publishedAt.toLocaleDateString() + ')' : ''}
                                </Typography>

                            )
                        }
                        <Typography variant="body2" color="textSecondary" component="p">
                            {content.excerpt}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    {
                        !isAdmin && (
                            <Button size="small" color="primary"  onClick={openContent}>
                                {t("read_more")}
                            </Button>
                        )
                    }
                    {
                        isAdmin && FuseUtils.hasPermission({slug: 'content', permission: 'can_edit'}) && (
                           <Button size="small" color="primary"  onClick={editContent}>
                                {t("edit")}
                            </Button>
                        )
                    }
                    {
                        isAdmin && FuseUtils.hasPermission({slug: 'content', permission: 'can_delete'}) && (
                           <Button size="small" color="primary"  onClick={deleteContent}>
                                {t("delete")}
                            </Button>
                        )
                    }
                </CardActions>
            </Card>
        </div>
    );
}