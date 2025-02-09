
export const checkingState = {
    status: 'checking',
    user: {},
    errorMessage: undefined
}

export const authenticatedState = {
    status: 'authenticated',
    user: {uid: 'abc', name: 'Francisco'},
    errorMessage: undefined
}

export const notAuthenticatedState = {
    status: 'not-authenticated',
    user: {},
    errorMessage: undefined
}