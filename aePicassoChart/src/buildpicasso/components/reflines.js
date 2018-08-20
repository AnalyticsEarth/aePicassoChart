import {colorForTheme, getThemeStyle} from '../functions.js'



let createRefLines = function(refLineDefs, theme){
  //console.log(theme);
  if(typeof refLineDefs == 'undefined') return null;
  if(refLineDefs.length == 0) return null;

  let refline = {
            key: "ref-line",
            type: "ref-line",
            dock: "center",
            prioOrder: -1,
            displayOrder:100,
            lines: {
              x: [],
              y: []
            },
            style: {
              oob: {
                width: 7,
                fill: getThemeStyle('object','referenceLine.outOfBounds','backgroundColor'),
                text: {
                  fill: getThemeStyle('object','referenceLine.outOfBounds','color'),
                  fontFamily:'"QlikView Sans", sans-serif'
                },
                padding: {
                  x: 7,
                  y: 5
                }
              }
            }
          };

  let xList = [];
  let yList = [];

  refLineDefs.forEach((rl, i) => {
    var refline = createRefLine(rl, theme);
    //console.log(refline);
    if (refline !== null){
      if(refline.axis == 'x'){
        xList.push(refline.line);
      }else{
        yList.push(refline.line);
      }
    }
  });

  refline.lines.x = xList;
  refline.lines.y = yList;

  return [refline];

}

let createRefLine = function(refLineDef, theme){

  if(refLineDef.show){

    let scaleaxis = refLineDef.scale.split("|");

    let axis = 'x';
    if(scaleaxis[1] == "left" || scaleaxis[1] == "right") axis = 'y';

    let line = {value: refLineDef.refLineExpr.value,
      scale:scaleaxis[0],
      line: {
        stroke: colorForTheme(refLineDef.paletteColor),
        strokeWidth: refLineDef.linestrokewidth,
        opacity: refLineDef.lineopacity
      },
      label: {
        align: axis == 'x' ? refLineDef.align : refLineDef.align,
        vAlign: axis == 'x' ? 1 - refLineDef.valign : 1 - refLineDef.valign,
        text: refLineDef.label,
        fill: colorForTheme(refLineDef.tcolor),
        fontFamily: '"QlikView Sans", sans-serif',
        fontSize: getThemeStyle('object','referenceLine.label.name','fontSize'),
        maxWidthPx: 135,
        background:{
          fill: colorForTheme(refLineDef.backcolor),
          stroke: colorForTheme(refLineDef.paletteColor),
          strokeWidth: refLineDef.borderwidth,
          opacity: refLineDef.backgroundopacity
        }
      }
    };



    return {axis,line};
  }else{
    return null;
  }


}

export default createRefLines
