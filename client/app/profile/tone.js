angular.module('hang.tone',[])
  .factory('tone', function (){

  	let averageValues = {
      "Anger":0,
      "Disgust":0,
      "Fear":0,
      "Joy":0,
      "Sadness":0,
      "Analytical":0,
      "Confident":0,
      "Tentative":0,
      "Openness":0,
      "Conscientiousness":0,
      "Extraversion":0,
      "Agreeableness":0,
      "Emotional Range":0,
  	};

    let grabValues = function (data){
    	for (var key in averageValues) {
    		averageValues[key] = data[key];
    	}
    };

    return {
    	averageValues :averageValues,
    	grabValues: grabValues
    }
  });