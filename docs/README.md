---
home: false
sidebarDepth: 2
---

# POST PCI Demo App Guide

## Introduction

`Post PCI Demo App` is a single page web app to demonstrate the capabilities of KGrid and [Post PCI Knowledge Objects](https://kgrid-objects.github.io/postpci/).

The app connects with the KGrid Sandbox instances of [Activator](https://activator.kgrid.org) and interacts with the activated Knowledge Objects.

The app also integrates with SMART Sandbox STU3; therefore, the SMART launcher is needed to run the app. After launching and selecting the patient, the app interface will be displayed.

## Usage

  * Choose one of four sample data sets;

  * The app will load the sample patient data;

  * The risk scores will be computed by the risk score Knowledge Objects and displayed along with the visualization using [Icon Array](https://kgrid-objects.github.io/icon-array/)


Note:

  1. In each advice panel, the links of `Knowledge Link` (will appear when hovered) will direct to the Knowledge Object in [Kgrid Library](https://library.kgrid.org);

  1. Hovering the mouse over the calculated risk score will highlight the input data used for the risk model.

  1. Patient data can be manually adjusted and the risk scores can be recalculated.


<div style="text-align:center;"><button style='background-color:green; color:#fff;padding:16px 10px;font-size: 1.5em;'><a href='https://launch.smarthealthit.org/?auth_error=&fhir_version_1=r2&fhir_version_2=r3&iss=&launch_ehr=1&launch_url=https%3A%2F%2Fdemo.kgrid.org%2Fcardiac-advisor%2Ffhir-app%2Flaunch.html&patient=&prov_skip_auth=1&provider=&pt_skip_auth=1&public_key=&sb=&sde=&sim_ehr=1&token_lifetime=15&user_pt=' style='color:#fff;'>LAUNCH POST PCI DEMO</a></button></div>
