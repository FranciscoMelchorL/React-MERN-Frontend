import { authSlice, clearErrorMessage, onChecking, onLogin, onLogout } from '../../../src/store/auth/authSlice';
import { authenticatedState, notAuthenticatedState } from '../../fixtures/authStates';
import { testUserCredentials } from '../../fixtures/testUser';

describe('Pruebas en authSlice', () => {

    test('Debe de regresar el estado inicial', () => {
    
        expect( authSlice.getInitialState() ).toEqual( notAuthenticatedState );

    });

    test('Debe de realizar el checking', () => {
    
        const state = authSlice.reducer( notAuthenticatedState, onChecking() );
        expect( state ).toEqual(
            {
                status: 'checking',
                user: {},
                errorMessage: undefined,
            }
        );

    });

    test('Debe de realizar un login', () => {

        const state = authSlice.reducer( notAuthenticatedState, onLogin( testUserCredentials ) );
        expect( state ).toEqual(
            {
                status: 'authenticated',
                user: testUserCredentials,
                errorMessage: undefined
              }
        );

    });

    test('Debe de realizar el logout sin mensaje de error', () => {
    
        const state = authSlice.reducer( authenticatedState, onLogout() );
        expect( state ).toEqual(
            {
                status: 'not-authenticated',
                user: {},
                errorMessage: undefined
            }
        );

    });

    test('Debe de realizar el logout con mensaje de error', () => {
        
        const errorMessage = 'Credenciales no validas'
        const state = authSlice.reducer( authenticatedState, onLogout(errorMessage) );
        expect( state ).toEqual(
            {
                status: 'not-authenticated',
                user: {},
                errorMessage
            }
        );

    });

    test('Debe de limpiar el mensaje de error', () => {

        const errorMessage = 'Credenciales no validas'
        const state = authSlice.reducer( authenticatedState, onLogout(errorMessage) );
        const newState = authSlice.reducer( state, clearErrorMessage() );
        
        expect( newState.errorMessage ).toBe( undefined );

    });

});
