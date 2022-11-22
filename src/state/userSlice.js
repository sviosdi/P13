import { createSlice } from '@reduxjs/toolkit'
import authService from '../api.services/api'

const initialState = () => {
    const registred = localStorage.getItem('registred')
    if (!registred) return { token: null, username: null }
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
        },
    },
})

export const { register, disconnect } = userSlice.actions

export const connectAsync = (user) => (dispatch) =>
    authService.authenticate(user)

export const connectedSelector = (state) => state.user.username !== null
export const getFirstnameSelector = (state) => {
    if (state.user.username !== null) {
        const firstname = state.user.username.trim().split('@')[0]
        return firstname.charAt(0).toUpperCase() + firstname.slice(1)
    }
    return null
}
export const getUsernameSelector = (state) => state.user.username

export default userSlice.reducer
