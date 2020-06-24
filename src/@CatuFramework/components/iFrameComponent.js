import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/styles';

// Page JSS
const useStyles = makeStyles(theme => ({
    iframe: {
        minHeight: '400px',
    }
}));

function IFrameCompnent(props) {
    // Set the states and refs
    const [data, setData] = useState({
        url: '',
        id: 'iframe', 
        name: 'iframe',
        title: 'iframe',
        sandbox: 'allow-forms allow-scripts allow-same-origin allow-modals allow-top-navigation'
    });
    const [iframeHeight, setIframeHeight] = useState(100);
    const classes = useStyles();
    let windowInnerHeight = 0; // Used for cached height

    // Function to set the iframe height
    const handleChangeIframe = () => {
        // Get the template header height
        const header = document.getElementsByTagName('header')[0];
        let headherHeight = 0; // Set it to zero
        if (header !== undefined) { // If there is a header, get the its height
            headherHeight = document.getElementsByTagName('header')[0].offsetHeight;
        }
        // Calculate the height for the iframe
        const height = window.innerHeight - headherHeight * (data.header ? 3 : 2);
        if (height && windowInnerHeight !== window.innerHeight) {
            windowInnerHeight = window.innerHeight; // Cache the window height
            setIframeHeight(height);
        }
    };

    useEffect(() => {
        const { url, id, name, title, sandbox, header } = props, tmp = {};
        if (url && url !== data.url) { tmp.url = url }
        if (id && id !== data.id) { tmp.id = id }
        if (name && name !== data.name) { tmp.name = name }
        if (title && title !== data.title) { tmp.title = title }
        if (sandbox && sandbox !== data.sandbox) { tmp.sandbox = sandbox }
        setData({
            ...data,
            ...tmp,
            header,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    useEffect(() => {
        handleChangeIframe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    // When window changes size resise the iframe
    window.addEventListener('resize', () => {
        handleChangeIframe();
    });

    if (!data.url) {
        return '';
    }

    return (
        <iframe
            title={data.title}
            name={data.name}
            id={data.id}
            sandbox={data.sandbox}
            src={data.url}
            style={{
                height: iframeHeight
            }}
            className={classes.iframe}
            width="100%"
            height="400px"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
        />
    );
}
 
export default IFrameCompnent;
