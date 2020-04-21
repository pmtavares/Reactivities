import React, { Fragment, useContext, useEffect }  from 'react';
import { Header, Segment, Comment, Form, Button } from 'semantic-ui-react';
import { RootStoreContext } from '../../../app/stores/rootStore';
import {Form as FinalForm, Field} from 'react-final-form';
import { Link } from 'react-router-dom';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import { observer } from 'mobx-react-lite';
import { formatDistance } from 'date-fns';

const ActivityDetailChat = () => {
    const rootStore = useContext(RootStoreContext);
    const {createHubConnection, stopHubConnection, addComment, activity} = rootStore.activityStore;

    useEffect(() => {
        createHubConnection(activity!.id);
        return() => {
            stopHubConnection();
        }
    }, [createHubConnection, stopHubConnection, activity]);


    return (
        <Fragment>
            <Segment>
                <Header>
                    Chat about thi event
                </Header>
            </Segment>
            <Segment attached>
            <Comment.Group>
                {activity && activity.comments && activity.comments.map((comment) => (
                        <Comment key={comment.id}>
                            <Comment.Avatar src={comment.image || `/assets/user.png`}/>
                            <Comment.Content>
                                <Comment.Author as={Link} to={`/profiles/${comment.username}`}>
                                    {comment.displayName}
                                </Comment.Author>
                                <Comment.Metadata>
                                    {formatDistance(comment.createdAt, new Date())}
                                </Comment.Metadata>
                                <Comment.Text>{comment.body}</Comment.Text>

                            </Comment.Content>
                        </Comment>
                ))
                }
                <FinalForm 
                    onSubmit={addComment}
                    render={({handleSubmit, submitting, form}) => (
                        <Form onSubmit={() => handleSubmit()!.then(() => form.reset())}>
                            <Field name='body' component={TextAreaInput} rows={3} placeholder='Add your comment'/>
                            <Button content='Add Reply' labelPosition='left' icon='edit' primary loading={submitting}/>
                        </Form>
                    )}
                />
            </Comment.Group>
        </Segment>
        </Fragment>   
    )
}

export default observer(ActivityDetailChat)