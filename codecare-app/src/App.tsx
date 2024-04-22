import {Outlet} from 'react-router-dom';
import CssBaseline from "@mui/material/CssBaseline";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Container from "@mui/material/Container";
import Header from "./components/Homepage/Header.tsx";
import Footer from "./components/Homepage/Footer.tsx";
import './App.css';
import { useTranslation } from 'react-i18next';

const defaultTheme =  createTheme({
    palette: {
        mode: 'light',
    },
});
const {t} = useTranslation('navbar');

const sections = [
    { title: `{t('navbar.section.label.home')}`, url: `/` },
    { title: `{t('navbar.section.label.events')}`, url: `/events` },
    { title: `{t('navbar.section.label.contact')}`, url: `/signin` },
    { title: `{t('navbar.section.label.appointment')}`, url: `/appointments`},
    { title: `{t('navbar.section.label.medical')}`, url: `/medical-diagnoses`}
];

function App() {

  return (
    <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Container maxWidth="lg">
            <Header title="CodeCare" sections={sections} />
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
