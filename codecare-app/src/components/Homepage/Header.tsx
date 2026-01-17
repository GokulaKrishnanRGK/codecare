import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import {Box, Button, Chip, FormControlLabel, Switch} from '@mui/material';

import {Typewriter} from 'react-simple-typewriter';

import {useNavigate} from 'react-router-dom';
import {SignedIn, SignedOut, UserButton} from "@clerk/clerk-react";
import i18n from '../../i18n';
import {useTranslation} from 'react-i18next';
import RoleGate from "../Auth/RoleGate.tsx";
import Roles from "../../models/auth/Roles.ts";
import {useMeQuery} from "../../store/api/meApi.ts";


interface HeaderProps {
  title: string;
}

export default function Header(props: Readonly<HeaderProps>) {
  const {title} = props;
  const {t} = useTranslation('common');

  const navigate = useNavigate();

  const titleBlock = [title]
  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>
  ) => {
    i18n.changeLanguage(event.target.checked ? 'ta' : 'en');
  };

  const {data: user} = useMeQuery();
  let role: string = "";
  if (user) {
    role = user?.role;
  }
  const isDevEnv = import.meta.env.VITE_APP_ENV === "dev";

  return (

      <React.Fragment>

        <Toolbar sx={{borderBottom: 1, borderColor: 'divider'}}>
          <Typography
              component="h2"
              variant="h4"
              color="inherit"
              align="left"
              noWrap
              sx={{flex: 1}}
          >

            <Typewriter
                words={titleBlock}
                loop={3}
                cursor
                cursorStyle='|'
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
            />
          </Typography>
          <FormControlLabel
              control={
                <Switch
                    checked={i18n.language === 'ta'}
                    onChange={handleLanguageChange}
                />
              }
              label={i18n.language === 'en' ? 'English' : 'தமிழ்'}
              sx={{marginRight: 4}}
          />
          <SignedIn>
            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
              {isDevEnv && (
                  <Chip
                      size="small"
                      variant="outlined"
                      label={`Role: ${role}`}
                      sx={{fontFamily: "monospace"}}
                  />
              )}

              <Box sx={{transform: "scale(1.2)"}}>
                <UserButton afterSignOutUrl="/"/>
              </Box>
            </Box>
          </SignedIn>

          <SignedOut>
            <Link href="/signin">{t('header.link.label.signin')}</Link>
          </SignedOut>
          &nbsp; &nbsp;
          <SignedOut>
            <Link href="/signup">{t('header.link.label.signup')}</Link>
          </SignedOut>

        </Toolbar>
        <Toolbar
            component="nav"
            variant="dense"
            sx={{overflowX: 'auto', gap: 2}}
        >
          <Link
              color="inherit"
              noWrap
              variant="body1"
              onClick={() => {
                return navigate(`/`)
              }}
              sx={{p: 1, flexShrink: 0, cursor: 'pointer'}}
          >
            {t('header.link.label.home')}
          </Link>

          <Link
              color="inherit"
              noWrap
              variant="body1"
              onClick={() => {
                return navigate(`/events`)
              }}
              sx={{p: 1, flexShrink: 0, cursor: 'pointer'}}
          >
            {t('header.link.label.events')}
          </Link>

          <RoleGate allowedRoles={[Roles.ADMIN]}>
            <>
              <Link
                  color="inherit"
                  noWrap
                  variant="body1"
                  onClick={() => {
                    return navigate(`/admin/users`)
                  }}
                  sx={{p: 1, flexShrink: 0, cursor: 'pointer'}}
              >
                {t('header.link.label.user')}
              </Link>
              <Link
                  color="inherit"
                  noWrap
                  variant="body1"
                  onClick={() => {
                    return navigate(`/admin/donations`)
                  }}
                  sx={{p: 1, flexShrink: 0, cursor: 'pointer'}}
              >
                {t('header.link.label.donation')}
              </Link>
              <Link
                  color="inherit"
                  noWrap
                  variant="body1"
                  onClick={() => {
                    return navigate(`/admin/activities`)
                  }}
                  sx={{p: 1, flexShrink: 0, cursor: 'pointer'}}
              >
                Activities
              </Link>
              <Link
                  color="inherit"
                  noWrap
                  variant="body1"
                  onClick={() => navigate(`/admin/vaccinations`)}
                  sx={{p: 1, flexShrink: 0, cursor: "pointer"}}
              >
                Vaccinations
              </Link>

            </>
          </RoleGate>

          <RoleGate allowedRoles={[Roles.ADMIN, Roles.VOLUNTEER, Roles.USER]}>
            <Link
                color="inherit"
                noWrap
                variant="body1"
                onClick={() => {
                  return navigate(`/profile`)
                }}
                sx={{p: 1, flexShrink: 0, cursor: 'pointer'}}
            >
              {t('header.link.label.profile')}
            </Link>
          </RoleGate>

          <Button
              onClick={() => navigate(`/donate`)}
              variant="outlined"
              sx={{marginLeft: 'auto'}}>
            {t('header.button.label.donate')}
          </Button>
        </Toolbar>

      </React.Fragment>
  );
}
