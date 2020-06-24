import React from 'react';
import {FuseAnimateGroup} from '@fuse';

function PoweredByLinks()
{
    return (
        <FuseAnimateGroup
            enter={{
                animation: "transition.expandIn"
            }}
            className="hidden sm:flex items-center"
        >
        </FuseAnimateGroup>
    );
}

export default PoweredByLinks;
