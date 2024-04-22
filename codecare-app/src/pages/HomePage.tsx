
import { Box } from '@mui/material';
import { useEffect,useState } from 'react';
import MainFeaturedPost from '../components/Homepage/MainFeaturedPost.tsx';
import Footer from '../components/Homepage/Footer.tsx';
import Slider from "react-slick";


import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Typewriter } from 'react-simple-typewriter';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { searchEvents } from '../services/event-service.ts';
import { useNavigate } from 'react-router-dom';
import { getAll, loadEvents } from '../store/event-slice.ts';
import { AppDispatch } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import MyButton from '../utils/MyButton.tsx';
import booking_appointment from './../assets/booking_appointment.jpg';
import donations from './../assets/donations.jpg'



const mainFeaturedPost = {
  title: 'Empowering Health: Your Communitys Compassionate Care Portal',
  description:
"   Welcome to CodeCare, your trusted healthcare companion. We are committed to providing accessible and compassionate healthcare solutions for everyone. Our platform connects patients with dedicated professionals, offering a range of services tailored to your needs. Together, we strive to create a healthier community, one person at a time.",
};


const settings = {
  dots: true,
  fade: true,
  infinite: true,
  speed: 2000,
  slidesToShow: 1,
  slidesToScroll: 1,
  waitForAnimate: false,
  autoplay: true,
};

export default function HomePage() {

const navigate = useNavigate();
const events = useSelector(getAll());
const dispatch = useDispatch<AppDispatch>();
const [searchParams, setSearchParams] = useState({});


const appointmentTitle=["Book An Appointment!!"]
const donationTitle=["Make Donations"]


useEffect(() => {
  searchEvents(searchParams).then((event) => {
      dispatch(loadEvents(event));
  });
}, [searchParams]);

  return (
    <>
      <main>
        <MainFeaturedPost post={mainFeaturedPost} />

        <hr/>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          width: '100%', 
          padding: '0%', 
          position:'relative', 
          top:'50px'}}>

    <h1> Upcoming Events</h1>
</Box>

      <Box  
        sx={{ 
          maxWidth: '100%', 
          margin: '0 auto', 
          marginTop: '20px', 
          position:'relative', 
          top:'-100px',
          border: '1px solid #ccc',  
          borderRadius: '8px',      
        }}
      >
        <Slider {...settings}>
          {events.map((event) => (
            <div key={event.id} >
              <Box
                sx={{
                  height: '1000px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <h1>{event.title}</h1>
                <h2>Hosted By: {event.organizer}</h2>
                <h3>{new Date(event.date).toLocaleString()}</h3>
                <h3>Location:{event.location.address}, {event.location.city} , {event.location.country}</h3>

                <p>{event.description}</p>
                <MyButton label='Visit For More Details!!' onClick={()=>navigate(`/events/${event.id}`)}/>

                <br/>
                <div>
                  <img src={event.eventImage} height={'400px'} width={'750px'} alt={event.title}/>
                </div>
              </Box>
            </div>
          ))}
        </Slider>
      </Box>

      <Grid container spacing={3}>
  <Grid item xs={12}>
    <Box
      sx={{
        maxWidth: '1200px',  
        height: '500px',
        margin: '20px auto',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {/* Content */}
      <Box sx={{ flex: 1, paddingLeft: '20px' }}>
        <Typography
          component="h2"
          variant="h4"
          color="inherit"
          align="left"
          noWrap
        >
          <Typewriter
            words={appointmentTitle}
            loop={30}
            cursor
            cursorStyle='|'
            typeSpeed={100}
            deleteSpeed={100}
            delaySpeed={1000}
          />
        </Typography>

        <Typography
          component="p"
          variant="body1"
          color="inherit"
          align="left"
        >
          Book your consultation appointment today at no cost. We're committed to providing accessible healthcare for everyone, especially those in need.
          
        </Typography>
        
      </Box>

  
      <Box
        sx={{
          flex: 1,
          backgroundImage: `url(${booking_appointment})`, 
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left center', 
          height: '100%',
          borderRadius: '8px'
        }}
      />
    </Box>
    
  </Grid>

  <Grid item xs={12}>
    <Box
      sx={{
        maxWidth: '1200px', 
        height: '500px',
        margin: '20px auto',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
          <Box
        sx={{
          flex: 1,
          backgroundImage: `url(${donations})`, 
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center', // Moved the image to the left
          height: '100%',
          borderRadius: '8px'
        }}
      />
      <Box sx={{ flex: 1, paddingLeft: '20px' }}>
        <Typography
          component="h2"
          variant="h4"
          color="inherit"
          align="left"
          noWrap
        >
          <Typewriter
            words={donationTitle}
            loop={30}
            cursor
            cursorStyle='|'
            typeSpeed={100}
            deleteSpeed={100}
            delaySpeed={1000}
          />
        </Typography>

        <Typography
          component="p"
          variant="body1"
          color="inherit"
          align="left"
        >
          Your generosity can change lives. Donate today to support the needy and make a difference in our CodeCare community.
        </Typography>
        <br/>
        <MyButton label='DONATE' variant='contained' onClick={()=>{navigate(`/donate`)}}/>
      </Box>

    </Box>
  </Grid>
</Grid>



        <div style={{ marginTop: '50px' }}>
          <Footer
            title="CodeCare"
            description="Empowering communities through accessible healthcare solutions."
          />
        </div>
      </main>
    </>
  );
}
