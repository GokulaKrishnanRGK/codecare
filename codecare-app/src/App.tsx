import {Outlet} from 'react-router-dom';
import CssBaseline from "@mui/material/CssBaseline";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Container from "@mui/material/Container";
import Header from "./components/Homepage/Header.tsx";
import Footer from "./components/Homepage/Footer.tsx";
import './App.css';
import { useTranslation } from 'react-i18next';

const defaultTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

function App() {

    const sections = [
        {title: 'navbar.section.label.home', url: `/`},
        {title: 'navbar.section.label.events', url: `/events`},
        {title: 'navbar.section.label.contact', url: `/signin`},
        {title: 'navbar.section.label.appointment', url: `/appointments`},
        {title: 'navbar.section.label.medical', url: `/medical-diagnoses`}
    ];

    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline/>
            <Container maxWidth="lg">
                <Header title="CodeCare" sections={sections}/>
                <Outlet></Outlet>
                <Footer
                    title="Footer"
                    description="Something here to give the footer a purpose!"
                />
            </Container>
        </ThemeProvider>
    )
}

export default App
