import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileState } from '../models/vaccination/ProfileState';

const initialState: ProfileState = {
  name: '',
  age: 0,
  gender: 'Other',
  vaccinations: []
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<{ field: string; value: any }>) => {
      const { field, value } = action.payload;
      (state as any)[field] = value;
    },
    addVaccination: (state) => {
      state.vaccinations.push({
        id: `vacc-${Date.now()}`,
        name: '',
        date: ''
      });
    },
    updateVaccination: (state, action: PayloadAction<{ index: number; field: string; value: any }>) => {
      const { index, field, value } = action.payload;
      if (state.vaccinations[index]) {
        (state.vaccinations[index] as any)[field] = value;
      }
    },
    removeVaccination: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.vaccinations.splice(index, 1);
    }
  }
});

export const {
  updateProfile,
  addVaccination,
  updateVaccination,
  removeVaccination
} = profileSlice.actions;

export default profileSlice.reducer;
