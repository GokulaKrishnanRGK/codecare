import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

import {createTheme, ThemeProvider } from '@mui/material/styles';
import Header from '../components/Homepage/Header.tsx';
import MainFeaturedPost from '../components/Homepage/MainFeaturedPost.tsx';
import FeaturedPost from '../components/Homepage/FeaturedPost.tsx';
// import Main from '../components/Homepage/Main.tsx';
// import Sidebar from '../components/Homepage/Sidebar.tsx';
import Footer from '../components/Homepage/Footer.tsx';

import { Zoom } from 'react-awesome-reveal';



const sections = [
  { title: 'About CodeCare', url: `/signin` },
  { title: 'Events', url: `/events` },
  { title: 'Contact us', url: `/signin` }
];

const mainFeaturedPost = {
  title: 'Title of a longer featured blog post',
  description:
"    Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus reprehenderit ut harum. Omnis, quae odit. Eveniet sed facere nesciunt a sit eligendi ducimus repudiandae aliquid, officia corporis, optio ratione deserunt.",
  image: 'https://source.unsplash.com/random?wallpapers',
  imageText: 'main image description',
  linkText: 'Continue reading…',
};

const featuredPosts = [
  {
    title: 'Add Feature post1',
    date: 'Nov 12',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
    image: 'https://source.unsplash.com/random?wallpapers',
    imageLabel: 'Image Text',
    delay:500
  },
  {
    title: 'Add Feature post2',
    date: 'Nov 11',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
    image: 'https://source.unsplash.com/random?wallpapers',
    imageLabel: 'Image Text',
    delay:500
  },
  {
    title: 'Add Feature post3',
    date: 'Nov 11',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
    image: 'https://source.unsplash.com/random?wallpapers',
    imageLabel: 'Image Text',
    delay:500
  },
  {
    title: 'Add Feature post4',
    date: 'Nov 11',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
    image: 'https://source.unsplash.com/random?wallpapers',
    imageLabel: 'Image Text',
    delay:500
  }
];



// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme =  createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function HomePage() {
  return (
      <>
        <main>
          <MainFeaturedPost post={mainFeaturedPost} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <h1>Featured Posts</h1>
              <div style={{ position:'relative', left:'380px', textAlign: 'center', width: '100%' }}>
                  <Grid container spacing={2}>
                    {featuredPosts.map((post) => (
                      <Grid item xs={12} sm={6} md={8} key={post.title}>
                        <Zoom delay={post.delay} triggerOnce>
                          <FeaturedPost post={post} />
                        </Zoom>
                      </Grid>
                    ))}
                  </Grid>
                </div>
            </div>
        </main>
    </>
  );
}
