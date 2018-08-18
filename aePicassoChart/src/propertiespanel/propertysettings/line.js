let line = {
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
};

export default line;
