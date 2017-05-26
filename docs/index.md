

# Using the Post PCI Risks Calculator
{:.no_toc}

* TOC
{:toc}

## Running Locally-hosted App in SMART Sandbox

You can run this app hosted locally from SMART Sandbox. This will help if you want to make changes or edit anything before publishing it. Follow the steps to register and launch the app. Be sure that the correct App Launch URI is used when registering.

## Running Published App in SMART Sandbox

You can run this app published at kgrid.org/cardiac-advisor from SMART Sandbox. Skip Step 1 and 2, follow the rest steps to register and launch the app. Be sure that the correct App Launch URI is used when reigstering.

## Quick Start Guide

### Step 1 - Clone the Cardiac Advisor repository
__Note__: you will need access to the github repisitory to do this
   * Clone the Cardiac Advisor repository into any directory you want by entering this in the command-line:
   * `git clone https://github.com/kgrid/cardiac-advisor.git`

### Step 2 - Start local server
   * From the command-line, navigate to the directory containing the "fhir-app" folder you downloaded
   * Do not enter the "fhir-app" folder
   * Start a local server at port 8000 (recommended server is Node's http-server)
    `http-server -p 8000`
   * __Note__: using Python's SimpleHTTPServer may not work with this application

### Step 3 - Register app in SMART sandbox
   * Go to the [SMART Sandbox](https://sandbox.smarthealthit.org). You may be asked to login. If you don't have an account in the public sandbox you will need to create one by clicking "sign up" and following the instructions.
   * Once logged in, select the desired sandbox from your list. (You can use the default one which is the only one after first sign-in);
   * In "Registered Apps", there might be some default apps. To register the app, click on the button of "+Register New App";
   * The registration form has two required fields: "App Name" for displaying in the sandbox, "App Launch URI" should be
    `http://kgrid.org/cardiac-advisor/fhir-app/launch.html` for the published SMART Post PCI Risks Calculator;
    `http://localhost:8000/fhir-app/launch.html` for the locally-hosted SMART Post PCI Risks Calculator;
   * Select the image of your choice and upload as the icon to be displayed in the sandbox ;
   * After save, the system will provide you the client ID. As for now, you don't need to make any changes in the launch.html.
   * The app should appear in your sandbox "Registered Apps" and be ready for launch.

### Step 4 - Launching the app
   * If running the locally-hosted app, make sure your local web server is running on the right port
   * On the Sandbox Manager page, you should see the app you just registered in "Registered Apps";
   * Click the "launch" button, and the application will launch;
   * A panel of Patient Picker will show up. Select the patient for the app to continue;
   * If this is the first time you are launching the app, it may take some time to launch and SMART may ask you to grant permssions to the application. Authorize the application to continue;
   * __Note__: The Patient Picker can be customized by entering a FHIR query to Sample Patient field in Registered App Detail Panel so that the patient picker only shows the list which the app applies. Example:
    `Patient?gender=male` will show only male patient to be selected from.
    `Patient?birthdate=lt1987-01-01` will show only the patients born before January 1, 1987 to be selected from.

## For more information visit:

- http://smarthealthit.org/
- http://docs.smarthealthit.org/sandbox/
