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
  
  //input: parameters for knwledge object, takes an arbitrary number of parameters. 
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
	 $.ajax(set).done(function(response)
	 {
	 	if(response.result) instr.success(response);
	 	else instr.error(response);
	 })
  }

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
  			riskScores["bleedRisk"] = response.result
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
			riskScores["stentRisk"] = response.result
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

function value_in_resource(resourceObj, path)
{
	return jsonpath.query(resourceObj, path).length > 0
}

function resource_path_for(code)
{
	return "$..resource.code.coding[?(@.code==" + code + ")].code"
}

function populate_inputs(smart, callback)
{
	smart.api.search({type: "Condition"})
	.done(callback)
}

function autofill(num, retrieved)
{
	console.log("autofill val", num)
	if(num === 0 || num === 1)
	{
		//mod will be either 2 or 3
		var mod = num + 2
		$(".no-btn").each(function(index)
		{
			if(index % mod && !retrieved.has(index))
			{
				$(this).prop("checked", true);
			}

		})
		$(".yes-btn").each(function(index)
		{
			if(!(index % mod) && !retrieved.has(index))
			{
				$(this).prop("checked", true);
			}
		})
	}
	else if(num === 2)
	{
		$(".yes-btn").each(function(index)
		{
			if(!$(this).is(":checked") && !retrieved.has(index))
				$(this).prop("checked", true);
		})
	}
	else
	{
		$(".no-btn").each(function(index)
		{
			if(!$(this).is(":checked") && !retrieved.has(index))
				$(this).prop("checked", true);
		})
	}


}

function write_risk_data(bleedRisk, stentRisk, smart)
{
	var riskAsm = 
	{
		"resource":
	{
     "resourceType": "RiskAssessment",              
     "id": "kgrid-ra101",                      
     "date": "2014-07-19",                      
     "subject":{
       "reference":"Patient/" + smart.patient.id                               
      },
     "prediction": [
      {
         "outcome": {
           "text": "Ischemic bleeding risk"                  
         },
         "probabilityDecimal": bleedRisk,
         "probabilityCodeableConcept": {
           "coding": [
            {
              "system": "http://hl7.org/fhir/risk-probability",      
            }
           ]
         }
      },

      {
      	"outcome": {
           "text": "Stent thrombosis risk"                  
         },
         "probabilityDecimal": stentRisk,
         "probabilityCodeableConcept": {
           "coding": [
            {
              "system": "http://hl7.org/fhir/risk-probability",      
            }
           ]
      }
    }
  ]
}
}

	var preview = $("#json-preview")
	preview.html(JSON.stringify(riskAsm, undefined, 3))
	$("#preview").slideDown("slow")

	smart.api.update(riskAsm).then(function()
	{
		//alert("hooray")
		console.log("successfully wrote data to health record")
		$("#preview").append("<div class='alert alert-success'> <strong> Success!</strong> </div>")

	})
}

// function finish_write(resource, smart)
// {
// 	smart.api.update(resource).then(function()
// 	{
// 		alert("hooray")
// 		console.log("successfully wrote data to health record")
// 		$("#preview").append("<div class='alert alert-success'> <string> Success!</strong> </div>")

// 	})

// }