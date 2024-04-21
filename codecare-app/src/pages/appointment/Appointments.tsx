import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Appointment from  './../../models/Appointment.ts';

import Doctor from './../../models/Doctor';


import CreateAppointmentModal from './../../components/Appointments/CreateAppointmentModal';

import MyButton from '../../utils/MyButton.tsx';





const rows: Array<Appointment> = [
    {
        appointmentId: "ABC12345",
        user: {
            userId: 'U1234567',
            username: 'johnDoe',
            firstname: 'John',
            lastname: 'Doe'
        },
        doctor: {
            doctorId: 'D9876543',
            doctorFirstname: 'Jane',
            doctorLastname: 'Smith',
            specialization: 'Orthopedics',
            roomNo: '101',
            hospitalName: 'City Hospital',
            city: 'New York'
        },
        appointmentDate: '04/28/2024',
        appointmentStartTime: '09:30',
        appointmentEndTime: '10:00',
        issue: ['Knee Pain'],
        medicalDiagnosis: 'Osteoarthritis',
        prescription: 'Painkillers',
        status: 'BOOKED'
    },
    {
        appointmentId: "DEF67890",
        user: {
            userId: 'U2345678',
            username: 'janeDoe',
            firstname: 'Jane',
            lastname: 'Doe'
        },
        doctor: {
            doctorId: 'D8765432',
            doctorFirstname: 'Bob',
            doctorLastname: 'Williams',
            specialization: 'Cardiology',
            roomNo: '102',
            hospitalName: 'Heart Center',
            city: 'Chicago'
        },
        appointmentDate: '05/01/2024',
        appointmentStartTime: '14:00',
        appointmentEndTime: '14:30',
        issue: ['Heart Palpitations'],
        medicalDiagnosis: 'Arrhythmia',
        prescription: 'Beta-blockers',
        status: 'BOOKED'
    }
];



const BasicTable=( )=> {

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const extractUniqueDoctors = (appointments: Array<Appointment>) => {
    const uniqueDoctors: Array<Doctor> = [];

    appointments.forEach((appointment) => {
        const doctor = appointment.doctor;
        const existingDoctor = uniqueDoctors.find(
            (d) => d.doctorId === doctor.doctorId
        );

        if (!existingDoctor) {
            uniqueDoctors.push(doctor);
        }
    });

    return uniqueDoctors;
};

const extractUniqueIssues = (appointments: Array<Appointment>): Array<string> => {
  const uniqueIssues: Array<string> = [];

  appointments.forEach((appointment) => {
      appointment.issue.forEach((issue) => {
          if (!uniqueIssues.includes(issue)) {
              uniqueIssues.push(issue);
          }
      });
  });

  return uniqueIssues;
};



const uniqueDoctors = extractUniqueDoctors(rows);
const uniqueIssues = extractUniqueIssues(rows);

const rowData = rows.map((row)=>(
        <TableRow
        key={row.appointmentId}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component="th" scope="row">{row.appointmentId} </TableCell>
        <TableCell align="right">{row.user.firstname}  {row.user.lastname}</TableCell>
        <TableCell align="right">Dr. {row.doctor.doctorFirstname} {row.doctor.doctorLastname}</TableCell>
        <TableCell align="right">{row.doctor.specialization}</TableCell>
        <TableCell align="right">{row.doctor.roomNo}  {row.doctor.hospitalName}  {row.doctor.city}</TableCell>
        <TableCell align="right">{row.appointmentDate} at {row.appointmentStartTime} to {row.appointmentEndTime}</TableCell>
        <TableCell align="right">{row.issue[0]}</TableCell>
        <TableCell align="right">{row.medicalDiagnosis}</TableCell>
        <TableCell align="right">{row.status}</TableCell>

      </TableRow>

    ))


  return (

    <div>
      <div>
        <MyButton  label="Create Appointment +" onClick={handleOpen}/>
        <CreateAppointmentModal open={open} handleClose={handleClose} doctors={uniqueDoctors} issues={uniqueIssues} />
      </div>
    
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 800 }} aria-label="simple table">
        <TableHead>

          <TableRow>
            <TableCell>Appointment ID</TableCell>
            <TableCell align="right">Patient Name</TableCell>
            <TableCell align="right">Doctor's Name</TableCell>
            <TableCell align="right">Specialization</TableCell>
            <TableCell align="right">Location</TableCell>
            <TableCell align="right">Appointment Date & time</TableCell>
            <TableCell align="right">Issue</TableCell>
            <TableCell align="right">Medical Diagnosis</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowData}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}

export default BasicTable;