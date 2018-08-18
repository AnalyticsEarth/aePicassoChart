var createRangeBrush = function(rangeDef) {

  var direction = 'horizontal';
  var rangekey = 'rangeX';
  var align = 'start';
  if (rangeDef.axisdock == "left" || rangeDef.axisdock == "right") {
    direction = "vertical";
    rangekey = 'rangeY';
    align = 'end';
  }

  var brush = {
    key: rangekey, // We'll use this reference when setting up our interaction events
    type: 'brush-range',
    settings: {
      brush: 'highlight',
      direction,
      scale: rangeDef.axisscale,
      target: {
        component: rangeDef.axisdock + "_" + rangeDef.axisscale // Use the x-axis as our target and interaction trigger
      },
      bubbles: {
        align
      },

    }
  };

  return brush;
}

export default createRangeBrush
