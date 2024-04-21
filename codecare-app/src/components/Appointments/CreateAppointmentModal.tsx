import React,{useState} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import Appointment from './../../models/Appointment';
import Doctor from './../../models/Doctor';
import MyButton from '../../utils/MyButton';
import dayjs from 'dayjs';

interface CreateAppointmentModalProps {
    open: boolean;
    handleClose: () => void;
    doctors: Array<Doctor>;
    issues: Array<string>;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({ open, handleClose, doctors, issues }) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const [appointmentData, setAppointmentData] = useState<Appointment>({
        appointmentId: '',
        user: {
            userId: '',
            username: '',
            firstname: '',
            lastname: '',
        },
        doctor: {
            doctorId: '',
            doctorFirstname: '',
            doctorLastname: '',
            specialization: '',
            roomNo: '',
            hospitalName: '',
            city: '',
        },
        appointmentDate: '',
        appointmentStartTime: '',
        appointmentEndTime: '',
        issue: [],
        medicalDiagnosis: '',
        prescription: '',
        status: '',
    });

    // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = event.target;
    //     setAppointmentData({ ...appointmentData, [name]: value });
    // };

    const handleDoctorChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const doctorId = event.target.value as string;
        setAppointmentData({ ...appointmentData, doctor: { ...appointmentData.doctor, doctorId: doctorId } });   
        return doctorId     
    };


    const formatDate = (date: Date | null): string => {
        if (!date) return '';
        return dayjs(date).format('MM/DD/YYYY');
    };

    const formatTime = (date: Date | null): string => {
        if (!date) return '';
        return dayjs(date).format('HH:mm');
    };

    const handleIssueChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const issue = event.target.value as string[];
        setAppointmentData({ ...appointmentData, issue });
        return issue
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formattedDate = formatDate(selectedDate);
        const formattedTime = formatTime(selectedDate);
        console.log(appointmentData.doctor.doctorId)
        console.log(appointmentData.issue)
        console.log(formattedDate);
        console.log(formattedTime);

    };

    const handleDateChange = (newDate: Date | null) => {
        setSelectedDate(newDate);
        console.log(selectedDate);
    };


    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition

        >
            <Fade in={open}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2">
                        Create Appointment
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <TextField
                                select
                                label="Select Doctor"
                                fullWidth
                                value={appointmentData.doctor.doctorId}
                                onChange={handleDoctorChange}
                                sx={{ mt: 2, mb: 2 }} // Added mb (margin-bottom) for spacing
                            >
                                {doctors.map((doctor) => (
                                    <MenuItem key={doctor.doctorId} value={doctor.doctorId}>
                                        {`Dr. ${doctor.doctorFirstname} ${doctor.doctorLastname}`}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <br/>
                            <TextField
                                select
                                label="Select Issue"
                                fullWidth
                                value={appointmentData.issue}
                                onChange={handleIssueChange}
                                sx={{ mt: 2, mb: 2 }} // Added mb (margin-bottom) for spacing
                            >
                                {issues.map((issue) => (
                                    <MenuItem key={issue} value={issue}>
                                        {issue}
                                    </MenuItem>
                                ))}
                            </TextField>


                            <br/>



                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker 
                                        name="date" 
                                        label="Appointment Date"
                                        value={selectedDate}
                                        onChange={handleDateChange} 
                                        sx={{ mt: 2, mb: 2 }} 
                                        disablePast
                                    />
                                </LocalizationProvider>


                            <br/>


                            <MyButton  
                                label="CREATE"
                                type="submit" 
                                variant="contained" 
                                color="primary"
                                sx={{ mt: 2 }} // Added mt (margin-top) for spacing
                            />
                        </div>
                    </form>
                </Box>
            </Fade>

        </Modal>
    );
}

export default CreateAppointmentModal;
