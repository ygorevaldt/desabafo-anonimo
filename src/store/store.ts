import { configureStore } from "@reduxjs/toolkit";
import feedReducer from "./slices/feedSlice";
import activeUnburdenReducer from "./slices/activeUnburdenSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      feed: feedReducer,
      activeUnburden: activeUnburdenReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
