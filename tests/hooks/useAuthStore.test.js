import { act, renderHook, waitFor } from '@testing-library/react';
import { useAuthStore } from '../../src/hooks';
import { authSlice } from '../../src/store';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { authenticatedState, checkingState, notAuthenticatedState } from '../fixtures/authStates';
import { testUserCredentials } from '../fixtures/testUser';
import { calendarApi } from '../../src/api';

const getMockStore = (initialState) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer,
        },
        preloadedState: {
            auth: {...initialState},
        }
    })
}

describe('Pruebas en useAuthStore', () => {

    beforeEach(() => localStorage.clear());

    test('Debe de regresar los valores por defecto', () => {

        const mockStore = getMockStore({...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });

        expect( result.current ).toEqual(
            {
                status: 'not-authenticated',
                user: {},
                errorMessage: undefined,
                startLogin: expect.any( Function ),
                startRegister: expect.any( Function ),
                checkAuthToken: expect.any( Function ),
                startLogout: expect.any( Function ),
            }
        );

    });

    test('startLogin debe de realizar el login correctamente', async() => {

        const mockStore = getMockStore({...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });

        await act( async() => { await result.current.startLogin( testUserCredentials ) } );
        const { status, user, errorMessage } = result.current;

        expect({ status, user, errorMessage }).toEqual(
            {
                status: 'authenticated',
                user: { name: 'Test User', uid: '67a63ef5450d3121fc523396' },
                errorMessage: undefined,
            }
        );
        expect( localStorage.getItem('token') ).toEqual( expect.any( String ) );
        expect( localStorage.getItem('token-init-date') ).toEqual( expect.any( String ) );

    });

    test('startLogin debe de fallar la autenticación', async() => {

        const testUser = { email: 'fail@google.com', password: '111111' };
        const mockStore = getMockStore({...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });

        await act( async() => { await result.current.startLogin( testUser ) } );
        const { status, user, errorMessage } = result.current;

        expect({ status, user, errorMessage }).toEqual(
            {
                status: 'not-authenticated',
                user: {},
                // errorMessage: 'correo y/o contraseña incorrecta',
                errorMessage: expect.any( String ),
            }
        );
        expect( localStorage.getItem('token') ).toBe( null );
        expect( localStorage.getItem('token-init-date') ).toBe( null );

        await waitFor(() => expect( result.current.errorMessage ).toBe( undefined ));

    });

    test('startRegister debe de crear un usuario', async() => {

        const testUser = { email: 'fail@google.com', password: '111111', name: 'Fail User' };
        const mockStore = getMockStore({...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });

        const spy = jest.spyOn( calendarApi, 'post' ).mockReturnValue({
            data: {
                ok: true,
                uid: '1234567890',
                name: 'user',
                token: 'SOME-TOKEN',
            }
        });

        await act( async() => { await result.current.startRegister( testUser ) } );
        const { status, user, errorMessage } = result.current;

        expect({ status, user, errorMessage }).toEqual(
            {
                status: 'authenticated',
                user: { name: 'user', uid: '1234567890' },
                errorMessage: undefined
            }
        );
        spy.mockRestore();
        
    });
    
    test('startRegister debe de fallar la creación', async() => {
        
        const mockStore = getMockStore({...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });
    
        await act( async() => { await result.current.startRegister( testUserCredentials ) } );
        const { status, user, errorMessage } = result.current;
    
        expect({ status, user, errorMessage }).toEqual(
            {
                status: 'not-authenticated',
                user: {},
                errorMessage: 'correo ya en uso'
            }
        );

    });

    test('checkAuthToken debe de fallar sino hay token', async() => {

        const mockStore = getMockStore({...checkingState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });

        await act( async() => { await result.current.checkAuthToken() } );
        const { status, user, errorMessage } = result.current;
    
        expect({ status, user, errorMessage }).toEqual(
            {
                status: 'not-authenticated',
                user: {},
                errorMessage: undefined
            }
        );

    });

    test('checkAuthToken debe autenticar el usuario si hay token', async() => {

        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({...checkingState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });

        await act( async() => { await result.current.checkAuthToken() } );
        const { status, user, errorMessage } = result.current;
    
        expect({ status, user, errorMessage }).toEqual(
            {
                status: 'authenticated',
                user: { name: 'Test User', uid: '67a63ef5450d3121fc523396' },
                errorMessage: undefined
            }
        );

    });

    test('startLogout debe de realizar el logout del usuario', async() => {

        const mockStore = getMockStore({...authenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });

        await act( async() => { await result.current.startLogout() } );
        const { status, user, errorMessage } = result.current;

        expect({ status, user, errorMessage }).toEqual(
            { 
                status: 'not-authenticated', 
                user: {}, 
                errorMessage: undefined 
            }
        );
        expect( localStorage.getItem('token') ).toBe( null );
        expect( localStorage.getItem('token-init-date') ).toBe( null );

    });
    
});
