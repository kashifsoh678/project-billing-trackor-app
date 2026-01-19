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

    %% Enums
    class Role {
        ADMIN
        EMPLOYEE
    }

    class ProjectStatus {
        ACTIVE
        COMPLETED
        ARCHIVED
    }

    class TimeLogStatus {
        TODO
        IN_PROGRESS
        DONE
    }
```

## Relationships

1.  **User to TimeLog (1:N)**
    - One `User` can create many `TimeLog` entries.
    - Each `TimeLog` belongs to exactly one `User`.

2.  **Project to TimeLog (1:N)**
    - One `Project` can have many `TimeLog` entries associated with it.
    - Each `TimeLog` belongs to exactly one `Project`.

## Key Fields

- **User.role**: Determines access levels (RBAC). `ADMIN` has full access, `EMPLOYEE` generally has read/write access only to their own data (except projects list).
- **Project.billingRate**: Used to calculate the cost of billable hours.
- **TimeLog.status**: Tracks the workflow state of time entries on the Kanban board.
