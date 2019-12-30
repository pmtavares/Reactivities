import React, {  useContext, useEffect }  from 'react';
import { Form, Segment, Button, Grid } from 'semantic-ui-react';
import { ActivityFormValues } from '../../../app/models/activity';
import { useState } from 'react';
import {v4 as uuid} from 'uuid';
import {observer} from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router';
import {Form as FinalForm, Field} from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import { category } from '../../../app/common/options/CategoryOptions';
import SelectInput from '../../../app/common/form/SelectInput';
import DateInput from '../../../app/common/form/DateInput';
import { combineDateAndTime } from '../../../app/common/util/util';
import {combineValidators, composeValidators, isRequired, hasLengthGreaterThan} from 'revalidate';
import { RootStoreContext } from '../../../app/stores/rootStore';

const validate = combineValidators({
    title: isRequired({message: 'The event title is required'}),
    category: isRequired('Category is required'),
    description: composeValidators(
        isRequired('Description'),
        hasLengthGreaterThan(4)({message: 'Description should have at least 4 characteres'})
        )(),
    city: isRequired('City is required'),
    venue: isRequired('Venue is required'),
    date: isRequired('Date is required'),
    time: isRequired('Time is required')
    
})

interface DetailParams
{
    id: string
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({match,history}) => {
                                            
    const rootStore = useContext(RootStoreContext);
    const {createActivity, editActivity, submitting, 
        loadActivity} = rootStore.activityStore;    
    
    const [activity, setActivity] = useState(new ActivityFormValues());
    const [loading, setLoading] = useState(false);    

    useEffect(() => {
        if(match.params.id)
        {
            setLoading(true);
            loadActivity(match.params.id)
            .then((activity) =>{
                setActivity(new ActivityFormValues(activity))
            })
            .finally(() => setLoading(false));
        }
    },[loadActivity, match.params.id])

     /*const handleSubmitForm = () =>
    {
        if(activity.id.length === 0)
        {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity)
            .then(()=> history.push(`/activities/${newActivity.id}`));
        }
        else{
            editActivity(activity)
            .then(()=> history.push(`/activities/${activity.id}`));
        }
    } */

    

    const handleFinalFormSubmit = (values : any) => {
        const dateAndTime = combineDateAndTime(values.date, values.time);
        const {date, time, ...activity}=values;
        activity.date = dateAndTime; 
        if(!activity.id)
        {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity)
            //.then(()=> history.push(`/activities/${newActivity.id}`));
        }
        else{
            editActivity(activity)
           // .then(()=> history.push(`/activities/${activity.id}`));
        }
    }


    return (
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing>
                    <FinalForm validate={validate}
                        initialValues ={activity}
                        onSubmit={handleFinalFormSubmit}
                        render={({handleSubmit, invalid, pristine}) => (
                            <Form onSubmit={handleSubmit} loading={loading} >
                                <Field 
                                    name='title' 
                                    placeholder='Title' 
                                    value={activity.title}
                                    component={TextInput}
                                />
                                <Field 
                                    name='description' 
                                    placeholder='Description' 
                                    value={activity.description}
                                    component={TextAreaInput}
                                    rows={3}/>                                    
                                
                                <Field  
                                    name='category' 
                                    placeholder='Category' 
                                    value={activity.category}                                    
                                    component={SelectInput}
                                    options={category} />                                
                                <Form.Group widths='equal'>
                                    <Field 
                                        name='date' 
                                        placeholder='Date' 
                                        date={true}
                                        value={activity.date}
                                        component={DateInput} />
                                    <Field 
                                        name='time' 
                                        placeholder='Time' 
                                        time={true}
                                        value={activity.time}
                                        component={DateInput} />
                                </Form.Group>
                                
                                
                                <Field 
                                    name='city' 
                                    placeholder='City' 
                                    value={activity.city}
                                    component={TextInput} />
                                <Field 
                                    name='venue' 
                                    placeholder='Venue' 
                                    value={activity.venue}
                                    component={TextInput} />
                                <Button floated='right' 
                                        positive type='submit' 
                                        content='Submit' 
                                        loading={submitting}
                                        disabled={loading || invalid || pristine} />
                                <Button floated='right' 
                                        disabled = {loading}
                                        type='button' 
                                        content='Cancel' 
                                        onClick={activity.id ? () => history.push(`/activities/${activity.id}`) 
                                                                : () => history.push('/activities')} />
                            </Form>
                            
                        )}/>
                   
                </Segment>
            </Grid.Column>
        </Grid>
        
    );
}

export default observer(ActivityForm)