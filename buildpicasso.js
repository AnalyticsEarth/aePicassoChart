define(['jquery',
        './node_modules/picasso-plugin-q/dist/picasso-q',
        'text!./templates/bar.json',
        'text!./templates/line.json',
        'text!./templates/bubble-grid.json',
        'text!./templates/scatter.json'
      ], function($, pq, charttemplate_bar, charttemplate_line, charttemplate_bubblegrid, charttemplate_scatter) {

        var charts = {};
        charts['bar'] = charttemplate_bar;
        charts['line'] = charttemplate_line;
        charts['bubble-grid'] = charttemplate_bubblegrid;
        charts['scatter'] = charttemplate_scatter;


  //Create Collection
  var createCollections = function(hypercube) {
    //Create Collection Array
    var collectionArray = [];

    var collection = {
      key: 'hypercubeCollection',
      data: {
        extract: {
          props: {

          }
        }
      }
    };

    //needs to support multiple dimensions in next phase
    hypercube.qDimensionInfo.forEach((d, i) => {
      if(i == 0){
        collection.data.extract.field = 'qDimensionInfo/' + i;
        //collection.data.extract.trackBy = (v) => {return v.qElemNumber;};
      }
      collection.data.extract.props['d' + i] = {
        field: 'qDimensionInfo/' + i,

      }; //trackBy: (v) => {return v.qElemNumber;}


    });
    hypercube.qMeasureInfo.forEach((m, i) => {
      collection.data.extract.props['m' + i] = {
        field: 'qMeasureInfo/' + i
      };
    });

    collectionArray.push(collection);
    //console.log(collectionArray);
    return collectionArray;

  };


  //Create Scales
  var createScales = function(scalesDef) {
    var scalesObj = {};
    scalesDef.forEach((scale) => {
      if (scale.scalefield.split("/")[0] == "qDimensionInfo") {
        scalesObj[scale.scalename] = {
          data: {
            extract: {
              field: scale.scalefield
            }
          },
          invert: scale.scaleinvert,
          padding: scale.scalepadding
        };
      } else {
        scalesObj[scale.scalename] = {
          data: {
            field: scale.scalefield
          },
          invert: scale.scaleinvert,
          expand: scale.scaleexpand
        };

        if (typeof scale.scaleinclude != 'undefined' && scale.scaleinclude != '') {
          scalesObj[scale.scalename].include = scale.scaleinclude.split(",");
        }

      }

      if (scale.scaletype != "") {
        scalesObj[scale.scalename].type = scale.scaletype;
      }
    });
    return scalesObj;
  };

  //Create Components
  var createComponents = function(picassoprops, hypercube) {
    var componentsArray = [];
    //Axis
    picassoprops.componentsDef.axis.forEach((axis) => {
      componentsArray.push.apply(componentsArray, createDockedItem(axis, hypercube, picassoprops.scalesDef));
    });

    //Layers
    picassoprops.componentsDef.layers.forEach((layer) => {
      var retLayer = createLayer(layer);
      if (retLayer !== null) componentsArray.push(retLayer);
    });

    var brush = componentsArray.filter(x => x.type == 'brush-range');
    var notbrush = componentsArray.filter(x => x.type != 'brush-range');



    return notbrush.concat(brush);
  };

  var createDockedItem = function(dockDef, hypercube, scalesDef) {
    if (dockDef.dockeditemtype == "axis") {
      return createAxis(dockDef, hypercube, scalesDef);
    }
    if (dockDef.dockeditemtype == "legend") {
      return createLegend(dockDef);
    }
  }

  //Axis Component - Note this creates two picasso components
  var createAxis = function(axisDef, hypercube, scalesDef) {
    var scaleIndex = scalesDef.map(e => e.scalename).indexOf(axisDef.axisscale);
    //console.log(scaleIndex);
    if(scaleIndex != -1){
      var axisFieldDef = scalesDef[scaleIndex].scalefield;
      var dimMes = axisFieldDef.split("/");

      var axisTitle = {
        type: 'text',
        text: hypercube[dimMes[0]][dimMes[1]].qFallbackTitle,
        style: {
          text: {
            fontSize: '13px',
            fontFamily: '"QlikView Sans", sans-serif'
          }
        },
        dock: axisDef.axisdock
      };
      var axis = {
        key: axisDef.axisdock + "_" + axisDef.axisscale,
        type: 'axis',
        scale: axisDef.axisscale,
        dock: axisDef.axisdock,
        settings: {
          labels: {
            mode: axisDef.axislabelmode,
          }
        },
      };

      if (axisDef.axislabelmode == "tilted") {
        axis.settings.labels.tiltAngle = axisDef.axistiltangle;
      }

      if(dimMes[0] == "qDimensionInfo"){
        var brush = createRangeBrush(axisDef);
        return [axis, axisTitle, brush];
      }else{
        return [axis, axisTitle];
      }
    }else{
      return null;
    }


  };

  var createLegend = function(legDef) {
    if (legDef.legendtype == "legend-seq") {
      return createSeqLegend(legDef);
    }
    if (legDef.legendtype == "legend-cat") {
      return createCatLegend(legDef);
    }
  };

  var createSeqLegend = function(legDef) {
    var leg = {
      type: legDef.legendtype,
      settings: {
        major: legDef.axisscale,
        fill: legDef.colorscale
      },
      dock: legDef.axisdock
    };

    return [leg]; //in array to mirror the axis function
  };

  var createCatLegend = function(legDef) {
    var leg = {
      type: legDef.legendtype,
      scale: legDef.axisscale,
      dock: legDef.axisdock,
      brush: {
        trigger: [{
          on: 'tap',
          contexts: ['highlight']
        }],
        consume: [{
          context: 'highlight',
          style: {
            inactive: {
              opacity: 0.3
            }
          }
        }]
      },
    };

    return [leg]; //in array to mirror the axis function
  };

  var createLayer = function(layerDef) {
    if (layerDef.layername != '') {
      if (layerDef.layertype == "line") {
        return createLine(layerDef);
      }
      if (layerDef.layertype == "point") {
        return createPoint(layerDef);
      }
      if (layerDef.layertype == "box") {
        return createBox(layerDef);
      }
      if (layerDef.layertype == "grid") {
        return createGrid(layerDef);
      }
      if (layerDef.layertype == "pie") {
        return createPie(layerDef);
      }
    } else {
      return null;
    }

  };

  var createLine = function(lineDef) {
    var line = {
      key: lineDef.layername, //this needs to be unique
      type: 'line',
      show:lineDef.layershow,
      data: {
        collection: 'hypercubeCollection'
      },
      settings: {
        coordinates: {
          major: {
            scale: lineDef.layerscale1,
            ref: lineDef.layerfield1 //Should be auto set to be the scale of the dimension
          },
          minor: {
            scale: lineDef.layerscale2, //Should be auto set to the scale of the measure
            ref: lineDef.layerfield2
          }
        },
        layers: {
          show: lineDef.layershow,
          line: {}
        }
      }
    };

    if(lineDef.layerfield3 != '' && lineDef.linetype == 'rangearea'){
      line.settings.coordinates.minor0 = {
        scale: lineDef.layerscale2,
        ref: lineDef.layerfield3
      };
    }

    if (!lineDef.showpresentation) {
      line.settings.layers.curve = lineDef.layercurve;
      if (typeof lineDef.primarycolor.color != 'undefined') {
        line.settings.layers.line.stroke = lineDef.primarycolor.color;
      }

      line.settings.layers.line.strokeWidth = lineDef.primarywidth;
      line.settings.layers.line.opacity = lineDef.primaryopacity;
      line.settings.layers.line.strokeDasharray = lineDef.primarydashpattern;
    }

    if (~["area", "rangearea"].indexOf(lineDef.linetype)) {
      line.settings.layers.area = {};
      if (!lineDef.showpresentation) {
        if (typeof lineDef.secondarycolor.color != 'undefined')
          line.settings.layers.area.fill = lineDef.secondarycolor.color;
        line.settings.layers.area.opacity = lineDef.secondaryopacity;
      }
    }

    if (lineDef.layerfield1 != '' && lineDef.layerfield2 != '') {
      //console.log(line);
      return line;
    } else {
      return null;
    }

  };

  var createPie = function(pieDef){
    var pie = {
  type: 'pie',
  data: {
    collection: 'hypercubeCollection'
  },
  brush: {
    trigger: [{
      on: 'tap',
      contexts: ['highlight'],
      globalPropagation:'stop',
      propagation:'stop'
    }],
    consume: [{
      context: 'highlight',
      style: {
        inactive: {
          opacity: 0.3
        }
      }
    }]
  },
  settings: {
    //startAngle: Math.PI / 2,
    //endAngle: -Math.PI / 2,
    padAngle: pieDef.piepadangle,
    slice: {
      arc: { ref: pieDef.layerfield1 },
      outerRadius: pieDef.pieouterradius,
      innerRadius: pieDef.pieinnerradius,
      cornerRadius: pieDef.piecornerradius,
      fill: {scale:pieDef.layerscale2},
    }
  }
};

if (!pieDef.showpresentation) {

  if (typeof pieDef.primarycolor.color != 'undefined') {
    pie.settings.slice.stroke = pieDef.primarycolor.color;
  }
  pie.settings.slice.strokeWidth = pieDef.primarywidth;
  pie.settings.slice.opacity = pieDef.primaryopacity;
}

return pie;
  }

  var convertFieldRefToFieldName = function(field) {
    if (typeof field == 'undefined') {
      return "";
    } else {
      if (field.substr(0, 1) == "d") {
        return field.replace("d", "qDimensionInfo/");
      } else {
        return field.replace("m", "qMeasureInfo/");
      }
    }

  };

  var createBox = function(boxDef) {
    var box = {
      key: boxDef.layername, //this needs to be unique
      type: 'box',
      show:boxDef.layershow,
      data: {
        //collection: 'hypercubeCollection',
        extract: {
          field: '',
          props: {
            start: 0,
            end: 0
          }
        }
      },
      brush: {
        trigger: [{
          on: 'tap',
          contexts: ['highlight'],
          globalPropagation:'stop',
          propagation:'stop'
        }],
        consume: [{
          context: 'highlight',
          style: {
            inactive: {
              opacity: 0.3
            }
          }
        }]
      },
      settings: {
        major: {
          scale: boxDef.layerscale1 //Should be auto set to be the scale of the dimension

        },
        minor: {
          scale: boxDef.layerscale2 //Should be auto set to the scale of the measure
        },
        box: {

        },
        line: {

        },
        whisker: {

        },
        median: {

        }
      }
    };

    if (boxDef.layerfield1 != "" && boxDef.layerscale1 != "") {
      box.data.extract.field = convertFieldRefToFieldName(boxDef.layerfield1);
      //Include some error checking to not try and render an incomplete layer
    }

    if (boxDef.layerfield2 != "" && boxDef.layerscale2 != "" && ~["box", "whisker"].indexOf(boxDef.boxtype)) {
      box.data.extract.props.start = {
        field: convertFieldRefToFieldName(boxDef.layerfield2)
      };
    }
    if (boxDef.layerfield3 != "" && boxDef.layerscale2 != "" && ~["bar", "box", "whisker"].indexOf(boxDef.boxtype)) {
      box.data.extract.props.end = {
        field: convertFieldRefToFieldName(boxDef.layerfield3)
      };
    }
    if (boxDef.layerfield4 != "" && boxDef.layerscale2 != "" && ~["whisker"].indexOf(boxDef.boxtype)) {
      box.data.extract.props.min = {
        field: convertFieldRefToFieldName(boxDef.layerfield4)
      };
    }
    if (boxDef.layerfield5 != "" && boxDef.layerscale2 != "" && ~["whisker"].indexOf(boxDef.boxtype)) {
      box.data.extract.props.max = {
        field: convertFieldRefToFieldName(boxDef.layerfield5)
      };
    }
    if (boxDef.layerfield6 != "" && boxDef.layerscale2 != "" && ~["whisker"].indexOf(boxDef.boxtype)) {
      box.data.extract.props.med = {
        field: convertFieldRefToFieldName(boxDef.layerfield6)
      };
    }

    if (boxDef.layerfield7 != "" && boxDef.layerscale7 != "" && ~["bar", "box", "whisker"].indexOf(boxDef.boxtype)) {
      box.data.extract.props.color = {
        field: convertFieldRefToFieldName(boxDef.layerfield7)
      };
      box.settings.box.fill = {
        scale: boxDef.layerscale7,
        ref:'color'
      };
    }

    if (boxDef.orientation != "" && ~["bar", "box", "whisker"].indexOf(boxDef.boxtype)) {
      box.settings.orientation = boxDef.orientation;
    }

    if (!boxDef.showpresentation) {
      if (typeof boxDef.primarycolor.color != 'undefined')
        box.settings.box.stroke = boxDef.primarycolor.color;

      box.settings.box.strokeWidth = boxDef.primarywidth;

      if (typeof boxDef.secondarycolor.color != 'undefined')
        box.settings.box.fill = boxDef.secondarycolor.color;

      //Line
      if (typeof boxDef.thirdcolor.color != 'undefined')
        box.settings.line.stroke = boxDef.thirdcolor.color;

      box.settings.line.strokeWidth = boxDef.thirdwidth;

      //Whisker
      if (typeof boxDef.forthcolor.color != 'undefined')
        box.settings.whisker.stroke = boxDef.forthcolor.color;

      box.settings.whisker.strokeWidth = boxDef.forthwidth;

      //Median
      if (typeof boxDef.fifthcolor.color != 'undefined')
        box.settings.median.stroke = boxDef.fifthcolor.color;

      box.settings.median.strokeWidth = boxDef.fifthwidth;

    }

    /*if (~["area", "rangearea"].indexOf(boxDef.linetype)) {
      line.settings.layers.area = {};
      if (!lineDef.showpresentation) {

        line.settings.layers.area.opacity = lineDef.secondaryopacity;
      }
    }*/

    if (boxDef.layerfield1 != '') {
      return box;
    } else {
      return null;
    }

  };

  var createPoint = function(pointDef) {
    var point = {
      key: pointDef.layername, //this needs to be unique
      type: 'point',
      show:pointDef.layershow,
      data: {
        collection: 'hypercubeCollection'
      },
      brush: {
        trigger: [{
          on: 'tap',
          contexts: ['highlight'],
          globalPropagation:'stop',
          propagation:'stop'
        }],
        consume: [{
          context: 'highlight',
          style: {
            inactive: {
              opacity: 0.4
            }
          }
        }]
      },
      settings: {

      }
    };

    var displayCount = 0;

    //X
    if (pointDef.layerfield1 != "" && pointDef.layerscale1 != "") {
      point.settings.x = {
        scale: pointDef.layerscale1,
        ref: pointDef.layerfield1
      }
      displayCount++;
    }

    //Y
    if (pointDef.layerfield2 != "" && pointDef.layerscale2 != "") {
      point.settings.y = {
        scale: pointDef.layerscale2,
        ref: pointDef.layerfield2
      }
      displayCount++;
    }

    //Size
    if (pointDef.layerfield4 != "" && pointDef.layerscale4 != "") {
      point.settings.size = {
        scale: pointDef.layerscale4,
        ref: pointDef.layerfield4
      }
      displayCount++;
    }

    //Color
    //console.log(pointDef);
    if (pointDef.layerfield3 != "" && pointDef.layerscale3 != "") {
      point.settings.fill = {
        scale: pointDef.layerscale3,
        ref: pointDef.layerfield3
      }
      displayCount++;
    }

    if (!pointDef.showpresentation) {
      if (typeof pointDef.primarycolor.color != 'undefined')
        point.settings.stroke = pointDef.primarycolor.color;
      point.settings.strokeWidth = pointDef.primarywidth;
      point.settings.opacity = pointDef.primaryopacity;

      if (typeof point.settings.fill == 'undefined' && typeof pointDef.secondarycolor.color != 'undefined') point.settings.fill = pointDef.secondarycolor.color;

    }

    if (!pointDef.showpointtype) {
      point.settings.shape = pointDef.pointshape;
      if(pointDef.layerfield4 == ""){
        point.settings.size = pointDef.pointsize;
      }

    }

    if (displayCount >= 2) {
      return point;
    } else {
      return null;
    }

  };

  var createGrid = function(gridDef) {
    var grid = {
      type: 'grid-line',
      show:gridDef.layershow,
      ticks: { // Optional
        show: gridDef.showgridtickmajor,
      },
      minorTicks: { // Optional
        show: gridDef.showgridtickminor,
      },
    };

    if (gridDef.showgridx) {
      grid.x = {
        scale: gridDef.layerscale1
      };
    }

    if (gridDef.showgridy) {
      grid.y = {
        scale: gridDef.layerscale2
      };
    }

    if (!gridDef.showpresentation) {
      if (typeof gridDef.primarycolor.color != 'undefined')
        grid.ticks.stroke = gridDef.primarycolor.color;
      grid.ticks.strokeWidth = gridDef.primarywidth;

      if (typeof gridDef.secondarycolor.color != 'undefined')
        grid.minorTicks.stroke = gridDef.secondarycolor.color;
      grid.minorTicks.strokeWidth = gridDef.secondarywidth;
    }

    return grid;
  };

  var createRangeBrush = function(rangeDef) {

    var direction = 'horizontal';
    var rangekey = 'rangeX';
    var align = 'start';
    if (rangeDef.axisdock == "left" || rangeDef.axisdock == "right") {
      direction = "vertical";
      rangekey = 'rangeY';
      align = 'end';
    }

    var brush = {
      key: rangekey, // We'll use this reference when setting up our interaction events
      type: 'brush-range',
      settings: {
        brush: 'highlight',
        direction,
        scale: rangeDef.axisscale,
        target: {
          component: rangeDef.axisdock + "_" + rangeDef.axisscale // Use the x-axis as our target and interaction trigger
        },
        bubbles: {
          align
        },

      }
    };

    return brush;
  }

  var interactionsSetup = function(intDef) {
    "use strict";
    let rangeRef = 'rangeY';
    var interactions = [{
      type: 'native',
      events: {
        mousedown: function(e) {
          // Use Alt-key + click to reset the brush
          /*  if (e.altKey) {
              this.chart.brush('highlight').end();
              this.chart.component('rangeY').emit('rangeClear');
              this.chart.component('rangeX').emit('rangeClear');
            }*/

          const overComp = this.chart.componentsFromPoint({
            x: e.clientX,
            y: e.clientY
          })[0];
          //console.log(overComp);
          rangeRef = overComp && ~["left", "right"].indexOf(overComp.dock) ? 'rangeY' : 'rangeX';

          // Fetch the range component instance and trigger the start event
          //console.log(this.chart.component(rangeRef));
          if(typeof this.chart.component(rangeRef) != 'undefined'){
            this.chart.component(rangeRef).emit('rangeStart', mouseEventToRangeEvent(e));
          }

        },
        mousemove: function(e) {
          if(typeof this.chart.component(rangeRef) != 'undefined'){
            this.chart.component(rangeRef).emit('rangeMove', mouseEventToRangeEvent(e));
          }
        },
        mouseup: function(e) {
          if(typeof this.chart.component(rangeRef) != 'undefined'){
            this.chart.component(rangeRef).emit('rangeEnd', mouseEventToRangeEvent(e));
          }
        }
      }
    }];
    return interactions;
  };

  var mouseEventToRangeEvent = function(e) {
    return {
      center: {
        x: e.clientX,
        y: e.clientY
      },
      deltaX: e.movementX,
      deltaY: e.movementY
    };
  }




  var enableSelectionOnFirstDimension = function(that, chart, brush, layout) {
    //console.log(that);
    var chartBrush = chart.brush(brush);
    //console.log(chartBrush);
    chartBrush.on('start', (x) => {
      //console.log("start");
      //console.log(chartBrush.isActive);
    });
    chartBrush.on('update', (added, removed) => {
      var selection = pq.selections(chartBrush)[0];
      //console.log(selection);
      if (selection.method === 'resetMadeSelections') {
        //console.log
        chartBrush.end();
        that.backendApi.clearSelections();
      } else
      if (selection.method === 'selectHyperCubeValues') {
        that.selectValues(selection.params[1], selection.params[2], false);
      } else
      if (selection.method === 'rangeSelectHyperCubeValues') {
        if (chartBrush.isActive){
          that.backendApi.selectRange(selection.params[1], true);
        }else{

        }


      }
    });
    return chartBrush;
  };

  var optionsListForFields = function(hypercube) {
    var list = [];

    hypercube.qDimensionInfo.forEach((d, i) => {
      list.push({
        value: 'qDimensionInfo/' + i,
        label: 'Dim ' + i + ': ' + d.qFallbackTitle

      });
    });
    hypercube.qMeasureInfo.forEach((m, i) => {
      list.push({
        value: 'qMeasureInfo/' + i,
        label: 'Mes ' + i + ': ' + m.qFallbackTitle

      });
    });
    return list;
  };

  var optionsListForFieldsDef = function(hypercubedef, valueType) {
    var list = [];
    if (valueType == 1) {
      list.push({
        value: "",
        label: "None"
      });
    }
    hypercubedef.qDimensions.forEach((d, i) => {
      //console.log(d);
      var labelVal = 'Dim ' + i + ': ' + d.qDef.qFieldLabels[d.qDef.qActiveField];
      if (labelVal.trim().slice(-1) == ':') labelVal = 'Dim ' + i + ': ' + d.qDef.qFieldDefs[d.qDef.qActiveField];
      //console.log(labelVal);
      if(labelVal.slice(-9) == 'undefined') labelVal = 'Dimension ' + i;
      var valueVal = 'qDimensionInfo/' + i;
      if (valueType == 1) valueVal = 'd' + i;
      if (valueType == 2) valueVal = i;
      list.push({
        value: valueVal,
        label: labelVal
      });
    });
    hypercubedef.qMeasures.forEach((m, i) => {
      var labelVal = 'Mes ' + i + ': ' + m.qDef.qLabel;
      if (labelVal.trim().slice(-1) == ':') labelVal = 'Mes ' + i + ': ' + m.qDef.qDef;
      //console.log(labelVal);
      if(labelVal.trim().slice(-1) == ':') labelVal = 'Measure ' + i;
      var valueVal = 'qMeasureInfo/' + i;
      if (valueType == 1) valueVal = 'm' + i;
      list.push({
        value: valueVal,
        label: labelVal
      });
    });
    return list;
  }

  var optionsListForDimensionsDef = function(hypercubedef, valueType) {
    var list = [];
    hypercubedef.qDimensions.forEach((d, i) => {
      var labelVal = 'Dim ' + i + ': ' + d.qDef.qFieldLabels[d.qDef.qActiveField];
      if (labelVal == '') labelVal = 'Dim ' + i + ': ' + d.qDef.qFieldDefs[d.qDef.qActiveField];
      if(typeof labelVal == 'undefined') labelVal = 'Dimension ' + i;
      var valueVal = 'qDimensionInfo/' + i;
      if (valueType == 1) valueVal = 'd' + i;
      if (valueType == 2) valueVal = i;
      list.push({
        value: valueVal,
        label: labelVal
      });
    });
    return list;
  }

  var optionsListForScales = function(scalesDef, valueType) {
    var list = [];
    if (valueType == 1) {
      list.push({
        value: "",
        label: "None"
      });
    }
    scalesDef.forEach((s) => {
      list.push({
        value: s.scalename,
        label: s.scalename
      });
    });
    return list;
  };

  var exportChart = function(picassoprops) {
    console.log("Export Chart Spec");
    var expDate = new Date(Date.now());
    var specout = {
      info: {
        version: "0.1",
        exportDate: expDate.toISOString()
      },
      chartspec: {
        scales: picassoprops.scalesDef,
        components: picassoprops.componentsDef
      }
    };
    var json = JSON.stringify(specout);

    var datestring = ("0" + expDate.getDate()).slice(-2) + "-" + ("0" + (expDate.getMonth() + 1)).slice(-2) + "-" +
      expDate.getFullYear() + "_" + ("0" + expDate.getHours()).slice(-2) + ("0" + expDate.getMinutes()).slice(-2);


    download("picassocomposer_" + datestring + ".json", json);
  };

  var download = function(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  var importChart = function(chartspec, picassoprops, save) {
    //TODO: This will be to import the chart from an archive file
    if(chartspec != 'custom'){
      try{
        var response = JSON.parse(charts[chartspec]);
        if (save) {
          picassoprops.scalesDef = response.chartspec.scales;
          picassoprops.componentsDef = response.chartspec.components;
        }
      }catch(e){

      }

    }
  };

  return {
    createCollections,
    createScales,
    createComponents,
    enableSelectionOnFirstDimension,
    optionsListForFields,
    optionsListForFieldsDef,
    optionsListForScales,
    optionsListForDimensionsDef,
    exportChart,
    importChart,
    interactionsSetup
  }
})
