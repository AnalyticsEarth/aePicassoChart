import bp from '../../buildpicasso.js';

let templates = {
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
        show: (x) => {
          return x.picassoprops.enableexp
        },
        action: (x) => {
          console.log(x);
          bp.exportChart(x.picassoprops);
        }
      }
    },
  };

  export default templates;
