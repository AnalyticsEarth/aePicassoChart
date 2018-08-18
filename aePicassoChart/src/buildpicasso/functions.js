var props = null;

var setProps = function(p){
  props = p;
}

var colorForTheme = function(colorPickerObject){
  var theme = props.theme;
  if(theme != null){
    //Use Theme colors
    if(typeof colorPickerObject != 'undefined'){
      if(colorPickerObject.index != -1){
        try{
          if(theme.properties.palettes.ui[0].colors[0] == "none"){
            return theme.properties.palettes.ui[0].colors[colorPickerObject.index];
          }else{
            return theme.properties.palettes.ui[0].colors[(colorPickerObject.index -1)];
          }

        }catch(err){
          return colorPickerObject.color;
        }
      }else{
        return colorPickerObject.color;
      }
    }else{
      return '#000000';
    }


  }else{
    //Backup to whatever is in the picker colors
    if(typeof colorPickerObject != 'undefined'){
      return colorPickerObject.color;
    }else{
      return '#000000';
    }
  }
};

var getThemeStyle = function(p1,p2,p3){
  var theme = props.theme;
  if(theme != null){
    return theme.getStyle(p1,p2,p3);
  }
};

//checkVersionNumbers
var isVersionGreater = function(extVersion, checkVersion){
  //console.log("Check " + extVersion + " >= " + checkVersion);
  if(typeof extVersion == 'undefined') return false;
  var extV = extVersion.split(".");
  var cheV = checkVersion.split(".");
  if(cheV[0] > extV[0]){ //Major Verion greater - false
    return false;
  }else if(cheV[0] == extV[0]){ //Major Versions the same
    if(cheV[1] > extV[1]){ //Minor is greater - false
      return false;
    }else if(cheV[1] == extV[1]){ //Minor is the same
      if(cheV[2] > extV[2]){ //Revision is greater - false
        return false;
      }else if(cheV[2] == extV[2]){ //Revision is the same - true
        return true;
      }else{ //Revision is smaller - true
        return true;
      }
    }else{ //Minor is smaller - true
      return true;
    }
  }else{ //Major is smaller - true
    return true;
  }
  return false;
};

var optionsListForFields = function(hypercube) {
  var list = [];

  hypercube.qDimensionInfo.forEach((d, i) => {
    list.push({
      value: 'qDimensionInfo/' + i,
      label: 'Dim ' + i + ': ' + d.qFallbackTitle
    });
  });
  hypercube.qMeasureInfo.forEach((m, i) => {
    list.push({
      value: 'qMeasureInfo/' + i,
      label: 'Mes ' + i + ': ' + m.qFallbackTitle
    });
  });
  return list;
};

var optionsListForFieldsDef = function(hypercubedef, valueType) {
  var list = [];
  if (valueType <= 1) {
    list.push({
      value: "",
      label: "None"
    });
  }
  hypercubedef.qDimensions.forEach((d, i) => {
    //console.log(d);
    var labelVal = 'Dim ' + i + ': ' + d.qDef.qFieldLabels[d.qDef.qActiveField];
    if (labelVal.trim().slice(-1) == ':') labelVal = 'Dim ' + i + ': ' + d.qDef.qFieldDefs[d.qDef.qActiveField];
    //console.log(labelVal);
    if (labelVal.slice(-9) == 'undefined') labelVal = 'Dimension ' + i;
    var valueVal = 'qDimensionInfo/' + i;
    if (valueType == 1) valueVal = 'd' + i;
    if (valueType == 2) valueVal = i;
    list.push({
      value: valueVal,
      label: labelVal
    });
  });
  hypercubedef.qMeasures.forEach((m, i) => {
    var labelVal = 'Mes ' + i + ': ' + m.qDef.qLabel;
    if (labelVal.trim().slice(-1) == ':') labelVal = 'Mes ' + i + ': ' + m.qDef.qDef;
    //console.log(labelVal);
    if (labelVal.trim().slice(-1) == ':') labelVal = 'Measure ' + i;
    var valueVal = 'qMeasureInfo/' + i;
    if (valueType == 1) valueVal = 'm' + i;
    list.push({
      value: valueVal,
      label: labelVal
    });
  });
  return list;
}

var optionsListForDimensionsDef = function(hypercubedef, valueType) {
  var list = [];
  hypercubedef.qDimensions.forEach((d, i) => {
    var labelVal = 'Dim ' + i + ': ' + d.qDef.qFieldLabels[d.qDef.qActiveField];
    if (labelVal == '') labelVal = 'Dim ' + i + ': ' + d.qDef.qFieldDefs[d.qDef.qActiveField];
    if (typeof labelVal == 'undefined') labelVal = 'Dimension ' + i;
    var valueVal = 'qDimensionInfo/' + i;
    if (valueType == 1) valueVal = 'd' + i;
    if (valueType == 2) valueVal = i;
    list.push({
      value: valueVal,
      label: labelVal
    });
  });
  return list;
}

var optionsListForScales = function(scalesDef, valueType) {
  var list = [];
  if (valueType == 1) {
    list.push({
      value: "",
      label: "None"
    });
  }
  scalesDef.forEach((s) => {
    list.push({
      value: s.scalename,
      label: s.scalename
    });
  });
  return list;
};

export {props, setProps, colorForTheme, getThemeStyle, isVersionGreater, optionsListForFields, optionsListForFieldsDef, optionsListForDimensionsDef, optionsListForScales};
