import React, {useState} from 'react';
import Event from '../models/Event.ts';
import { FormLabel, OutlinedInput} from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import * as eventService from '../services/event-service.ts'

const initialEventState: Event = {
    type: '',
    title: '',
    organizer: '',
    description: '',
    date: new Date(),
    contactInfo: '',
    location: {
        latitude: 0,
        longitude: 0,
        name: 'Location Name',
        address: '',
        city: '',
        state: '',
        country: 'USA',
        postalCode: ''
    }
};

const CreateEvent = () => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Handle form submission logic here
        const formData = new FormData(event.target);
        // const object = {};
        // formData.forEach((value, key) => object[key] = value);
        // const json = JSON.stringify(object);
        initialEventState.type = formData.get('type') !==null ? formData.get('type') : '';
        initialEventState.title = formData.get('title') !==null ? formData.get('title') : '';
        initialEventState.description = formData.get('description') !==null ? formData.get('description') : '';
        initialEventState.organizer = formData.get('organizer') !==null ? formData.get('organizer') : '';
        initialEventState.contactInfo = formData.get('contactInfo') !==null ? formData.get('contactInfo') : '';
        initialEventState.date = formData.get('date') !==null ? formData.get('date') : '';
        initialEventState.location.address = formData.get('address') !==null ? formData.get('address') : '';
        initialEventState.location.city = formData.get('city') !==null ? formData.get('city') : '';
        initialEventState.location.state = formData.get('state') !==null ? formData.get('state') : '';
        initialEventState.location.postalCode = formData.get('postalCode') !==null ? formData.get('postalCode') : '';
        // console.log(json);
        console.log(initialEventState);
        eventService.createEvent(initialEventState);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <div>
                        <div>
                            <FormLabel htmlFor="title" required>
                            Title
                            </FormLabel>
                        </div>
                        <div>
                            <OutlinedInput
                                id="title"
                                name="title"
                                type="text"
                                placeholder="Title"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <div>
                            <FormLabel htmlFor="description" required>
                                Description
                            </FormLabel>
                        </div>
                        <div>
                            <OutlinedInput
                                id="description"
                                name="description"
                                type="text"
                                placeholder="Description"
                                multiline={true}
                                rows={6}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <div>
                            <FormLabel htmlFor="organizer" required>
                                Name of the Organizer
                            </FormLabel>
                        </div>
                        <div>
                            <OutlinedInput
                                id="organizer"
                                name="organizer"
                                type="text"
                                placeholder="Organizer"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <div>
                            <FormLabel htmlFor="type" required>
                                Event Type
                            </FormLabel>
                        </div>
                        <div>
                            <OutlinedInput
                                id="type"
                                name="type"
                                type="text"
                                placeholder="Type"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <div>
                            <FormLabel required>
                                Date
                            </FormLabel>
                        </div>
                        <div>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker name="date" label="Event Date"/>
                            </LocalizationProvider>
                        </div>
                    </div>
                    <div>
                        <div>
                            <FormLabel htmlFor="address" required>
                                Address
                            </FormLabel>
                        </div>
                        <div>
                            <OutlinedInput
                                id="address"
                                name="address"
                                type="text"
                                placeholder="Address"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <div>
                            <FormLabel htmlFor="city" required>
                                City
                            </FormLabel>
                        </div>
                        <div>
                            <OutlinedInput
                                id="city"
                                name="city"
                                type="text"
                                placeholder="City"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <div>
                            <FormLabel htmlFor="state" required>
                                State
                            </FormLabel>
                        </div>
                        <div>
                            <OutlinedInput
                                id="state"
                                name="state"
                                type="text"
                                placeholder="State"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <div>
                            <FormLabel htmlFor="postalCode" required>
                                Postal Code
                            </FormLabel>
                        </div>
                        <div>
                            <OutlinedInput
                                id="postalCode"
                                name="postalCode"
                                type="text"
                                placeholder="Postal Code"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <div>
                            <FormLabel htmlFor="contactInfo" required>
                                Contact
                            </FormLabel>
                        </div>
                        <div>
                            <OutlinedInput
                                id="contactInfo"
                                name="contactInfo"
                                type="text"
                                placeholder="Contact"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <Button type="submit" variant="contained" color="primary">Submit</Button>
                    </div>
                </Stack>
            </form>
        </div>
    );
};

export default CreateEvent;
