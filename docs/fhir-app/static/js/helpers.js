// var keyDict = {0: 'DAPT', 4: 'infar', 5: 'priorPCI', 6: 'CHF', 7: 'veinGraft', 8: 'stentDiameter',
//  				9: 'pac', 10: 'cigSmoker', 11: 'diabetes', 1: 'periphDisease',  2: 'hypertension', 3: 'renal'};

var keyDict = {'DAPT': 0, 'infar': 4, 'priorPCI': 5, 'CHF': 6, 'veinGraft': 7, 'stentDiameter': 8,
 				'pac': 9, 'cigSmoker': 10, 'diabetes': 11, 'periphDisease': 1,  'hypertension': 2, 'renal': 3};
// var baseDevUrl = "http://dlhs-fedora-dev-a.umms.med.umich.edu:8080/ExecutionStack";
// var baseUrl ="http://kgrid.med.umich.edu/stack";
// var objLeadUrl = "/knowledgeObject/ark:/";
var baseUrl ="https://activator.kgrid.org/";
var b = false;

/**
 * Calculates age of a person based on their birthDate
 * @param  {String} birthday birthdate in formatted as YYY-MM-DD
 * @return {number}          returns the person's age
 */
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

function startup(){
  b=true;
}
function pauseonerror(){
  b=false;
}
/**
 * gets patient's full name from patient fhir resource
 * @param  {Object} patient Patient FHIR resource obtained from SMART API
 * @return {String}         returns patient's full name. Returns "anonymous" if not available
 */
function get_patient_name(ver, patient)
{
  var displayname = 'anonymous';
	try	{
		var names = patient.name[0];
    switch(ver){
      case 2:
        displayname= names.family.join(" ");
        if(names.given){
          displayname= names.given.join(" ") + " " + displayname;
        } else {
          if(names.text){
            displayname = names.text.join(" ") + " " + displayname;
          }
        }
        break;
      case 3:
        displayname= names.family;
        if(names.given){
          displayname= names.given+ " " + displayname;
        } else {
          if(names.text){
            displayname = names.text + " " + displayname;
          }
        }
        break;
      default:
        displayname= names.family;
        break;
    }
	}
	catch(e) {
    console.log(patient.name);
  }
  return displayname;
}


function getButtonValue(inputName)
{
  alert($('input[name="yes/no"]:checked').val());
}

  //input: parameters for knwledge object, takes a list as the first argument
  //optionals is an optional parameter, it should be an object that holds any extra keys you want to add to data
  //needs: a key dictionary for mapping values
  //output: returns object mapping parameters to their values

  /**
   * maps input buttons on index.html table to their values
   * @param  {list} args      key dictionary for mapping values
   * @param  {object} optionals object containing any extra keys you want to map
   * @return {String}           returns json object mapping parameters to their values
   */
  function get_data(args, optionals)
  {
  	var data = {};
  	var checkedValues = $("input[name='yes/no']:checked").map(function()
  	{
  		return this.value;
  	}).get();

  	console.log("got checked values: ", checkedValues);

  	for(var i = 0; i < args.length; i += 1)
  	{
  		data[args[i]] = checkedValues[keyDict[args[i]]];
  	}
  	if(optionals)
  	{
  		for(var key in optionals)
  		{
  			data[key] = optionals[key];
  		}
  	}

  	console.log("populated data: ", data);

  	return JSON.stringify(data);
  }

