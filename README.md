# cardiac-advisor
SMART cardiac advisor

Publish by copying files in `/fhir-app` to `/docs/fhir-app` folder, but do __not__ change the launch.html file

## Overview

The Cardiac advisor implements three use cases
- The SMART-on-FHIR use case—a provider starts from a patient record (in the sandbox EHR,) tinvokes and authorizes a remote application (running in the users browser.) The application then request thes patient's data in the form of FHIR resources from the (sandbox) FHIR server.
- THe Kgrid use case for patient instance data being sent to an Activator, engaging one or more Knowledge Objects, returning results to the application (running in the users browser) for display.
- The (SMART-on-FHIR) application adding a FHIR resource (e.g. risk measurement) to the associated patients record via the FHIR server.

## Running locally 
You can run this app locally if you want to make changes or edit anything without publishing it. To run locally, clone this repository into any directory. From the command-line, navigate to the directory that you cloned to. You will now have to start a local server to test the application. Node's http-server is recommended for this. To run the application, go to the [SMART FHIR starter](https://fhir-dstu2.smarthealthit.org/#/ui/select-patient) and sign in (you will need to create an account if you do not alredy have one).

From here, you can either choose the "My web app" option or the "Custom app option". To use the "My web app" option, make sure your local server is running on port 8000. Once the server is on that port, just click the "My web app" button, and the app will interact with the SMART sandbox using your local server. If you want to run on a different port or server, use the "Custom App" option and use any URL you want.

__Notes__: 
  * the Python SimpleHTTPServer does not work with this application.
  * to run locally, make sure the launch.html file has a `client_id` of "my_web_app"
