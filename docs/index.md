## Using the Cardiac Advisor with the SMART Sandbox


1. Start from the [SMART Sandbox patient selector](https://fhir-dstu2.smarthealthit.org/#/ui/select-patient) and select a patient.

   (You may be asked to login. If you don't have an account in the public sandbox you can [create one](https://service.smarthealthit.org/public/NewUser) or [find a lost username or password](https://service.smarthealthit.org/private/Login).)

   Resources from the selected patient will be used to calculate and display cardiac risk.

1. On the **App Time** page use the **Custom App** widget and enter the following URL in the **Launch URL** field:

   `https://kgrid.github.io/cardiac-advisor/fhir-app/launch.html`

   (The **Client ID** doesn't matter, you can leave it empty.)


1. The **Cardiac Advisor** application will open in a new window/tab. (If this your first time accessing the application you'll be asked to authorize the Cardiac Advisor application.)

   Once the application opens you can proceed with the assesing cardiac risk for patient selected from the sandbox.
   
   > If the application is unresponsive it may be a problem with loading the Icon Array code from an execution stack behind a firewall or from a non-HTTPS source. In the Chrome browser, there should be a small shield with a red X in the address bar. Click it and select `Load unsafe scripts`. Safari doesn't allow *any* loading of scripts from non-secure sources. In Firefox, click the info icon next to the address bar and change the security settings to `Disable protection for now` 

1. You can return to the **App Time** page in the Smart Sandbox and use the back arrow to return to the list of patients in the sandbox, or go directly to the [patient selector](https://fhir-dstu2.smarthealthit.org/#/ui/select-patient) to try different resources.

### For more information visit:

- http://smarthealthit.org/
- http://docs.smarthealthit.org/sandbox/

To revoke the authorization granted to the Cardiac advisor visit:

- https://authorize-dstu2.smarthealthit.org/manage/user/approved