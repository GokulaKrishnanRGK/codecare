import { createBrowserRouter } from "react-router-dom";
import SignIn from './pages/SignIn.tsx';
import SignUp from './pages/SignUp.tsx';
import HomePage from './pages/HomePage.tsx';
import App from './App.tsx';


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
    }
]);

export default router;