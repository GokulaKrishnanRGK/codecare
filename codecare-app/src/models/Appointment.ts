export default interface Appointment{
    appointmentId: string,
    
    user:{
        userId:string,
        username:string,
        firstname:string,
        lastname:string,
    }

    doctor:{
        doctorId:string,
        doctorFirstname:string,
        doctorLastname:string,
        specialization:string,
        roomNo:string,
        hospitalName:string,
        city:string,
    },

    appointmentDate:string,
    appointmentStartTime:string,
    appointmentEndTime:string,
    issue:Array<string>,
    medicalDiagnosis:string,
    prescription:string,
    status:string


    
}