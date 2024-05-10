import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as appointmentService from './../../services/appointment-service.ts';
import { useNavigate } from 'react-router-dom';
import Status from "../../models/appointments/Status.ts";
import Appointment from "../../models/appointments/Appointment.ts";

interface EditAppointmentModalProps {
    open: boolean;
    handleClose: () => void;
    appointment: Appointment;
}

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({ open, handleClose, appointment }) => {
    const [diagnosis, setDiagnosis] = React.useState(appointment.diagnosis || '');
    const [prescription, setPrescription] = React.useState(appointment.prescription || '');

    const navigate=useNavigate();

    console.log(appointment.id);
    const handleSubmit = () => {

        const updatedAppointment = {
            id: appointment.id,
            user: appointment.user.id,
            doctor: appointment.doctor.id,
            diagnosis: diagnosis,
            treatment: prescription ,
            status: Status.COMPLETE,
            dateOfTreatment: appointment.appointmentDate
        }

        appointmentService.updateAppointment(updatedAppointment).then((response: Appointment)=>{
            if(response.data) {
                navigate('/appointments');

            }
        });
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Edit Appointment</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="diagnosis"
                    label="Medical Diagnosis"
                    type="text"
                    fullWidth
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="prescription"
                    label="Prescription"
                    type="text"
                    fullWidth
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                />

                {/*<FormControl fullWidth margin="dense">
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                        labelId="status-label"
                        id="status"
                        value={status}
                        onChange={handleStatusChange}
                    >
                        <MenuItem value="CANCELLED">Cancelled</MenuItem>
                        <MenuItem value="COMPLETE">Complete</MenuItem>

                    </Select>
                </FormControl>*/}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditAppointmentModal;