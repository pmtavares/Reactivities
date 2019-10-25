import React, {  FormEvent, useContext }  from 'react';
import { Form, Segment, Button } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { useState } from 'react';
import {v4 as uuid} from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';

interface IProps
{
  activity: IActivity;
}

const ActivityForm: React.FC<IProps> = ({ activity: InitialFormState }) => {
                                            
    const activityStore = useContext(ActivityStore);
    const {createActivity, editActivity, submitting, cancelEditForm} = activityStore;

    const initializeForm = () =>
    {
        if(InitialFormState)
        {
            return InitialFormState;
        }
        else
        {
            return {
                id: '',
                title: '',
                category: '',
                description: '',
                date: '',
                city: '',
                venue: ''

            }
        }
    };

    const [activity, setActivity] = useState<IActivity>(initializeForm);

    const handleSubmit = () =>
    {
        if(activity.id.length === 0)
        {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity);
        }
        else{
            editActivity(activity);
        }
    }

    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    {
        const {name, value} = event.currentTarget;
        setActivity({...activity, [name]: value});
    }


    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input onChange={handleInputChange} name='title' placeholder='Title' value={activity.title}></Form.Input>
                <Form.TextArea onChange={handleInputChange} name='description' rows={2} placeholder='Description' value={activity.description}></Form.TextArea>
                <Form.Input onChange={handleInputChange} name='category' placeholder='Category' value={activity.category}></Form.Input>
                <Form.Input onChange={handleInputChange} name='date' type='datetime-local' placeholder='Date' value={activity.date}></Form.Input>
                <Form.Input onChange={handleInputChange} name='city' placeholder='City' value={activity.city}></Form.Input>
                <Form.Input onChange={handleInputChange} name='venue' placeholder='Venue' value={activity.venue}></Form.Input>
                <Button floated='right' positive type='submit' content='Submit' loading={submitting} />
                <Button floated='right' type='button' content='Cancel' onClick={cancelEditForm} />
            </Form>
        </Segment>
        
    );
}

export default ActivityForm