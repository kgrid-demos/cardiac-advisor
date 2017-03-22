//$$$

$(document).ready(function()
{

	//	console.log("rsc", rsc_obsv)
	
	  	//alert('yo');
FHIR.oauth2.ready(function(smart)
{
    //alert("whoa")
	var patient = smart.patient.read()

	var retrieved = new Set()
	//alert("here")
	var renalCode = "36225005"
	var hypertensionCode = "38341003"
	//TODO: check for different diabetes codes - there are different kinds	
	var diabetesCode = "44054006"

	$.when(patient).done(function(pt)
	{
		console.log("PATIENT RESOURCE: ", pt);
	    //alert('got yo patient')
		patientInfo = pt;
		console.log(patientInfo);
		$("#patient-name").text(get_patient_name(pt))

		var retrieved = new Set()
		populate_inputs(smart, function(condition)
		{
			console.log("condition yo", condition)
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

			if(retrieved.size > 0)
			{
				console.log("retrieved elts", retrieved)
				$("#ehr-info").text("Areas outlined in green were pre-populated from the patient's electronic health record")
			}

			$(".sample").click(function()
			{
				autofill(parseInt($(this).val()) ,retrieved)
				$("#get_data").slideDown("slow"	)
				hide_visuals()
			})

		})
		$("#patient-ag").text(calculateAge(pt.birthDate))

		var riskScores = 
		{
			"bleedRisk": null,
			"stentRisk": null
		}

		$("#get_data").click(function()
		{
			//alert("shi")
			get_ischemic_data(pt, riskScores);
			get_stent_data(riskScores);
			$(".visual-field").slideDown("slow");

		})

		$("#write-data").click(function()
		{
			write_risk_data(riskScores["bleedRisk"], riskScores["stentRisk"], smart)
		})
		
	})
})



	$("input:radio[name='yes/no']").change(function()
	{
		//alert("!");
		hide_visuals()
		if($("input[name='yes/no']:checked").length == 12)
		{
			$("#get_data").slideDown("slow");
		}

	})


	$(".show_gage").click(function()
	{
		$div = $(this).parent("div");
		id = $div.attr("id");
		text = $div.find("span").text();
		text = text.substr(0, text.length - 1);

		//alert(text);
		var divID_ = this.name;
		console.log("divID: ", divID_);
		var domObj = $("#" + divID_);
		
		if(!domObj.is(":visible"))
		{
			draw_array({divID: divID_, count: parseFloat(text), gridWidth: 10, gridHeight: 10, personFill: "steelblue",
					backgroundFill: "#FFFFFF", key: true})
			$("#" + divID_).slideDown("slow");
		}

	})

	 // $("#start").click(function()
  // 	 {
  // 		$("#input_div").slideDown("slow");
  // 	 })
	  
})

 