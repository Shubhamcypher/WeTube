import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

const initialState  = {
    currentUser:null,
    loading: false,
    error: false
}


export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
     loginStart:(state)=>{
        state.loading = true
     },
     loginSuccess:(state,action)=>{
        state.loading = false
        state.currentUser = action.payload
     },
     loginFailure:(state)=>{
        state.loading = false,
        state.error =  true
     },
     logout: async(state)=>{
       alert(`Logging out, ${state.currentUser}` )
        state.currentUser = null
        state.loading = false,
        state.error =  false,
        axios.get(`/user/logout`);
        navigate('/signin')
     },
     subscription: (state, action) => {
      if (state.currentUser.subscribedUsers.includes(action.payload)) {
          state.currentUser.subscribedUsers.splice(
            state.currentUser.subscribedUsers.findIndex(
              (channelId) => channelId === action.payload
          ),
          1
        );
      } else {
        state.currentUser.subscribedUsers.push(action.payload);
      }
    },
    },
  })

export const {loginStart,loginSuccess,loginFailure,logout,subscription} = userSlice.actions;

export default userSlice.reducer;





