//$$$$

$(document).ready(function()
{
	
	  	//alert('yo');
		FHIR.oauth2.ready(function(smart)
		{
		    //alert("whoa")
			var patient = smart.patient.read()
			$.when(patient).done(function(pt)
			{
				console.log("PATIENT RESOURCE: ", pt);
			   // alert('got yo patient')
				patientInfo = pt;
				console.log(patientInfo);
				$("#patient-name").text(get_patient_name(pt))
				populate_inputs(smart)
				$("#patient-age").text(calculateAge(pt.birthDate))

				get_ischemic_data(pt);
				get_stent_data();

			})
		})

		$("#get_data").click(function()
		{
				alert("shi")
				$("#visual-info").slideDown("slow")

		})

	$("input:radio[name='yes/no']").change(function()
	{
		//alert("!");
		$("#bleeding-icon").slideUp("slow");
		$("#bleeding-icon").html("");
		$("#stent-gage").slideUp("slow");
		$("#stent-gage").html("");
		if($("input[name='yes/no']:checked").length == 12)
		{
			$("#get_data").slideDown("slow");
		}

	})

	$(".sample").click(function()
	{
		$("#bleeding-icon").slideUp("slow");
		$("#bleeding-icon").html("");
		$("#stent-gage").slideUp("slow");
		$("#stent-gage").html("");
	})

	$("#sample1").click(function()
	{
		$(".no-btn").each(function(index)
		{
			if(index % 2)
			{
				$(this).prop("checked", true);
			}

		})

		$(".yes-btn").each(function(index)
		{
			if(!(index % 2))
			{
				$(this).prop("checked", true);
			}
		})

		$("#get_data").slideDown("slow");

	})

	$("#sample2").click(function()
	{
		$(".no-btn").each(function(index)
		{
			if(!(index % 3))
				$(this).prop("checked", true);
		})
		$(".yes-btn").each(function(index)
		{
			if(index % 3)
				$(this).prop("checked", true);
		})

		$("#get_data").slideDown("slow")
	})

	$("#sample3").click(function()
	{
		$(".yes-btn").each(function()
		{
			if(!$(this).is(":checked"))
				$(this).prop("checked", true);
		})

		$("#get_data").slideDown("slow")
	});

	$("#sample4").click(function()
	{
		$(".no-btn").each(function()
		{
			if(!$(this).is(":checked"))
				$(this).prop("checked", true);
		})

		$("#get_data").slideDown("slow")

	});


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

 