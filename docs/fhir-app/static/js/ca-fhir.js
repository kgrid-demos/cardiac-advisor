//$$$

$(document).ready(function()
{
  appendLog("App Build Info: 20200430-FHIRAPI");
  appendLog("K-GRID Resource Request - Retrieving Icon Array Code (ark:/99999/fk40s01p75) from Knowledge Grid Activator.");
  if(b){
    appendLog("K-GRID Resource Response - Retrieved Icon Array Code (ark:/99999/fk40s01p75) from Knowledge Grid Activator.");
    appendLog("Application Event - Post PCI Risk Assessment Ready.");
    ir_fill("bleeding-icon", 0);
    ir_fill("stent-gage", 0);
  }else {
    appendLog('K-GRID Resource Response - Error');
    $("input").prop("disabled", "disabled");
  }
  $("[id$='pane']").hover(function() {
    var hoveredElement = this.id.replace("-pane", "");
    $(".vis").removeClass("vis");
    $("." + hoveredElement).addClass("vis");
  }, function() {
    $(".stent").addClass("vis");
    $(".bleed").addClass("vis");
  });
  console.log(FHIR);
  FHIR.oauth2.ready().then(function(client) {
      app(client);
    }).catch(function(e){
      console.log(e);
    });
});

function app(smart){
  //get patient information from SMART API
  console.log(smart);
  console.log(smart.state.serverUrl);
  var smartkey =sessionStorage.getItem('SMART_KEY').replace(/"/g, "") ;
  var smartstate = sessionStorage.getItem(smartkey+"");
  var obj1 = {};
  if(smartstate!=null){
    obj1 = JSON.parse(smartstate);
    console.log(smartkey);
  }
  var ver = 3;
  if(obj1.serverUrl.indexOf("DSTU2") !=-1 | obj1.serverUrl.indexOf("r2")!=-1){
    ver =2;
  } else if(obj1.serverUrl.indexOf("r3")!=-1) {
    ver =3;
  }
  var serverVer = (ver==2) ? "DSTU2" : "STU3";
  if(obj1.authorizeUri){
    appendLog("SMART Auth Event - Auth Server URI: "+smartstate);
  }
  if(obj1.tokenResponse){
    var atoken = obj1.tokenResponse.access_token.substring(0,6)+"****";
    appendLog("SMART Auth Event - Access Token: "+atoken);
  }

  if(obj1.serverUrl.indexOf("umich.edu")!=-1|obj1.serverUrl.indexOf("epic")!=-1){
        //MM POC handling STU3 Resource in DSTU2 Server
        var baseUrl = obj1.serverUrl.replace('api/FHIR/'+serverVer, "");
        console.log(baseUrl);
        var identifierSearchString = "api/epic/2015/Common/Patient/GetPatientIdentifiers/Patient/Identifiers";
        var completeSearchString = baseUrl + identifierSearchString;
       // appendLog("FHIR Patient ID URL: "+completeSearchString);
       var requestParams = { "PatientID":obj1.tokenResponse.patient,
          "PatientIDType":"FHIR",
          "UserID":"999972508570",
          // "UserID":"1",
          "UserIDType":"External" };
        console.log(requestParams);
        $.ajaxSetup({
          headers:{
            'Authorization': 'Bearer '+obj1.tokenResponse.access_token,
            "Epic-Client-ID":"c658350f-8c9c-4f46-8a27-a1ceb736d701"
          }
        });
        // $.post(completeSearchString, requestParams).done(function(data) {
        //   appendLog("EPIC FHIR Patient Identifier: "+data);
        //   var result = $.grep(data, function(x) { return x.IDType == "FHIR STU3"; });
          var patientIdSTU3 =  "e63wRTbPfr1p8UW81d8Seiw3"; //Epic App Orchard
          if(obj1.serverUrl.indexOf("umich.edu")!=-1){
            patientIdSTU3 = "eix-nouOxJRM2qt-h2y0-qg3";  //MM POC sample id
          }
          //result[0].ID;  //We’ll only ever return one FHIR STU3 ID
          //
          // Patient Info
          var ptSearchString = obj1.serverUrl.replace(serverVer, 'STU3')+"/Patient/" + patientIdSTU3;
          appendLog("Patient Search URL: "+ ptSearchString);
          $.getJSON(ptSearchString).done(function(pt){
            ptUI(ver, pt);
        		var retrieved = new Set();
            // Condition
            var ptConditionString = obj1.serverUrl.replace(serverVer, 'STU3')+"/Condition?patient=" + patientIdSTU3;
            $.getJSON(ptConditionString).done(function(data){
                appendLog("EPIC FHIR Resource - Patient Info: ");
                appendLog(data);
                appUI(pt, condition);
              }).fail(function(error){
                console.log(error);
                appendLog("EPIC FHIR Error Code: (Condition) " + error.status);
                appendLog("EPIC FHIR Error Status Text: (Condition) " + error.statusText);
              });
          }).fail(function(jqXHR, textStatus, error){
            console.log(error);
            appendLog("EPIC FHIR Error Code: (Patient) " + JSON.stringify(jqXHR.responseJSON));

            appendLog("EPIC FHIR Error Code: (Patient) " + error.status);
            appendLog("EPIC FHIR Error Status Text: (Patient) " + error.statusText);
          });
        // }).fail(function(error){
        //   console.log(error);
        //   appendLog("EPIC FHIR Error Code: " + error.status);
        //   appendLog("EPIC FHIR Error Status Text: " + error.statusText);
        // });
  } else {
    console.log(obj1.serverUrl);
    smart.request('Patient/'+smart.patient.id).then(function(pt)
    {
      ptUI(ver, pt);

      var retrieved = new Set();
      // resourecount_refresh(smart);
      smart.request("/Condition?patient=" + smart.patient.id)
      .then(function(condition)
      {
        appendLog("SMART FHIR Resource - Patient Condition FHIR Resource: ");
        appendLog(JSON.stringify(condition));
        appUI(pt, condition);
      }).catch(function(error){
        appendLog("SMART Request Error: - "+ error);
      });
    }).catch(function(error){
      appendLog("SMART Request Error: - "+ error);
    });
  }
}

function ptUI(ver, pt){
  appendLog("FHIR Resource - Patient Info: ");
  appendLog(JSON.stringify(pt));
  appendLog("Application Event - Patient ID: "+pt.id);
  var patientName =get_patient_name(ver, pt);
  var serverVer = (ver==2) ? "DSTU2" : "STU3";
  appendLog("Application Event - Retrieved Patient Data from FHIR Server ("+serverVer+")");
  appendLog("Application Event - Patient ID: "+pt.id);
  appendLog("Application Event - Patient Name: "+JSON.stringify(pt.name));
  console.log(patientName);
  console.log(ver);
  $("#patient-name").text(get_patient_name(ver, pt));
  $("#patient-age").text(calculateAge(pt.birthDate));
  $("#patient-id").text(pt.id);
  $("#patient-gender").text(pt.gender);
}

function appUI(pt, condition){
  //if there the patient has a condition observation resource containing an
  // observation, outlilne the table box in green to show it was retrieved from the EHR
  // keep track of retrieved information using Retrieved set
  //This is used to keep track of results from knowledge objects
  var retrieved = new Set();
  //codes for different conditions from EHR
  var renalCode = "36225005";
  var hypertensionCode = "38341003";
  var diabetesCode = "44054006";
  var riskScores =
  {
    "bleedRisk": null,
    "stentRisk": null
  };
  if(value_in_resource(condition, resource_path_for(renalCode)))
  {
    retrieved.add(keyDict.renal);
    $("#renal-form").find("input").prop("disabled", true);
    $("#renal-yes").prop("checked", true);
    $(".renal-data").addClass("filled");
    console.log('SET', retrieved);
  }
  if(value_in_resource(condition, resource_path_for(hypertensionCode)))
  {
    retrieved.add(keyDict.hypertension);
    $("#hypertension-form").find("input").prop("disabled", true);
    $("#hypertension-yes").prop("checked", true);
    $(".hypertension-data").addClass("filled");
  }
  if(value_in_resource(condition, resource_path_for(diabetesCode)))
  {
    retrieved.add(keyDict.diabetes);
    $("#diabetes-form").find("input").prop("disabled", true);
    $("#diabetes-yes").prop("checked", true);
    $(".diabetes-data").addClass("filled");
  }

  //If we got anything from the EHR display message explaining the green highlights
  if(retrieved.size > 0)
  {
    console.log("retrieved elts", retrieved);
  }

  //Autofill sample buttons
  $(".sample").click(function()
  {
     var sampleno = parseInt($(this).val())+1;
    autofill(parseInt($(this).val()) ,retrieved);
    // hide_visuals()
     appendLog("Application Event - Autofill sample "+sampleno+ " is selected.");
     get_ischemic_data(pt, riskScores);
     get_stent_data(pt,riskScores);
     resetWriteButton("bleed");
     resetWriteButton("stent");
  });

  $("input:radio[name='yes/no']").change(function()
  {
    get_ischemic_data(pt, riskScores);
    get_stent_data(pt,riskScores);
    resetWriteButton("bleed");
    resetWriteButton("stent");
  });

}
