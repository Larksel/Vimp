import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./features/playerSlice";

export default configureStore({
  reducer: {
    /*
     When we pass in an object like {counter: counterReducer}, that says that we want to have a state.counter section of our Redux state object, and that we want the counterReducer function to be in charge of deciding if and how to update the state.counter section whenever an action is dispatched.
    */
    player: playerReducer,
  }
})