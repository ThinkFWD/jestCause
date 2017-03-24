angular.module('hang.render',[])
  .factory ('render', function () {


   clearRender = () => {
   	d3.select("svg").remove();
   }

   renderData = (dataToRender) => {

   	clearRender();

   	let outerWidth = 800,
   	  outerHeight = 400,
   	  margin = { left: 155, top:0, right:0, bottom:30},
   	  barPadding = 0.2;
   	
   	let xColumn = "value",
   	  yColumn = "name";
   	 
   	let innerWidth = outerWidth - margin.left - margin.right, 
   	  innerHeight = outerHeight - margin.top - margin.bottom;   

   	let svg = d3.select("#d3Display").append("svg")
   	  .attr("class", "d3SVG")
   	  .attr("width", outerWidth)
   	  .attr("height", outerHeight);

   	let g = svg.append("g")
   	  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   	let xAxisG = g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + innerHeight + ")")
      .attr("class", "gridA");
    
    let yAxisG = g.append("g")
      .attr("class", "y axis")
      .attr("class", "gridB"); 

    let xScale = d3.scale.linear().range([0, innerWidth]),
      yScale = d3.scale.ordinal().rangeBands([0, innerHeight], barPadding),
      colors = d3.scale.category20();

    let xAxis = d3.svg.axis().scale(xScale).orient("bottom")
      .outerTickSize(0);

    let yAxis = d3.svg.axis().scale(yScale).orient("left")
      .outerTickSize(0);

    render = (data) => {
        xScale.domain([0, d3.max(data, function (d) { return d[xColumn];})]);
        yScale.domain(data.map(function (d) { return d[yColumn]; }));
        colors.domain([0, d3.max(data, function (d) { return d[xColumn];})]);

        xAxisG.call(xAxis);
        yAxisG.call(yAxis);

        let bars = g.selectAll("rect").data(data);

         bars.enter().append("rect")
          .attr("height", yScale.rangeBand())
          .attr("fill", function(d, i) { return colors(d[xColumn]); })
          .attr("class", function(d, i) {
            if (i <= 4) {
              return 'bar_' + d[yColumn] + ' emotional';
            } else if (i <= 7) {
              return 'bar_' + d[yColumn] + ' language';
            } else {
              return 'bar_' + d[yColumn] + '  social';
            }
          })
          .attr("data-score", function(d) { return d[xColumn];} )
          .append("title")
            .text(function(d) { return d['description'] })
            .attr("class", "d3Tooltip");

        bars
          .attr("x", 0)
          .attr("y", function (d) { return yScale(d[yColumn]); })
          .attr("width", function (d) { return xScale(d[xColumn]); });
        bars.exit().remove();
      }

      // Descriptions

      descriptionMap = {
        // "Anger": "Anger - evoked due to injustice, conflict, humiliation, negligence or betrayal",
        // "Disgust": "Disgust - an emotional response of revulsion to something considered offensive or unpleasant",
        // "Fear": "Fear - shows a response to impending danger",
        // "Joy": "Joy - has shades of enjoyment, satisfaction and pleasure",
        // "Sadness": "Sadness - indicates a feeling of loss and disadvantage",
        "Analytical": "Analytical - reasoning and analytical attitude about things",
        "Confident": "Confidence - degree of certainty",
        "Tentative": "Tentative - degree of inhibition",
        "Openness": "Openness - open to experience a variety of activities",
        "Conscientiousness": "Conscientiousness - tendency to act in an organized or thoughtful way",
        "Extraversion": "Extraversion - tendency to seek stimulation in the company of others",
        "Agreeableness": "Agreeableness - tendency to be compassionate and cooperative",
        "Emotional Range": "Emotional Range - extent a person's emotion is sensitive to the environment"
      }

      //Formatting

      let d3JSON_arr = [];
      for (let key in dataToRender) {
        if(key === 'Anger' || key === 'Disgust' || key === 'Fear' || key ==='Joy' || key === 'Sadness'){
          console.log('sorry')
        } else {
          d3JSON_arr.push({'name': key, 'value': dataToRender[key], 'description': descriptionMap[key]});
        }
      }
      console.log(d3JSON_arr);
      render(d3JSON_arr);
    }

    return {
      renderData: renderData,
      clearRender: clearRender
    }

  });

