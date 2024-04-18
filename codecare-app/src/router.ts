import { createBrowserRouter } from "react-router-dom";
import SignIn from './pages/SignIn.tsx';
import SignUp from './pages/SignUp.tsx';
import HomePage from './pages/HomePage.tsx';
import App from './App.tsx';
import Events from "./pages/Events.tsx";
import Event from "./pages/Event.tsx";
import CreateEvent from "./pages/CreateEvent.tsx";
import Donate from "./pages/donate/Donate.tsx";
import Success from "./pages/donate/Success.tsx";
import Cancel from "./pages/donate/Cancel.tsx";


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
            path:'/Signup',
            Component:SignUp

        },
        {
            path:'/Signin',
            Component:SignIn

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
        Component: Donate,
    },
    {
        path: '/donate/success',
        Component: Success
    },
    {
        path: '/donate/cancel',
        Component: Cancel
    }
]);

export default router;