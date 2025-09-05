import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-hot-toast"

const initialState = {
  pastes: localStorage.getItem("pastes")
    ? JSON.parse(localStorage.getItem("pastes"))
    : [],
  currentUser: localStorage.getItem("currentUser") || "guest",
  isOwner: false
}

const pasteSlice = createSlice({
  name: "paste",
  initialState,
  reducers: {
    addToPastes: (state, action) => {
      const paste = action.payload
      const index = state.pastes.findIndex((item) => item._id === paste._id)

      if (index >= 0) {
        toast.error("Paste already exist")
        return
      }
      
      // Add owner information to the paste
      const pasteWithOwner = {
        ...paste,
        owner: state.currentUser,
        createdAt: new Date().toISOString()
      }
      
      state.pastes.push(pasteWithOwner)
      
      localStorage.setItem("pastes", JSON.stringify(state.pastes))
      toast.success("Paste added")
    },

    updatePastes: (state, action) => {
      const paste = action.payload
      const index = state.pastes.findIndex((item) => item._id === paste._id)

      if (index >= 0) {
        // Only allow update if user is the owner or if paste has no owner (backward compatibility)
        if (state.pastes[index].owner === state.currentUser || !state.pastes[index].owner) {
          state.pastes[index] = {
            ...paste,
            owner: state.currentUser,
            createdAt: state.pastes[index].createdAt // Keep original creation date
          }
          localStorage.setItem("pastes", JSON.stringify(state.pastes))
          toast.success("Paste updated")
        } else {
          toast.error("You can only edit your own pastes")
        }
      }
    },
    removeFromPastes: (state, action) => {
      const pasteId = action.payload
      const index = state.pastes.findIndex((item) => item._id === pasteId)

      if (index >= 0) {
        // Only allow delete if user is the owner or if paste has no owner (backward compatibility)
        if (state.pastes[index].owner === state.currentUser || !state.pastes[index].owner) {
          state.pastes.splice(index, 1)
          localStorage.setItem("pastes", JSON.stringify(state.pastes))
          toast.success("Paste deleted")
        } else {
          toast.error("You can only delete your own pastes")
        }
      }
    },
    resetPaste: (state) => {
      state.pastes = []
      localStorage.removeItem("pastes")
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload
      localStorage.setItem("currentUser", action.payload)
    },
    checkOwnership: (state, action) => {
      const pasteId = action.payload
      const paste = state.pastes.find((item) => item._id === pasteId)
      state.isOwner = paste ? paste.owner === state.currentUser : false
    },
  },
})

export const { addToPastes, removeFromPastes, updatePastes, setCurrentUser, checkOwnership } = pasteSlice.actions

export default pasteSlice.reducer