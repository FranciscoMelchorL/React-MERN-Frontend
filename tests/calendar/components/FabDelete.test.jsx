import { fireEvent, render, screen } from '@testing-library/react';
import { FabDelete } from '../../../src/calendar/components/FabDelete';
import { useCalendarStore } from '../../../src/hooks/useCalendarStore';
import { useUiStore } from '../../../src/hooks/useUiStore';

jest.mock('../../../src/hooks/useCalendarStore');
jest.mock('../../../src/hooks/useUiStore');

describe('Pruebas en el <FabDelete />', () => {

    const mockStartDeletingEvent = jest.fn();

    beforeEach(() => jest.clearAllMocks());

    test('Debe de mostrar el componente correctamente', () => {

        useCalendarStore.mockReturnValue({ hasActiveEvent: false });
        useUiStore.mockReturnValue({ isDateModalOpen: true });
        
        render( <FabDelete /> );
        const btn = screen.getByLabelText('button');

        expect( btn.classList ).toContain( 'btn' );
        expect( btn.classList ).toContain( 'btn-danger' );
        expect( btn.classList ).toContain( 'fab-danger' );
        expect( btn.style.display ).toBe( 'none' );

    });

    test('Debe de mostrar el botón si hay un evento activo', () => {

        useCalendarStore.mockReturnValue({ hasActiveEvent: true });
        useUiStore.mockReturnValue({ isDateModalOpen: false });
        
        render( <FabDelete /> );
        const btn = screen.getByLabelText('button');
        expect( btn.style.display ).toBe('');

    });

    test('Debe de startDeletingEvent si hay un evento activo', () => {

        useCalendarStore.mockReturnValue({ hasActiveEvent: true, startDeletingEvent: mockStartDeletingEvent });
        useUiStore.mockReturnValue({ isDateModalOpen: false });
        
        render( <FabDelete /> );
        const btn = screen.getByLabelText('button');
        fireEvent.click( btn );

        expect( mockStartDeletingEvent ).toHaveBeenCalled();

    });
    
});
