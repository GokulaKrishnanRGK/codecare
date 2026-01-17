import {createBrowserRouter} from "react-router-dom";
import HomePage from './pages/HomePage.tsx';
import App from './App.tsx';
import Events from "./pages/events/Events.tsx";
import Event from "./pages/events/Event.tsx";
import CreateEvent from "./pages/events/CreateEvent.tsx";
import Donate from "./pages/donate/Donate.tsx";
import Success from "./pages/donate/Success.tsx";
import Cancel from "./pages/donate/Cancel.tsx";
import Forbidden from "./components/Auth/Forbidden.tsx";
import SignInPage from "./pages/auth/SignIn.tsx";
import SignUpPage from "./pages/auth/SignUp.tsx";
import ListUsers from "./pages/admin/ListUsers.tsx";
import ListDonations from "./pages/admin/ListDonations.tsx";
import NotFound from "./pages/NotFound.tsx";
import Profile from "./pages/profile/Profile.tsx";
import VaccinationsAdmin from "./pages/admin/Vaccinations.tsx";
import EventVaccinations from "./pages/volunteer/EventVaccinations.tsx";
import ListActivities from "./pages/admin/ListActivities.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        index: true,
        Component: HomePage
      },
      {
        path: '/signup/*',
        Component: SignUpPage

      },
      {
        path: '/signin/*',
        Component: SignInPage
      },
    ]
  },
  {
    path: '/events',
    Component: App,
    children: [
      {
        Component: Events,
        index: true
      },
      {
        path: '/events/:id',
        Component: Event
      },
      {
        path: '/events/create',
        Component: CreateEvent
      },
      {
        path: '/events/:id/edit',
        Component: Event
      }
    ]
  },
  {
    path: '/donate',
    Component: App,
    children: [
      {
        Component: Donate,
        index: true
      },
      {
        path: '/donate/success',
        Component: Success
      },
      {
        path: '/donate/cancel',
        Component: Cancel
      }
    ]
  },
  {
    path: '/admin',
    Component: App,
    children: [
      {
        Component: ListUsers,
        index: true
      },
      {
        path: '/admin/users',
        Component: ListUsers
      },
      {
        path: '/admin/donations',
        Component: ListDonations
      },
      {
        path: "/admin/vaccinations",
        Component: VaccinationsAdmin,
      },
      {
        path: "/admin/activities",
        Component: ListActivities,
      }
    ]
  },
  {
    path: "/volunteer",
    Component: App,
    children: [
      {path: "/volunteer/events/:id", Component: EventVaccinations},
    ],
  },
  {
    path: "/profile",
    Component: App,
    children: [{index: true, Component: Profile}],
  },
  {
    path: '/forbidden',
    Component: Forbidden
  },
  {
    path: "*",
    Component: NotFound,
  }
]);

export default router;