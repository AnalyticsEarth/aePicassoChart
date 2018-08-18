import {colorForTheme} from '../../functions.js'

var createPoint = function(pointDef) {
  var point = {
    key: pointDef.layername, //this needs to be unique
    type: 'point',
    show: pointDef.layershow,
    data: {
      collection: 'hypercubeCollection'
    },
    brush: {
      trigger: [{
        on: 'tap',
        contexts: ['highlight'],
        globalPropagation: 'stop',
        propagation: 'stop'
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
    if (typeof pointDef.primarycolor != 'undefined')
      point.settings.stroke = colorForTheme(pointDef.primarycolor);
    point.settings.strokeWidth = pointDef.primarywidth;
    point.settings.opacity = pointDef.primaryopacity;

    if (typeof point.settings.fill == 'undefined' && typeof pointDef.secondarycolor != 'undefined') point.settings.fill = colorForTheme(pointDef.secondarycolor);

  }

  if (!pointDef.showpointtype) {
    point.settings.shape = pointDef.pointshape;
    if (pointDef.layerfield4 == "") {
      point.settings.size = pointDef.pointsize;
    }

  }

  var label = null; //createBoxLabel(pointDef, 'circle');

  if (displayCount >= 2) {
    if (label !== null) {
      return [point, label];
    } else {
      return [point];
    }

  } else {
    return null;
  }

};

export default createPoint
