// var keyDict = {0: 'DAPT', 4: 'infar', 5: 'priorPCI', 6: 'CHF', 7: 'veinGraft', 8: 'stentDiameter',
//  				9: 'pac', 10: 'cigSmoker', 11: 'diabetes', 1: 'periphDisease',  2: 'hypertension', 3: 'renal'};

var keyDict = {'DAPT': 0, 'infar': 4, 'priorPCI': 5, 'CHF': 6, 'veinGraft': 7, 'stentDiameter': 8,
 				'pac': 9, 'cigSmoker': 10, 'diabetes': 11, 'periphDisease': 1,  'hypertension': 2, 'renal': 3};

//input: birhtdate as a string in the form YYYY-MM-DD
//output: an integer representing the age based on the birthdate
function calculateAge(birthday)
{
	var today = new Date();
	var birthDate = new Date(birthday);
	var age = today.getFullYear() - birthDate.getFullYear();
	var m = today.getMonth() - birthDate.getMonth();
	if(m < 0 || (m == 0 && today.getDate() < birthDate.getDate()))
		age--;

	return age;
}

//input: patient FHIR resource
//output: patient's name as a string
function get_patient_name(patient)
{
	if(patient.name)
	{
		var names = patient.name.map(function(name)
		{
			return name.given.join(" ") + " " + name.family.join(" ");
		})
		return names.join("/");
	}
	else return "anonymous";
}


function getButtonValue(inputName)
{
  alert($('input[name="yes/no"]:checked').val())
}

  //input: parameters for knwledge object, takes a list as the first argument
  //optionals is an optional parameter, it should be an object that holds any extra keys you want to add to data
  //needs: a key dictionary for mapping values
  //output: returns object mapping parameters to their values
  function get_data(args, optionals)
  {
  	var data = {};
  	var checkedValues = $("input[name='yes/no']:checked").map(function()
  	{
  		return this.value
  	}).get()

  	console.log("got checked values: ", checkedValues)

  	for(var i = 0; i < args.length; i += 1)
  	{
  		data[args[i]] = checkedValues[keyDict[args[i]]]
  	}
  	if(optionals)
  	{
  		for(var key in optionals)
  		{
  			data[key] = optionals[key];
  		}
  	}

  	console.log("populated data: ", data)

  	return JSON.stringify(data);
  }

//input: data, ark id, success callback, error callback. Parameters need to be in the same object
//output: sends a POST request to the knowledge object with the ark ID, runs callbacks on success/error (async)
/*
	instr should be formatted like so:
		{
			arkID: ...
			data: ...
			success: function(result)...
			error: function(result)...
		}

*/
  function KOPost(instr)
  {
  	var set =
  	 {
		  "url": "http://dlhs-fedora-dev-a.umms.med.umich.edu:8080/ExecutionStack/knowledgeObject/ark:/"+ instr.arkID + "/result",
		  "method": "POST",
		  "headers": {
			  "content-type": "application/json",
		  },
		  "data": instr.data
	 }

	 console.log("AJAX SETTINGS: ", set)
	 //gonna need to change this when they change how the execution stack handles errors
	 $.ajax(set).done(function(response)
	 {
	 	if(response.result) instr.success(response);
	 	else instr.error(response);
	 })

	 // $.ajax(
	 // {
		//   "url": "http://dlhs-fedora-dev-a.umms.med.umich.edu:8080/ExecutionStack/knowledgeObject/ark:/"+ instr.arkID + "/result",
		//   "method": "POST",
		//   "headers": {
		// 	  "content-type": "application/json",
		//   },
		//   "data": instr.data,

		//   success: function(response)
		//   {
		//       instr.success(response)
		//   }

		//   error: function(response)
		//   {
		//       instr.error(response)
		//   }
	// })
  }

  //input: dictionary keeping track of the risk scores
  //output: makes call to stent risk knowledge object and updates the riskScores dictionary. also
  //	displays the risk score on the page as a percentage
  function get_stent_data(riskScores)
  {
  	KOPost(
  	{
  		arkID: "99999/fk45m6gq9t",
  		data: get_data(['DAPT', 'infar', 'hypertension', 'priorPCI', 'CHF', 'veinGraft', 'stentDiameter',
  			'pac', 'cigSmoker', 'diabetes', 'periphDisease', 'renal']),
  		success: function(response)
  		{
  			console.log('got value from stent object');
  			riskScores["stentRisk"] = response.result
			$("#stent-risk").text((response.result * 100).toFixed(2) + '%');
  		},
  		error: function(response)
  		{
  			console.log('got error in stent msg');
			console.log(response.errorMessage);
			$("#stent-vis").css("display", "none")
			$("#stent-risk").text(response.errorMessage)
  		}
  	})
  }


//input: SMART patient resource and a dictionary to contain returned value
//output: makes call to ischemic bleeding risk knowledge object and updates riskScores dictionary to contain result
//			also displays result on the page as a percentage
function get_ischemic_data(pt, riskScores)
{
	console.log('BIRTHDATE: ', pt.birthDate)
	KOPost(
	{
		arkID: "67034/k47c7m",
		data: get_data(['DAPT', 'periphDisease', 'hypertension', 'renal'], {age: calculateAge(pt.birthDate)}),
		success: function(response)
		{
			console.log('result  ' + response.result);
			riskScores["bleedRisk"] = response.result
			$("#bleed-risk").text("" + (response.result * 100).toFixed(2) + '%');
		},
		error: function(response)
		{
			console.log(response.errorMessage);
		  	$("#bleed-vis").css("display", "none");
			$("#bleed-risk").text(response.errorMessage);
		}
	})

}

