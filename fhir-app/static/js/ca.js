//$$$

$(document).ready(function()
{

//This gives the smart endopoint for using SMART API calls
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

		patientInfo = pt;
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
				$("#ehr-info").text("Areas outlined in green were pre-populated from the patient's electronic health record")
			}

			//Autofill sample buttons
			$(".sample").click(function()
			{
				autofill(parseInt($(this).val()) ,retrieved)
				$("#get_data").slideDown("slow"	)
				hide_visuals()
			})

		})

		//display patient's age
		$("#patient-ag").text(calculateAge(pt.birthDate))


		//make calls to knowledge objects when user clicks the "Get Risk" button
		$("#get_data").click(function()
		{

			get_ischemic_data(pt, riskScores);
			get_stent_data(riskScores);
			//get ready to show visuals
			$(".visual-field").slideDown("slow");
			$(this).prop("disabled", true)

		})

		$("#write-data").click(function()
		{
			write_risk_data(riskScores["bleedRisk"], riskScores["stentRisk"], smart)
		})
		
	})

	//if the user changes one of the input options, clear the visuals and reset everything
	$("input:radio[name='yes/no']").change(function()
	{
		//alert("!");
		hide_visuals()
		if($("input[name='yes/no']:checked").length == 12)
		{
			$("#get_data").slideDown("slow");
		}

	})

	//show icon array
	$(".show_gage").click(function()
	{
		//the name attribute of this object's tag should be the same as the desired ID for the div in 
		//	which the icon array is being drawn
		var divID = this.name
		//vis is the button the user clicked (one of the 2)
		var vis = $(this)
		var count_ = null
		var arrayDiv = $("#" + divID)

		//get proper count parameter based on which of the 2 icon arrays is being drawn
		if(divID === "bleeding-icon")
			count_ = riskScores["bleedRisk"]
		else
			count_ = riskScores["stentRisk"]


		//if the icon array is not already visible, draw the array
		if(!arrayDiv.is(":visible"))
		{
			arrayDiv.append("<br>")
			draw_array({divID: divID, count: count_ * 100, gridWidth: 10, gridHeight: 10, personFill: "steelblue",
					backgroundFill: "#FFFFFF", key: true})
			$("#" + divID).slideDown("slow", function()
			{
				//button will now change to hide visual if clicked again
				vis.text("Hide visual")
			});
		}
		//if the icon array is already visible, this means the user clicked the "hide visual" button
		//	so clear the icon array and slide the visual field up
		else
		{
			arrayDiv.slideUp("slow", function()
			{
				arrayDiv.html("")
				//change button to say "display visual"
				vis.text("Display visual")
			})
		}

	})

})

	  
})

 