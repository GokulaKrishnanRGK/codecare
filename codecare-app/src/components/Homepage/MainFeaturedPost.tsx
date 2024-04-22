import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import HealtCareImage from './../../assets/healtcare_image.jpg';

//Models
import { MainFeaturedPostProps } from '../../models/MainFeaturedPostProps';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';


export default function MainFeaturedPost(props: MainFeaturedPostProps) {
  const { post } = props;
  const {t} =useTranslation('common');

  
  // const title= 
  // const description="Welcome to CodeCare, your trusted healthcare companion. We are committed to providing accessible and compassionate healthcare solutions for everyone. Our platform connects patients with dedicated professionals, offering a range of services tailored to your needs. Together, we strive to create a healthier community, one person at a time.";
 
  
  return (
    <Paper
      sx={{
        position: 'relative',
        backgroundColor: 'grey.1000',
        color: '#fff',
        mb: 4,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(${HealtCareImage})`,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: 'rgba(0,0,0,.3)',
        }}
      />
      <Grid container>
        <Grid item md={6}>
          <Box
            sx={{
              position: 'relative',
              p: { xs: 3, md: 6 },
              pr: { md: 0 },
            }}
          >
            <Typography component="h1" variant="h3" color="inherit" gutterBottom>
            {t('homepage.link.label.homepageTitle')}
            </Typography>
            <Typography variant="h5" color="inherit" paragraph>
            {t('homepage.link.label.homepageDescription')}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
