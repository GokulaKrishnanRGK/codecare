import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {User} from "../models/User.ts";


export type UserState = User;
const initialState: UserState = {};
export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        loadUser: (state: UserState, action: PayloadAction<User>) => {
            return action.payload;
        }
    }
});

export const {loadUser} = userSlice.actions

export default userSlice.reducer;