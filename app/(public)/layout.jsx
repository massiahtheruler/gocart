"use client";
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/lib/features/product/productSlice";
import { useAuth, useUser } from "@clerk/nextjs";
import { fetchCart, uploadCart } from "@/lib/features/cart/cartSlice";
import { fetchAddress } from "@/lib/features/address/addressSlice";
import { setRatings } from "@/lib/features/rating/ratingSlice";
import axios from "axios";

export default function PublicLayout({ children }) {
  const dispatch = useDispatch();
  const { user } = useUser();
  const { getToken } = useAuth();

  const { cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart({ getToken }));
      dispatch(fetchAddress({ getToken }));

      const fetchRatings = async () => {
        try {
          const token = await getToken();
          const { data } = await axios.get("/api/ratings", {
            headers: { Authorization: `Bearer ${token}` },
          });
          dispatch(setRatings(data.ratings || []));
        } catch (error) {
          console.error(error);
        }
      };

      fetchRatings();
    }
  }, [user, getToken, dispatch]);
  useEffect(() => {
    if (user) {
      dispatch(uploadCart({ getToken }));
    }
  }, [cartItems, user, getToken, dispatch]);

  return (
    <>
      <Banner />
      <Navbar />
      <main className="page-float-in">{children}</main>
      <Footer />
    </>
  );
}
