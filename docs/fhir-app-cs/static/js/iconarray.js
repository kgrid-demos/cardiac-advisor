//divID , count, gridWidth = 10, gridHeight = 10, personFill = "steelblue", backgroundFill = "#FFFFFF", key=true
var svgContainer;
function draw_array(instr)
{
    //for drawing svg icon path
    var path = "M0,0v40h22V0H0z M11,0.732c1.755,0,3.177,1.423,3.177,3.177c0,1.755-1.422,3.177-3.177,3.177" +
        "c-1.754,0-3.177-1.422-3.177-3.177C7.823,2.155,9.246,0.732,11,0.732z M18.359,11.884v9.851c0,0.763-0.617,1.381-1.381,1.381" +
        "c-0.763,0-1.381-0.618-1.381-1.381v-8.967h-0.535v0.124v10.224v14.307c0,1.02-0.826,1.848-1.848,1.848" +
        "c-1.02,0-1.846-0.828-1.846-1.848V23.114h-0.697v14.307H10.63c0,1.021-0.827,1.847-1.847,1.847c-1.021,0-1.847-0.826-1.847-1.847" +
        "c0-0.134,0.016-0.264,0.043-0.39V23.114H6.937V12.767H6.401v8.967c0,0.763-0.618,1.381-1.381,1.381s-1.38-0.619-1.38-1.383v-9.85" +
        "v-0.407c0-2.032,1.647-3.679,3.68-3.68h7.362c2.03,0,3.68,1.647,3.68,3.68v0.408H18.359z";

    var personHeight = 39;
    var personWidth = 19;




    //-----FUNCTIONS-----
    var initialize_svg = function(divID, width, height, maskDecimal)
    {
        svgContainer = d3.selectAll("#" + divID).append("svg")
        .attr("fill", instr.backgroundFill)
        .attr("width", width)
        .attr("height", height);

        return svgContainer;
    };

    var draw_person = function(svgContainer, fill, path, x, y)
    {
        svgContainer.append("rect")
        .attr("height", personHeight)
        .attr("width", personWidth)
        .attr("fill", fill)
        .attr("transform", "translate(" + x + ", " + y + ")");

        svgContainer.append("path")
        .attr("fill", instr.backgroundFill)
        .attr("d", path)
        .attr("transform", "translate(" + x + ", " + y + ")");
    };

    var draw_partial_person = function(svgContainer, fill, path, x, y, portion)
    {

        svgContainer.append("rect")
        .attr("height", personHeight)
        .attr("width", personWidth)
        .attr("fill", fill)
        .attr("transform", "translate(" + x + ", " + y + ")");

        svgContainer.append("rect")
        .attr("height", personHeight * (1 - portion))
        .attr("width", personWidth)
        .attr("fill", "#cccccc")
        .attr("transform", "translate(" + x + ", " + y + ")");


        svgContainer.append("path")
        .attr("fill", instr.backgroundFill)
        .attr("d", path)
        .attr("transform", "translate(" + x + ", " + y + ")");
    };

    //-----BEGIN-----


    if( !instr ){
        throw new Error("must have instructions 'divID , count, gridWidth = 10, gridHeight = 10, personFill = \"steelblue\", backgroundFill = \"#FFFFFF\", key=true'");
    }

    var height = 45 * instr.gridHeight + 29	;
    var width = 44 * instr.gridWidth;

    var decimal = instr.count - Math.floor(instr.count);
    if(decimal && decimal < 0.1)
    {
        decimal = 0.1;
    };

    var partial = (decimal != 0) ? true : false;
    //Make an SVG Container
    var svgContainer = initialize_svg(instr.divID, width, height, decimal);

    var xDist = 25;
    var yCoord = 0;
    var yDist = 45;
    var xCoordMultiplier = 0;

    var numGrey = (instr.gridWidth * instr.gridHeight) - Math.ceil(instr.count);
    console.log(numGrey);


    var fillColor = function(j)
    {
        if(j <= numGrey)
            return "#cccccc";
        else
            return instr.personFill;
    };


    var c = 1;

    for(var i = 0; i < instr.gridHeight; ++i)
    {
        for(var j = 0; j < instr.gridWidth; ++j, xCoordMultiplier++, c++)
        {
            if(c > numGrey && partial)
            {
                draw_partial_person(svgContainer, fillColor(c), path, xCoordMultiplier*xDist, yCoord, decimal);
                partial = false;
            }
            else
                draw_person(svgContainer, fillColor(c), path, xCoordMultiplier*xDist, yCoord);
        }
        xCoordMultiplier = 0;
        yCoord += yDist;
    }
    if(instr.key == true)
    {
        yCoord += 25;

        var txt = "Number of people affected: " + instr.count;

        draw_person(svgContainer, fillColor(0), path, instr.gridWidth * xDist + 30, (instr.gridHeight/2 * personHeight) - 44);

        svgContainer.append("text")
        .attr("x", instr.gridWidth * xDist + 32)
        .attr("y", instr.gridHeight/2 * personHeight + 20)
        .attr("fill", "black")
        .text("Not affected");

        draw_person(svgContainer, fillColor(numGrey + 1), path, instr.gridHeight * xDist + 30, instr.gridHeight/2 * personHeight + 44);

        svgContainer.append("text")
        .attr("x", instr.gridWidth * xDist + 32)
        .attr("y", instr.gridHeight/2 * personHeight + 110)
        .attr("fill", "black")
        .text("Affected");
    }
}
