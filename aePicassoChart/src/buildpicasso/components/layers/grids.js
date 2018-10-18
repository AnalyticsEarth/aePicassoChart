import {colorForTheme} from '../../functions.js'

var createGrid = function(gridDef) {
  var grid = {
    type: 'grid-line',
    show: gridDef.layershowbool,
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
    if (typeof gridDef.primarycolor != 'undefined')
      grid.ticks.stroke = colorForTheme(gridDef.primarycolor);
    grid.ticks.strokeWidth = gridDef.primarywidth;

    if (typeof gridDef.secondarycolor != 'undefined')
      grid.minorTicks.stroke = colorForTheme(gridDef.secondarycolor);
    grid.minorTicks.strokeWidth = gridDef.secondarywidth;
  }

  return [grid];
};

export default createGrid
