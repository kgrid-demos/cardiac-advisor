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

function get_patient_name(patient)
{
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
  
  //input: parameeters for knwledge object, takes an arbitrary number of parameters. 
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

  function get_stent_data()
  {
  	KOPost(
  	{
  		arkID: "99999/fk45m6gq9t",
  		data: get_data(['DAPT', 'infar', 'hypertension', 'priorPCI', 'CHF', 'veinGraft', 'stentDiameter', 
  			'pac', 'cigSmoker', 'diabetes', 'periphDisease', 'renal']),
  		success: function(response)
  		{
  			console.log('got value from stent object');
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

function get_ischemic_data(pt)
{
	console.log('BIRTHDATE: ', pt.birthDate)
	KOPost(
	{
		arkID: "67034/k47c7m",
		data: get_data(['DAPT', 'periphDisease', 'hypertension', 'renal'], {age: calculateAge(pt.birthDate)}),
		success: function(response)
		{
			console.log('result  ' + response.result);
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

function populate_inputs(smart)
{
	alert("here")
	var renalCode = "36225005"
	var hypertensionCode = "38341003"
	//TODO: check for different diabetes codes - there are different kinds	
	var diabetesCode = "44054006"

	smart.api.search({type: "Condition"})
	.done(function(condition)
	{
		if(value_in_resource(condition, resource_path_for(renalCode)))
		{
			$("#renal-yes").prop("checked", true)
			$(".renal-data").css("outline", "1px solid #5cbf2a")
		}
		if(value_in_resource(condition, resource_path_for(hypertensionCode)))
		{
			$("#hypertension-yes").prop("checked", true)
			$(".hypertension-data").css("outline", "1px solid #5cbf2a")
		}
		if(value_in_resource(condition, resource_path_for(diabetesCode)))
		{
			$("#diabetes-yes").prop("checked", true)
			$(".diabetes-data").css("outline", "1px solid #5cbf2a")
		}
	})
}