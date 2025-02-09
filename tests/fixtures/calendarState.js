
export const events = [
    {
        id: '1',
        title: 'Cumpleaños de Francisco',
        notes: 'Alguna nota de Francisco',
        start: new Date('2025-02-07 13:00:00'),
        end: new Date('2025-02-07 15:00:00')
    },
    {
        id: '2',
        title: 'Cumpleaños de Juan',
        notes: 'Alguna nota de Juan',
        start: new Date('2025-03-07 13:00:00'),
        end: new Date('2025-03-07 15:00:00')
    },
];

export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null
}

export const calendarWithEventsState = {
    isLoadingEvents: false,
    events: [...events],
    activeEvent: null
}

export const calendarWithActiveEventState = {
    isLoadingEvents: false,
    events: [...events],
    activeEvent: {...events[0]}
}