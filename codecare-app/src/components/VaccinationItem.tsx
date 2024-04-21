import React from 'react';
import { useDispatch } from 'react-redux';
import { TextField, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateVaccination, removeVaccination } from '../store/ProfileSlice';

interface VaccinationItemProps {
    vaccination: { id: string; name: string; date: string };
    index: number;
}

const VaccinationItem: React.FC<VaccinationItemProps> = ({ vaccination, index }) => {
    const dispatch = useDispatch();

    const handleVaccinationChange = (field: 'name' | 'date', value: string) => {
        dispatch(updateVaccination({ index, field, value }));
    };

    return (
        <>
            <Box display="flex" alignItems="center" gap={2} marginTop={2}>
                <TextField
                    label="Vaccination Name"
                    value={vaccination.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleVaccinationChange('name', e.target.value)}
                    fullWidth
                />
                <TextField
                    label=""
                    type="date"
                    value={vaccination.date}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleVaccinationChange('date', e.target.value)}
                    fullWidth
                />
                <IconButton onClick={() => dispatch(removeVaccination(index))} color="secondary">
                    <DeleteIcon />
                </IconButton>
            </Box>
        </>
    );
};

export default VaccinationItem;