# Project Structure
        homework-1/
        └───src
        │   database.json
        │   index.js
        │   utils.js
        │
        ├───controllers
        │       habits.controller.js
        │
        ├───models
        │       habits.model.js
        │
        ├───router
        │       habits.router.js
        │
        └───services
                habits.service.js

# Usage 
Run commands via Node.js (in project folder \homework-1v\src)
    
`node index.js <command> [--options]`

# Commands
| Command                                                   | Description                                 |
|-----------------------------------------------------------|---------------------------------------------|
| `add --name "<text>" --freq \<'daily' 'weekly' 'monthly'` | Add a new habit                             |
| `list`                                                    | List all habits in a table                  |
| `done --id <habit_id>`                                    | Mark today's habit as done                  |
| `stats`                                                   | Show progress stats (7/30 day completion %) |
| `delete --id <habit_id>`                                  | Delete a habit                              |
| `update --id <habit_id> --name "<new text>" --freq <...>` | Update a habit’s name or frequency          |


# Examples
```
node index.js add --name "Drink water" --freq daily
node index.js list
node index.js done --id 1729482039483
node index.js stats
node index.js delete --id 1729482039483
node index.js update --id 1729482039483 --name "Morning workout" --freq weekly
```

# Time Simulation with OFFSET_DAYS
You can simulate a different "current day" by setting the environment variable OFFSET_DAYS:

For example, if you want add habit in two days in future run in PowerShell
```
 $env:OFFSET_DAYS=2    
```