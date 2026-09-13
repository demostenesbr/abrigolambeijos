import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminLogin from "../pages/login/main";
import AdminRegister from "../pages/register/main";
import AdminDashboard from "../pages/dashboard/main";
import AdminPets from "../pages/pets/main";
import AdminAdopters from "../pages/adopters/main";
import AdminAdoptionRequests from "../pages/adoption-requests/main";
import AdiminAdoptions from "../pages/adoptions/main";
import AdminRescues from "../pages/rescues/main";
import AdminDonations from "../pages/donations/main";
import AdminRecommedations from "../pages/recommendations/main";
import AdminPartners from "../pages/partners/main";

export const router = createBrowserRouter([
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "pets", Component: AdminPets },
      { path: "adotantes", Component: AdminAdopters },
      { path: "login", Component: AdminLogin },
      { path: "cadastro", Component: AdminRegister },
      { path: "solicitacoes", Component: AdminAdoptionRequests },
      { path: "adocoes", Component: AdiminAdoptions },
      { path: "resgates", Component: AdminRescues },
      { path: "doacoes", Component: AdminDonations },
      { path: "recomendacoes", Component: AdminRecommedations },
      { path: "parceiros", Component: AdminPartners },
    ],
  },
]);
