import {colorForTheme} from '../../functions.js'

var createLine = function(lineDef) {
  var line = {
    key: lineDef.layername, //this needs to be unique
    type: 'line',
    show: lineDef.layershowbool,
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
    if (typeof lineDef.primarycolor != 'undefined') {
      line.settings.layers.line.stroke = colorForTheme(lineDef.primarycolor);
    }

    line.settings.layers.line.strokeWidth = lineDef.primarywidth;
    line.settings.layers.line.opacity = lineDef.primaryopacity;
    line.settings.layers.line.strokeDasharray = lineDef.primarydashpattern;
  }

  if (~["area", "rangearea"].indexOf(lineDef.linetype)) {
    line.settings.layers.area = {};
    if (!lineDef.showpresentation) {
      if (typeof lineDef.secondarycolor != 'undefined')
        line.settings.layers.area.fill = colorForTheme(lineDef.secondarycolor);
      line.settings.layers.area.opacity = lineDef.secondaryopacity;
    }
  }

  if (lineDef.layerfield1 != '' && lineDef.layerfield2 != '') {
    //console.log(line);
    return [line];
  } else {
    return null;
  }

};

export default createLine
