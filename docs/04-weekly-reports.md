# Weekly Reports

## Week of 2026-09-26

**Done.**  
The main application screens are now created and functional, including the dashboard, log load screen, clothing screen for tracking special/delicate items, and history screen for displaying laundry records. The required app components and styling were also implemented. API endpoints were debugged and connected to temporary local/in-memory storage so user inputs could be recorded and displayed.

**Stuck.**  
I encountered repeated API routing errors, particularly with incorrect or mixed-up path parameters. These errors prevented user data from being properly logged into the in-memory data. The database had also not yet been implemented.

**Hours.**  
6 Hours

**Next.**  
Implement the database and continue debugging the API and application. Add the application logo once the main application is completed.

---

## Week of 2026-10-01

**Done.**  
The application code was successfully committed and pushed to the repository. The Neon database and Render environment were set up, and the frontend and backend are now communicating successfully. The API is connected to the database, GitHub repository variables were configured, and the application was tested in its deployed environment.

**Stuck.**  
The main issue encountered was the `deviceId`. The application generates different `deviceId` values when a user enters a new laundry load even when the loads are coming from the same account. This creates an inconsistency in identifying the same user's device/account. A problem also arise in mobile version of the app, the authentication is missing, it means the app has no communication with the API.

**Hours.**  
8 Hours

**Next.**  
Fix the `deviceId` consistency issue and improve the application's design or features. Fix the authentication for the mobile version of the web app. Continue addressing bugs and incorporating feedback from the professor.