/**
 * sends a POST request to the knowledge object with specified ark ID, runs callbacks on success/error (async)
 * @param {object} instr object containing ark ID, success callback, and error callback
 *
 * instr should be formatted like so:
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
		  "url": baseUrl+ instr.arkID + instr.endpoint,
		  "method": "POST",
		  "headers": {
			  "content-type": "application/json",
		  },
		  "data": instr.data
	 };
   appendLog("K-GRID Service Request - Sending Patient Data to Knowledge Object: ark:/ " + instr.arkID);
	 console.log("AJAX SETTINGS: ", set);

	 $.ajax(set).done(function(data, textStatus, jqXHR)
	 {
         console.log(jqXHR);
    	 instr.success(data);
       appendLog("K-GRID Service Response - Risk Score returned from Knowledge Object: ark:/ " + instr.arkID);
      }).fail(function(jqXHR, textStatus, errorThrown){
        console.log(jqXHR);
        instr.error(jqXHR.responseJSON);
        appendLog("K-GRID Service Response - Error returned from Knowledge Object: ark:/ " + instr.arkID);
      }).always(function(){
        console.log("Finished");
      });

}


  /**
   * makes call to stent risk knowledge object and updates the riskScores object, also displays score on page as a percentage
   * @param  {Object} riskScores an object that keeps track of the 2 risk scores
   */
  function get_stent_data(pt, riskScores)
  {
  	KOPost(
  	{
      arkID: "99999/fk45m6gq9t",
      endpoint:"/getStentThrombosisRisk",
  		data: get_data(['DAPT', 'infar', 'hypertension', 'priorPCI', 'CHF', 'veinGraft', 'stentDiameter',
  			'pac', 'cigSmoker', 'diabetes', 'periphDisease', 'renal']),
  		success: function(response)
  		{
  			console.log(response);
            $("#stent-risk").css("display", "block");
            $("#stent-error").css("display", "none");
  			riskScores.stentRisk = response.result;
			$("#stent-risk").text((response.result * 100).toFixed(1) + '%');

      ir_fill("stent-gage",riskScores.stentRisk);
            prepRiskAsm(null,riskScores.stentRisk,pt.id,"kgrid-ra22");
  		},
  		error: function(response)
  		{
  			console.log(response);
			console.log(response.message);
			$("#stent-risk").css("display", "none");
            $("#stent-error").css("display", "block");
			$("#stent-error").text(response.status + " - " + response.message);
            //$("#write-data").prop("disabled", "disabled")
  		}
  	});
  }


  function ir_fill(divID, score)
  {
    //the name attribute of this object's tag should be the same as the desired ID for the div in
    //	which the icon array is being drawn
    //vis is the button the user clicked (one of the 2)
    var count_ = score;
    var arrayDiv = $("#" + divID);
  // As long as <ul> has a child node, remove it
  arrayDiv.empty();
    //get proper count parameter based on which of the 2 icon arrays is being drawn
    // if(divID === "bleeding-icon")
    //   count_ = riskScores["bleedRisk"]
    // else
    //   count_ = riskScores["stentRisk"]


    //if the icon array is not already visible, draw the array

      // arrayDiv.append("<br>")
    draw_array({divID: divID, count: count_ * 100, gridWidth: 10, gridHeight: 10, personFill: "steelblue",
          backgroundFill: "#FFFFFF", key: true});

  }
/**
 * makes call to ischemic bleeding risk knowledge object and updates the riskScores object,
 * also displays score on page (percentage)
 * @param  {Object} riskScores an object that keeps track of the 2 risk scores
 */
function get_ischemic_data(pt, riskScores)
{
	console.log('BIRTHDATE: ', pt.birthDate);
	KOPost(
	{
    arkID: "67034/k47c7m",
    endpoint:"/getIschemicRisk",
		data: get_data(['DAPT', 'periphDisease', 'hypertension', 'renal'], {age: calculateAge(pt.birthDate)}),
		success: function(response)
		{
			console.log('result  ' + response.result);
            $("#bleed-risk").css("display", "block");
            $("#bleed-error").css("display", "none");
			riskScores.bleedRisk = response.result;
			$("#bleed-risk").text("" + (response.result * 100).toFixed(1) + '%');
      ir_fill("bleeding-icon", riskScores.bleedRisk);
      prepRiskAsm(riskScores.bleedRisk,null,pt.id,"kgrid-ra21");
		},
		error: function(response)
		{
			console.log(response.message);
            $("#bleed-risk").css("display", "none");
            $("#bleed-error").css("display", "block");
		  	// $("#bleed-vis").css("display", "none");
			$("#bleed-error").text(response.status + " - " + response.message);
            //$("#write-data").prop("disabled", "disabled")
		}
	});

}

function appendLog(message) {
	var d = new Date();
	var ts = d.toISOString();
	$("#statusArea").append("\n" + d + "   " + message);
	$("#statusArea")[0].scrollTop = $("#statusArea")[0].scrollHeight;
}



/**
 * returns true if FHIR resource contains specified path, false otherwise
 * @param  {Object} resourceObj FHIR resource
 * @param  {String} path        jsonpath string
 * @return {Boolean}            returns true if path exists in resource, false otherwise
 */
function value_in_resource(resourceObj, path)
{
	return jsonpath.query(resourceObj, path).length > 0;
}


/**
 * takes in a medical codde and returns a jsonpath string for a generic FHIR resource that searches for the code
 * note: may not work for all FHIR resources
 * @param  {String|Number} code medical code
 * @return {String}      returns formatted jsonpath for the specified code
 */
function resource_path_for(code)
{
	return "$..resource.code.coding[?(@.code==" + code + ")].code";
}

/**
 * retrieves FHIR Conditin resource using smart endpoint, uses callback to do somethign with resource
 * @param  {Object}   smart    SMART API endpoint obtained from FHIR.oauth2.ready()
 * @param  {Function} callback callback to do something with FHIR resource
 */
function populate_inputs(smart, callback)
{
	smart.request("/Condition?patient=" + smart.patient.id)
	.then(callback);
}

function resource_counting(smart, rsc, callback){
  smart.request(rsc, {
                    resolveReferences: [ "medicationReference" ],
                    graph: true
                }).then(callback);
}

/**
 * autofills table inputs based on option selected, does not overwrite things retrieved from
 * EHR using SMART
 * @param  {Number} num       autofill option Number
 * @param  {Object} retrieved object containing values retrieved using SMART
 */
function autofill(num, retrieved)
{
	console.log("autofill val", num);
	//if one of the first 2 autofill options are selected
	if(num === 0 || num === 1)
	{
		//mod will be either 2 or 3
		var mod = num + 2;
		//select every other or every 2 "no" input buttons (depending on what num is)
		$(".no-btn").each(function(index)
		{
			if(index % mod && !retrieved.has(index))
			{
				$(this).prop("checked", true);
			}

		});
		//make the remaining ones "yes" selected
		$(".yes-btn").each(function(index)
		{
			if((!(index % mod)) && (!retrieved.has(index)))
			{
				$(this).prop("checked", true);
			}
		});
	}
	//third autfill option
	//make everything "yes" selected
	else if(num === 2)
	{
		$(".yes-btn").each(function(index)
		{
			if(!$(this).is(":checked") && !retrieved.has(index))
				$(this).prop("checked", true);
		});
	}
	//autofill option 4
	//mark everything as "no"
	else
	{
		$(".no-btn").each(function(index)
		{
			if(!$(this).is(":checked") && !retrieved.has(index))
				$(this).prop("checked", true);
		});
	}


}

/**
 * makes a template for prediction key in RiskAssessment FHIR resource
 * this is the part of the FHIR resource that contains the risk scores
 * @param  {String} txt       description of risk value
 * @param  {Float} riskValue  risk score as a decimal
 * @return {Object}           returns outcome dictionary to be inserted into RiskAssessment resrouce
 */
function predictionTemplate(txt, riskValue)
{
	//format is important, SMART won't write it if the key names are wrong
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
    };

    return thing;
}

