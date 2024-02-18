# Functional Requirements
- [ ] It should be possible to create a user.
- [ ] It should be possible to register a meal with specific information.
    - [ ] The meal must have the following payload:
        ```
        {
            name: string;
            description: string;
            time: timestamp;
            offDiet: boolean;
        }
        ```
- [ ] It should be possible to edit a meal, altering all related data.
- [ ] It should be possible to delete a meal.
- [ ] It should be possible to list all meals of a user.
- [ ] It should be possible to view a single meal.
- [ ] It should be possible to retrieve a user's metrics.


# Nonfunctional Requirements

- [ ] It should be possible to identify the user between requests.
- [ ] The user can only view, edit, and delete meals they created.