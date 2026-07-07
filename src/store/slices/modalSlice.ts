import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
  quickAddOpen: boolean;
}

const initialState: ModalState = {
  quickAddOpen: false,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openQuickAdd(state) {
      state.quickAddOpen = true;
    },
    closeQuickAdd(state) {
      state.quickAddOpen = false;
    },
  },
});

export const { openQuickAdd, closeQuickAdd } = modalSlice.actions;
export default modalSlice.reducer;
