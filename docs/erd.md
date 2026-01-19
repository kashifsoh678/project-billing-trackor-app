# Entity Relationship Diagram (ERD)

This diagram represents the database schema and relationships for the Project Billing & Time Tracking System.

```mermaid
erDiagram
    User ||--o{ TimeLog : "logs time"
    Project ||--o{ TimeLog : "has logs"

    User {
        String id PK "UUID"
        String email "Unique"
        String password "Hashed"
        String name
        Role role "ADMIN | EMPLOYEE"
        DateTime createdAt
        DateTime updatedAt
    }

    Project {
        String id PK "UUID"
        String name
        String description "Optional"
        Float billingRate
        ProjectStatus status "ACTIVE | COMPLETED | ARCHIVED"
        DateTime archivedAt "Optional"
        DateTime createdAt
        DateTime updatedAt
    }

    TimeLog {
        String id PK "UUID"
        String userId FK
        String projectId FK
        Float hours
        String notes "Optional"
        DateTime logDate
        TimeLogStatus status "TODO | IN_PROGRESS | DONE"
        DateTime createdAt
        DateTime updatedAt
    }
```

## Relationships

1.  **User to TimeLog (1:N)**
    - One `User` can create many `TimeLog` entries.
    - Each `TimeLog` belongs to exactly one `User`.

2.  **Project to TimeLog (1:N)**
    - One `Project` can have many `TimeLog` entries associated with it.
    - Each `TimeLog` belongs to exactly one `Project`.
