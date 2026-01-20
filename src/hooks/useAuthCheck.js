// custom hook - triggers on page refresh and route changes.if backend returns unauthorized , this will trigger logout


import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { logout } from "../redux/slices/userAuthSlice";
import { triggerBannedModal } from "../redux/slices/uiSlice";
import { fetchCart } from "../redux/slices/cartSlice";

export const useAuthCheck = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { token, isAuthenticated } = useSelector((state) => state.userAuth);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated || !token) return;

      try {
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // If auth is valid, fetch user's cart
        dispatch(fetchCart());
      } catch (error) {
        if (error.response) {
            if (error.response.status === 403) {
                 dispatch(triggerBannedModal());
                 dispatch(logout());
            } else if (error.response.status === 401) {
                 dispatch(logout());
            }
        }
      }
    };

    checkAuth();
  }, [location.pathname, isAuthenticated, token, dispatch]);
};