function prepRiskAsm(bleedRisk, stentRisk, pid, rid)
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
    var riskname = "bleed";
  	//current date formatted as yyyy-mm-dd
  	var todayStr = yyyy+'-'+mm+'-'+dd;

  	//RiskAssessment resource template
  	//have to add in prediction information
  	var riskAsm =
  	{
  		"resource":
  		{
  		     "resourceType": "RiskAssessment",
  		     "id": rid,
  		     "date": todayStr,
  		     "subject":{
  		       "reference":"Patient/" + pid
  		      },
  		     "prediction": []
  		}
  	};

  	var prediction = riskAsm.resource.prediction;

  	//add prediction information to resource if there is data
  	if(bleedRisk){

      riskname="bleed";
  		prediction.push(predictionTemplate("Ischemic bleeding risk", bleedRisk));
    }
  	if(stentRisk){
      riskname="stent";
  		prediction.push	(predictionTemplate("Stent thrombosis risk", stentRisk));
    }
  	if(!bleedRisk && !stentRisk)
  	{
  		$("#preview-"+riskname).append("<div class='alert alert-danger'><strong>Failure!</strong> No risk values to write</div>");
  	}else{
      var preview = $("#json-preview-"+riskname);
  		//display preview of resource
  		preview.html(JSON.stringify(riskAsm, undefined, 3));
    }
}



/**
 * uses SMART API to create a RiskAssesment resource and writes it to the patient's EHR
 * @param  {Float} bleedRisk    bleeding risk as a decimal
 * @param  {Float} stentRisk    stent risk as a decimal
 * @param  {Object} smart       SMART API endpoint from FHIR.oauth2.ready()
 */
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
	var todayStr = yyyy+'-'+mm+'-'+dd;

	//RiskAssessment resource template
	//have to add in prediction information
	var riskAsm =
	{
		"resource":
		{
		     "resourceType": "RiskAssessment",
		     "id": null,
		     "date": todayStr,
		     "subject":{
		       "reference":"Patient/" + smart.patient.id
		      },
		     "prediction": []
		}
	};
  var riskname =null;
	var prediction = riskAsm.resource.prediction;

	//add prediction information to resource if there is data
	if(bleedRisk){
    riskname="bleed";
    riskAsm.resource.id="kgrid-ra21";
		prediction.push(predictionTemplate("Ischemic bleeding risk", bleedRisk));
  }
	if(stentRisk){
    riskname="stent";
    riskAsm.resource.id="kgrid-ra22";
		prediction.push	(predictionTemplate("Stent thrombosis risk", stentRisk));
  }
	if(!bleedRisk && !stentRisk)
	{
		$("#preview").append("<div class='alert alert-danger'><strong>Failure!</strong> No risk values to write</div>");
	}
	else
	{
		var preview = $("#json-preview");
		//display preview of resource
		preview.html(JSON.stringify(riskAsm, undefined, 3));
		$("#preview").slideDown("slow");

		//write the resource to the patient's EHR
		smart.api.update(riskAsm).then(function()
		{
			//alert("hooray")
			console.log("successfully wrote data to health record");
			//update visuals
      $("#write-data-"+riskname).addClass("done");
      $("#write-status-"+riskname).removeClass("hidden");
      // $("#write-status-"+riskname).text("Success");
			$("#write-data").prop("disabled", "disabled");
      resourecount_refresh(smart);
		});
	}
}

function resetWriteButton(riskname){
  $("#write-data-"+riskname).removeClass("done");
  $("#write-status-"+riskname).addClass("hidden");
}
function resourecount_refresh(smart) {
  resource_counting(smart, "/Condition?patient=" + smart.patient.id, function(rsp){
        var totalcount= rsp.data.total;
        console.log("condition:"+totalcount);
        $("#condition_count").text(totalcount);
  });
  resource_counting(smart, "/Observation", function(rsp){
        var totalcount= rsp.data.total;
        console.log("Observation:"+totalcount);
        $("#observation_count").text(totalcount);
  });
  resource_counting(smart, "/RiskAssessment", function(rsp){
        var totalcount= rsp.data.total;
        console.log("Risk:"+totalcount);
        $("#risk_count").text(totalcount);
  });
}
// resets and clears the icon arrays on the page
function reset_gages()
{
	$(".show_gage").text("Display visual");
	var stentGage = $("#stent-gage");
	stentGage.slideUp("slow", function()
	{
		stentGage.html("");
	});
	var bleedGage = $("#bleeding-icon");
	bleedGage.slideUp("slow", function()
	{
		bleedGage.html("");
	});
}
