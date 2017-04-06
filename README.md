# cardiac-advisor
SMART cardiac advisor

Publish by copying files in `/fhir-app` to `/docs/fhir-app` folder, but do __not__ change the launch.html file

## Overview

The Cardiac advisor implements three use cases
- The SMART-on-FHIR use case—a provider starts from a patient record (in the sandbox EHR,) tinvokes and authorizes a remote application (running in the users browser.) The application then request thes patient's data in the form of FHIR resources from the (sandbox) FHIR server.
- THe Kgrid use case for patient instance data being sent to an Activator, engaging one or more Knowledge Objects, returning results to the application (running in the users browser) for display.
- The (SMART-on-FHIR) application adding a FHIR resource (e.g. risk measurement) to the associated patients record via the FHIR server.

## Getting started 

