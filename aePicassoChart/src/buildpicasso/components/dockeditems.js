import createAxis from './dockeditems/axis.js'
import createLegend from './dockeditems/legends.js'

var createDockedItem = function(dockDef, hypercube, picassoprops, theme) {
  if (dockDef.dockeditemtype == "axis") {
    return createAxis(dockDef, hypercube, picassoprops.scalesDef, theme);
  }
  if (dockDef.dockeditemtype == "legend") {
    return createLegend(dockDef, hypercube, picassoprops);
  }
}

export default createDockedItem;
