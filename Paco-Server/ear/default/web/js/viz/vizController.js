pacoApp.controller('VizCtrl', ['$scope', '$element', '$compile', 'experimentsVizService', '$timeout', '$routeParams', '$filter', '$mdDialog', '$mdToast', function ($scope, $element, $compile, experimentsVizService, $timeout, $routeParams, $filter, $mdDialog, $mdToast) {


  $scope.selectedQues = "";
  $scope.vizTemplate = false;
  $scope.dateRangeControl = false;
  $scope.multipleInputs = false;
  $scope.expParticipants = false;
  $scope.vizChartTypes = false;
  $scope.input1Input2 = false;
  $scope.createBtn = false;
  $scope.singleInput = false;
  $scope.responseCounts = 0;
  $scope.participantsCount = 0;
  $scope.vizDesc = "";
  $scope.vizs = [];
  $scope.vizTable = false;
  $scope.vizTitle = "";
  $scope.selectedInput1 = undefined;
  $scope.xInput = "";
  $scope.xPlotData = [];

  var responseTypeMap = new Map();
  var responseMetaData = [];
  var responses = [];
  var questionsMap = new Map();
  var getEvents = "";
  var vizIndex = 0;
  var editViz = false;

  $scope.questions = [{
    qno: 1,
    question: "Compare distribution of responses for the variable?",
  }, {
    qno: 2,
    question: "Compare distribution of responses for the variable by day?",
  }, {
    qno: 3,
    question: "How do the responses for input 1 relate to the responses for variable 2?",
  }, {
    qno: 4,
    question: "What is the value of the variable over time for each person?"
  }, {
    qno: 5,
    question: "What is the value of this variable over time for everyone?"
  }, {
    qno: 6,
    question: "How many people in total and basic demographics.",
  }, {
    qno: 7,
    question: "Stats: Spread of # of devices, average by use from high to low"
  }, {
    qno: 8,
    question: "Stats:range of time on devices, any differences by demographics?"
  }, {
    qno: 9,
    question: "No.of apps in total and ranges of time spent, and differences by demographics?"
  }, {
    qno: 10,
    question: "App usage by category"
  }, {
    qno: 11,
    question: "App usage by time of day with ESM responses"
  }];

  $scope.questions.forEach(function (ques) {
    questionsMap.set(ques.question, ques.qno);
  });

  $scope.dataSnapshot = function () {
    $scope.dateRange = [];
    $scope.responseCounts = [];

    $scope.responseCounts = experimentsVizService.getEventsCounts($scope.experimentId);

    experimentsVizService.getParticipants($scope.experimentId).then(function (participants) {
      $scope.participantsCount = participants.data.customResponse.length;
    });

    $scope.dateRange = experimentsVizService.getDateRange($scope.experimentId);
  };

  //experiment json objects are retrieved from the 'experimentsVizService'
  // to create a scope variable for response type meta data.
  $scope.getExperiment = function () {
    experimentsVizService.getExperiment($scope.experimentId).then(
        function (experiment) {
          if (experiment.status === 404) {
            displayErrorMessage("Experiments ", experiment);
          }
          else {
            $scope.vizs = experiment.results[0].visualizations;
            if (experiment.results[0].visualizations.length >= 1) {
              $scope.vizTable = true;
            }
            $scope.experimentDataModel = {
              id: experiment.results[0].id,
              title: experiment.results[0].title,
              creator: experiment.results[0].creator,
              date: experiment.results[0].modifyDate
            };
            responseTypeData(experiment.results[0]);
          }
        });
  };

  function getGroups() {
    $scope.groupInputs = [];
    $scope.groups = [];

    experimentsVizService.getExperiment($scope.experimentId).then(
        function (experiment) {
          experiment.results[0].groups.forEach(function (groups) {
            $scope.groups.push(groups.name);
            groups.inputs.forEach(function (input) {
              // $scope.groupInputs.push({"group": groups.name, "inputs": input.name});
              $scope.groupInputs.push(groups.name + ":" + input.name);
            });
          });
        });
  }

  $scope.getResponseType = function(groupNInput){
    var input = groupNInput.split(":");
    var response = responseTypeMap.get(input[1]);
    return response.responseType;
  }

  function responseTypeData(experiment) {
    responseMetaData = [];
    responseTypeMap = new Map();
    experiment.groups.forEach(function (groups) {
      groups.inputs.forEach(function (input) {
        if (input.responseType == "likert") {
          responseMetaData.push({
            "name": input.name,
            "responseType": input.responseType,
            "text": input.text,
            "leftsidelabel": input.leftSideLabel,
            "rightsidelabel": input.rightSideLabel
          });
        } else if (input.responseType == "list") {
          responseMetaData.push({
            "name": input.name,
            "responseType": input.responseType,
            "text": input.text,
            "listChoices": input.listChoices
          });
        } else {
          responseMetaData.push({
            "name": input.name,
            "responseType": input.responseType,
            "text": input.text
          });
        }
      });
      responseMetaData.forEach(function (response) {
        responseTypeMap.set(response.name, response);
      });
    });
  }

  function resetVariables() {
    $scope.selectedInputs = undefined;
    $scope.selectedType = undefined;
    $scope.startDate = undefined;
    $scope.endDate = undefined;
    $scope.startTime = undefined;
    $scope.endTime = undefined;
    $scope.startDateTime = undefined;
    $scope.endDateTime = undefined;
    $scope.selectedInput1 = undefined;
    $scope.input_timeSeries = undefined;
    $scope.xPlotData = [];
    $scope.selectedParticipants = [];
  }

  var inputs = [];
  $scope.getTemplate = function () {
    var template = "";
    $scope.template = "";
    if (questionsMap.has($scope.selectedQues)) {
      $scope.template = questionsMap.get($scope.selectedQues);
      var vizContainer = angular.element(document.querySelector('.vizContainer'));
      if ($scope.template === 1) {
        $scope.dateRangeControl = false;
        $scope.multipleInputs = true;
        $scope.expParticipants = true;
        $scope.vizChartTypes = true;
        $scope.createBtn = true;
        $scope.input1Input2 = false;
        $scope.singleInput = false;
        resetVariables();
      } else if ($scope.template === 2) {
        $scope.dateRangeControl = true;
        $scope.multipleInputs = true;
        $scope.expParticipants = true;
        $scope.vizChartTypes = true;
        $scope.createBtn = true;
        $scope.input1Input2 = false;
        $scope.singleInput = false;
        resetVariables();
      }
      if ($scope.template === 3) {
        $scope.dateRangeControl = true;
        $scope.multipleInputs = false;
        $scope.expParticipants = true;
        $scope.vizChartTypes = true;
        $scope.createBtn = true;
        $scope.input1Input2 = true;
        $scope.singleInput = false;
        resetVariables();
      }
      if ($scope.template === 4) {
        $scope.dateRangeControl = true;
        $scope.multipleInputs = false;
        $scope.expParticipants = true;
        $scope.vizChartTypes = true;
        $scope.createBtn = true;
        $scope.input1Input2 = false;
        $scope.singleInput = true;
        resetVariables();
      }
    }
    getGroups();
    populateParticipants();
    $scope.selectedParticipants = $scope.participants;
    populateVizType();
  };

  function populateVizType() {
    if (questionsMap.has($scope.selectedQues)) {
      $scope.template = questionsMap.get($scope.selectedQues);
      if ($scope.template === 1 || $scope.template === 2) {
        $scope.vizTypes = ["Box Plot", "Bar Chart", "Bubble Chart"];
      }
      if ($scope.template === 3) {
        $scope.vizTypes = ["Scatter Plot"];
      }
      if ($scope.template === 4) {
        $scope.vizTypes = ["Scatter Plot"];
      }
    }
  }

  function populateParticipants() {
    $scope.participants = [];
    experimentsVizService.getParticipants($scope.experimentId).then(function (participants) {
      participants.data.customResponse.forEach(function (participant) {
        $scope.participants.push(participant.who);
      });
    });
  }

  $scope.getInputs = function () {
    var groupsNInputs = [];
    $scope.inputNames = [];
    // $scope.groupNInput = [];
    $scope.groupsSet = new Set();
    inputs = $scope.selectedInputs;

    if (inputs != undefined) {
      inputs.forEach(function (input) {
        groupsNInputs = input.split(":");
        $scope.inputNames.push(groupsNInputs[1]);
        $scope.groupsSet.add(groupsNInputs[0]);
      });

      // inputs.forEach(function (input) {
      //   // $scope.groupNInput.push(input.group + ":" + input.inputs);
      //   $scope.inputNames.push(input.inputs);
      //   $scope.groupsSet.add(input.group);
      // });
    }
  };

  function getEventsResponses() {

    $scope.startDateTime = undefined;
    $scope.endDateTime = undefined;

    // start and end date/time stamp based on a date
    if ($scope.startDate != undefined) {
      $scope.startDateTime = formatDate($scope.startDate) + " " + "00:00:00";
      $scope.endDateTime = formatDate($scope.startDate) + " " + "23:59:59";
    }

    // start and end date/time stamp based on a date range
    if ($scope.endDate != undefined) {
      $scope.startDateTime = formatDate($scope.startDate) + " " + "00:00:00";
      $scope.endDateTime = formatDate($scope.endDate) + " " + "23:59:59";
    }
    // start and end date/time stamp based on a date and time range
    if ($scope.startDate != undefined && $scope.startTime != undefined && $scope.endTime != undefined) {
      $scope.startDateTime = formatDate($scope.startDate) + " " + formatTime($scope.startTime);
      $scope.endDateTime = formatDate($scope.startDate) + " " + formatTime($scope.endTime);
    }

    // start and end date/time stamp based on a date range and time range
    if ($scope.startDate != undefined && $scope.endDate != undefined && $scope.startTime != undefined && $scope.endTime != undefined) {
      $scope.startDateTime = formatDate($scope.startDate) + " " + formatTime($scope.startTime);
      $scope.endDateTime = formatDate($scope.endDate) + " " + formatTime($scope.endTime);
    }

    if ($scope.selectedInputs !== undefined) {
      var groupNInputs = [];
      $scope.responseData = [];
      var responses = [];
      var key = "";
      $scope.selectedInputs.forEach(function (inputs) {
        var data = {};
        groupNInputs = inputs.split(":");
        key = groupNInputs[1];
        data.key = key;
        getEvents = experimentsVizService.getEvents($scope.experimentId, groupNInputs[0], groupNInputs[1], $scope.selectedParticipants, $scope.startDateTime, $scope.endDateTime).then(function (events) {
          if (events.data.customResponse.length > 0) {
            responses = events.data.customResponse;
            data.values = responses;
            $scope.responseData.push(data);
          } else {
            alert("No data available for the selection: " + groupNInputs[1]);
          }
        });
      });
    }

    if ($scope.selectedInput1 !== undefined) {
      var responses = [];
      var data = {};
      $scope.xPlotData = [];
      var groupNInputs = $scope.selectedInput1.split(":");
      data.key = groupNInputs[1];
      getEvents = experimentsVizService.getEvents($scope.experimentId, groupNInputs[0], groupNInputs[1], $scope.selectedParticipants, $scope.startDateTime, $scope.endDateTime).then(function (events) {
        if (events.data.customResponse.length > 0) {
          responses = events.data.customResponse;
          data.values = responses;
          $scope.xPlotData.push(data);
        }
      });
    }

    if ($scope.input_timeSeries !== undefined) {
      var responses = [];
      var data = {};
      $scope.timeSeriesInput = [];
      var groupNInputs = $scope.input_timeSeries.split(":");
      data.key = groupNInputs[1];
      getEvents = experimentsVizService.getEvents($scope.experimentId, groupNInputs[0], groupNInputs[1], $scope.selectedParticipants, $scope.startDateTime, $scope.endDateTime).then(function (events) {
        if (events.data.customResponse.length > 0) {
          responses = events.data.customResponse;
          data.values = responses;
          $scope.timeSeriesInput.push(data);
        }
      });
    }
  }

  function displayViz() {
    if ($scope.selectedType === "Box Plot") {
      processBoxData($scope.responseData);
      $scope.vizTemplate = true;
    }
    if ($scope.selectedType === "Bar Chart") {
      processBarChartData($scope.responseData);
      $scope.vizTemplate = true;
    }
    if ($scope.selectedType === "Bubble Chart") {
      processBubbleChartData($scope.responseData);
      $scope.vizTemplate = true;
    }
    if (($scope.selectedType === "Scatter Plot") && ($scope.template === 4)) {
      processXYPlotTimeSeries($scope.timeSeriesInput);
      $scope.vizTemplate = true;
    } else if (($scope.selectedType === "Scatter Plot") && ($scope.template === 3)) {
      processScatterPlot($scope.responseData);
      $scope.vizTemplate = true;
    }
    $timeout(function () {
      displayDescription();
      displayTitle();
    }, 1000);
  }

  function displayDescription() {
    var participantsDesc = [];
    var dateDesc = " ";
    var timeDesc = " ";
    if ($scope.participantsCount === $scope.selectedParticipants.length) {
      participantsDesc.push("All participants")
    } else {
      participantsDesc = $scope.selectedParticipants.join(', ');
    }
    if ($scope.startDate != undefined) {
      dateDesc = formatDate($scope.startDate);
    }
    if ($scope.startDate != undefined && $scope.endDate != undefined) {
      dateDesc = formatDate($scope.startDate) + " - " + formatDate($scope.endDate);
    }
    if ($scope.startDate === undefined && $scope.endDate === undefined) {
      dateDesc = $scope.dateRange[0] + " - " + $scope.dateRange[1];
    }
    if ($scope.startTime != undefined) {
      timeDesc = "Time Range: " + formatTime($scope.startTime);
    }
    if ($scope.startTime != undefined && $scope.endTime != undefined) {
      timeDesc = "Time Range: " + formatTime($scope.startTime) + " - " + formatTime($scope.endTime);
    }

    if ($scope.template == 1) {

      $scope.vizDesc = "Participants: " + participantsDesc + "\n"
          + "Date Range: " + $scope.dateRange[0] + " - " + $scope.dateRange[1];
    } else if ($scope.template === 2 || $scope.template === 3 || $scope.template === 4) {
      $scope.vizDesc = "Participants: " + participantsDesc + "\n" + "Date Range: " + dateDesc + "\n" + timeDesc;
    }
  }

  function displayTitle() {
    if ($scope.selectedInputs !== undefined) {
      if ($scope.responseData !== undefined) {
        var inputNames = [];
        var titles = [];
        $scope.selectedInputs.forEach(function (res) {
          inputNames = res.split(":");
          titles.push(inputNames[1]);
        });
      }
    }

    if ($scope.selectedType === "Box Plot" || $scope.selectedType === "Bar Chart" || $scope.selectedType === "Bubble Chart") {
      $scope.vizTitle = "Distribution of responses for: " + titles.join(", ");
    } else if (($scope.selectedType === "Scatter Plot") && ($scope.xPlotData !== undefined) && ($scope.template === 3)) {
      $scope.vizTitle = "Correlation between '" + $scope.xPlotData[0].key + "' and '" + titles.join(", ") + "'";
    } else if (($scope.selectedType === "Scatter Plot") && ($scope.input_timeSeries) && ($scope.template === 4)) {
      var input = $scope.input_timeSeries.split(":");
      $scope.vizTitle = "Value of '"+ input[1] + "' over time for each person.";
    }
  }

  function formatDate(dateValue) {
    var format = 'yyyy/MM/dd';
    var formattedDate = $filter('date')(new Date(dateValue), format);
    return formattedDate;
  }

  function formatTime(timeValue) {
    var format = 'HH:mm:ss';
    var formattedTime = $filter('date')(new Date(timeValue), format);
    return formattedTime;
  }

  $scope.inputsLength = "";
  $scope.getInputsLength = function () {
    var inputsLength = "";
    if ($scope.selectedInputs === undefined) {
      inputsLength = "0 Inputs";
    } else if ($scope.selectedInputs.length === 1) {
      inputsLength = $scope.selectedInputs;
    } else {
      $scope.inputsLength = dropDownDisplayText($scope.selectedInputs);
      inputsLength = $scope.inputsLength;
    }
    return inputsLength;
  };

  $scope.participantsLength = "";
  $scope.getParticipantsLength = function () {
    var participantsLength = "";
    if ($scope.selectedParticipants === undefined) {
      participantsLength = "0 Participants";
    } else if ($scope.selectedParticipants.length === 1) {
      participantsLength = $scope.selectedParticipants;
    } else {
      $scope.participantsLength = dropDownDisplayText($scope.selectedParticipants);
      participantsLength = $scope.participantsLength;
    }
    return participantsLength;
  };

  function dropDownDisplayText(selection) {
    var display_text = "";
    if (selection.length === 1) {
      display_text = selection;
    } else {
      if (selection === $scope.selectedInputs) {
        display_text = selection.length + " Inputs";
      } else if (selection === $scope.selectedParticipants) {
        display_text = selection.length + " Participants";
      }
    }
    return display_text;
  }

  function processXYPlotTimeSeries(responseData) {

    $timeout(function () {
      var xAxisMaxMin = [];
      var xAxisTickValues = [];
      var yValues =  new Set();

      if ($scope.startDateTime !== undefined && $scope.endDateTime !== undefined) {
        xAxisMaxMin.push(new Date($scope.startDateTime).getTime(), new Date($scope.endDateTime).getTime());
      } else if ($scope.dateRange !== undefined && $scope.startDateTime === undefined && $scope.endDateTime === undefined) {
        $scope.dateRange.forEach(function(dateRange){
          xAxisMaxMin.push(new Date(dateRange).getTime());
        });
      }

      function getAllDays() {
        var start_date = new Date(xAxisMaxMin[0]);
        var end_Date = new Date(xAxisMaxMin[1]);
        var dateRange = [];

        while (start_date < end_Date) {
          dateRange.push(start_date);
          start_date = new Date(start_date.setDate(
              start_date.getDate() + 1
          ));
        }
        return dateRange;
      }

      var xTickValues = getAllDays();
      xTickValues.forEach(function (value) {
        xAxisTickValues.push(value.getTime());
      });

      var groupByParticipants = d3.nest()
          .key(function (d) {
            return d.who;
          }).entries(responseData[0].values);

      var scatterPlotTimeSeries = [];
      groupByParticipants.forEach(function (participant) {
        var data = [];
        data.key = participant.key;
        data.values = [];
        participant.values.forEach(function (value) {
          data.values.push({
            x: new Date(value.response_time).getTime(),
            y: value.answer,
            size: Math.round(Math.random() * 100) / 100
          });
        });
        scatterPlotTimeSeries.push(data);
      });

      scatterPlotTimeSeries.forEach(function(plotData){
       plotData.values.forEach(function(value){
         yValues.add(value.y);
       })
      });
      function compareNumbers(a, b) {
        return a - b;
      }
      var sortedYValues = Array.from(yValues).sort(compareNumbers);
      var yAxisMaxMin = [];
      yAxisMaxMin.push(parseInt(sortedYValues[0]),parseInt(sortedYValues[(sortedYValues.length)-1]));
      var yAxisTickValues =[];
      for(var i=1;i<sortedYValues.length-1;i++){
        yAxisTickValues.push(parseInt(sortedYValues[i]));
      }

      drawXYPlotTimeSeries(xAxisMaxMin,yAxisMaxMin,xAxisTickValues,yAxisTickValues,scatterPlotTimeSeries);
    }, 1000);

  }

  function drawXYPlotTimeSeries(xAxisMaxMin,yAxisMaxMin,xAxisTickValues,yAxisTickValues,data) {

    d3.selectAll('.vizContainer' + "> *").remove();

    $timeout(function () {

      var input = $scope.input_timeSeries.split(":");
      var response = responseTypeMap.get(input[1]);
      var responseType = response.responseType;
      // create the chart
      var chart;
      nv.addGraph(function () {
        chart = nv.models.scatterChart()
            .showDistX(true)
            .showDistY(true)
            .useVoronoi(true)
            .interactive(true)
            .xDomain(xAxisMaxMin)
            .height(550)
            .color(d3.scale.category10().range())
            .duration(300);

        chart.xAxis
            .rotateLabels(-45)
            .tickValues(xAxisTickValues)
            .tickFormat(function (d) {
                  return d3.time.format('%m/%d/%y %H:%M:%S')(new Date(d));
            });
        chart.yAxis
            .tickFormat(d3.format('d'))
            .axisLabel(displayTitle());
        if((responseType === "likert") || (responseType === "likert_smileys")){
          chart.forceY([1,5]);
          chart.yAxis.tickValues([2,3,4]);
        }else{
          chart.forceY(yAxisMaxMin);
          // chart.yAxis.tickValues(yAxisTickValues);
        }

        chart.tooltip(true);
        chart.tooltip.contentGenerator(function (d) {
          var rows =
              "<tr>" +
              "<td class='key'>" + 'Date:' + "</td>" +
              "<td class='x-value'><strong>" + $filter('date')(new Date(d.point.x), 'dd/MM/yyyy hh:mm:ss') + "</strong></td>" +
              "</tr>" +
              "<tr>" +
              "<td class='key'>" + 'Value:' + "</td>" +
              "<td class='x-value'><strong>" + d.point.y + "</strong></td>" +
              "</tr>";

          var header =
              "<thead>" +
              "<tr>" +
              "<td class='legend-color-guide'><div style='background-color: " + d.series.color + ";'></div></td>" +
              "<td class='key'><strong>" + d.series.key + "</strong></td>" +
              "</tr>" +
              "</thead>";

          return "<table>" +
              header +
              "<tbody>" +
              rows +
              "</tbody>" +
              "</table>";
        });

        d3.select('.vizContainer')
            .append('svg')
            .style('width', '98%')
            .style('height', 600)
            .style('margin-left', 15)
            .style('margin-top', 15)
            .style('background-color', 'white')
            .style('vertical-align', 'middle')
            .style('display', 'inline-block')
            .datum(data)
            .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;

      });
    }, 1000);
  }

  function processScatterPlot(responseData) {

    $timeout(function () {
      if ($scope.xPlotData !== undefined && responseData !== undefined) {
        var xValue = $scope.xPlotData;
        var yValue = responseData;

        var data = [];
        for (var i = 0; i < yValue.length; i++) {
          data.push({
            key: yValue[i].key,
            values: []
          });

          for (var j = 0; j < xValue[0].values.length; j++) {
            data[i].values.push({
              x: xValue[0].values[j].answer,
              y: yValue[i].values[j].answer,
              size: Math.round(Math.random() * 100) / 100
            });
          }
        }
        drawScatterPlot(data);
      }
    }, 1000);
  }

  function drawScatterPlot(data) {
    d3.selectAll('.vizContainer' + "> *").remove();

    $timeout(function () {
      // create the chart
      var chart;
      nv.addGraph(function () {
        chart = nv.models.scatterChart()
            .showDistX(true)
            .showDistY(true)
            .useVoronoi(true)
            .height(500)
            .color(d3.scale.category10().range())
            .duration(300);

        chart.xAxis.rotateLabels(-45).tickFormat(d3.format('.0f'))
                   .axisLabel($scope.xPlotData[0].key);
        chart.yAxis.tickFormat(d3.format('.0f'))
                   .axisLabel(displayTitle());

        d3.select('.vizContainer')
            .append('svg')
            .style('width', '98%')
            .style('height', 530)
            .style('margin-left', 15)
            .style('margin-top', 15)
            .style('background-color', 'white')
            .style('vertical-align', 'middle')
            .style('display', 'inline-block')
            .datum(data)
            .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;
      });
    }, 1000);

  }


  function processBoxData(res) {
    var response = res;
    var label = "";
    var maxValue = 0;
    var minValue = 0;
    var data = [];
    var firstHalf = [];
    var secondHalf = [];

    var boxPlotData = [];

    $timeout(function () {
      response.forEach(function (res) {
        var resData = {};
        label = res.key;
        resData.label = label;
        data = [];
        resData.values = {};
        var max, min, median, midPoint, q1, q3 = "";
        res.values.forEach(function (val) {
          data.push(parseInt(val.answer));
        });
        function compareFunction(a, b) {
          return a - b;
        }

        data.sort(compareFunction);
        max = d3.max(data);
        min = d3.min(data);
        median = d3.median(data);
        midPoint = Math.floor((data.length / 2));
        firstHalf = data.slice(0, midPoint);
        secondHalf = data.slice(midPoint, data.length);
        q1 = d3.median(firstHalf);
        q3 = d3.median(secondHalf);
        resData.values = {Q1: q1, Q2: median, Q3: q3, whisker_low: min, whisker_high: max};
        boxPlotData.push(resData);
      });

      var whiskers_high = [];
      var whiskers_low = [];
      boxPlotData.forEach(function (data) {
        whiskers_high.push(data.values.whisker_high);
        whiskers_low.push(data.values.whisker_low);
      });
      maxValue = d3.max(whiskers_high);
      minValue = d3.min(whiskers_low);
      drawBoxPlot(minValue,boxPlotData, maxValue);
    }, 1000);

  }

  function drawBoxPlot(min,boxPlotData, whisker_high) {
    d3.selectAll('.vizContainer' + "> *").remove();
    var inputName = [];

    $timeout(function () {
      if (boxPlotData !== undefined) {
        nv.addGraph(function () {
          var chart = nv.models.boxPlotChart()
              .x(function (d) {
                return d.label;
              })
              .height(530)
              .staggerLabels(true)
              .maxBoxWidth(50)
              .yDomain([min, whisker_high]);

          chart.xAxis.showMaxMin(false)
                     .rotateLabels(-45);
          chart.tooltip(true);
          chart.tooltip.contentGenerator(function (d) {
            var rows =
                "<tr>" +
                "<td class='key'>" + 'Max ' + "</td>" +
                "<td class='x-value'><strong>" + d.data.values.whisker_high + "</strong></td>" +
                "</tr>" +
                "<tr>" +
                "<td class='key'>" + '75% ' + "</td>" +
                "<td class='x-value'><strong>" + d.data.values.Q3 + "</strong></td>" +
                "</tr>" +
                "<tr>" +
                "<td class='key'>" + '50% ' + "</td>" +
                "<td class='x-value'><strong>" + d.data.values.Q2 + "</strong></td>" +
                "</tr>" +
                "<tr>" +
                "<td class='key'>" + '25%: ' + "</td>" +
                "<td class='x-value'>" + d.data.values.Q1 + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td class='key'>" + 'Min ' + "</td>" +
                "<td class='x-value'><strong>" + d.data.values.whisker_low + "</strong></td>" +
                "</tr>";

            var header =
                "<thead>" +
                "<tr>" +
                "<td class='legend-color-guide'><div style='background-color: " + d.series[0].color + ";'></div></td>" +
                "<td class='key'><strong>" + d.key + "</strong></td>" +
                "</tr>" +
                "</thead>";

            return "<table>" +
                header +
                "<tbody>" +
                rows +
                "</tbody>" +
                "</table>";
          });
          chart.yAxis.axisLabel("Distribution of responses");

          d3.select('.vizContainer')
              .append('svg')
              .on("mousedown", function () {
                d3.event.stopPropagation();
              })
              .on("mouseover", function () {
                d3.event.stopPropagation();
              })
              .on("mousemove", function () {
                d3.event.stopPropagation();
              })
              .on("mousemout", function () {
                d3.event.stopPropagation();
              })
              .style('width', '98%')
              .style('height', 570)
              .style('margin-left', 20)
              .style('margin-top', 15)
              .style('background-color', 'white')
              .style('vertical-align', 'middle')
              .style('display', 'inline-block')
              .datum(boxPlotData)
              .call(chart);

          nv.utils.windowResize(chart.update);

          return chart;
        });
      }
    }, 1000);

  }

  function processBarChartData(res) {

    var listChoicesMap = new Map();

    //Utility functions
    //map answer indices with list choices
    function mapIndicesWithListChoices(index) {
      var listChoice = " ";
      var index = (parseInt(index) - 1).toString();
      if (listChoicesMap.has(index)) {
        listChoice = listChoicesMap.get(index);
      }
      return listChoice;
    };

    //frequency of the data
    function responseDataFrequency(dataSet) {

      var frequency = d3.nest()
          .key(function (d) {
            return d.answer;
          })
          .rollup(function (v) {
            var who = [];
            v.forEach(function (data) {
              who.push(data.who);
            });
            return {"count": v.length, "participants": who};
          })
          .entries(dataSet);
      return frequency;
    }

    var barChartData = [];
    $timeout(function () {

      res.forEach(function (responseData) {
        if (responseData !== null && responseData !== undefined) {
          var listResponseData = [];
          var chartData = {};
          var choices = "";
          var responsesFrequency = [];
          var responsesMap = new Map();
          chartData.key = responseData.key;

          if (responseTypeMap.has(responseData.key)) {
            var responseType = responseTypeMap.get(responseData.key);
            var response_type = responseType.responseType;
            if (responseType.responseType === "list") {
              for (var i in responseType.listChoices) {
                listChoicesMap.set(i, responseType.listChoices[i]);
              }

              responseData.values.forEach(function (response) {
                if (response.answer.length > 1) {
                  var answers = response.answer.split(",");
                  answers.forEach(function (a) {
                    choices = mapIndicesWithListChoices(a);
                    listResponseData.push({"who": response.who, "answer": choices, "index": a});
                  });
                } else {
                  choices = mapIndicesWithListChoices(response.answer);
                  listResponseData.push({
                    "who": response.who,
                    "answer": choices,
                    "index": response.answer
                  });
                }
              });

              responsesFrequency = responseDataFrequency(listResponseData);
            } else if (responseType.responseType === "likert" || responseType.responseType === "likert_smileys") {
              responsesFrequency = responseDataFrequency(responseData.values);
              if (responsesFrequency.length < 5) {
                responsesFrequency.forEach(function (resFrequency) {

                  responsesMap.set(resFrequency.key, resFrequency.values);
                });
                var scales = ["1", "2", "3", "4", "5"];

                scales.forEach(function (scale) {
                  var emptyData = {};
                  if (!responsesMap.has(scale)) {
                    emptyData = {
                      key: scale,
                      values: {
                        count: 0,
                        participants: "None"
                      }
                    };
                    responsesFrequency.push(emptyData);
                  }
                });
                responsesFrequency.sort(function (x, y) {
                  return d3.ascending(x.key, y.key);
                });
              }
            } else {
              responsesFrequency = responseDataFrequency(responseData.values);
            }
          }

          // var responsesFrequency = dataFrequency("Bar Chart", res);
          var barChartVals = [];
          responsesFrequency.forEach(function (res) {
            var chartDataValues = {};
            chartDataValues.x = res.key;
            chartDataValues.y = res.values.count;
            chartDataValues.participants = res.values.participants;
            barChartVals.push(chartDataValues);
          });
          chartData.values = barChartVals;
          barChartData.push(chartData);
        }
      });
      drawMultiBarChart(barChartData);
    }, 1000);
  }

  function drawMultiBarChart(barChartData) {
    d3.selectAll('.vizContainer' + "> *").remove();
    $timeout(function () {
      if (barChartData !== undefined) {
        var chart = nv.models.multiBarChart()
            .showControls(true).showLegend(true)
            .height(580)
            .duration(500);

        chart.yAxis.tickFormat(d3.format('.0f'));
        chart.yAxis.axisLabel("Count of responses");
        chart.xAxis.axisLabel("Available options").rotateLabels(-45);
        chart.tooltip(true);
        chart.tooltip.contentGenerator(function (d) {

          var rows =
              "<tr>" +
              "<td class='key'>" + 'Data: ' + "</td>" +
              "<td class='x-value'>" + d.data.x + "</td>" +
              "</tr>" +
              "<tr>" +
              "<td class='key'>" + 'Frequency: ' + "</td>" +
              "<td class='x-value'><strong>" + d.data.y + "</strong></td>" +
              "</tr>";

          var header =
              "<thead>" +
              "<tr>" +
              "<td class='legend-color-guide'><div style='background-color: " + d.color + ";'></div></td>" +
              "<td class='key'><strong>" + d.data.key + "</strong></td>" +
              "</tr>" +
              "</thead>";

          return "<table>" +
              header +
              "<tbody>" +
              rows +
              "</tbody>" +
              "</table>";
        });

        var svg = d3.select('.vizContainer')
            .append('svg')
            .style('width', '98%')
            .style('height', 600)
            .style('margin-left', 20)
            .style('margin-top', 20)
            .style('background-color', 'white')
            .style('vertical-align', 'middle')
            .datum(barChartData)
            .call(chart);
        nv.utils.windowResize(chart.update);
        return chart;
      }
    }, 1000);
  }

  function dataFrequency(viz, resData) {

    var listChoicesMap = new Map();

    //Utility functions
    //map answer indices with list choices
    function mapIndicesWithListChoices(index) {
      var listChoice = " ";
      var index = (parseInt(index) - 1).toString();
      if (listChoicesMap.has(index)) {
        listChoice = listChoicesMap.get(index);
      }
      return listChoice;
    };


    function responseDataFrequency(dataSet) {

      var frequency = [];
      if (viz === "Bubble Chart") {

        //frequency of the data
        frequency = d3.nest()
            .key(function (d) {
              return d.answer;
            })
            .rollup(function (v) {
              return v.length;
            })
            .entries(dataSet);
        // return frequency;
      }
      // else if (viz === "Bar Chart") {
      //   console.log("BarC");
      //   frequency = d3.nest()
      //       .key(function (d) {
      //         return d.answer;
      //       })
      //       .rollup(function (v) {
      //         var who = [];
      //         v.forEach(function (data) {
      //           who.push(data.who);
      //         });
      //         return {"count": v.length, "participants": who};
      //       })
      //       .entries(dataSet);
      // }
      return frequency;
    }

    var responsesFrequency = [];
    resData.forEach(function (responseData) {
      if (responseData !== null && responseData !== undefined) {
        var listResponseData = [];
        // var chartData = {};
        var choices = "";

        var responsesMap = new Map();
        // chartData.key = responseData.key;

        if (responseTypeMap.has(responseData.key)) {
          var responseType = responseTypeMap.get(responseData.key);
          if (responseType.responseType === "list") {
            for (var i in responseType.listChoices) {
              listChoicesMap.set(i, responseType.listChoices[i]);
            }

            responseData.values.forEach(function (response) {
              if (response.answer.length > 1) {
                var answers = response.answer.split(",");
                answers.forEach(function (a) {
                  choices = mapIndicesWithListChoices(a);
                  listResponseData.push({"who": response.who, "answer": choices, "index": a});
                });
              } else {
                choices = mapIndicesWithListChoices(response.answer);
                listResponseData.push({
                  "who": response.who,
                  "answer": choices,
                  "index": response.answer
                });
              }
            });
            responsesFrequency = responseDataFrequency(listResponseData);
          } else if (responseType.responseType === "likert" || responseType.responseType === "likert_smileys") {
            responsesFrequency = responseDataFrequency(responseData.values);
            if (responsesFrequency.length < 5) {
              responsesFrequency.forEach(function (resFrequency) {

                responsesMap.set(resFrequency.key, resFrequency.values);
              });
              var scales = ["1", "2", "3", "4", "5"];

              scales.forEach(function (scale) {
                var emptyData = {};
                if (!responsesMap.has(scale)) {
                  emptyData = {
                    key: scale,
                    values: {
                      count: 0,
                      participants: "None"
                    }
                  };
                  responsesFrequency.push(emptyData);
                }
              });
              responsesFrequency.sort(function (x, y) {
                return d3.ascending(x.key, y.key);
              });
            }
          } else {
            responsesFrequency = responseDataFrequency(responseData.values);
          }
        }
      }
    });
    return responsesFrequency;
  }

  function processBubbleChartData(data) {
    $timeout(function () {
      var bubbleChartData = [];

      var responsesFrequency = dataFrequency("Bubble Chart", data);
      bubbleChartData = responsesFrequency.map(function (d) {
        d.value = +d["values"];
        return d;
      });
      drawBubbleChart(data.key, bubbleChartData);
    }, 1000);
  }

  function drawBubbleChart(key, data) {
    d3.selectAll('.vizContainer' + "> *").remove();

    $timeout(function () {
      if (data !== undefined) {

        var diameter = 600; //max size of the bubbles

        var color = d3.scale.category20c(); //color category

        var bubble = d3.layout.pack()
            .sort(null)
            .size([diameter, diameter])
            .padding(1);

        var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .text("tooltip");

        var svg = d3.select('.vizContainer')
            .append("svg")
            .attr("display", "block")
            .attr("width", diameter)
            .attr("height", diameter)
            .style("margin", "auto")
            .style("margin-top", "-50")
            .attr("class", "bubble");

        //bubbles needs very specific format, convert data to this.
        var nodes = bubble.nodes({children: data}).filter(function (d) {
          return !d.children;
        });

        //setup the chart
        var bubbles = svg.append("g")
            .attr("transform", "translate(0,0)")
            .selectAll(".bubble")
            .data(nodes)
            .enter();

        //create the bubbles
        bubbles.append("circle")
            .attr("r", function (d) {
              return d.r;
            })
            .attr("cx", function (d) {
              return d.x;
            })
            .attr("cy", function (d) {
              return d.y;
            })
            .style("fill", function (d, i) {
              return color(i);
            })
            .on("mouseover", function (d) {
              tooltip.text(d.key + ": " + d.value);
              tooltip.style("visibility", "visible");
            })
            .on("mousemove", function () {
              return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            })
            .on("mouseout", function () {
              return tooltip.style("visibility", "hidden");
            });

        //format the text for each bubble
        bubbles.append("text")
            .attr("x", function (d) {
              return d.x;
            })
            .attr("y", function (d) {
              return d.y + 5;
            })
            .attr("text-anchor", "middle")
            .text(function (d) {
              return d["key"];
            })
            .style({
              "fill": "black",
              "font-family": "Helvetica Neue, Helvetica, Arial, san-serif",
              "font-size": "12px"
            });
      }
    }, 1000);
  }
  $scope.createViz = function () {
    getEventsResponses();
    displayViz();
  };

  $scope.saveViz = function () {

    if (editViz) {
      experimentsVizService.getExperiment($scope.experimentId).then(function successCallback(experimentData) {
        experimentData.results[0].visualizations[vizIndex].experimentId = $scope.experimentId;
        experimentData.results[0].visualizations[vizIndex].modifyDate = $filter('date')(new Date(), 'EEE, dd MMM yyyy HH:mm:ss Z');
        experimentData.results[0].visualizations[vizIndex].participants = $scope.selectedParticipants;
        experimentData.results[0].visualizations[vizIndex].question = $scope.selectedQues;
        experimentData.results[0].visualizations[vizIndex].texts = $scope.selectedInputs;
        experimentData.results[0].visualizations[vizIndex].vizTitle = $scope.vizTitle;
        experimentData.results[0].visualizations[vizIndex].vizType = $scope.selectedType;
        experimentData.results[0].visualizations[vizIndex].vizDesc = $scope.vizDesc;
        experimentData.results[0].visualizations[vizIndex].startDateTime = $filter('date')(new Date($scope.startDateTime), 'EEE, dd MMM yyyy HH:mm:ss Z');
        experimentData.results[0].visualizations[vizIndex].endDateTime = $filter('date')(new Date($scope.endDateTime), 'EEE, dd MMM yyyy HH:mm:ss Z');
        if($scope.template === 3){
          experimentData.results[0].visualizations[vizIndex].xPlotData = $scope.selectedInput1;
        } else if($scope.template === 4){
          experimentData.results[0].visualizations[vizIndex].xPlotData = $scope.input_timeSeries;
        }
        experimentsVizService.saveVisualizations(experimentData.results[0]).then(function (res) {
          if (res.data[0].status === true) {
            $mdDialog.show($mdDialog.alert().title('Edit Status').content('Viz Edited! Saving Viz..').ariaLabel('Success'));
            $timeout(function () {
              "use strict";
              location.reload();
            }, 1000);
          } else {
            $mdDialog.show($mdDialog.alert().title('Edit Status').content('Could not edit viz due to ' + res.data[0].errorMessage).ariaLabel('Success').ok('OK'));
          }
        });
      });
    } else {
      var saveVizs = [];
      var vizData = {};
      vizData.xInput = "";
      vizData.expId = "";
      vizData.vizTitle = "";
      vizData.dateCreated = "";
      vizData.vizQues = "";
      vizData.inputs = [];
      vizData.participants = [];
      vizData.vizType = "";
      vizData.startDateTime = "";
      vizData.endDateTime = "";


      if ($scope.selectedInput1 !== undefined) {
        vizData.xInput = $scope.selectedInput1;
      } else if($scope.input_timeSeries !== undefined){
        vizData.xInput = $scope.input_timeSeries;
      }
      if ($scope.selectedQues !== undefined) {
        vizData.vizQues = $scope.selectedQues;
      }
      if ($scope.selectedType !== undefined) {
        vizData.vizType = $scope.selectedType;
      }
      if ($scope.selectedInputs !== undefined) {
        vizData.inputs = $scope.selectedInputs;
      }
      if ($scope.experimentId !== undefined) {
        vizData.expId = $scope.experimentId;
      }
      if ($scope.vizTitle !== "") {
        vizData.vizTitle = $scope.vizTitle;
      }
      if ($scope.selectedParticipants.length > 0) {
        vizData.participants = $scope.selectedParticipants;
      }
      if ($scope.startDateTime !== undefined) {
        vizData.startDateTime = $filter('date')(new Date($scope.startDateTime), 'EEE, dd MMM yyyy HH:mm:ss Z');
      } else{
        if($scope.dateRange !== undefined){
          vizData.startDateTime =  $filter('date')(new Date($scope.dateRange[0]), 'EEE, dd MMM yyyy HH:mm:ss Z');
        }
      }
      if ($scope.endDateTime !== undefined) {
        vizData.endDateTime = $filter('date')(new Date($scope.endDateTime), 'EEE, dd MMM yyyy HH:mm:ss Z');
      }else{
        if($scope.dateRange !== undefined){
        vizData.endDateTime =  $filter('date')(new Date($scope.dateRange[1]), 'EEE, dd MMM yyyy HH:mm:ss Z');
        }
      }
      if ($scope.vizDesc != "") {
        vizData.vizDesc = $scope.vizDesc;
      }
      vizData.vizId = new Date().getUTCHours() + new Date().getUTCMinutes() + new Date().getUTCSeconds() + new Date().getUTCMilliseconds();
      vizData.dateCreated = $filter('date')(new Date(), 'EEE, dd MMM yyyy HH:mm:ss Z');

      if (vizData.vizId != undefined && vizData.expId != undefined && vizData.vizQues != undefined) {
        saveVizs.push({
          "vizId": vizData.vizId,
          "experimentId": vizData.expId,
          "vizTitle": vizData.vizTitle,
          "modifyDate": vizData.dateCreated,
          "question": vizData.vizQues,
          "texts": vizData.inputs,
          "participants": vizData.participants,
          "vizType": vizData.vizType,
          "vizDesc": vizData.vizDesc,
          "startDateTime": vizData.startDateTime,
          "endDateTime": vizData.endDateTime,
          "xPlotData": vizData.xInput
        });
      } else {
        $mdDialog.show($mdDialog.alert().content('Insufficient data').ariaLabel('Failure').ok('OK'));
      }

      if (saveVizs.length > 0) {
        experimentsVizService.getExperiment($scope.experimentId).then(function successCallback(experimentData) {
          saveVizs.forEach(function (viz) {
            experimentData.results[0].visualizations.push(viz);
          });

          experimentsVizService.saveVisualizations(experimentData.results[0]).then(function (res) {
            if (res.data[0].status === true) {
              $mdDialog.show($mdDialog.alert().content('Saving Viz...'));
              $timeout(function () {
                location.reload();
              }, 1000);
            } else {
              $mdDialog.show($mdDialog.alert().title('Save Status').content('Could not save viz due to error: ' + res.data[0].errorMessage).ariaLabel('Success').ok('OK'));
            }
          });
        });
      }

      $scope.vizTemplate = false;
      $scope.vizTitle = "";
      $scope.selectedQues = undefined;
      $scope.groupNInput = [];
      $scope.inputNames = [];
      $scope.selectedInputs = [];
      $scope.groupsSet = new Set();
      $scope.selectedParticipants = [];
      $scope.selectedType = undefined;
      $scope.vizDesc = "";
    }
  };

  $scope.renderViz = function (viz, index) {

    var startTime = "";
    var endTime = "";
    var startDate = "";
    var endDate = "";

    if (viz.question !== undefined) {
      $scope.selectedQues = viz.question;
      $scope.getTemplate();
    }

    if (viz.vizType !== undefined) {
      $scope.selectedType = viz.vizType;
    }

    if (viz.texts.length > 0) {
      $scope.selectedInputs = viz.texts;
      $scope.getInputs();
    }

    if (viz.xPlotData !== undefined) {
      if($scope.template === 3){
        $scope.selectedInput1 = viz.xPlotData;
      }
      if($scope.template === 4){
        $scope.input_timeSeries = viz.xPlotData;
      }
    }

    if (viz.participants !== undefined) {
      $scope.selectedParticipants = viz.participants;
    }

    if (viz.startDateTime != undefined && viz.endDateTime != undefined) {

      $scope.startDateTime = viz.startDateTime;
      $scope.endDateTime = viz.endDateTime;
      startDate = $filter('date')(new Date($scope.startDateTime), 'dd/MM/yyyy');
      endDate = $filter('date')(new Date($scope.endDateTime), 'dd/MM/yyyy');
      if (startDate == endDate) {
        $scope.startDate = $filter('date')(new Date($scope.startDateTime), 'EEE, dd MMM yyyy HH:mm:ss Z');
        $scope.endDate = undefined;
      } else {
        $scope.startDate = $filter('date')(new Date($scope.startDateTime), 'EEE, dd MMM yyyy HH:mm:ss Z');
        $scope.endDate = $filter('date')(new Date($scope.endDateTime), 'EEE, dd MMM yyyy HH:mm:ss Z');
      }
      startTime = $filter('date')($scope.startDateTime, 'HH:mm:ss');
      endTime = $filter('date')($scope.endDateTime, 'HH:mm:ss');
      if (startTime == '00:00:00' || startTime == '23:59:59') {
        $scope.startTime = undefined;
      } else {
        $scope.startTime = new Date($filter('date')($scope.startDateTime, 'EEE, dd MMM yyyy HH:mm:ss Z'));
      }
      if (endTime == '00:00:00' || endTime == '23:59:59') {
        $scope.endTime = undefined;
      } else {
        $scope.endTime = new Date($filter('date')($scope.endDateTime, 'EEE, dd MMM yyyy HH:mm:ss Z'));
      }
    }

    $scope.createViz();
    $timeout(function () {
      if (viz.vizTitle !== undefined) {
        $scope.vizTitle = viz.vizTitle;
      }
      if (viz.vizDesc !== undefined) {
        $scope.vizDesc = viz.vizDesc;
      }
    }, 1000);
    editViz = true;
    vizIndex = index;
  };

  $scope.deleteViz = function (viz, index) {
    $mdDialog.show($mdDialog.confirm()
        .title('Delete Status')
        .content('Do you want to delete the viz: ' + viz.vizTitle + '?')
        .ariaLabel("Delete Viz")
        .cancel('Yes')
        .ok('No')).then(function () {
    }, function () {
      experimentsVizService.getExperiment($scope.experimentId).then(function successCallback(experimentData) {
        experimentData.results[0].visualizations.splice(index, 1);
        experimentsVizService.saveVisualizations(experimentData.results[0]).then(function (res) {
          if (res.data[0].status === true) {
            location.reload();
          } else {
            $mdDialog.show($mdDialog.alert().title('Delete Status').content('Could not delete viz due to ' + res.data[0].errorMessage).ariaLabel('Success').ok('OK'));
          }
        });
      });
    });
  };

  $scope.clearVizTable = function () {
    $mdDialog.show($mdDialog.confirm()
        .title('Confirmation Status')
        .textContent('Do you want to delete all the visualizations?')
        .ariaLabel('Clear All').cancel('Yes')
        .ok('No')
    ).then(function () {
    }, function () {
      experimentsVizService.getExperiment($scope.experimentId).then(function successCallback(experimentData) {
        experimentData.results[0].visualizations = [];
        experimentsVizService.saveVisualizations(experimentData.results[0]).then(function (res) {
          if (res.data[0].status === true) {
            $scope.vizTable = false;
          } else {
            $mdDialog.show($mdDialog.alert().title('Failure').content('Could not delete vizs due to ' + res.data[0].errorMessage).ariaLabel('Failure').ok('OK'));
          }
        });
      });
    });
  };

  if (angular.isDefined($routeParams.experimentId)) {
    $scope.experimentId = parseInt($routeParams.experimentId, 10);
    $scope.getExperiment();
    $scope.dataSnapshot();
  }
  function displayErrorMessage(data, error) {
    $scope.vizTemplate = false;
    var message = "";
    var errorData = "";
    if (data == "Query") {
      message = error.errorMessage;
      errorData = "";
    } else {
      message = error.statusText;
      errorData = data;
    }
    $scope.error = {
      data: errorData,
      code: error.status,
      message: message
    };
  }
}]);