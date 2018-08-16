define(['./buildpicasso'], function(bp) {



  var propertySettings = {
    line: {
      linetype: {
        show: {
          field: "layertype",
          values: ["line"]
        }
      },
      layerscale1: {
        label: "Major Axis Scale",
        show: {
          field: "linetype",
          values: ["line", "area", "rangearea"]
        }
      },
      layerscale2: {
        label: "Minor Axis Scale",
        show: {
          field: "linetype",
          values: ["line", "area", "rangearea"]
        }
      },
      layerfield1: {
        label: "Major Axis Field",
        show: {
          field: "linetype",
          values: ["line", "area", "rangearea"]
        }
      },
      layerfield2: {
        label: "Line Field",
        show: {
          field: "linetype",
          values: ["line", "area", "rangearea"]
        }
      },
      layerfield3: {
        label: "Lower Line Field",
        show: {
          field: "linetype",
          values: ["rangearea"]
        }
      },
      primarycolor: {
        label: "Line Color",
        show: {
          field: "layertype",
          values: ["line"]
        }
      },
      primarywidth: {
        label: "Line Width",
        show: {
          field: "layertype",
          values: ["line"]
        }
      },
      primaryopacity: {
        label: "Line Opacity",
        show: {
          field: "layertype",
          values: ["line"]
        }
      },
      primarydashpattern: {
        label: "Line Dash Pattern",
        show: {
          field: "layertype",
          values: ["line"]
        }
      },
      secondarycolor: {
        label: "Fill Color",
        show: {
          field: "linetype",
          values: ["area", "rangearea"]
        }
      },
      secondaryopacity: {
        label: "Fill Opacity",
        show: {
          field: "linetype",
          values: ["area", "rangearea"]
        }
      },
    },
    point: {
      layerscale1: {
        label: "X Axis Scale",
        show: {
          field: "layertype",
          values: ["point"]
        }
      },
      layerscale2: {
        label: "Y Axis Scale",
        show: {
          field: "layertype",
          values: ["point"]
        }
      },
      layerscale3: {
        label: "Color Scale",
        show: {
          field: "layertype",
          values: ["point"]
        }
      },
      layerscale4: {
        label: "Size Scale",
        show: {
          field: "layertype",
          values: ["point"]
        }
      },
      layerfield1: {
        label: "X Axis Field",
        show: {
          field: "layertype",
          values: ["point"]
        }
      },
      layerfield2: {
        label: "Y Axis Field",
        show: {
          field: "layertype",
          values: ["point"]
        }
      },
      layerfield3: {
        label: "Color Field",
        show: {
          field: "layertype",
          values: ["point"]
        }
      },
      layerfield4: {
        label: "Size Field",
        show: {
          field: "layertype",
          values: ["point"]
        }
      },
      primarycolor: {
        label: "Outline Color",
        show: {
          field: "layertype",
          values: ["point"]
        }
      },
      primarywidth: {
        label: "Outline Width",
        show: {
          field: "layertype",
          values: ["point"]
        }
      },
      primaryopacity: {
        label: "Opacity",
        show: {
          field: "layertype",
          values: ["point"]
        }
      },
      secondarycolor: {
        label: "Fill Color",
        show: {
          field: "layertype",
          values: ["point"]
        }
      },
    },
    box: {
      boxtype: {
        show: {
          field: "layertype",
          values: ["box"]
        }
      },
      layerscale1: {
        label: "Major Scale (Dimension)",
        show: {
          field: "layertype",
          values: ["box"]
        }
      },
      layerscale2: {
        label: "Minor Scale (Measure)",
        show: {
          field: "layertype",
          values: ["box"]
        }
      },
      layerscale7: {
        label: "Color Scale",
        show: {
          field: "layertype",
          values: ["box"]
        }
      },
      layerfield1: {
        label: "X Axis Field",
        show: {
          field: "layertype",
          values: ["box"]
        }
      },
      layerfield2: {
        label: "Start Field",
        show: {
          field: "boxtype",
          values: ["box", "whisker"]
        }
      },
      layerfield3: {
        label: "End Field",
        show: {
          field: "boxtype",
          values: ["bar", "box", "whisker"]
        }
      },
      layerfield4: {
        label: "Min Field",
        show: {
          field: "boxtype",
          values: ["whisker"]
        }
      },
      layerfield5: {
        label: "Max Field",
        show: {
          field: "boxtype",
          values: ["whisker"]
        }
      },
      layerfield6: {
        label: "Median Field",
        show: {
          field: "boxtype",
          values: ["box", "whisker"]
        }
      },
      layerfield7: {
        label: "Color Field",
        show: {
          field: "layertype",
          values: ["box"]
        }
      },
      primarycolor: {
        label: "Box Outline Color",
        show: {
          field: "layertype",
          values: ["box"]
        }
      },
      primarywidth: {
        label: "Box Outline Width",
        show: {
          field: "layertype",
          values: ["box"]
        }
      },
      primaryopacity: {
        label: "Opacity",
        show: {
          field: "layertype",
          values: ["point"]
        }
      },
      secondarycolor: {
        label: "Box Fill Color",
        show: {
          field: "layertype",
          values: ["box"]
        }
      },
      thirdcolor: {
        label: "Line Color",
        show: {
          field: "boxtype",
          values: ["whisker"]
        }
      },
      thirdwidth: {
        label: "Line Width",
        show: {
          field: "boxtype",
          values: ["whisker"]
        }
      },
      forthcolor: {
        label: "Whisker Color",
        show: {
          field: "boxtype",
          values: ["whisker"]
        }
      },
      forthwidth: {
        label: "Whisker Width",
        show: {
          field: "boxtype",
          values: ["whisker"]
        }
      },
      fifthcolor: {
        label: "Median Line Color",
        show: {
          field: "boxtype",
          values: ["whisker"]
        }
      },
      fifthwidth: {
        label: "Median Line Width",
        show: {
          field: "boxtype",
          values: ["whisker"]
        }
      },
      orientation: {
        label: "Orientation",
        show: {
          field: "layertype",
          values: ["box"]
        }
      },
      objectwidth: {
        label: "Bar Width",
        show: {
          field: "layertype",
          values: ["box"]
        }
      },
      objectoffset: {
        label: "Bar Offset",
        show: {
          field: "layertype",
          values: ["box"]
        }
      },
    },
    grid: {
      layerscale1: {
        label: "X Scale",
        show: {
          field: "layertype",
          values: ["grid"]
        }
      },
      layerscale2: {
        label: "Y Scale",
        show: {
          field: "layertype",
          values: ["grid"]
        }
      },
      primarycolor: {
        label: "Major Tick Color",
        show: {
          field: "layertype",
          values: ["grid"]
        }
      },
      primarywidth: {
        label: "Major Tick Width",
        show: {
          field: "layertype",
          values: ["grid"]
        }
      },

      secondarycolor: {
        label: "Minor Tick Color",
        show: {
          field: "layertype",
          values: ["grid"]
        }
      },
      secondarywidth: {
        label: "Minor Tick Width",
        show: {
          field: "layertype",
          values: ["grid"]
        }
      },

    },
    pie: {
      layerfield1: {
        label: "Arc Size Field",
        show: {
          field: "layertype",
          values: ["pie"]
        }
      },
      layerscale2: {
        label: "Color Scale",
        show: {
          field: "layertype",
          values: ["pie"]
        }
      },
      primarycolor: {
        label: "Stroke Color",
        show: {
          field: "layertype",
          values: ["pie"]
        }
      },
      primarywidth: {
        label: "Stroke Width",
        show: {
          field: "layertype",
          values: ["pie"]
        }
      },
      primaryopacity: {
        label: "Opacity",
        show: {
          field: "layertype",
          values: ["pie"]
        }
      },
    }
  }

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


  var layeritems = {
    itemgroups: {
      type: "items",
      grouped: true,
      items: {
        core: {
          type: "items",
          items: {
            layertype: {
              type: "string",
              component: "dropdown",
              ref: "layertype",
              label: "Layer Type",
              options: [{
                  value: "line",
                  label: "Line & Area"
                },
                {
                  value: "point",
                  label: "Point"
                },
                {
                  value: "box",
                  label: "Box"
                },
                {
                  value: "pie",
                  label: "Pie"
                },
                {
                  value: "grid",
                  label: "Grid"
                }
              ],
              change: (a) => {
                console.log("Changed to Layer Type: ");
                console.log(a);
              }
            },
            layername: {
              type: "string",
              ref: "layername",
              label: "Layer Name",
            },
            layershow: {
              type: "boolean",
              ref: "layershow",
              label: "Show Layer",
              defaultValue: true,
            },
            legshow: {
              type: "boolean",
              ref: "legshow",
              label: "Show In Legend",
              show:(y) => { return !~["pie","grid"].indexOf(y.layertype); }, //Not for pie and grid
              defaultValue: true
            },
            layertitle: {
              type: "string",
              ref: "layertitle",
              label: "Layer Title",
              expression:"optional"
            },
            linetype: {
              type: "string",
              component: "dropdown",
              ref: "linetype",
              label: "Line Type",
              options: [{
                  value: "line",
                  label: "Single Line"
                },
                {
                  value: "area",
                  label: "Area"
                },
                {
                  value: "rangearea",
                  label: "Range Area"
                }
              ],
              show: (a) => {
                return showForProperty(a, "linetype")
              },
            },
            boxtype: {
              type: "string",
              component: "dropdown",
              ref: "boxtype",
              label: "Box Type",
              options: [{
                  value: "bar",
                  label: "Bar"
                },
                {
                  value: "box",
                  label: "Box"
                },
                {
                  value: "whisker",
                  label: "Box with Whiskers"
                }
              ],
              show: (a) => {
                return showForProperty(a, "boxtype")
              },
            },
            layerscale1: objForConditionalProp("layerscale1", "string", "dropdown", false, {
              options: (x, y) => {
                return bp.optionsListForScales(y.properties.picassoprops.scalesDef, 1);
              }
            }),
            layerfield1: objForConditionalProp("layerfield1", "string", "dropdown", false, {
              options: (x, y) => {
                return bp.optionsListForFieldsDef(y.properties.qHyperCubeDef, 1);
              }
            }),
            layerscale2: objForConditionalProp("layerscale2", "string", "dropdown", false, {
              options: (x, y) => {
                return bp.optionsListForScales(y.properties.picassoprops.scalesDef, 1);
              }
            }),
            layerfield2: objForConditionalProp("layerfield2", "string", "dropdown", false, {
              options: (x, y) => {
                return bp.optionsListForFieldsDef(y.properties.qHyperCubeDef, 1);
              }
            }),
            layerscale3: objForConditionalProp("layerscale3", "string", "dropdown", false, {
              options: (x, y) => {
                return bp.optionsListForScales(y.properties.picassoprops.scalesDef, 1);
              }
            }),
            layerfield3: objForConditionalProp("layerfield3", "string", "dropdown", false, {
              options: (x, y) => {
                return bp.optionsListForFieldsDef(y.properties.qHyperCubeDef, 1);
              }
            }),
            layerscale4: objForConditionalProp("layerscale4", "string", "dropdown", false, {
              options: (x, y) => {
                return bp.optionsListForScales(y.properties.picassoprops.scalesDef, 1);
              }
            }),
            layerfield4: objForConditionalProp("layerfield4", "string", "dropdown", false, {
              options: (x, y) => {
                return bp.optionsListForFieldsDef(y.properties.qHyperCubeDef, 1);
              }
            }),
            layerscale5: objForConditionalProp("layerscale5", "string", "dropdown", false, {
              options: (x, y) => {
                return bp.optionsListForScales(y.properties.picassoprops.scalesDef, 1);
              }
            }),
            layerfield5: objForConditionalProp("layerfield5", "string", "dropdown", false, {
              options: (x, y) => {
                return bp.optionsListForFieldsDef(y.properties.qHyperCubeDef, 1);
              }
            }),
            layerscale6: objForConditionalProp("layerscale6", "string", "dropdown", false, {
              options: (x, y) => {
                return bp.optionsListForScales(y.properties.picassoprops.scalesDef, 1);
              }
            }),
            layerfield6: objForConditionalProp("layerfield6", "string", "dropdown", false, {
              options: (x, y) => {
                return bp.optionsListForFieldsDef(y.properties.qHyperCubeDef, 1);
              }
            }),
            layerscale7: objForConditionalProp("layerscale7", "string", "dropdown", false, {
              options: (x, y) => {
                return bp.optionsListForScales(y.properties.picassoprops.scalesDef, 1);
              }
            }),
            layerfield7: objForConditionalProp("layerfield7", "string", "dropdown", false, {
              options: (x, y) => {
                return bp.optionsListForFieldsDef(y.properties.qHyperCubeDef, 1);
              }
            }),
            orientation: objForConditionalProp("orientation", "string", "dropdown", true, {
              defaultValue: "vertical",
              options: [{
                value: "vertical",
                label: "Vertical"
              }, {
                value: "horizontal",
                label: "Horizontal"
              }]
            }),
          }
        },
        presentation: { //This will be shown inline but can be controlled as a group with a toggle
          type: "items",
          items: {
            showpresentation: {
              type: "boolean",
              component: "switch",
              label: "Presentation",
              ref: "showpresentation",
              defaultValue: true,
              options: [{
                  value: false,
                  label: "Custom"
                },
                {
                  value: true,
                  label: "Auto"
                },
              ]
            },
            presentationitems: {
              type: "items",
              show: (a) => {
                return !a.showpresentation
              },
              items: {
                layercurve: {
                  type: "string",
                  component: "dropdown",
                  ref: "layercurve",
                  label: "Curve",
                  defaultValue: "linear",
                  options: [{
                      value: "linear",
                      label: "Linear"
                    },
                    {
                      value: "monotone",
                      label: "Monotone"
                    },
                    {
                      value: "step",
                      label: "Step"
                    },
                    {
                      value: "stepAfter",
                      label: "Step After"
                    },
                    {
                      value: "stepBefore",
                      label: "Step Before"
                    },
                    {
                      value: "basis",
                      label: "Basis"
                    },
                    {
                      value: "cardinal",
                      label: "Cardinal"
                    },
                    {
                      value: "catmullRom",
                      label: "CutmullRom"
                    },
                    {
                      value: "natural",
                      label: "Natural"
                    },
                  ],
                  show: (a) => {
                    return a.layertype == "line";
                  }
                },
                primarycolor: objForConditionalProp("primarycolor", "object", "color-picker", false, {
                  dualOutput: true,
                  defaultValue: {
                    index: 3,
                  }
                }),
                primarywidth: objForConditionalProp("primarywidth", "number", "slider", true, {
                  defaultValue: 1,
                  min: 0,
                  max: 5,
                  step: 1
                }),
                primaryopacity: objForConditionalProp("primaryopacity", "number", "slider", true, {
                  defaultValue: 1,
                  min: 0,
                  max: 1,
                  step: 0.01
                }),
                primarydashpattern: objForConditionalProp("primarydashpattern", "string", null, true, null),

                secondarycolor: objForConditionalProp("secondarycolor", "object", "color-picker", false, {
                  dualOutput: true,
                  defaultValue: {
                    index: 3,
                  }
                }),
                secondarywidth: objForConditionalProp("secondarywidth", "number", "slider", true, {
                  defaultValue: 1,
                  min: 0,
                  max: 5,
                  step: 1
                }),
                secondaryopacity: objForConditionalProp("secondaryopacity", "number", "slider", true, {
                  defaultValue: 1,
                  min: 0,
                  max: 1,
                  step: 0.01
                }),

                thirdcolor: objForConditionalProp("thirdcolor", "object", "color-picker", false, {
                  dualOutput: true,
                  defaultValue: {
                    index: 3,
                  }
                }),
                thirdwidth: objForConditionalProp("thirdwidth", "number", "slider", true, {
                  defaultValue: 1,
                  min: 0,
                  max: 5,
                  step: 1
                }),

                forthcolor: objForConditionalProp("forthcolor", "object", "color-picker", false, {
                  dualOutput: true,
                  defaultValue: {
                    index: 3,
                  }
                }),
                forthwidth: objForConditionalProp("forthwidth", "number", "slider", true, {
                  defaultValue: 1,
                  min: 0,
                  max: 5,
                  step: 1
                }),

                fifthcolor: objForConditionalProp("fifthcolor", "object", "color-picker", false, {
                  dualOutput: true,
                  defaultValue: {
                    index: 3,
                  }
                }),
                fifthwidth: objForConditionalProp("fifthwidth", "number", "slider", true, {
                  defaultValue: 1,
                  min: 0,
                  max: 5,
                  step: 1
                }),
                objectwidth: objForConditionalProp("objectwidth", "number", "slider", true, {
                  defaultValue: 1,
                  min: 0,
                  max: 1,
                  step: 0.1
                }),
                objectoffset: objForConditionalProp("objectoffset", "number", "slider", true, {
                  defaultValue: 0.5,
                  min: 0,
                  max: 1,
                  step: 0.1
                }),
              }
            }
          }
        },
        pointtype: { //This will be shown inline but can be controlled as a group with a toggle
          type: "items",
          show: (a) => {
            return a.layertype == "point";
          },
          items: {
            showpointtype: {
              type: "boolean",
              component: "switch",
              label: "Point Type",
              ref: "showpointtype",
              defaultValue: true,
              options: [{
                  value: false,
                  label: "Custom"
                },
                {
                  value: true,
                  label: "Auto"
                },
              ]
            },
            pointtypeitems: {
              type: "items",
              show: (a) => {
                return !a.showpointtype
              },
              items: {
                pointshape: {
                  type: "string",
                  component: "dropdown",
                  ref: "pointshape",
                  label: "Shape",
                  defaultValue: "circle",
                  options: [{
                      value: "circle",
                      label: "Circle"
                    },
                    {
                      value: "square",
                      label: "Square"
                    },
                    {
                      value: "cross",
                      label: "Cross"
                    },
                    {
                      value: "diamond",
                      label: "Diamond"
                    },
                    {
                      value: "star",
                      label: "Star"
                    },
                    {
                      value: "triangle",
                      label: "Triangle"
                    }
                  ]
                },
                pointsize: {
                  type: "number",
                  component: "slider",
                  ref: "pointsize",
                  label: "Point Size",
                  defaultValue: 1,
                  min: 0.1,
                  max: 1,
                  step: 0.1
                }
              }
            }
          }
        },
        gridsettings: { //This will be shown inline but can be controlled as a group with a toggle
          type: "items",
          show: (a) => {
            return a.layertype == "grid";
          },
          items: {
            gridx: {
              type: "boolean",
              ref: "showgridx",
              label: "Show X Grid Lines",
              defaultValue: true
            },
            gridy: {
              type: "boolean",
              ref: "showgridy",
              label: "Show Y Grid Lines",
              defaultValue: true
            },
            gridtickx: {
              type: "boolean",
              ref: "showgridtickmajor",
              label: "Show Major Grid Ticks",
              defaultValue: true
            },
            gridticky: {
              type: "boolean",
              ref: "showgridtickminor",
              label: "Show Minor Grid Ticks",
              defaultValue: true
            },
          }
        },
        piesettings: { //This will be shown inline but can be controlled as a group with a toggle
          type: "items",
          show: (a) => {
            return a.layertype == "pie";
          },
          items: {
            piepadangle: {
              type: "number",
              component:"slider",
              ref: "piepadangle",
              label: "Pad Angle",
              defaultValue: 0,
              min:0,
              max:0.05,
              step:0.01
            },
            pieouterradius: {
              type: "number",
              component:"slider",
              ref: "pieouterradius",
              label: "Outer Radius",
              defaultValue: 1,
              min:0,
              max:1,
              step:0.1
            },
            pieinnerradius: {
              type: "number",
              component:"slider",
              ref: "pieinnerradius",
              label: "Inner Radius",
              defaultValue: 0,
              min:0,
              max:1,
              step:0.1
            },
            piecornerradius: {
              type: "number",
              component:"slider",
              ref: "piecornerradius",
              label: "Corner Radius",
              defaultValue: 0,
              min:0,
              max:20,
              step:1
            },
          }
        },
        labelsettings: { //This will be shown inline but can be controlled as a group with a toggle
          type: "items",
          show: (a) => {
            return ~["box"].indexOf(a.layertype);
          },
          items: {
            showlabels: {
              type: "boolean",
              ref: "labelshow",
              label: "Show Labels",
              defaultValue: false
            },
            labelsize: {
              type: "number",
              component:"slider",
              ref: "labelsize",
              label: "Text Size",
              defaultValue: 13,
              min:8,
              max:30,
              step:1
            },
            intocolor: { //Pie Only
              type: "object",
              show:(x) => {
                return x.layertype == "pie"
              },
              component:"color-picker",
              ref: "labelintocolor",
              label: "Into - Fill Color",
              dualOutput: true,
              defaultValue:{
                index:2,
                color:'#545352'
              }
            },
            insidejustify: {
              show:(x) => {
                return ~["box", "point"].indexOf(x.layertype)
              },
              type: "number",
              component:"slider",
              ref: "labelinsidejustify",
              label: "Inside - Justify",
              defaultValue: 0.5,
              min:0,
              max:1,
              step:0.01
            },
            insidealign: {
              show:(x) => {
                return ~["box", "point"].indexOf(x.layertype)
              },
              type: "number",
              component:"slider",
              ref: "labelinsidealign",
              label: "Inside - Align",
              defaultValue: 0.5,
              min:0,
              max:1,
              step:0.01
            },
            insidecolor: {
              type: "object",
              component:"color-picker",
              ref: "labelinsidecolor",
              label: "Inside - Fill Color",
              dualOutput: true,
              defaultValue:{
                index:10,
                color:'#ffffff'
              }
            },
            outsidejustify: {
              show:(x) => {
                return ~["box", "point"].indexOf(x.layertype)
              },
              type: "number",
              component:"slider",
              ref: "labeloutsidejustify",
              label: "Outside - Justify",
              defaultValue: 0.5,
              min:0,
              max:1,
              step:0.01
            },
            outsidealign: {
              show:(x) => {
                return ~["box", "point"].indexOf(x.layertype)
              },
              type: "number",
              component:"slider",
              ref: "labeloutsidealign",
              label: "Outside - Align",
              defaultValue: 0.5,
              min:0,
              max:1,
              step:0.01
            },
            outsidecolor: {
              type: "object",
              component:"color-picker",
              ref: "labeloutsidecolor",
              label: "Outside - Fill Color",
              dualOutput: true,
              defaultValue:{
                index:2,
                color:'#545352'
              }
            },
            oppositejustify: {
              show:(x) => {
                return ~["box", "point"].indexOf(x.layertype)
              },
              type: "number",
              component:"slider",
              ref: "labeloppositejustify",
              label: "Opposite - Justify",
              defaultValue: 0.5,
              min:0,
              max:1,
              step:0.01
            },
            oppositealign: {
              show:(x) => {
                return ~["box", "point"].indexOf(x.layertype)
              },
              type: "number",
              component:"slider",
              ref: "labeloppositealign",
              label: "Opposite - Align",
              defaultValue: 0.5,
              min:0,
              max:1,
              step:0.01
            },
            oppositecolor: {
              show:(x) => {
                return ~["box", "point"].indexOf(x.layertype)
              },
              type: "object",
              component:"color-picker",
              ref: "labeloppositecolor",
              label: "Opposite - Fill Color",
              dualOutput: true,
              defaultValue:{
                index:2,
                color:'#545352'
              }
            },
          }
        },
      }
    }
    //}
  };

  return {
    type: "items",
    component: "accordion",
    items: {
      data: {
        uses: "data",
        items: {
          dimensions: {
            min: 1
          },
          measures: {
            min: 1,
          },
        }
      },
      templates: {
        type: "items",
        label: "Chart Templates",
        items: {
          templatepick: {
            type: "string",
            component: "item-selection-list",
            icon: "true",
            horizontal: "true",
            ref: "picassoprops.loadtemplate",
            defaultValue: "custom",
            items: [{
                value: "custom",
                component: "icon-item",
                labelPlacement: "bottom",
                icon: "@",
                label: "Custom"
              },
              {
                value: "bar",
                component: "icon-item",
                labelPlacement: "bottom",
                icon: "6",
                label: "Bar"
              },
              {
                value: "line",
                component: "icon-item",
                icon: "%",
                labelPlacement: "bottom",
                label: "Line"
              },
              {
                value: "scatter",
                component: "icon-item",
                icon: "+",
                labelPlacement: "bottom",
                label: "Scatter"
              },
              {
                value: "bubble-grid",
                component: "icon-item",
                icon: "_",
                labelPlacement: "bottom",
                label: "Bubble Grid"
              },
          /*    {
                value: "area",
                component: "icon-item",
                icon: "ø",
                labelPlacement: "bottom",
                label: "Area"
              },
              {
                value: "combo",
                component: "icon-item",
                icon: "˛",
                labelPlacement: "bottom",
                label: "Combo"
              }*/
            ],
            change: (x, y) => {
              console.log(x.picassoprops.loadtemplate);
              bp.importChart(x.picassoprops.loadtemplate, x.picassoprops, true);
            },
            show: (x, y) => {
              if (y.layout.picassoprops.componentsDef.length > 0 || y.layout.picassoprops.scalesDef.length > 0) {
                return false;
              } else {
                return true;
              }
            }
          },
          hidemessage: {
            type: "string",
            component: "text",
            label: "You can only load a template in an empty visualisation, create a new object or remove all Scales, Docked Items and Layers",
            show: (x, y) => {
              if (y.layout.picassoprops.componentsDef.length > 0 || y.layout.picassoprops.scalesDef.length > 0) {
                return true;
              } else {
                return false;
              }
            }
          },
          export: {
            type: "string",
            component: "button",
            label: "Export Current Chart Spec",
            show: (x) => {return x.picassoprops.enableexp},
            action: (x) => {
              console.log(x);
              bp.exportChart(x.picassoprops);
            }
          }
        },
      },
      picasso: {
        label: "Picasso Axis & Scales",
        component: "expandable-items",
        items: {
          scales: {
            type: "array",
            ref: "picassoprops.scalesDef",
            label: "Scales",
            itemTitleRef: "scalename",
            allowAdd: true,
            allowRemove: true,
            addTranslation: "Add Scale",
            items: {
              scalename: {
                type: "string",
                ref: "scalename",
                label: "Name",
              },
              scalefield: {
                type: "string",
                component: "dropdown",
                ref: "scalefield",
                label: "Field 1",
                options: (x, y) => {
                  return bp.optionsListForFieldsDef(y.properties.qHyperCubeDef, 0);
                }
              },
              scalefield2: {
                type: "string",
                component: "dropdown",
                ref: "scalefield2",
                label: "Field 2",
                show:(x) => {
                  return ((x.scalefield != "") && (typeof x.scalefield != "undefined"));
                },
                options: (x, y) => {
                  return bp.optionsListForFieldsDef(y.properties.qHyperCubeDef, 0); //TODO: Hide the fields already selected
                }
              },
              scalefield3: {
                type: "string",
                component: "dropdown",
                ref: "scalefield3",
                label: "Field 3",
                show:(x) => {
                  return (((x.scalefield != "") && (typeof x.scalefield != "undefined")) && ((x.scalefield2 != "") && (typeof x.scalefield2 != "undefined")));
                },
                options: (x, y) => {
                  return bp.optionsListForFieldsDef(y.properties.qHyperCubeDef, 0);
                }
              },
              scaleinvert: {
                type: "boolean",
                ref: "scaleinvert",
                label: "Invert",
                defaultValue: false
              },
              scaletype: {
                type: "string",
                component: "dropdown",
                ref: "scaletype",
                label: "Type",
                options: [{
                    value: "",
                    label: "Default"
                  },
                  {
                    value: "linear",
                    label: "Linear"
                  },
                  {
                    value: "ordinal",
                    label: "Ordinal"
                  },
                  {
                    value: "color",
                    label: "Color"
                  },
                  {
                    value: "categorical-color",
                    label: "Categorical Color"
                  }
                ],
                defaultValue: ""
              },
              scaleinclude: {
                type: "string",
                ref: "scaleinclude",
                label: "Include Values (sep with ,)",
                defaultValue: '',
                show: (x) => {
                  return (x.scalefield.split("/")[0] == "qMeasureInfo")
                }
              },
              scaleexpand: {
                type: "number",
                ref: "scaleexpand",
                label: "Expand Scale",
                defaultValue: 0,
                show: (x) => {
                  return (x.scalefield.split("/")[0] == "qMeasureInfo")
                }
              },
              scalepadding: {
                type: "number",
                component: "slider",
                ref: "scalepadding",
                label: "Padding",
                defaultValue: 0,
                min: 0,
                max: 1,
                step: 0.01,
                show: (x) => {
                  return (x.scalefield.split("/")[0] == "qDimensionInfo")
                }
              },

            }
          },
          axis: {
            type: "array",
            ref: "picassoprops.componentsDef.axis",
            label: "Docked Items",
            itemTitleRef: "axisdock", //This should include the scale as well for dual placed scales? will this even work?
            allowAdd: true,
            allowRemove: true,
            addTranslation: "Add Docked Item",
            items: {
              axistype: {
                type: "string",
                component: "buttongroup",
                label: "Docked Item Type",
                ref: "dockeditemtype",
                defaultValue: "axis",
                options: [{
                  value: "axis",
                  label: "Axis",
                  tooltip: "Select for Axis"
                }, {
                  value: "legend",
                  label: "Legend",
                  tooltip: "Select for Legend"
                }],
              },
              dockgroup: {
                type: "items",
                show: (a) => {
                  return (a.dockeditemtype == 'legend');
                },
                items: {
                  legtype: {
                    type: "string",
                    component: "buttongroup",
                    label: "Legend Type",
                    ref: "legendtype",
                    defaultValue: "legend-cat",
                    options: [{
                      value: "legend-layer",
                      label: "Layers",
                      tooltip: "Categorical Legend for All Layers"
                    },{
                      value: "legend-cat",
                      label: "Cat",
                      tooltip: "Categorical Legend"
                    }, {
                      value: "legend-seq",
                      label: "Seq",
                      tooltip: "Sequential Legend"
                    }],
                  },
                  axisscale: objForProp("colorscale", "string", "dropdown", false, {
                    label: "Color Scale",
                    show: (x) => {
                      return x.legendtype != 'legend-layer';
                    },
                    options: (x, y) => {
                      return bp.optionsListForScales(y.properties.picassoprops.scalesDef, 0);
                    }
                  }),
                  legtitle: objForProp("legtitle", "string", null, false, {
                    label: "Legend Title",
                    show: (x) => {
                      return x.dockeditemtype == 'legend';
                    },
                  }),
                }
              },
              axisgroup: {
                type: "items",
                show: (a) => {
                  return (a.dockeditemtype == 'axis');
                },
                items: {
                  axisscale: objForProp("axisscale", "string", "dropdown", false, {
                    label: "Scale",
                    options: (x, y) => {
                      return bp.optionsListForScales(y.properties.picassoprops.scalesDef, 0);
                    }
                  }),
                  axismode:{
                    type: "string",
                    component: "dropdown",
                    ref: "axismode",
                    label: "Axis Mode",
                    options: [
                      {
                        value: "labels",
                        label: "Labels"
                      },
                      {
                        value: "title",
                        label: "Title"
                      },
                      {
                        value: "both",
                        label: "Both"
                      },
                    ],
                    defaultValue: "both"
                  },
                  axislabelmode: {
                    type: "string",
                    component: "dropdown",
                    ref: "axislabelmode",
                    label: "Label Mode",
                    options: [{
                        value: "auto",
                        label: "Auto"
                      },
                      {
                        value: "horizontal",
                        label: "Horizontal"
                      },
                      {
                        value: "tilted",
                        label: "Tilted"
                      },
                      {
                        value: "layered",
                        label: "Layered"
                      },
                    ],
                    defaultValue: "auto"
                  },
                  axistiltangle: {
                    type: "number",
                    component: "slider",
                    label: "Label Tilt Angle",
                    ref: "axistiltangle",
                    defaultValue: 0,
                    min: -90,
                    max: 90,
                    step: 5,
                    show: (a) => {
                      return (a.axislabelmode == 'tilted');
                    }
                  },
                }
              },
              axisdock: {
                type: "string",
                component: "dropdown",
                ref: "axisdock",
                label: "Dock",
                options: [{
                    value: "left",
                    label: "Left"
                  },
                  {
                    value: "right",
                    label: "Right"
                  },
                  {
                    value: "top",
                    label: "Top"
                  },
                  {
                    value: "bottom",
                    label: "Bottom"
                  }
                ],
                defaultValue: "left"
              },
            }
          },
        }
      },
      picassolayers: {
        type: "array",
        ref: "picassoprops.componentsDef.layers",
        label: "Picasso Layers",
        itemTitleRef: (a) => {
          return a.layertype + ": " + a.layername;
        }, //Need to lookup the layer type label from globally accessible option list
        allowAdd: true,
        allowRemove: true,
        addTranslation: "Add Layer",
        items: layeritems
      },
      sorting: {
        uses: "sorting"
      },
      addons: {
        uses:"addons",
        items:{
          datahandling:{
            uses: "dataHandling",
            items:{
              suppressZero: {
                ref: "qHyperCubeDef.qSuppressZero",
              },
              calcCond: {
                uses: "calcCond",
                ref: "qHyperCubeDef"
              },
            }
          },
          refLines: {
            uses: "reflines",
            show:false,
            ref:"picassoprops.reflines",
            items:{
              test:{
                type:"string",
                component:"dropdown",
                ref:"test",
                label:"Axis",
                options: (d,e) => {return e.properties.picassoprops.componentsDef.axis.filter(item => item.dockeditemtype == 'axis').map((item,index) => {return {value:"axis_"+index, label:item.axisscale + " (" + item.axisdock + ")"}});}
              }
            }
          },
          hypercubeSize:{
            label: "Hypercube Size",
            type:"items",
            items:{
              content:{
                type:"items",
                show: (d) => {
                  var vc = bp.isVersionGreater(d.createdVersion,"0.2.2");
                  return vc;
                },
                items:{
                  hqlimit:{
                    type:"boolean",
                    ref:"picassoprops.cube.limit",
                    label:"Limit Cube Size",
                    defaultValue:false
                  },
                  hqtop:{
                    type:"number",
                    ref:"picassoprops.cube.top",
                    label:"Top",
                    defaultValue:0
                  },
                  hqleft:{
                    type:"number",
                    ref:"picassoprops.cube.left",
                    label:"Left",
                    defaultValue:0
                  },
                  hqwidth:{
                    type:"number",
                    ref:"picassoprops.cube.width",
                    label:"Width",
                    defaultValue:0
                  },
                  hqheight:{
                    type:"number",
                    ref:"picassoprops.cube.height",
                    label:"Height",
                    defaultValue:0
                  },
                }
              },
              info:{
                type:"string",
                component:"text",
                label:"These settings will only work on a new charts created after version 0.2.2",
                show: (d) => {
                  var vc = bp.isVersionGreater(d.createdVersion,"0.2.2");
                  return !vc;
                }
              },
            }
          }
        }
			},
      appearance: {
        uses: "settings",
      },
      about: {
        type: "items",
        label: "About",
        items: {
          about1:{
            type:"string",
            component:"text",
            label:"Steven Pressland 2018"
          },
          about1a:{
            type:"string",
            component:"text",
            label:"BETA: v0.2.3"
          },
          about2:{
            type:"string",
            component:"text",
            label:"GitHub: www.github.com/analyticsearth"
          },
          about3:{
            type:"string",
            component:"text",
            label:"Picasso Designer is an extension to aid building complex charts based on the Picasso.JS library without having to write any code or understand the picasso JSON structure. The extension also provides support for selections against the chart for the expected user experience in Qlik Sense."
          },
          about4:{
            type:"boolean",
            label:"Enable Experimental Features",
            ref:"picassoprops.enableexp",
            defaultValue:"false"
          }
        }
      },
    }

};

})
