import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UnburdenType } from "@/types/unburden.type";

export interface FeedState {
  items: UnburdenType[];
  page: number;
  total: number;
  take: number;
  hasMore: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: FeedState = {
  items: [],
  page: 1,
  total: 0,
  take: 10,
  hasMore: true,
  status: "idle",
  error: null,
};

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setFeed: (
      state,
      action: PayloadAction<{
        items: UnburdenType[];
        total: number;
        page: number;
        take?: number;
      }>,
    ) => {
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.page = action.payload.page;
      if (action.payload.take) state.take = action.payload.take;
      state.hasMore = action.payload.items.length < action.payload.total;
      state.status = "succeeded";
      state.error = null;
    },
    appendFeed: (
      state,
      action: PayloadAction<{
        items: UnburdenType[];
        total: number;
        page: number;
      }>,
    ) => {
      // Append unique items
      const existingIds = new Set(state.items.map((item) => item.id));
      const newItems = action.payload.items.filter(
        (item) => !existingIds.has(item.id),
      );
      state.items = [...state.items, ...newItems];
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.hasMore = state.items.length < action.payload.total;
      state.status = "succeeded";
      state.error = null;
    },
    addNewUnburden: (state, action: PayloadAction<UnburdenType>) => {
      state.items = [action.payload, ...state.items];
      state.total += 1;
    },
    optimisticSupport: (state, action: PayloadAction<string>) => {
      const unburden = state.items.find((item) => item.id === action.payload);
      if (unburden && !unburden.supported) {
        unburden.supports_amount += 1;
        unburden.supported = true;
      }
    },
    setStatus: (state, action: PayloadAction<FeedState["status"]>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.status = "failed";
    },
  },
});

export const {
  setFeed,
  appendFeed,
  addNewUnburden,
  optimisticSupport,
  setStatus,
  setError,
} = feedSlice.actions;

export default feedSlice.reducer;
