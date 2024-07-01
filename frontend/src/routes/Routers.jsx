import React from "react";
import Home from "../pages/Home";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import Contact from "../pages/Contact";
import Category from "../pages/Category";
import Caretakers from "../pages/Caretakers/Caretakers";
import CaretakerDetails from "../pages/Caretakers/CaretakerDetails";
import ActivationPage from "../pages/Auth/ActivationPage";
import FeedbackForm from "../pages/Caretakers/FeedbackForm";
import ForgetPassword from "../pages/Auth/ForgetPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import Chat from "../pages/Chat/Message";
import Chats from "../pages/Chat/Messages";

//user
import UserDashboard from "../Dashboard/user-account/Dashboard";
import UserOverview from "../Dashboard/user-account/Overview";
import MyFavourites from "../pages/Users/MyFavourites";
import UserOrders from "../Dashboard/user-account/MyOrders";
import MyPets from "../Dashboard/user-account/MyPets";
import UserProfile from "../Dashboard/user-account/Profile";

//caretaker
import CTDashboard from "../Dashboard/caretaker-account/Dashboard";
import CTOverview from "../Dashboard/caretaker-account/Overview";
import CTOrders from "../Dashboard/caretaker-account/MyOrders";
import MyServices from "../Dashboard/caretaker-account/MyServices";
import CTProfile from "../Dashboard/caretaker-account/Profile";
import SelectPanel from "../pages/Caretakers/SelectPanel";

//admin
import AdminDashboard from "../Dashboard/admin-account/Dashboard";
import AdminOverview from "../Dashboard/admin-account/Overview";
import OurUsers from "../Dashboard/admin-account/OurUsers";
import OurCaretakers from "../Dashboard/admin-account/OurCaretakers";
import Approval from "../Dashboard/admin-account/Approval";
import Helpdesk from "../Dashboard/admin-account/Helpdesk";

import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset" element={<ForgetPassword />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/categories" element={<Category />} />
      <Route path="/caretaker" element={<Caretakers />} />
      <Route path="/caretakers/:id" element={<CaretakerDetails />} />
      <Route path="/select/:id" element={<SelectPanel />} />
      <Route path="/favourites" element={<MyFavourites />} />
      <Route path="/message/:id" element={<Chat />} />
      <Route path="/messages" element={<Chats />} />
      <Route
        path="/activation/:activation_token"
        element={<ActivationPage />}
      />
      <Route path="/forget/:reset_token" element={<ResetPassword />} />
      <Route path="/rate/:id" element={<FeedbackForm />} />"{/* user */}
      <Route path="/users">
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="overview" element={<UserOverview />} />
          <Route path="orders" element={<UserOrders />} />
          <Route path="pets" element={<MyPets />} />
          <Route path="settings" element={<UserProfile />} />
        </Route>
      </Route>
      {/* caretaker */}
      <Route path="/caretakers">
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={["caretaker"]}>
              <CTDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="overview" element={<CTOverview />} />
          <Route path="orders" element={<CTOrders />} />
          <Route path="services" element={<MyServices />} />
          <Route path="settings" element={<CTProfile />} />
        </Route>
      </Route>
      {/* admin */}
      <Route path="/admin">
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="overview" element={<AdminOverview />} />
          <Route path="users" element={<OurUsers />} />
          <Route path="caretakers" element={<OurCaretakers />} />
          <Route path="approval" element={<Approval />} />
          <Route path="helpdesk" element={<Helpdesk />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Routers;