//input: a FHIR resouce and a jsonpath string
//output: returns true if the FHIR resource contains the path you specified, false otherwise
function value_in_resource(resourceObj, path)
{
	return jsonpath.query(resourceObj, path).length > 0
}

//input: medical code
//output: returns a jsonpath string for a generic FHIR resource that searches for the code
//	note: may not work for all FHIR resources.
function resource_path_for(code)
{
	return "$..resource.code.coding[?(@.code==" + code + ")].code"
}

//input: smart endpoint, callback to do something with condition resource
//output: retrieves FHIR Condition resource using smart endpoint, uses callback to do something with
//	the resource
function populate_inputs(smart, callback)
{
	smart.api.search({type: "Condition"})
	.done(callback)
}


//input: autofill option number and object containing values retrieved using SMART
//output: autofills the input buttons on the table, does not overwrite thing retrieved
//			fro EHR using smart
function autofill(num, retrieved)
{
	console.log("autofill val", num)
	//if one of the first 2 autofill options are selected
	if(num === 0 || num === 1)
	{
		//mod will be either 2 or 3
		var mod = num + 2
		//select every other or every 2 "no" input buttons (depending on what num is)
		$(".no-btn").each(function(index)
		{
			if(index % mod && !retrieved.has(index))
			{
				$(this).prop("checked", true);
			}

		})
		//make the remaining ones "yes" selected
		$(".yes-btn").each(function(index)
		{
			if(!(index % mod) && !retrieved.has(index))
			{
				$(this).prop("checked", true);
			}
		})
	}
	//third autfill option
	//make everything "yes" selected
	else if(num === 2)
	{
		$(".yes-btn").each(function(index)
		{
			if(!$(this).is(":checked") && !retrieved.has(index))
				$(this).prop("checked", true);
		})
	}
	//autofill option 4
	//mark everything as "no"
	else
	{
		$(".no-btn").each(function(index)
		{
			if(!$(this).is(":checked") && !retrieved.has(index))
				$(this).prop("checked", true);
		})
	}


}

//input: description text and risk score as a decimal
//output: returns outcome dictionary that is inserted into a FHIR RiskAssessment resource
function predictionTemplate(txt, riskValue)
{
	//format is important, SMART won't write it if the format is wrong
	var thing =
	{
         "outcome":
         {
           "text": txt
         },
         "relativeRisk": riskValue,
         "probabilityCodeableConcept":
         {
           "coding":
          	[
	       		{
	              "system": "http://hl7.org/fhir/risk-probability"
	            }
           	]
         }
    }

    return thing
}

//input: risk scores and smart endpoint
//output: uses SMART API to create a RiskAssesment resource and writes it to the patient's EHR
function write_risk_data(bleedRisk, stentRisk, smart)
{
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!

	var yyyy = today.getFullYear();
	if(dd<10){
	    dd='0'+dd;
	}
	if(mm<10){
	    mm='0'+mm;
	}

	//current date formatted as yyyy-mm-dd
	var today = yyyy+'-'+mm+'-'+dd;

	//RiskAssessment resource template
	//have to add in prediction information
	var riskAsm =
	{
		"resource":
		{
		     "resourceType": "RiskAssessment",
		     "id": "kgrid-ra102",
		     "date": today,
		     "subject":{
		       "reference":"Patient/" + smart.patient.id
		      },
		     "prediction": []
		}
	}

	var prediction = riskAsm['resource']['prediction']

	//add prediction information to resource if there is data
	if(bleedRisk)
		prediction.push(predictionTemplate("Ischemic bleeding risk", bleedRisk))

	if(stentRisk)
		prediction.push	(predictionTemplate("Stent thrombosis risk", stentRisk))

	if(!bleedRisk && !stentRisk)
	{
		$("#preview").append("<div class='alert alert-danger'><strong>Failure!</strong> No risk values to write</div>")
	}
	else
	{
		var preview = $("#json-preview")
		//display preview of resource
		preview.html(JSON.stringify(riskAsm, undefined, 3))
		$("#preview").slideDown("slow")

		//write the resource to the patient's EHR
		smart.api.update(riskAsm).then(function()
		{
			//alert("hooray")
			console.log("successfully wrote data to health record")
			//update visuals
			$("#preview").append("<div class='alert alert-success'> <strong> Success!</strong> </div>")
			$("#write-data").prop("disabled", "disabled")

		})
	}
}

//output: resets and clears the icon arrays on the page
function reset_gages()
{
	$(".show_gage").text("Display visual")
	var stentGage = $("#stent-gage")
	stentGage.slideUp("slow", function()
	{
		stentGage.html("")
	})
	var bleedGage = $("#bleeding-icon")
	bleedGage.slideUp("slow", function()
	{
		bleedGage.html("")
	})
}

//output: hides all visuals on the page
function hide_visuals()
{
		reset_gages()
		$(".visual-field").slideUp("slow")
		$("#json-preview").html("")
		$("#write-data").removeAttr("disabled")
		$(".alert").html("")
		$(".alert").css("display", "none")
		$("#preview").slideUp("slow")
		$("#get_data").removeAttr("disabled")
}
