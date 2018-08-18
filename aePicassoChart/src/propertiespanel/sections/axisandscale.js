import bp from '../../buildpicasso.js';
import {showForProperty, labelForProperty, objForConditionalProp, objForProp} from '../functions.js';

let axisandscale = {
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
          show: (x) => {
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
          show: (x) => {
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
              }, {
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
            axismode: {
              type: "string",
              component: "dropdown",
              ref: "axismode",
              label: "Axis Mode",
              options: [{
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
            fontsection: {
              type: "items",
              items: {
                fontauto: {
                  type: "boolean",
                  component: "switch",
                  label: "Title Font",
                  ref: "axisfontauto",
                  options: [{
                    value: true,
                    label: "Auto"
                  }, {
                    value: false,
                    label: "Custom"
                  }],
                  defaultValue: true
                },
                fontfamily: {
                  type: "string",
                  label: "Font Family",
                  ref: "axisfontfamily",
                  defaultValue: '"QlikView Sans", sans-serif',
                  show: (a) => {
                    try {
                      return !a.axisfontauto;
                    } catch (err) {
                      return false;
                    }
                  }
                },
                fontsize: {
                  type: "number",
                  label: (a) => {
                    return "Font Size (" + a.axisfontsize + "px)";
                  },
                  component: "slider",
                  ref: "axisfontsize",
                  defaultValue: 13,
                  min: 6,
                  max: 24,
                  step: 1,
                  show: (a) => {
                    try {
                      return !a.axisfontauto;
                    } catch (err) {
                      return false;
                    }

                  }
                },
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
};

export default axisandscale;
