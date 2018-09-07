import {colorForTheme} from '../../functions.js'

var createLegend = function(legDef, hypercube, picassoprops) {
  if (legDef.legendtype == "legend-seq") {
    return createSeqLegend(legDef);
  }
  if (legDef.legendtype == "legend-cat") {
    return createCatLegend(legDef, hypercube, picassoprops);
  }
  if (legDef.legendtype == "legend-layer") {
    return createLayerLegend(legDef, hypercube, picassoprops);
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

var createCatLegend = function(legDef, hypercube, picassoprops) {
  var leg = {
    type: legDef.legendtype,
    scale: legDef.colorscale,
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

var createLayerLegend = function(legDef, hypercube, picassoprops){

  var data = [];
  var range = [];
  var layers = picassoprops.componentsDef.layers.forEach(y => {
    //Resolve the Layer legend show expression to a boolean
    if(typeof y.legshow2 == "string"){
      if(y.legshow2 == "-1" || y.legshow2 == "" || y.legshow2 == "True"){
        y.legshowbool = true;
      }else{
        y.legshowbool = false;
      }
    }else{
      y.legshowbool = true;
    }


    if(y.layershowbool && y.legshowbool){
      var titletext = y.layertitle;
      if(typeof y.layertitle == "undefined" || y.layertitle == "" ){
        titletext = y.layername;
      }

      switch (y.layertype) {
        case 'line':
          data.push(titletext);
          if(y.linetype == 'line'){
            range.push(colorForTheme(y.primarycolor));
          }else{
            range.push(colorForTheme(y.secondarycolor));
          }
          break;
        case 'box':
          data.push(titletext);
        case 'point':
          data.push(titletext);
          range.push(colorForTheme(y.secondarycolor));
          break;
        default:

      }
    }
  });

  var leg = {
    type: "legend-cat",
    scale: {
      type: 'categorical-color',
      data,
      range
    },
    settings: {
      item:{shape:{type:'circle'}},
      title:{
        show:(legDef.legtitle != ''),
        text:legDef.legtitle
      }
    },
    dock: legDef.axisdock,
  };

  return [leg];

};

export default createLegend
