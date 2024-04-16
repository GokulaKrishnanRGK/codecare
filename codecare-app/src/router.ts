import { createBrowserRouter } from "react-router-dom";
import SignIn from './pages/SignIn.tsx';
import SignUp from './pages/SignUp.tsx';
import App from './App.tsx';


const router= createBrowserRouter([
    {
        path:'/',
        Component:App,
        children:[
            {
                index:true,
                Component:SignIn
        },
        {
            path:'/Signup',
            Component:SignUp

        }
    ]
    }
]);

export default router;