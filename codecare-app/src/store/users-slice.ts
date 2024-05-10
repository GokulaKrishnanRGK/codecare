import {User} from "../models/auth/User.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppState} from "./index.ts";


export type UsersState = User[];
const initialState: UsersState = [];

export const usersSlice = createSlice({
    name: 'users',
    initialState: initialState,
    reducers: {
        loadUsers: (_state: UsersState, action: PayloadAction<User[]>) => {
            return action.payload;
        }
    }
})

export const {loadUsers} = usersSlice.actions;

export const getUsers = (state: AppState): UsersState => state.users;

export default usersSlice.reducer;