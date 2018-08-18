let appearance = {
  uses: "settings",
  items: {
    style: {
      type: "items",
      label: "Picasso Theme",
      grouped: true,
      items: {
        about1: {
          type: "string",
          component: "text",
          label: "Picasso will use the Qlik Sense theme where possible, Individual settings can be overwritten."
        },
        fontsection: {
          type: "items",
          items: {
            fontauto: {
              type: "boolean",
              component: "switch",
              label: "Font",
              ref: "picassoprops.theme.fontauto",
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
              ref: "picassoprops.theme.fontfamily",
              defaultValue: '"QlikView Sans", sans-serif',
              show: (a) => {
                try {
                  return !a.picassoprops.theme.fontauto;
                } catch (err) {
                  return false;
                }
              }
            }
          }
        },
        fontsizesection: {
          type: "items",
          items: {
            fontauto: {
              type: "boolean",
              component: "switch",
              label: "Font Size",
              ref: "picassoprops.theme.fontsizeauto",
              options: [{
                value: true,
                label: "Auto"
              }, {
                value: false,
                label: "Custom"
              }],
              defaultValue: true
            },
            fontsize: {
              type: "number",
              label: (a) => {
                return "Font Size (" + a.picassoprops.theme.fontsize + "px)";
              },
              component: "slider",
              ref: "picassoprops.theme.fontsize",
              defaultValue: 13,
              min: 6,
              max: 24,
              step: 1,
              show: (a) => {
                try {
                  return !a.picassoprops.theme.fontsizeauto;
                } catch (err) {
                  return false;
                }

              }
            },
            fontsizelarge: {
              type: "number",
              label: (a) => {
                return "Legend Title Font Size (" + a.picassoprops.theme.fontsizelarge + "px)";
              },
              component: "slider",
              ref: "picassoprops.theme.fontsizelarge",
              defaultValue: 15,
              min: 6,
              max: 24,
              step: 1,
              show: (a) => {
                try {
                  return !a.picassoprops.theme.fontsizeauto;
                } catch (err) {
                  return false;
                }
              }
            }
          }
        },
        fontcolorsection: {
          type: "items",
          items: {
            fontauto: {
              type: "boolean",
              component: "switch",
              label: "Font Color",
              ref: "picassoprops.theme.fontcolorauto",
              options: [{
                value: true,
                label: "Auto"
              }, {
                value: false,
                label: "Custom"
              }],
              defaultValue: true
            },
            fontcolor: {
              type: "object",
              label: "Font Color",
              ref: "picassoprops.theme.fontcolor",
              component: "color-picker",
              dualOutput: true,
              defaultValue: {
                index: 2,
              },
              show: (a) => {
                try {
                  return !a.picassoprops.theme.fontcolorauto;
                } catch (err) {
                  return false;
                }

              }
            }
          }
        }
      }
    }
  }
};

export default appearance;
