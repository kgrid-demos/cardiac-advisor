export var patientModel= {patient:{name:{family:"",given:""},gender:"",birthDate:"",id:"",age:0,
	count:[{resourceType:'Condition',show:true,rscurl:'#Condition',total:0,content:''},
	       {resourceType:'Observation',show:true,rscurl:'#Observation',total:0,content:''},
	       {resourceType:'MedicationOrder',show:false,rscurl:'#MedicationOrder',total:0,content:''},
	       {resourceType:'MedicationDispense',show:false,rscurl:'#MedicationDispense',total:0,content:''},
	       {resourceType:'MedicationAdministration',show:false,rscurl:'#MedicationAdministration',total:0,content:''},
	       {resourceType:'RiskAssessment',show:false,rscurl:'#RiskAssessment',total:0,content:''},
	       {resourceType:'Procedure',show:false,rscurl:'#Procedure',total:0,content:''}]
}};
export var diabetes2_input = [
	{'text':"hemoglobin A1c"}, {'text':"fasting plasma glucose (mg/dL)"},{'text': "random plasma glucose (mg/dL)"}, {'text': "oral glucose tolerance test (OGTT)(mg/dL)"}
];
export var diabetes2_output = [
	{result:'normal', snomed:'102659003', text: 'Normal Glucose Level'},
	{result:'pre-diabetes', snomed:'714628002', text: 'Prediabetes'},
	{result:'diabetes', snomed:'44054006', text: 'Diabetes mellitus type 2'}

]
export var rsc_obsv = {
         "resource":{
            "resourceType":"Observation",                             //fixed for Observation
            "id":"kgrid-lab04",																				// Client generated
            "code":{
               "coding":[
                  {
                     "system":"http://loinc.org",
                     "code":"1493-6"                                  // KO specific
                  }
               ],
               "text":"fasting plasma glucose (mg/dL)"                // KO specfic
            },
            "effectiveDateTime": "2009-12-30",                        // UI input
            "valueQuantity":{
               "value":"123",                                         // UI input
               "unit":"mg/dL",                                        // UI input
               "system":"http://unitsofmeasure.org",
               "code":"%"
            },
            "subject":{
               "reference":"Patient/kgrid-02",												// Patient ID, auto filled
            }
         }
      };
const var rsc_riskasm = 
{
      "resource": 
      {
  			"resourceType": "RiskAssessment",																// fixed for Risk Assessment
  			"id": "kgrid-ra101",																						// UI input
  			"date": "2014-07-19",																						//UI input
  			"subject":
        {
    			"reference":"Patient/kgrid-02"                                // Patient ID, auto filled
    		},

  			"prediction": 
        [
      		{
        			"outcome": 
              {
          			"text": "Diabetes"																				// KO specific
        			},
        			"probabilityCodeableConcept": 
              {
          			"coding": 
                [
              		{
                		"system": "http://hl7.org/fhir/risk-probability",       // fixed for probabilityCodeableConcept
                		"code": "certain",																			// KO specific
                		"display": "effectively guaranteed"
              		}
          			]
              }
          }
        ]
      }
};

var rsc_condition = {
        "resource": {
        "resourceType": "Condition",
        "id": "kgrid-co05",
        "patient": {
          "reference": "Patient/kgrid-01"
        },
        "code": {
          "coding": [
            {
              "system": "http://snomed.info/sct",
              "code": "44054006",
              "display": "Diabetes mellitus type 2"
            }
          ],
          "text": "Diabetes mellitus type 2"
        },
        "clinicalStatus": "active",
        "verificationStatus": "confirmed",
        "onsetDateTime": "2005-01-18"
      }
    };

export var s_obsv = {"diagnosticTest":"","glucoseLevel":0};
