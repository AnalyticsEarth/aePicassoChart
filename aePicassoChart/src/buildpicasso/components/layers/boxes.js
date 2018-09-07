import {createBoxLabel} from './labels.js'
import {colorForTheme} from '../../functions.js'

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
    show: boxDef.layershowbool,
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
      major: {
        scale: boxDef.layerscale1, //Should be auto set to be the scale of the dimension
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
      ref: 'color'
    };
  }

  if (boxDef.orientation != "" && ~["bar", "box", "whisker"].indexOf(boxDef.boxtype)) {
    box.settings.orientation = boxDef.orientation;
  }

  if (!boxDef.showpresentation) {
    //if (typeof boxDef.primarycolor != 'undefined')
    box.settings.box.stroke = colorForTheme(boxDef.primarycolor);

    box.settings.box.strokeWidth = boxDef.primarywidth;

    //if (typeof boxDef.secondarycolor != 'undefined')
    box.settings.box.fill = colorForTheme(boxDef.secondarycolor);

    //Line
    if (typeof boxDef.thirdcolor != 'undefined')
      box.settings.line.stroke = colorForTheme(boxDef.thirdcolor);

    box.settings.line.strokeWidth = boxDef.thirdwidth;

    //Whisker
    if (typeof boxDef.forthcolor != 'undefined')
      box.settings.whisker.stroke = colorForTheme(boxDef.forthcolor);

    box.settings.whisker.strokeWidth = boxDef.forthwidth;

    //Median
    if (typeof boxDef.fifthcolor != 'undefined')
      box.settings.median.stroke = colorForTheme(boxDef.fifthcolor);

    box.settings.median.strokeWidth = boxDef.fifthwidth;

    //Bar Width and Offset
    if (typeof boxDef.objectwidth != 'undefined')
      box.settings.box.width = boxDef.objectwidth;

    if (typeof boxDef.objectoffset != 'undefined')
      box.settings.major.fn = function(d) {
        var a = d.scale(d.datum.value) + (d.scale.bandwidth() * boxDef.objectoffset);
        return a;
      };
  }

  var label = createBoxLabel(boxDef, 'rect');

  if (boxDef.layerfield1 != '') {
    if (label !== null) {
      return [box, label];
    } else {
      return [box];
    }

  } else {
    return null;
  }

};

export default createBox
