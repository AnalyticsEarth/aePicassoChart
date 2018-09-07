import {colorForTheme} from '../../functions.js'

var createPie = function(pieDef) {
  var pie = {
    type: 'pie',
    show: pieDef.layershowbool,
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
        arc: {
          ref: pieDef.layerfield1
        },
        outerRadius: pieDef.pieouterradius,
        innerRadius: pieDef.pieinnerradius,
        cornerRadius: pieDef.piecornerradius,
        fill: {
          scale: pieDef.layerscale2
        },
      }
    }
  };

  if (!pieDef.showpresentation) {

    if (typeof pieDef.primarycolor != 'undefined') {
      pie.settings.slice.stroke = colorForTheme(pieDef.primarycolor);
    }
    pie.settings.slice.strokeWidth = pieDef.primarywidth;
    pie.settings.slice.opacity = pieDef.primaryopacity;
  }

  var label = null; //createPieLabel(pieDef);

  if (pieDef.layerfield1 != '') {
    if (label !== null) {
      return [pie, label];
    } else {
      return [pie];
    }

  } else {
    return null;
  }

}


export default createPie
