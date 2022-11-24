import { createSlice } from '@reduxjs/toolkit'

const initialState = () => {
    const registred = localStorage.getItem('registred')
    if (!registred)
        return { token: null, username: null, firstname: null, lastname: null }
    return JSON.parse(registred)
}

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState(),
    reducers: {
        register: (state, action) => {
            state.token = action.payload.token
            state.username = action.payload.username
        },
        disconnect: (state) => {
            state.token = null
            state.username = null
            state.firstname = null
            state.lastname = null
        },
        registerUser: (state, action) => {
            state.firstname = action.payload.firstname
            state.lastname = action.payload.lastname
            state.username = action.payload.email
        },
        updateName: (state, action) => {
            state.firstname = action.payload.firstName
            state.lastname = action.payload.lastName
        },
    },
})

export const { register, disconnect, registerUser, updateName } =
    userSlice.actions

export const userSelector = (state) => state.user

export default userSlice.reducer
