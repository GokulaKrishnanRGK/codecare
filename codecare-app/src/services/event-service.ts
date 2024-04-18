import {deleteById, postForm, search} from './api-service';
import Event from '../models/Event';

const eventAPI = 'events';

export const searchEvents = async (params = {}): Promise<Event[]> => {
    const eventArr = await search<{ data: Event[] }>(eventAPI, params);
    return eventArr.data;
}

export const createEvent = async (event = {}) => {
    return await postForm(eventAPI, event);
}

export const deleteEvent = async (id: string) => {
    return await deleteById(eventAPI, id);
}