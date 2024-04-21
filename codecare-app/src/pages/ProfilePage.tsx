import React from 'react';
import ProfileForm from '../components/ProfileForm';
import { Container } from '@mui/material';

const ProfilePage: React.FC = () => {
    return (
        <>
            <Container component="main" maxWidth="sm" sx={{ mt: 4 }}>
                <ProfileForm />
            </Container>
        </>
    );
};

export default ProfilePage;
