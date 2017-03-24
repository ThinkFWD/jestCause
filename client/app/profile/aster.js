angular.module ('hang.aster', [])
  .factory('aster', function () {


    renderData = (dataToRender) => {

     var width = 250,
      height = 250,
      radius = Math.min(width, height) / 2,
      innerRadius = 0.3 * radius;

      var pie = d3.layout.pie()
          .sort(null)
          .value(function(d) { return d.width; });
      
      var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([0, 0])
        .html(function(d) {
          return d.data.label + ": <span style='color:orangered'>" + d.data.score + "</span>";
        });
      
      var arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(function (d) { 
          return (radius - innerRadius) * (d.data.score / 50.0) + innerRadius; 
        });
      
      var outlineArc = d3.svg.arc()
              .innerRadius(innerRadius)
              .outerRadius(radius);
  
      var svg = d3.select("#d3Display_Donut").append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
      
      svg.call(tip);
      
      let totalScore = dataToRender.Joy+dataToRender.Fear+dataToRender.Sadness+dataToRender.Disgust+dataToRender.Anger;
      let delta = 0;

      if (totalScore < 1){
        delta = 1-totalScore;
      };

      var data = [
        {id:'ANG',order:1,score:(dataToRender.Anger*100).toFixed(2),weight:1,color:'#9E0041',label:'Anger'},
        {id:'DIS',order:2,score:(dataToRender.Disgust*100).toFixed(2),weight:1,color:'#C32F4B',label:'Disgust'},
        {id:'FER',order:3,score:(dataToRender.Fear*100).toFixed(2),weight:1,color:'#E1514B',label:'Fear'},
        {id:'SAD',order:4,score:(dataToRender.Sadness*100).toFixed(2),weight:1,color:'#F47245',label:'Sadness'},
        {id:'JOY',order:5,score:(dataToRender.Joy*100).toFixed(2),weight:1,color:'#C7E89E',label:'Joy'},
        {id:'VAR',order:6,score:(delta*100).toFixed(2),weight:1,color:'#FEC574',label:'Variance'}
      ]

        data.forEach(function(d) {
          d.id     =  d.id;
          d.order  = +d.order;
          d.score  = +d.score;
          d.weight = +d.weight;
          d.color  =  d.color;
          d.label  =  d.label;
          d.width  = +d.weight;  
         });


        var path = svg.selectAll(".solidArc")
            .data(pie(data))
            .enter().append("path")
            .attr("fill", function(d) { return d.data.color; })
            .attr("class", "solidArc")
            .attr("stroke", "gray")
            .attr("d", arc)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        var outerPath = svg.selectAll(".outlineArc")
            .data(pie(data))
            .enter().append("path")
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("class", "outlineArc")
            .attr("d", outlineArc);  


        // calculate the weighted mean score
        var score = 
          data.reduce(function(a, b) {
            //console.log('a:' + a + ', b.score: ' + b.score + ', b.weight: ' + b.weight);
            return a + (b.score * b.weight); 
          }, 0) / 
          data.reduce(function(a, b) { 
            return a + b.weight; 
          }, 0);

         svg.append("svg:text")
          .attr("class", "aster-score")
          .attr("dy", ".35em")
          .attr("text-anchor", "middle") // text-align: right
          .text(Math.round(score));
      
}
return {
  renderData : renderData
}

  });