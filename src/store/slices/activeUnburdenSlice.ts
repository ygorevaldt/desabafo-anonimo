import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UnburdenType } from "@/types/unburden.type";
import { CommentType } from "@/types/comment.type";

export interface ActiveUnburdenState {
  current: UnburdenType | null;
  comments: CommentType[];
  status: "idle" | "loading" | "succeeded" | "failed";
  isSubmittingComment: boolean;
  error: string | null;
}

const initialState: ActiveUnburdenState = {
  current: null,
  comments: [],
  status: "idle",
  isSubmittingComment: false,
  error: null,
};

export const activeUnburdenSlice = createSlice({
  name: "activeUnburden",
  initialState,
  reducers: {
    setActiveUnburden: (state, action: PayloadAction<UnburdenType>) => {
      state.current = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    setComments: (state, action: PayloadAction<CommentType[]>) => {
      state.comments = action.payload;
    },
    addComment: (state, action: PayloadAction<CommentType>) => {
      state.comments = [action.payload, ...state.comments];
      if (state.current) {
        state.current.comments_amount += 1;
      }
    },
    optimisticSupportActive: (state) => {
      if (state.current && !state.current.supported) {
        state.current.supports_amount += 1;
        state.current.supported = true;
      }
    },
    setSubmittingComment: (state, action: PayloadAction<boolean>) => {
      state.isSubmittingComment = action.payload;
    },
    setStatus: (state, action: PayloadAction<ActiveUnburdenState["status"]>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.status = "failed";
    },
    resetActive: (state) => {
      state.current = null;
      state.comments = [];
      state.status = "idle";
      state.isSubmittingComment = false;
      state.error = null;
    },
  },
});

export const {
  setActiveUnburden,
  setComments,
  addComment,
  optimisticSupportActive,
  setSubmittingComment,
  setStatus,
  setError,
  resetActive,
} = activeUnburdenSlice.actions;

export default activeUnburdenSlice.reducer;
