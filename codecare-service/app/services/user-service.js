

export const save = async (request, response) => {
    try {
        const newNote = {...request.body};
        newNote._id = null;
        const meetingNote = await meetingNotesService.save(newNote);
        setResponse(meetingNote, response);
    } catch (error) {
        setError(error, response);
    }
}