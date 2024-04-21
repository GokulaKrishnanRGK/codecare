import React, { useEffect, useState } from 'react';
import { Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper ,Typography,} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { getNotes, loadNotes } from './../store/noteSlice';
import NoteForm from '../components/NoteForm';
import { Note } from '../models/Note';
import * as medicalDiagnosisService from '../services/medical-diagnosis-service';
import { ResponseObject } from '../models/ResponseObject';
import dayjs from 'dayjs';

const NotesPage: React.FC = () => {

  useEffect(() => {
    medicalDiagnosisService.get().then((notes: ResponseObject<Note[]>) => {
      if (notes.data) {
        dispatch(loadNotes(notes.data));
      }
    });
  }, []);

  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const notes = useSelector(getNotes());
  const dispatch = useDispatch<AppDispatch>();

  const handleSave = (note: Note) => {
    console.log('Note to save:', note);
    // Here you directly check if the note has an ID that exists in your list of notes
    const exists = notes.some(n => n.id === note.id);

    if (exists) {
      medicalDiagnosisService.update(note).then(() => {
        medicalDiagnosisService.get().then((notes: ResponseObject<Note[]>) => {
          if (notes.data) {
            dispatch(loadNotes(notes.data));
            setIsModalOpen(false);
          }
        });
      }) // Update the existing note
    } else {
      // dispatch(addNote(note)); // Add a new note
      medicalDiagnosisService.create(note).then(() => {
        medicalDiagnosisService.get().then((notes: ResponseObject<Note[]>) => {
          if (notes.data) {
            dispatch(loadNotes(notes.data));
            setIsModalOpen(false);
          }
        });
      })
    }
    setCurrentNote(null); // Reset or close form
  };
  const openForm = (note?: Note) => {
    setCurrentNote(note || { id: '', diagnosis: '', treatment: '', dateOfTreatment: new Date().toISOString() });
    setIsModalOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Enter your previous Medical Diagnosis
      </Typography>
      <IconButton
        onClick={() => openForm()} color="primary" size="large" >
        <AddIcon />
      </IconButton>
      {/* {currentNote && <NoteForm note={currentNote} onSave={handleSave} />} */}
      <NoteForm note={currentNote} onSave={handleSave} open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <TableContainer component={Paper}>
        <Table aria-label="notes table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Diagnosis</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Treatment</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date of Treatment</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notes.map((note) => (
              <TableRow key={note.id}>
                <TableCell>{note.diagnosis}</TableCell>
                <TableCell>{note.treatment}</TableCell>
                <TableCell>{dayjs(note.dateOfTreatment).format('YYYY-MM-DD')}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openForm(note)} color="primary">
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
  );
};

export default NotesPage;

