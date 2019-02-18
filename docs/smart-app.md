# SMART-doc
Documentation on how to use SMART with the Knowledge Grid

# About SMART
SMART is a way for applications to interact with data stored in a FHIR-formatted electronic health record system (EHR). SMART provides an aPI for accessing FHIR resources. Applications that use SMART can be plugged in to any properly formatted EHR. This makes it easy to make
flexible applications, and it is especially useful for interacting with the Knowledge Grid (kgrid).

# Files
Every SMART application needs two things: a **launch** page and an **index** page. Both of these are html files. The launch.html page sets up your application's **client ID** and gives it a **context**. A SMART application can have read/write contexts and can access different inforation based on the launch context.

# Example launch page
Here is an example of a standard launch page for a SMART app

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://rawgithub.com/smart-on-fhir/client-js/master/dist/fhir-client.js"></script>
    <script>
      FHIR.oauth2.authorize({
        "client_id": "my_web_app",
        "scope":  "patient/*.read"
      });
    </script>
  </head>
  Loading...
</html>
```
**NOTE:** This example includes a script source to a raw github link for the smart-on-fhir library. A finished SMART app should **not** include this

In this example, the SMART application has a client ID of "my_web_app". The client ID is essentially the name of your application. "patient/\*.read" means this application has access to patient-level FHIR resources, and can read from all those resources.

This application is patient-specific and will read resources from a specified patient, but can't access other resources. If you wanted to make a population-level SMART application, you would need to change the scope to
```
"scope": "user/*.read"
```
This would give the applicatoin access to all the resources the current user is able to use, which can include all patients in an EHR.

Now that the application has a context, it will launch into the index.html page where you can begin using the API

# Index page
The index.html page is just like any html file. To use smart, you will have to use the FHIR.ouath2() method like this:
```javascript
FHIR.oauth2.ready(function(smart) 
{
}
```
the `FHIR.oauth2.ready()` method will give you an endpoint to make SMART API calls with. The endpoint can be named anything, but in this example it is called "smart"

Take a look at the index-example.html file in this repository to get an idea of how SMART works.

FHIR formatted data is similar to JSON. To access resources you may have to jump through a few hoops to get to the actual information you want within the resource.

I reccomend using ```console.log()``` to log some fhir resources to the console so you can see their structure and where the information is within each resource

To access fhir resources with SMART, use the ```smart.api.search()``` method. This method accepts a type of FHIR resource to search for, and an optional ```query``` paramter that can narrow the search.

For example:
```javascript
  smart.api.search({type: 'Observation'})
 ```
 Will search for Observation-type resources within the context of the application. In this case it will give you an Observation resource belonging to the patient you are reading from
 
 To add a query to the search:
 ```javascript
smart.api.search({type: "Observation", query: {code: '8480-6'} })
```
This will give you an Observation resource with code 8480-6 (code is a medical code. In this case it is the code for systolic blood pressure)

# Writing FHIR resources with SMART
Using SMART, it is possible to write and update fhir resources for patients. This section will go over writing FHIR resources using the SMART sandbox from www.smarthealthit.org

To write a FHIR resource, first you will need a template of the resource type. For resource formats go to https://www.hl7.org/fhir/clinical.html. Once you have a template, you will need to change a few things to make sure the resource is writen properly.

The first thing you should change is the patient ID. This will make sure the resource is associated with the right patient. You should __not__ enter this manually. use ```patient.id``` from the SMART API to obtain this.


# SMART with KGrid
Data from FHIR resources obtained from SMART can be used by some knowledge objects. For an example of an application that does this, check out the [SMART cardiac advisor](https://github.com/kgrid/cardiac-advisor) application

To use SMART with KGrid, First obtain the data you want using the `smart.api.search()` method. Once you have the data you want, you will have to make a call to the knowledge object you want. For information on how to use knowledge objects, see the [Manual](https://www.gitbook.com/book/kgrid/authoring-ii/details)
