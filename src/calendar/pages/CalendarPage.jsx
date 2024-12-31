import { useEffect, useState } from 'react';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { CalendarEvent, CalendarModal, FabAddNew, FabDelete, NavBar } from '../';
import { getMessageES, localizer } from '../../helpers';
import { useAuthStore, useCalendarStore, useUiStore } from '../../hooks';

export const CalendarPage = () => {

    const {user} = useAuthStore();
    const {events, setActiveEvent, startLoadingEvents} = useCalendarStore();
    const {openDateModal} = useUiStore();
    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week');

    const eventStyleGetter = (event, start, end, isSelected) => {  
        const isMyEvent = (user.uid === event.user.uid) || (user.uid === event.user._id)
              
        const style = {
            backgroundColor: isMyEvent ? '#347CF7' : '#465660',
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white'
        }
        return {style};
    }

    const onDoubleClick = (event) => {
        // console.log({dobleClick: event});
        openDateModal();
    }

    const onSelected = (event) => {
        // console.log({click: event});
        setActiveEvent(event);
    }
    const onViewChanged = (event) => {
        localStorage.setItem('lastView', event);
    }

    useEffect(() => {
      startLoadingEvents();
    }, [])
    

    return (
        <>
            <NavBar />

            <Calendar
                culture='es'
                localizer={localizer}
                events={events}
                defaultView={lastView}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 'calc( 100vh - 80px )' }}
                messages={getMessageES()}
                eventPropGetter={eventStyleGetter}
                components={{event: CalendarEvent}}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelected}
                onView={onViewChanged}
            />
            <CalendarModal/>
            <FabAddNew />
            <FabDelete />
        </>
    )
}
