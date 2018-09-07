import bp from '../../buildpicasso.js';
//import propertySettings from './propertiespanel/propertysettings/index.js';
import {showForProperty, labelForProperty, objForConditionalProp, objForProp} from '../functions.js';

let layeritems = {
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
            type: "string",
            ref: "layershow2",
            expression: "always",
            label: "Show Layer",
          },
          legshow: {
            type: "string",
            ref: "legshow2",
            expression: "always",
            label: "Show In Legend",
            show: (y) => {
              return !~["pie", "grid"].indexOf(y.layertype);
            }, //Not for pie and grid
          },
          layertitle: {
            type: "string",
            ref: "layertitle",
            label: "Layer Title",
            expression: "optional"
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
              primarydashpattern: objForConditionalProp("primarydashpattern", "string", null, true, {expression:"optional"}),


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
            component: "slider",
            ref: "piepadangle",
            label: "Pad Angle",
            defaultValue: 0,
            min: 0,
            max: 0.05,
            step: 0.01
          },
          pieouterradius: {
            type: "number",
            component: "slider",
            ref: "pieouterradius",
            label: "Outer Radius",
            defaultValue: 1,
            min: 0,
            max: 1,
            step: 0.1
          },
          pieinnerradius: {
            type: "number",
            component: "slider",
            ref: "pieinnerradius",
            label: "Inner Radius",
            defaultValue: 0,
            min: 0,
            max: 1,
            step: 0.1
          },
          piecornerradius: {
            type: "number",
            component: "slider",
            ref: "piecornerradius",
            label: "Corner Radius",
            defaultValue: 0,
            min: 0,
            max: 20,
            step: 1
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
            component: "slider",
            ref: "labelsize",
            label: "Text Size",
            defaultValue: 13,
            min: 8,
            max: 30,
            step: 1
          },
          intocolor: { //Pie Only
            type: "object",
            show: (x) => {
              return x.layertype == "pie"
            },
            component: "color-picker",
            ref: "labelintocolor",
            label: "Into - Fill Color",
            dualOutput: true,
            defaultValue: {
              index: 2,
              color: '#545352'
            }
          },
          insidejustify: {
            show: (x) => {
              return ~["box", "point"].indexOf(x.layertype)
            },
            type: "number",
            component: "slider",
            ref: "labelinsidejustify",
            label: "Inside - Justify",
            defaultValue: 0.5,
            min: 0,
            max: 1,
            step: 0.01
          },
          insidealign: {
            show: (x) => {
              return ~["box", "point"].indexOf(x.layertype)
            },
            type: "number",
            component: "slider",
            ref: "labelinsidealign",
            label: "Inside - Align",
            defaultValue: 0.5,
            min: 0,
            max: 1,
            step: 0.01
          },
          insidecolor: {
            type: "object",
            component: "color-picker",
            ref: "labelinsidecolor",
            label: "Inside - Fill Color",
            dualOutput: true,
            defaultValue: {
              index: 10,
              color: '#ffffff'
            }
          },
          outsidejustify: {
            show: (x) => {
              return ~["box", "point"].indexOf(x.layertype)
            },
            type: "number",
            component: "slider",
            ref: "labeloutsidejustify",
            label: "Outside - Justify",
            defaultValue: 0.5,
            min: 0,
            max: 1,
            step: 0.01
          },
          outsidealign: {
            show: (x) => {
              return ~["box", "point"].indexOf(x.layertype)
            },
            type: "number",
            component: "slider",
            ref: "labeloutsidealign",
            label: "Outside - Align",
            defaultValue: 0.5,
            min: 0,
            max: 1,
            step: 0.01
          },
          outsidecolor: {
            type: "object",
            component: "color-picker",
            ref: "labeloutsidecolor",
            label: "Outside - Fill Color",
            dualOutput: true,
            defaultValue: {
              index: 2,
              color: '#545352'
            }
          },
          oppositejustify: {
            show: (x) => {
              return ~["box", "point"].indexOf(x.layertype)
            },
            type: "number",
            component: "slider",
            ref: "labeloppositejustify",
            label: "Opposite - Justify",
            defaultValue: 0.5,
            min: 0,
            max: 1,
            step: 0.01
          },
          oppositealign: {
            show: (x) => {
              return ~["box", "point"].indexOf(x.layertype)
            },
            type: "number",
            component: "slider",
            ref: "labeloppositealign",
            label: "Opposite - Align",
            defaultValue: 0.5,
            min: 0,
            max: 1,
            step: 0.01
          },
          oppositecolor: {
            show: (x) => {
              return ~["box", "point"].indexOf(x.layertype)
            },
            type: "object",
            component: "color-picker",
            ref: "labeloppositecolor",
            label: "Opposite - Fill Color",
            dualOutput: true,
            defaultValue: {
              index: 2,
              color: '#545352'
            }
          },
        }
      },
    }
  }
};

let layers = {
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
};

export default layers;
