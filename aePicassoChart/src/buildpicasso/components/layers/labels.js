import {colorForTheme} from '../../functions.js'

var checkForNull = function(val, def) {
  if (typeof val == 'undefined') {
    return def;
  } else {
    return val;
  }
}

var createBoxLabel = function(boxDef, selector) {
  //console.log(boxDef);
  var label = {
    type: 'labels',
    key: boxDef.layername + '_label',
    displayOrder: 2, // must be larger than the displayOrder for the 'bars' component
    settings: {
      sources: [{
        component: boxDef.layername,
        selector: selector, // select all 'rect' shapes from the 'bars' component
        strategy: {
          type: 'bar', // the strategy type
          settings: {
            direction: function(d) { // data argument is the data bound to the shape in the referenced component
              if (boxDef.orientation == 'vertical') {
                return d.data && d.data.end.value > d.data.start.value ? 'up' : 'down'
              } else {
                return d.data && d.data.end.value > d.data.start.value ? 'left' : 'right'
              }
            },
            fontSize: checkForNull(boxDef.labelsize, 13).toString(),
            fontFamily: '"QlikView Sans", sans-serif',
            labels: [{
              label: (d) => {
                return d.data.end.label;
              },
              placements: [ // label placements in prio order. Label will be placed in the first place it fits into
                {
                  position: 'inside',
                  fill: colorForTheme(checkForNull(boxDef.labelinsidecolor, {
                    index: 10,
                    color: '#ffffff'
                  })),
                  justify: checkForNull(boxDef.labelinsidejustify, 0.5),
                  align: checkForNull(boxDef.labelinsidealign, 0.5)
                },
                {
                  position: 'outside',
                  fill: colorForTheme(checkForNull(boxDef.labeloutsidecolor, {
                    index: 2,
                    color: '#545352'
                  })),
                  justify: checkForNull(boxDef.labeloutsidejustify, 0.5),
                  align: checkForNull(boxDef.labeloutsidealign, 0.5)
                },
                {
                  position: 'opposite',
                  fill: colorForTheme(checkForNull(boxDef.labeloppositecolor, {
                    index: 2,
                    color: '#545352'
                  })),
                  justify: checkForNull(boxDef.labeloppositejustify, 0.5),
                  align: checkForNull(boxDef.labeloppositealign, 0.5)
                },
              ]
            }]
          }
        }
      }]
    }
  };

  if (boxDef.labelshow) {
    return label;
  } else {
    return null;
  }

}

var createPieLabel = function(pieDef) {
  var label = {
    type: 'labels',
    key: pieDef.layername + '_label',
    displayOrder: 10,
    settings: {
      sources: [{
        component: pieDef.layername,
        selector: 'path',
        strategy: {
          type: 'slice', // the strategy type
          settings: {
            direction: 'rotate',
            fontSize: checkForNull(pieDef.label.size, 13).toString(),
            fontFamily: '"QlikView Sans", sans-serif',
            labels: [{
              label: (d) => {
                console.log(d);
                return d.data.label;
              },
              placements: [ // label placements in prio order. Label will be placed in the first place it fits into
                /*  { position: 'into', fill: pieDef.label.into.color.color},
                  { position: 'inside', fill: pieDef.label.inside.color.color},*/
                {
                  position: 'outside',
                  fill: colorForTheme(checkForNull(pieDef.label.outside.color, {
                    index: 2,
                    color: '#545352'
                  }))
                },
              ]
            }, {
              label: (d) => {
                return d.data.arc.label;
              },
              placements: [ // label placements in prio order. Label will be placed in the first place it fits into
                {
                  position: 'outside',
                  fill: colorForTheme(checkForNull(pieDef.label.inside.color, {
                    index: 10,
                    color: '#ffffff'
                  }))
                },
                /*  { position: 'inside', fill: pieDef.label.inside.color.color},
                  { position: 'outside', fill: pieDef.label.outside.color.color},*/
              ]
            }]
          }
        }
      }]
    }
  };

  if (pieDef.label.show) {
    return label;
  } else {
    return null;
  }

}

export {createBoxLabel, createPieLabel}
