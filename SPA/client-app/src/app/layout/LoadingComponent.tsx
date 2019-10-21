import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';


/*
*   Loading Component to use througout the application
*
*/
const LoadingComponent: React.FC<{inverted?: boolean, content?: string}> = ({inverted=true, content}) =>
{
    return (
        <Dimmer active inverted={inverted}>
            <Loader content={content}/>
        </Dimmer>
    )
}

export default LoadingComponent