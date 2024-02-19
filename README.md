# Functional Requirements
- [x] It should be possible to create a user.
- [x] It should be able to list all users.
- [x] It should be able to get user by ID.
- [x] It should be able to login passing user ID.
- [x] It should be possible to register a meal with specific information.
    - [x] The meal must have the following payload:
        ```
        {
            name: string;
            description: string;
            time: timestamp;
            offDiet: boolean;
            userId: string;
        }
        ```
- [x] It should be possible to edit a meal, altering all related data.
- [x] It should be possible to delete a meal.
- [x] It should be possible to list all meals of a user.
- [x] It should be possible to view a single meal.
- [ ] It should be possible to retrieve a user's metrics.


# Nonfunctional Requirements

- [x] It should be possible to identify the user between requests.
- [x] The user can only view, edit, and delete meals they created.