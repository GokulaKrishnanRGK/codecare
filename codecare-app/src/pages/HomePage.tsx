
import { Box } from '@mui/material';
import { useEffect,useState } from 'react';
import MainFeaturedPost from '../components/Homepage/MainFeaturedPost.tsx';
import Footer from '../components/Homepage/Footer.tsx';
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { searchEvents } from '../services/event-service.ts';
import { useNavigate } from 'react-router-dom';
import { getAll, loadEvents } from '../store/event-slice.ts';
import { AppDispatch } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import MyButton from '../utils/MyButton.tsx';




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





useEffect(() => {
  searchEvents(searchParams).then((event) => {
      dispatch(loadEvents(event));
  });
}, [searchParams]);
  return (
    <>
      <main>
        <MainFeaturedPost post={mainFeaturedPost} />

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '0%'}}>
            <h1>Featured Posts</h1>
        </Box>

        <Box sx={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Slider {...settings}>
            {events.map((event) => (
             <div key={event.id} >
             <Box
               sx={{
                 height: '500px',
                 display: 'flex',
                 flexDirection: 'column',
                 justifyContent: 'center',
                 alignItems: 'center',
                 position: 'relative',
               }}
             >
               {/* <Box
                 sx={{
                  backgroundImage: `url(https://source.unsplash.com/random?wallpapers)`,
                  backgroundSize: 'cover',
                   position: 'absolute',
                   top: 0,
                   left: 0,
                   right: 0,
                   bottom: '40px', // Adjust this to leave space for the image and description
                 }}
               /> */}
               <h1>{event.title}</h1>
               <h2>Hosted By: {event.organizer}</h2>
               <h3>{new Date(event.date).toLocaleString()}</h3>
               <h3>Location:{event.location.address}, {event.location.city} , {event.location.country}</h3>

               <p>{event.description}</p>
               <MyButton label='Visit For More Details!!' onClick={()=>navigate(`/events/${event.id}`)}/>
             </Box>
           </div>
           
            ))}
          </Slider>
        </Box>

        <div style={{ marginTop: '50px' }}>
          <Footer
            title="Footer"
            description="Something here to give the footer a purpose!"
          />
        </div>
      </main>
    </>
  );
}
