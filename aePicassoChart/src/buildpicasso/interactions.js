import pq from 'picasso-plugin-q';

var interactionsSetup = function(intDef, picassoprops) {
  "use strict";
  let rangeRef = 'rangeY';
  var interactions = [{
    type: 'native',
    events: {
      mousedown: function(e) {
        // Use Alt-key + click to reset the brush
        /*  if (e.altKey) {
            this.chart.brush('highlight').end();
            this.chart.component('rangeY').emit('rangeClear');
            this.chart.component('rangeX').emit('rangeClear');
          }*/

        const overComp = this.chart.componentsFromPoint({
          x: e.clientX,
          y: e.clientY
        })[0];
        //console.log(overComp);
        rangeRef = overComp && ~["left", "right"].indexOf(overComp.dock) ? 'rangeY' : 'rangeX';

        // Fetch the range component instance and trigger the start event
        //console.log(this.chart.component(rangeRef));
        if (typeof this.chart.component(rangeRef) != 'undefined') {
          this.chart.component(rangeRef).emit('rangeStart', mouseEventToRangeEvent(e));
        }

      },
      mousemove: function(e) {
        if (typeof this.chart.component(rangeRef) != 'undefined') {
          this.chart.component(rangeRef).emit('rangeMove', mouseEventToRangeEvent(e));
        }
      },
      mouseup: function(e) {
        if (typeof this.chart.component(rangeRef) != 'undefined') {
          this.chart.component(rangeRef).emit('rangeEnd', mouseEventToRangeEvent(e));
        }
      }
    }
  }];

  try { //Old charts dont have this property to switch on tooltip.
    if (picassoprops.tooltip.show) {
      interactions.push({
        type: 'native',
        events: {
          mousemove(e) {
            const tooltip = this.chart.component('tooltip-key');
            tooltip.emit('show', e);
          },
          mouseleave(e) {
            const tooltip = this.chart.component('tooltip-key');
            tooltip.emit('hide');
          }
        }
      });
    }
  }catch(e){
    
  }

  return interactions;
};

var mouseEventToRangeEvent = function(e) {
  return {
    center: {
      x: e.clientX,
      y: e.clientY
    },
    deltaX: e.movementX,
    deltaY: e.movementY
  };
}




var enableSelectionOnFirstDimension = function(that, chart, brush, layout) {
  //console.log(that);
  var chartBrush = chart.brush(brush);
  //console.log(chartBrush);
  chartBrush.on('start', (x) => {
    //console.log("start");
    //console.log(chartBrush.isActive);
  });
  chartBrush.on('update', (added, removed) => {
    var selection = pq.selections(chartBrush)[0];
    //console.log(selection);
    if (selection.method === 'resetMadeSelections') {
      //console.log
      chartBrush.end();
      that.backendApi.clearSelections();
    } else
    if (selection.method === 'selectHyperCubeValues') {
      that.selectValues(selection.params[1], selection.params[2], false);
    } else
    if (selection.method === 'rangeSelectHyperCubeValues') {
      if (chartBrush.isActive) {
        that.backendApi.selectRange(selection.params[1], true);
      } else {

      }


    }
  });
  return chartBrush;
};

export {
  interactionsSetup,
  mouseEventToRangeEvent,
  enableSelectionOnFirstDimension
}
