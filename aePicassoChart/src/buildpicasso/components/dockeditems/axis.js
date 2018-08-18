import createRangeBrush from '../../brushes/rangebrush.js'

//Axis Component - Note this creates two picasso components
var createAxis = function(axisDef, hypercube, scalesDef, theme) {
  var scaleIndex = scalesDef.map(e => e.scalename).indexOf(axisDef.axisscale);

  var titleShow = true;
  var labelShow = true;
  switch (axisDef.axismode) {
    case 'labels':
      titleShow = false;
      labelShow = true;
      break;
    case 'title':
      titleShow = true;
      labelShow = false;
      break;
    case 'both':
      titleShow = true;
      labelShow = true;
      break;
    default:

  }

  if(scaleIndex != -1){
    var axisFieldDef = scalesDef[scaleIndex].scalefield;
    if(axisFieldDef == "") return null;
    var dimMes = axisFieldDef.split("/");


    //Get The Style Settings for the AXIS Title
    var qTheme = theme;
    //Font Size
    var fontSize = '13px';
    try{
      if(!axisDef.axisfontauto){
        if(typeof axisDef.axisfontsize == 'undefined'){
          //Set Nothing
        }else{
          fontSize = axisDef.axisfontsize + "px";
        }
      }else{
        if(qTheme != null) fontSize = qTheme.getStyle('object','axis.title','fontSize');
      }
    }catch(err){
      if(qTheme != null) fontSize = qTheme.getStyle('object','axis.title','fontSize');
    }

    var fontFamily = '"QlikView Sans", sans-serif';

    try{
      if(!axisDef.axisfontauto){
        if(typeof axisDef.axisfontfamily == 'undefined'){
          //Set Nothing
        }else{
          fontFamily = axisDef.axisfontfamily;
        }
      }
    }catch(err){

    }


    var axisTitle = {
      type: 'text',
      /*text: hypercube[dimMes[0]][dimMes[1]].qFallbackTitle,*/
      scale:axisDef.axisscale,
      displayOrder:1,
      show:titleShow,
      style: {
        text: {
          fontSize: fontSize,
          fontFamily: fontFamily
        },
        fill:"#ff0000"
      },
      dock: axisDef.axisdock
    };
    var axis = {
      key: axisDef.axisdock + "_" + axisDef.axisscale,
      type: 'axis',
      scale: axisDef.axisscale,
      dock: axisDef.axisdock,
      show:labelShow,
      displayOrder:0,
      settings: {
        labels: {
          mode: axisDef.axislabelmode,
        }
      },
    };

    if (axisDef.axislabelmode == "tilted") {
      axis.settings.labels.tiltAngle = axisDef.axistiltangle;
    }

    var scroll = {
            key: "scrollbar",
            type: "scrollbar",
            scroll: "dimension",
            dock: axisDef.axisdock,
            displayOrder:2,
            show:true,
            settings: {
              backgroundColor: '#dddddd',
              invert: true
            },
            scroll:{
              min:0,
              max:100,
              viewSize:20
            }
          };

    if(dimMes[0] == "qDimensionInfo"){
      var brush = createRangeBrush(axisDef);
      return [axis, axisTitle, scroll, brush];
    }else{
      return [axis, axisTitle];
    }
  }else{
    return null;
  }
};

export default createAxis;
