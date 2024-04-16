import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider} from 'react-router-dom';
import router from './router.ts';
import {Provider} from "react-redux";
import {I18nextProvider} from "react-i18next";
import i18n from "./i18n.ts";
import {store} from "./store";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <I18nextProvider i18n={i18n}>
                <RouterProvider router={router}/>
            </I18nextProvider>
        </Provider>
    </React.StrictMode>,
)
