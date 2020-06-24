import React from 'react';
import {
    makeStyles
} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    card: {
        maxWidth: 400,
        margin: '0px 10px 10px 10px',
        boxShadow: 'none',
        border: '1px solid #d4d4d4',
    },
    title: {
        color: 'black',
    },
    media: {
        height: 200,
    },
});

export default (props) => {
    const classes = useStyles();
    const { category, parentId } = props;
    const handleClick = () => {
        if (category.link && (category.link.startsWith('https://') || category.link.startsWith('http://'))) {
            let url = category.link;
            if (!category.external) {
                url = `/i/${parentId}-${category.id}/`;
                props.history.push(url);
            } else {
                window.open(url, "_blank");
            }
        }
    }

    return (
        <Card 
            className={`${classes.card} w-full sm:w-1/2 lg:w-1/4 flex flex-col`}
            style={{
                background: (category && category.color_background ? category.color_background : null),
            }}
            onClick={handleClick}
        >
            {
                category && (
                    <>
                        <CardActionArea
                            style={{
                                background: (category && category.color_background ? category.color_background : null),
                            }}
                        >
                            <CardMedia
                                className={classes.media}
                                image={category && category.image ? category.image : 'assets/images/news-block/default-image.png'}
                                title={category.title}
                            />
                            <CardContent>
                                <Typography className={classes.title} variant="body2" color="textSecondary" component="p"
                                    style={{
                                        color: (category && category.color_text ? category.color_text : 'black'),
                                    }}
                                >
                                    {category.title}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                                     
                    </>
                ) 
            }
        </Card>
    )
}