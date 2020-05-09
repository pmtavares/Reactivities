import React, { Fragment, useContext } from 'react'
import { Menu, Header } from 'semantic-ui-react';
import { Calendar } from 'react-widgets';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';

const ActivityFilters = () => {
    const rootStore = useContext(RootStoreContext);

    const {predicates, setPredicates} = rootStore.activityStore;

    return (
        <Fragment>
            <Menu vertical size={'large'} style={{width: '100%', marginTop: 50}}> 
                <Header icon={'filter'} attached color={'teal'} content={'Filters'} />
                <Menu.Item active={predicates.size === 0} onClick={()=> setPredicates('all', 'true')}
                    color={'blue'} name={'all'} content={'All activities'} />
                <Menu.Item active={predicates.has('isGoing')} onClick={() => setPredicates('isGoing', 'true')}
                    color={'blue'} name={'username'} content={'I am going'} />
                <Menu.Item active={predicates.has('isHost')} onClick={() => setPredicates('isHost', 'true')}
                    color={'blue'} name={'host'} content={'I am hosting'} />
            </Menu>
            <Header icon={'calendar'} attached color={'teal'} content={'Select date'}/>
            <Calendar onChange={(date)=> setPredicates('startDate', date!)} 
                value={predicates.get('startDate') || new Date()}    
            />
        </Fragment>
    )
}

export default observer(ActivityFilters)
