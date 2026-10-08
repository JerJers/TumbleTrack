# Weekly Reports

## Week of 2026-07-30

**Done.**
- The authentication problem for mobile version is complete, the Frontend and API are now communicates the moment a user entered the correct username and password.
- Added a authentication modal using the existing modal design, to improvement the looks of the login.
- Understand the logic behind each screens, to create a contribution to the web app and be prepare to explain the web app to the users.
- Rewrote and refactored the 4 screens to make my own contributions to the web app.
- Complete the AI-Usage.md as a requirement for the third week of app development.

**Stuck.**
- Understanding the logic behind the 4 screens and how it communicates with the backend.
- Fixing the authentication problems for mobile version, it keeps repeating the same errors. Either the app lose its' communication to the API or the login prompt keeps prompting every time I switch screens

**Hours.**
- About 8 Hours

**Next.**
- Prepare and Record the presentation video of the web app, that will serve as a Demo video and Presentation of the whole web app.
- Making sure the app is up and running and available by using the live application link: https://jerjers.github.io/TumbleTrack/

---

## Week of 2026-09-23

**Done.**
- Successfully committed and pushed the application code to the repository.
- Set up the Neon database.
- Set up the Render environment for the API.
- Connected the frontend and backend successfully.
- Connected the API to the database.
- Tested the application after deployment.
- Configured the required variables in the GitHub repository.
- Confirmed that the deployed application can communicate with the backend and database.

**Stuck.**
- The `deviceId` is inconsistent.
- A new laundry load from the same account can receive a different `deviceId`.
- This makes it difficult to consistently identify the same device/account across multiple laundry loads.

**Hours.**
- About 7 Hours

**Next.**
- Fix the `deviceId` consistency issue.
- Improve the application's design and features while continuing to address bugs and professor feedback.

---

## Week of 2026-09-18

**Done.**
- Created the dashboard screen.
- Added dashboard updates whenever a user records a new laundry load or clothing item.
- Created the log load screen for recording information about a completed laundry load.
- Created the clothing screen for tracking special and delicate clothing items.
- Created the history screen for displaying recorded laundry logs in a table.
- Created and fixed the main application components before placing them in their respective screens.
- Added the initial application styling.
- Debugged and tested API endpoints to ensure their routes and purposes were correct.
- Added temporary local/in-memory storage for holding user inputs.

**Stuck.**
- Encountered repeated API routing errors.
- Mixed up path parameters, which caused problems when logging data into the in-memory storage.
- The database had not yet been implemented.

**Hours.**
- About 8 Hours

**Next.**
- Implement the database for persistent data storage.
- Continue debugging the application and resolve errors that appear during development.
