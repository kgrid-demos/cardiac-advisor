## Using the Cardiac Advisor with the SMART Sandbox


1. Start from the [SMART Sandbox patient selector](https://fhir-dstu2.smarthealthit.org/#/ui/select-patient) and select a patient.

   (You may be asked to login. If you don't have an account in the public sandbox you can [create one](https://service.smarthealthit.org/public/NewUser) or [find a lost username or password](https://service.smarthealthit.org/private/Login).)

   Resources from the selected patient will be used to calculate and display cardiac risk.

1. On the **App Time** page use the **Custom App** widget and enter the following URL in the **Launch URL** field:

   `http://kgrid.org/cardiac-advisor/fhir-app/launch.html`

   (The **Client ID** doesn't matter, but you have to put something in.)


1. The **Cardiac Advisor** application will open in a new window/tab. (If this your first time accessing the application you'll be asked to authorize the Cardiac Advisor application.)

   Once the application opens you can proceed with the assesing cardiac risk for patient selected from the sandbox.

1. You can return to the **App Time** page in the Smart Sandbox and use the back arrow to return to the list of patients in the sandbox, or go directly to the [patient selector](https://fhir-dstu2.smarthealthit.org/#/ui/select-patient) to try different resources.

### For more information visit:

- http://smarthealthit.org/
- http://docs.smarthealthit.org/sandbox/

To revoke the authorization granted to the Cardiac advisor visit:

- https://authorize-dstu2.smarthealthit.org/manage/user/approved
