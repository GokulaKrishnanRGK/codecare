# CodeCare

## Project Description

CodeCare is an innovative health management platform designed to streamline various aspects of
healthcare services for users. With a focus on providing comprehensive care solutions, CodeCare
addresses critical areas such as user registration, donations, vaccination management, appointment
bookings, and medical history maintenance. Each component of CodeCare is meticulously crafted to
enhance user experience and facilitate efficient healthcare interactions.

## Features

- **User Registration:**
  A seamless and secure registration process ensures that users can easily create accounts on the
  CodeCare platform. This foundational feature lays the groundwork for personalized healthcare
  services tailored to individual needs.

- **Donation:**
  CodeCare empowers users to contribute to healthcare initiatives through a dedicated donation
  system. This feature facilitates philanthropic endeavors, enabling users to
  support various healthcare projects and initiatives.

- **Vaccination Management:**
  Comprehensive vaccination management system.
  Users can access information regarding vaccinations, schedule appointments, and receive reminders
  for upcoming immunizations, promoting proactive healthcare practices.

- **Appointment Bookings:**
  Appointment booking system on CodeCare, ensuring users can conveniently
  schedule medical appointments with healthcare providers. This feature optimizes healthcare
  accessibility by simplifying the process of securing appointments for consultations, examinations,
  and treatments.

- **Medical History Maintenance:**
  Medical history maintenance module, a vital
  component that centralizes users' health records and past medical encounters. This feature
  includes functionalities such as medication reminders, enabling users to manage their treatment
  regimens effectively. Additionally, CodeCare incorporates general health checkup reminders to
  promote preventive healthcare practices and regular screenings.

## Contributors

- Gokul (User management, RBAC, Donation)
- Venkat (Vaccination Management)
- George (Appointment Bookings)
- Rohith (Medical History Maintenance)

# Object Model

```mermaid
---
Object Model For CodeCare
---

classDiagram
    class Role {
        +int id
        +String roleName
        +String description
    }
    class RoleApis {
        +int id
        +String name
        +Role role
        +String path
    }
    class Login {
        +int id;
        +String username;
        +String password;
        +User user;
        +Role role;
    }
    class User {
        +int id
        +String username
        +String firstname
        +String lastname
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

    class Donation {
        +int id
        +User user
        +double amount
        +DateTime donationDate
    }
    class Diagnosis {
        +int id
        +Appointment appointment
        +String condition
        +String remarks
    }
    class Medication {
        +int id
        +String tablets
        +String toniques
        +String injection
        +DateTime time
        +String operation
    }
    class VaccinationForm {
        +Patient patient
        +boolean covid_vaccine
        +boolean polio_vaccine
        +boolean influenza_vaccine
        +boolean varicella_vaccine
        +boolean hcp_vaccine
    }

    User <|-- Doctor
    User <|-- Patient
    Appointment "*" *-- "1" User
    AppointmentHistory "*" o-- "1" User

    Feedback "1" o-- "1" AppointmentHistory
    Appointment "1" *-- "1" Location
    
    Login "1" *-- "1" Role
    Login "1" *-- "1" User
    User "1" *-- "1" Role
    Role "1" -- "n" RoleApis
    User "1" -- "n" Donation

    Diagnosis "1" o-- "1" Appointment
    Medication "1" *-- "1" Diagnosis
    VaccinationForm "1" *-- "1" User

```