### Using the Cardiac Advisor with the SMART Sandbox

1. Start from the [SMART Sandbox patient selector](https://fhir-dstu2.smarthealthit.org/#/ui/select-patient) and select a patient.

  (You may be asked to login. If you don't have an account in the public sandbox you can [create one](https://service.smarthealthit.org/public/NewUser) or [find a lost username or password](https://service.smarthealthit.org/private/Login).)

  Resources from that patient will be used to calculate cardiac risk.

2. On the **App Time** page use the **Custom App** widget and enter the following URL in the **Launch URL** field:

   `https://kgrid.github.io/cardiac-advisor/fhir-app/launch.html`

   (The **Client ID** doesn't matter, you can leave it as `my_web_app`.)


3. The **Cardiac Advisor** application will open in a new window/tab. If this your first time accessing the application you'll be asked to authorize the Cardiac Advisor application.

4. After authorizing, you'll be redirected to the **Cardiac Advisor** application and can proceed with the assesing cardiac risk for patient selected from the sandbox.


5. You can return to the **App Time** page and use the back arrow to return to the list of patients in teh sandbox, or go directly to the [patient selector](https://fhir-dstu2.smarthealthit.org/#/ui/select-patient) to try different resources.
