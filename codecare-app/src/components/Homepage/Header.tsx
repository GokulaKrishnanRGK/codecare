import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import {Fade} from "react-awesome-reveal";

//utilities
import {useNavigate} from 'react-router-dom';
import MyButton from '../../utils/MyButton';
import {SignedIn, SignedOut, UserButton} from "@clerk/clerk-react";


interface HeaderProps {
    sections: ReadonlyArray<{
        title: string;
        url: string;
    }>;
    title: string;
}

export default function Header(props: HeaderProps) {
    const {sections, title} = props;

    const navigate = useNavigate();


    return (

        <React.Fragment>

            <Toolbar sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Typography
                    component="h2"
                    variant="h5"
                    color="inherit"
                    align="center"
                    noWrap
                    sx={{flex: 1}}
                >
                    <Fade delay={1000} triggerOnce>
                        {title}
                    </Fade>
                </Typography>
                <SignedIn>
                    <UserButton afterSignOutUrl='/signin'/>
                </SignedIn>
                <SignedOut>
                    <Link href="/signin">Sign In</Link>
                </SignedOut>
                <MyButton
                    label="Donate"
                    onClick={() => navigate(`/donate`)}
                    variant="outlined"
                    sx={{marginLeft: 1}} // Add margin to the left of the button
                />
            </Toolbar>
            <Toolbar
                component="nav"
                variant="dense"
                sx={{overflowX: 'auto', gap: 2}}
            >
                {sections.map((section) => (
                    <Link
                        color="inherit"
                        noWrap
                        key={section.title}
                        variant="body2"
                        onClick={() => {
                            return navigate(section.url)
                        }}
                        sx={{p: 1, flexShrink: 0, cursor: 'pointer'}}
                    >
                        {section.title}
                    </Link>
                ))}
            </Toolbar>
        </React.Fragment>
    );
}
