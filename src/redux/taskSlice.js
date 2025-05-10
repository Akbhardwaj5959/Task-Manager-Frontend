import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: [],
  reducers: {
    setTasks: (_, action) => action.payload,
    addTask: (state, action) => {
      state.push(action.payload);
    },
    updateTask: (state, action) => {
      return state.map((task) => task._id === action.payload._id ? action.payload : task);
    },
    deleteTask: (state, action) => {
      return state.filter(task => task._id !== action.payload);
    },
  },
});

export const { setTasks, addTask, deleteTask, updateTask } = taskSlice.actions;
export default taskSlice.reducer;

