# Object Model


```mermaid

---

Object Model For CodeCare

---

classDiagram
    class User {
        +int id
        +String firstName
        +String lastName
        +String email
        +String role
    }

    class Doctor {
        +String specialization
    }

    class Patient {

    }

    class Appointment {
        +int id
        +DateTime startTime
        +DateTime endTime
        +User user
        +Doctor doctor
        +String status
        +Location location
    }

    class AppointmentHistory {
        +int id
        +User user
        +DateTime appointmentDate
        +String notes
    }

    class Feedback {
        +Appointment appointment
        +User user
        +String comment
        +int rating
    }

    class Location {
        +int id
        +String name
        +String address
        +String city
        +String state
        +String country
        +String postalCode
    }

    User <|-- Doctor
    User <|-- Patient

    Appointment "*" *-- "1" User
    AppointmentHistory "*" o-- "1" User


    Feedback "1" o-- "1" AppointmentHistory
    Appointment "1" *-- "1" Location

```