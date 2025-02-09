import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from '../../../src/store/calendar/calendarSlice';
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from '../../fixtures/calendarState';

describe('Pruebas en calendarSlice', () => {

    test('Debe de regresar el estado inicial', () => {

        const state = calendarSlice.getInitialState();
        expect( state ).toEqual( initialState );

    });

    test('onSetActiveEvent debe de activar el evento', () => {
    
        const state = calendarSlice.reducer( calendarWithEventsState, onSetActiveEvent( events[0] ) );
        expect( state.activeEvent ).toEqual( events[0] );
    
    });

    test('onAddNewEvent debe de agregar el evento', () => {

        const newEvent = {
            id: '3',
            title: 'Cumpleaños de Rey',
            notes: 'Alguna nota de Rey',
            start: new Date('2025-02-17 13:00:00'),
            end: new Date('2025-02-17 15:00:00')
        };

        const state = calendarSlice.reducer( calendarWithEventsState, onAddNewEvent( newEvent ) );
        expect( state.events ).toEqual( [...events, newEvent] );
        expect( state.activeEvent ).toBe( null );

    });

    test('onUpdateEvent debe de actualizar el evento', () => {

        const updatedEvent = {
            id: '1',
            title: 'Cumpleaños de Francisco actualizado',
            notes: 'Alguna nota de Francisco actualizado',
            start: new Date('2025-02-18 13:00:00'),
            end: new Date('2025-02-18 15:00:00')
        };

        const state = calendarSlice.reducer( calendarWithEventsState, onUpdateEvent( updatedEvent ) );
        expect( state.events ).toContain( updatedEvent );

    });

    test('onDeleteEvent debe de borrar el evento activo', () => {

        const state = calendarSlice.reducer( calendarWithActiveEventState, onDeleteEvent() );
        expect( state.events ).not.toContain( events[0] );
        expect( state.activeEvent ).toBe( null );

    });

    test('onLoadEvents debe de establecer los eventos', () => {

        const state = calendarSlice.reducer( initialState, onLoadEvents( events ) );
        expect( state.events ).toEqual( events );
        expect( state.isLoadingEvents ).toBeFalsy();
        
        const newState = calendarSlice.reducer( state, onLoadEvents( events ) );
        expect( newState.events.length ).toBe( events.length );

    });

    test('onLogoutCalendar debe de limpiar el estado', () => {

        const state = calendarSlice.reducer( calendarWithActiveEventState, onLogoutCalendar() );
        expect( state ).toEqual( initialState );

    });

});
