import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Note } from '../models/Note';

interface NoteFormProps {
  note: Note | null;
  onSave: (note: Note) => void;
  open: boolean;
  onClose: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ note, onSave, open, onClose }) => {
  const [id, setId] = useState<string>('');
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [treatment, setTreatment] = useState<string>('');
  const [dateOfTreatment, setDateOfTreatment] = React.useState<Dayjs | null>(dayjs(new Date()));

  useEffect(() => {
    if (note) {
      setId(note.id);
      setDiagnosis(note.diagnosis);
      setTreatment(note.treatment);
      setDateOfTreatment(dayjs(note.dateOfTreatment));
    } else {
      // Reset form when note is null
      setId('');
      setDiagnosis('');
      setTreatment('');
      setDateOfTreatment(dayjs(new Date()));
    }
  }, [note]);

  const handleSaveClick= () => {
    onSave({
      id,
      diagnosis,
      treatment,
      dateOfTreatment: dateOfTreatment?.toDate().toISOString() || new Date().toISOString(),
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{id ? 'Edit Diagnosis' : 'Add New Diagnosis'}</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Diagnosis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Treatment"
            multiline
            rows={4}
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            margin="normal"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of Treatment"
              value={dateOfTreatment}
              onChange={setDateOfTreatment}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSaveClick} color="primary">Save</Button>
        <Button onClick={onClose} color="secondary">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NoteForm;
