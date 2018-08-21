//$$$

$(document).ready(function()
{
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


//This gives the smart endpoint for using SMART API calls
FHIR.oauth2.ready(function(smart)
{
  //get patient information from SMART API
  // console.log(smart);
  console.log(smart.server.serviceUrl);
  var ver = 0;
  if(smart.server.serviceUrl.includes("r2")){
    ver =2;
  } else if(smart.server.serviceUrl.includes("r3")) {
    ver =3;
  }
  console.log(ver);
	var patient = smart.patient.read()

	var retrieved = new Set()

	//codes for different conditions from EHR
	var renalCode = "36225005"
	var hypertensionCode = "38341003"
	//There are a lot of different codes for the different types of diabetes\
	//just using this code for now
	var diabetesCode = "44054006"

	//This is used to keep track of results from knowledge objects
  var riskScores =
  {
    "bleedRisk": null,
    "stentRisk": null
  }

	$.when(patient).done(function(pt)
	{
		console.log("PATIENT RESOURCE: ", pt);
    appendLog("Application Event - Retrieved Patient Data from SMART Sandbox.");
		var patientInfo = pt;
		console.log(patientInfo);
		$("#patient-name").text(get_patient_name(ver, pt))

		var retrieved = new Set()
    resourecount_refresh(smart);
		populate_inputs(smart, function(condition)
		{
			console.log("condition yo", condition)

			//if there the patient has a condition observation resource containing an
			// observation, outlilne the table box in green to show it was retrieved from the EHR
			// keep track of retrieved information using Retrieved set
			if(value_in_resource(condition, resource_path_for(renalCode)))
			{
				retrieved.add(keyDict['renal'])
				$("#renal-form").find("input").prop("disabled", true)
				$("#renal-yes").prop("checked", true)
				$(".renal-data").addClass("filled");
				console.log('SET', retrieved)
			}
			if(value_in_resource(condition, resource_path_for(hypertensionCode)))
			{
				retrieved.add(keyDict['hypertension'])
				$("#hypertension-form").find("input").prop("disabled", true)
				$("#hypertension-yes").prop("checked", true)
				$(".hypertension-data").addClass("filled")
			}
			if(value_in_resource(condition, resource_path_for(diabetesCode)))
			{
				retrieved.add(keyDict['diabetes'])
				$("#diabetes-form").find("input").prop("disabled", true)
				$("#diabetes-yes").prop("checked", true)
				$(".diabetes-data").addClass("filled")
			}

			//If we got anything from the EHR display message explaining the green highlights
			if(retrieved.size > 0)
			{
				console.log("retrieved elts", retrieved)
				//$("#ehr-info").text("Areas outlined in green were pre-populated from the patient's electronic health record")
			}

			//Autofill sample buttons
			$(".sample").click(function()
			{
        var sampleno = parseInt($(this).val())+1;
				autofill(parseInt($(this).val()) ,retrieved)
				// $("#get_data").slideDown("slow"	)
				// hide_visuals()
        appendLog("Application Event - Autofill sample "+sampleno+ " is selected.");
        get_ischemic_data(pt, riskScores);
        get_stent_data(pt,riskScores);
        resetWriteButton("bleed");
        resetWriteButton("stent");
			})

		})

		//display patient's info
		$("#patient-age").text(calculateAge(pt.birthDate));
    $("#patient-id").text(pt.id);
    $("#patient-gender").text(pt.gender);

    $("input:radio[name='yes/no']").change(function()
    {
      get_ischemic_data(pt, riskScores);
      get_stent_data(pt,riskScores);
      resetWriteButton("bleed");
      resetWriteButton("stent");
    })

		$("#write-data-bleed").click(function()
		{
			write_risk_data(riskScores["bleedRisk"],null, smart)
		})
    $("#write-data-stent").click(function()
		{
			write_risk_data(null,riskScores["stentRisk"], smart)
		})

	})

	//if the user changes one of the input options, clear the visuals and reset everything


})

})
