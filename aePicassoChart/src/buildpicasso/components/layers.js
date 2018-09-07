import createLine from './layers/lines.js'
import createPie from './layers/pies.js'
import createBox from './layers/boxes.js'
import createPoint from './layers/points.js'
import createGrid from './layers/grids.js'

var createLayer = function(layerDef) {

  //console.log(layerDef.layershow);
  if(typeof layerDef.layershow2 == "string"){
    if(layerDef.layershow2 == "-1" || layerDef.layershow2 == "" || layerDef.layershow2 == "True"){
      //console.log("Changing to true");
      layerDef.layershowbool = true;
    }else{
      //console.log("Changing to false");
      layerDef.layershowbool = false;
    }
  }else{
    layerDef.layershowbool = true;
  }


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
