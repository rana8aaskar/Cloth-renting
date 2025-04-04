import { createSlice } from "@reduxjs/toolkit";
import { deleteUser } from "../../../../server/controllers/user.controller";


const initialState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,   
    reducers:{
        signInStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => { 
            
            state.isLoading = false;
            state.currentUser = action.payload;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        updateUserStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        updateUserFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) => {
            state.isLoading = true;
            
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.isLoading = false;
            state.error = null;
        },
        deleteUserFailure: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
            
        },
        signOutUserStart: (state) => {
            state.isLoading = true;
            
        },
        signOutUserSuccess: (state) => {
            state.currentUser = null;
            state.isLoading = false;
            state.error = null;
        },
        signOutUserFailure: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
            
        },

    }
})

export const { signInStart,
     signInSuccess,
      signInFailure,
      updateUserFailure,
      updateUserStart,
      updateUserSuccess,
        deleteUserStart,
        deleteUserSuccess,
        deleteUserFailure,
        signOutUserStart,
        signOutUserSuccess,
        signOutUserFailure,
     } = userSlice.actions;
export default userSlice.reducer;