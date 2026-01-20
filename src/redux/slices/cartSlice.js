import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";

// Async Thunks
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { userAuth } = getState();
      if (!userAuth.token) return []; 

      const config = {
        headers: {
          Authorization: `Bearer ${userAuth.token}`,
        },
      };
      
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/cart`, config);
      return data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
    }
  }
);

export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async (item, { getState, rejectWithValue }) => {
    try {
      const { userAuth } = getState();
      
      const config = {
        headers: {
          Authorization: `Bearer ${userAuth.token}`,
        },
      };
      
      const payload = {
        productId: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        size: item.selectedSize,
        quantity: item.quantity || 1
      };

      const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/cart/add`, payload, config);
      return data; // Returns updated cart list from backend

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add item");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
    "cart/removeItemFromCart",
    async ({ id, selectedSize }, { getState, rejectWithValue }) => {
      try {
        const { userAuth } = getState();
        const config = {
          headers: {
            Authorization: `Bearer ${userAuth.token}`,
          },
        };

        const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/cart/remove`, { productId: id, size: selectedSize }, config);
        return data; // Returns updated cart list
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to remove item");
        return rejectWithValue(error.response?.data);
      }
    }
);

export const updateCartItemQuantity = createAsyncThunk(
    "cart/updateCartItemQuantity",
    async ({ id, selectedSize, quantity }, { getState, rejectWithValue }) => {
        try {
            const { userAuth } = getState();
            const config = {
                headers: {
                  Authorization: `Bearer ${userAuth.token}`,
                },
            };

            const { data } = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/cart/update`, { productId: id, size: selectedSize, quantity }, config);
            return data; // Returns updated cart list
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update quantity");
            return rejectWithValue(error.response?.data);
        }
    }
);

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalPrice: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
        state.cartItems = [];
        state.totalQuantity = 0;
        state.totalPrice = 0;
    },
  },
  extraReducers: (builder) => {
    const updateCartState = (state, action) => {
        const backendItems = action.payload.map(item => ({
             _id: item.productId,
             name: item.name,
             image: item.image,
             price: item.price,
             selectedSize: item.size,
             quantity: item.quantity,
             totalPrice: item.price * item.quantity
        }));
        
        state.cartItems = backendItems;
        state.totalQuantity = backendItems.reduce((total, item) => total + item.quantity, 0);
        state.totalPrice = backendItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    // Fetch Cart
    builder.addCase(fetchCart.fulfilled, (state, action) => {
        updateCartState(state, action);
    });

    // Add Item
    builder.addCase(addItemToCart.fulfilled, (state, action) => {
        updateCartState(state, action);
        toast.success("Added to Cart!");
    });

    // Remove Item
    builder.addCase(removeItemFromCart.fulfilled, (state, action) => {
        updateCartState(state, action);
        toast.success("Item removed from Cart");
    });

    // Update Quantity
    builder.addCase(updateCartItemQuantity.fulfilled, (state, action) => {
       updateCartState(state, action);
    });
  }
});

export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;
