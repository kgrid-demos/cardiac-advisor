## Using the Cardiac Advisor with the SMART Sandbox

# Step 1 - Clone the Cardiac Advisor repository
__Note__: you will need access to the github repisitory to do this
   * Clone the repository https://github.com/kgrid/cardiac-advisor.git into any directory you want
 
# Step 2 - Start local server
   * From the command-line, navigate to the directory containing the "fhir-app" folder you downloaded
   * Do not enter the "fhir-app" folder
   * Start a local server at port 8000 (recommended server is Node's http-server)
   * __Note__: using Python's SimpleHTTPServer may not work with this application


# Step 3 - Register app in SMART sandbox
   * Go to the [SMART Sandbox](http://docs.smarthealthit.org/sandbox/). You may be asked to login. If you don't have an account in the public sandbox you will need to create one.
   * Once you are signed in, you should be on the sandbox manager page. Click the "register new app" button to begin the registration process.
   * You will see a menu with several options. Make sure the app type is "Public Client". You can name the app anything you want.
   * For the app launch URI, you will need to choose a local address and port. If you have followed the previous instructions, make the application URI: `http://localhost:8000/fhir-app/launch.html`
   * Make sure the "patient-scoped app" checkbox is checked
   * press the "save" button

# Step 4 - Client ID
   * After pressing the "save" button, a window will appear giving you the client ID for your SMART application. This ID is __very__ important.
   * Copy the Client ID that shows up
   * Open the launch.html file in the fhir-app folder with a text editor
   * Change the string following "client_id:" to be the client ID you received and save the file
   * After doing that, the launch.html page should look like this:
   
   ![example launch page](https://github.com/kgrid/cardiac-advisor/blob/master/launch.png)

# Step 5 - Launching the app
   * Make sure your local web server is running on the right port
   * On the Sandbox Manager page, you should see the app you just registered
   * Click the "launch" button, and the application will launch
   * If this is the first time you are launching the app, it may take some time to launch
   * If SMART asks you to grant permssions to the application, select the option to give it permission to run the application

### For more information visit:

- http://smarthealthit.org/
- http://docs.smarthealthit.org/sandbox/

To revoke the authorization granted to the Cardiac advisor visit:

- https://authorize-dstu2.smarthealthit.org/manage/user/approved
