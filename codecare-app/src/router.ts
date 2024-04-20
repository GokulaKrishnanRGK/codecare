import { createBrowserRouter } from "react-router-dom";
import HomePage from './pages/HomePage.tsx';
import App from './App.tsx';
import Events from "./pages/Events.tsx";
import Event from "./pages/Event.tsx";
import CreateEvent from "./pages/CreateEvent.tsx";
import Donate from "./pages/donate/Donate.tsx";
import Success from "./pages/donate/Success.tsx";
import Cancel from "./pages/donate/Cancel.tsx";
import Forbidden from "./components/Auth/Forbidden.tsx";
import SignInPage from "./pages/auth/SignIn.tsx";
import SignUpPage from "./pages/auth/SignUp.tsx";


const router = createBrowserRouter([
    {
        path:'/',
        Component:App,
        children:[
            {
                index:true,
                Component:HomePage
        },
        {
            path:'/signup',
            Component:SignUpPage

        },
        {
            path:'/signin',
            Component:SignInPage
        }
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
        path: '/forbidden',
        Component: Forbidden
    }
]);

export default router;