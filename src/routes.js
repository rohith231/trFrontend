import Login from "views/pages/Login.js";
import ConfirmEmail from "./views/pages/ConfirmEmail";
import ResetPassword from "./views/pages/ResetPassword";
import ConfirmPassword from "./views/pages/ConfirmPassword";
import ResetPasswordSuccess from "./views/pages/ResetPasswordSuccess";
import ProfileManagement from "components/profileManagement/ProfileManagement";
import Dashboard from "views/Dashboard";
import Register from "views/pages/Register";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 ",
    component: Dashboard,
    layout: "/admin",
    access: ["*", "2"],
  },

  {
    path: "/profile-management",
    name: "Profile Management",
    icon: "fa fa-id-card",
    component: ProfileManagement,
    layout: "/admin",
    access: ["*", "2", "3"],
  },

  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth",
  },
  {
    path: "/confirm-email/:id",
    name: "Confirm Email",
    icon: "ni ni-check-bold text-green",
    component: ConfirmEmail,
    layout: "/auth",
  },

  {
    path: "/reset-password",
    name: "Reset Password",
    icon: "ni ni-folder-17 text-pink",
    component: ResetPassword,
    layout: "/auth",
  },
  {
    path: "/confirm-password/:id",
    name: "Confirm Password",
    icon: "ni ni-folder-17 text-pink",
    component: ConfirmPassword,
    layout: "/auth",
  },
  {
    path: "/reset-success",
    name: "Password Reset Confirmed",
    icon: "ni ni-folder-17 text-pink",
    component: ResetPasswordSuccess,
    layout: "/auth",
  },
];
export default routes;
