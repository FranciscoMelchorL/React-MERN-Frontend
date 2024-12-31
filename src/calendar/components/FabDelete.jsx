import { useCalendarStore, useUiStore } from '../../hooks';

export const FabDelete = () => {

    const {startDeletingEvent, hasActiveEvent} = useCalendarStore();
    const {isDateModalOpen} = useUiStore();

    const handleDelete = () => {
        startDeletingEvent();
    }

    return (
        <button className="btn btn-danger fab-danger" onClick={handleDelete} style={{display: (hasActiveEvent && !isDateModalOpen) ? '' : 'none'}}>
            <i className="fas fa-trash-alt"></i>
        </button>
    )
}
