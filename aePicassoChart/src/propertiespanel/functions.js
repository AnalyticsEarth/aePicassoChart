import propertySettings from './propertysettings/index.js';

var showForProperty = function(props, prop) {
  var p = propertySettings[props.layertype][prop];
  //console.log(p);
  if (typeof p == 'undefined') {
    return false;
  } else {
    //console.log(props);
    return ~p.show.values.indexOf(props[p.show.field]);
  }
}

var labelForProperty = function(props, prop) {
  //console.log(props);
  //console.log(prop);
  var label = propertySettings[props.layertype][prop]["label"];
  //console.log(label);
  if (typeof label != 'undefined') {
    return label;
  } else {
    return "LABEL ERROR";
  }
};

var objForConditionalProp = function(ref, type, component, incValueLabel, props) {
  var o = {
    type,
    ref,
    label: (a) => {
      return labelForProperty(a, ref)
    },
    show: (a) => {
      return showForProperty(a, ref)
    },
  };
  if (component !== null) o.component = component;
  if (props !== null) {
    Object.keys(props).forEach(x => {
      o[x] = props[x];
    });
  }
  return o;
};

var objForProp = function(ref, type, component, incValueLabel, props) {
  var o = {
    type,
    ref,
  };
  if (component !== null) o.component = component;
  if (props !== null) {
    Object.keys(props).forEach(x => {
      o[x] = props[x];
    });
  }
  return o;
};

export {showForProperty, labelForProperty, objForConditionalProp, objForProp};
