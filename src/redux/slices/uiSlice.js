import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showBannedModal: false,
  modal: {
    isOpen: false,
    type: "info",      // info, success, warning, danger
    title: "",
    message: "",
    confirmText: "Okay",
    cancelText: "Cancel",
    showCancel: false,
    onConfirm: null,  
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    triggerBannedModal(state) {
      state.showBannedModal = true;
    },
    closeBannedModal(state) {
      state.showBannedModal = false;
    },
    showModal(state, action) {
      state.modal = {
        isOpen: true,
        type: action.payload.type || "info",
        title: action.payload.title || "Notification",
        message: action.payload.message || "",
        confirmText: action.payload.confirmText || "Okay",
        cancelText: action.payload.cancelText || "Cancel",
        showCancel: action.payload.showCancel ?? false,
        onConfirm: action.payload.onConfirm, 
      };
    },
    closeModal(state) {
      state.modal.isOpen = false;
      state.modal.onConfirm = null; // Clean up
    },
  },
});

export const { triggerBannedModal, closeBannedModal, showModal, closeModal } = uiSlice.actions;

export default uiSlice.reducer;
