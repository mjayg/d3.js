var svgWidth = 900;
var svgHeight = 600;

var margin = {
  top: 40,
  right: 40,
  bottom: 80,
  left: 90
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);


var chart_cohort = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


var file = "./assets/data/data.csv"

d3.csv(file).then(successHandle, errorHandle);


function errorHandle(error) {
  throw error;
}

function successHandle(statesData) {


  statesData.map(function (data) {
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
  });


  var xScale = d3.scaleLinear()
    .domain([8.1, d3.max(statesData, d => d.poverty)])
    .range([0, width]);

  var yScale = d3.scaleLinear()
    .domain([20, d3.max(statesData, d => d.obesity)])
    .range([height, 0]);



  var bottomAxis = d3.axisBottom(xScale)
    
    .ticks(7);
  var leftAxis = d3.axisLeft(yScale);




 
  chart_cohort.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chart_cohort.append("g")
    .call(leftAxis);



  var circlesGroup = chart_cohort.selectAll("circle")
    .data(statesData)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.obesity))
    .attr("r", "13")
    .attr("fill", "#788dc2")
    .attr("opacity", ".75")




  var circlesGroup = chart_cohort.selectAll()
    .data(statesData)
    .enter()
    .append("text")
    .attr("x", d => xScale(d.poverty))
    .attr("y", d => yScale(d.obesity))
    .style("font-size", "13px")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(d => (d.abbr));

 
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}% `);
    });


  chart_cohort.call(toolTip);

  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })
    
    .on("mouseout", function (data) {
      toolTip.hide(data);
    });

  
  chart_cohort.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obese (%)");

  chart_cohort.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");
}


