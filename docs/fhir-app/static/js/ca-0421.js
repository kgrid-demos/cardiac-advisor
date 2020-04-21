//$$$

$(document).ready(function()
{
  appendLog("App Build Info: 20200421C");
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
  var smartkey =sessionStorage.getItem('SMART_KEY').replace(/"/g, "") ;
  var smartstate = sessionStorage.getItem(smartkey+"");
  var obj1 = {};
  if(smartstate!=null){
    obj1 = JSON.parse(smartstate);
    console.log(smartkey);
    var ver = 3;
    if(obj1.serverUrl.indexOf("DSTU2") !=-1 | obj1.serverUrl.indexOf("r2")!=-1){
      ver =2;
    } else if(obj1.serverUrl.indexOf("r3")!=-1) {
      ver =3;
    }
    if(obj1.authorizeUri){
      appendLog("Before Auth Ready - Auth Server URI: "+obj1.authorizeUri);
    }
  }

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
  if(obj1.authorizeUri){
    appendLog("SMART Auth Event - Auth Server URI: "+smartstate);
  }
  if(obj1.tokenResponse){
    var atoken = obj1.tokenResponse.access_token.substring(0,6)+"****";
    appendLog("SMART Auth Event - Access Token: "+atoken);
  }


	var retrieved = new Set();
	//codes for different conditions from EHR
	var renalCode = "36225005";
	var hypertensionCode = "38341003";
	var diabetesCode = "44054006";

	//This is used to keep track of results from knowledge objects
  var riskScores =
  {
    "bleedRisk": null,
    "stentRisk": null
  };

	smart.request('Patient/'+obj1.tokenResponse.patient).then(function(pt)
	{
		// console.log("PATIENT RESOURCE: ", pt);
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

		var retrieved = new Set();
    // resourecount_refresh(smart);
    smart.request("/Condition?patient=" + smart.patient.id)
  	.then(function(condition)
		{
			console.log("condition: ", condition);

			//if there the patient has a condition observation resource containing an
			// observation, outlilne the table box in green to show it was retrieved from the EHR
			// keep track of retrieved information using Retrieved set
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
				//$("#ehr-info").text("Areas outlined in green were pre-populated from the patient's electronic health record")
			}

			//Autofill sample buttons
			$(".sample").click(function()
			{
        var sampleno = parseInt($(this).val())+1;
				autofill(parseInt($(this).val()) ,retrieved);
				// $("#get_data").slideDown("slow"	)
				// hide_visuals()
        appendLog("Application Event - Autofill sample "+sampleno+ " is selected.");
        get_ischemic_data(pt, riskScores);
        get_stent_data(pt,riskScores);
        resetWriteButton("bleed");
        resetWriteButton("stent");
			});

		});


    $("input:radio[name='yes/no']").change(function()
    {
      get_ischemic_data(pt, riskScores);
      get_stent_data(pt,riskScores);
      resetWriteButton("bleed");
      resetWriteButton("stent");
    });

		// $("#write-data-bleed").click(function()
		// {
		// 	write_risk_data(riskScores["bleedRisk"],null, smart)
		// })
    // $("#write-data-stent").click(function()
		// {
		// 	write_risk_data(null,riskScores["stentRisk"], smart)
		// })
    // smart.user.read().then(function(usr){
    //   console.log(usr);
    // });

	}).catch(function(error){
    appendLog("SMART Request Error: - "+ error);
  });
}
