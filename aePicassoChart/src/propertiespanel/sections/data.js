let data = {
  uses: "data",
  items: {
    dimensions: {
      min: 1,
      items:{
        showintooltip:{
          type:"boolean",
          label:"Show In Tooltip",
          ref:"qDef.showintooltip",
          defaultValue:true
        }
      }
    },
    measures: {
      min: 1,
      items:{
        showintooltip:{
          type:"boolean",
          label:"Show In Tooltip",
          ref:"qDef.showintooltip",
          defaultValue:true
        }
      }
    },
  }
};

export default data;
