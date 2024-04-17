import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Fade } from "react-awesome-reveal";

//utilities
import { useNavigate } from 'react-router-dom';
import MyButton from '../../utils/MyButton';


interface HeaderProps {
  sections: ReadonlyArray<{
    title: string;
    url: string;
  }>;
  title: string;
}

export default function Header(props: HeaderProps) {
  const { sections, title } = props;

  const navigate = useNavigate();



  return (
    <React.Fragment>
<Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
  <Typography
    component="h2"
    variant="h5"
    color="inherit"
    align="center"
    noWrap
    sx={{ flex: 1 }}
  >
    <Fade delay={1000} triggerOnce>
      {title}
    </Fade>
  </Typography>
  <MyButton
    label="Login"
    onClick={() => navigate(`/signin`)}
    variant="outlined"
    sx={{ marginRight: 1 }} // Add margin to the right of the button
  />
  <MyButton
    label="Sign Up"
    onClick={() => navigate(`/signup`)}
    variant="outlined"
    sx={{ marginLeft: 1 }} // Add margin to the left of the button
  />
</Toolbar>
<Toolbar
  component="nav"
  variant="dense"
  sx={{ justifyContent: 'space-between', overflowX: 'auto' }}
>
  {sections.map((section) => (
    <Link
      color="inherit"
      noWrap
      key={section.title}
      variant="body2"
      onClick={()=>{ return navigate(section.url)}}
      sx={{ p: 1, flexShrink: 0 }}
    >
      {section.title}
    </Link>
  ))}
</Toolbar>

    </React.Fragment>
  );
}