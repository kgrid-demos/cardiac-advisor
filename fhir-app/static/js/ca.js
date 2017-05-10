//$$$

$(document).ready(function()
{
  ir_fill("bleeding-icon", 0);
  ir_fill("stent-gage", 0);//This gives the smart endpoint for using SMART API calls
FHIR.oauth2.ready(function(smart)
{


    //get patient information from SMART API
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

		var patientInfo = pt;
		console.log(patientInfo);
		$("#patient-name").text(get_patient_name(pt))

		var retrieved = new Set()
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
				$(".renal-data").css("outline", "1px solid #5cbf2a")
				console.log('SET', retrieved)
			}
			if(value_in_resource(condition, resource_path_for(hypertensionCode)))
			{
				retrieved.add(keyDict['hypertension'])
				$("#hypertension-form").find("input").prop("disabled", true)
				$("#hypertension-yes").prop("checked", true)
				$(".hypertension-data").css("outline", "1px solid #5cbf2a")
			}
			if(value_in_resource(condition, resource_path_for(diabetesCode)))
			{
				retrieved.add(keyDict['diabetes'])
				$("#diabetes-form").find("input").prop("disabled", true)
				$("#diabetes-yes").prop("checked", true)
				$(".diabetes-data").css("outline", "1px solid #5cbf2a")
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
				autofill(parseInt($(this).val()) ,retrieved)
				// $("#get_data").slideDown("slow"	)
				// hide_visuals()
        get_ischemic_data(pt, riskScores);
        get_stent_data(riskScores);

			})

		})

		//display patient's age
		$("#patient-age").text(calculateAge(pt.birthDate))
    $("#patient-id").text(pt.id);
    $("#patient-gender").text(pt.gender);

    $("input:radio[name='yes/no']").change(function()
    {
      //alert("!");
      get_ischemic_data(pt, riskScores);
      get_stent_data(riskScores);


    })

		$("#write-data").click(function()
		{
			write_risk_data(riskScores["bleedRisk"], riskScores["stentRisk"], smart)
		})

	})

	//if the user changes one of the input options, clear the visuals and reset everything


})

})
