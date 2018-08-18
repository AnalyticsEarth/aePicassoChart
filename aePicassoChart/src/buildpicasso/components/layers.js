import createLine from './layers/lines.js'
import createPie from './layers/pies.js'
import createBox from './layers/boxes.js'
import createPoint from './layers/points.js'
import createGrid from './layers/grids.js'

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

export default createLayer
