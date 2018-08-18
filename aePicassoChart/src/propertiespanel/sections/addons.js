import bp from '../../buildpicasso.js';

let addons = {
  uses: "addons",
  items: {
    datahandling: {
      uses: "dataHandling",
      items: {
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
      ref: "picassoprops.reflines",
      items: {
        textcolor:{
          type:"object",
          component:"color-picker",
          label:"Text Color",
          ref:"tcolor",
          defaultValue:{
            index:-1,
            color:"#000000"
          },
          dualOutput:true
        },
        backgroundcolor:{
          type:"object",
          component:"color-picker",
          label:"Background Color",
          ref:"backcolor",
          defaultValue:{
            index:1,
            color:"#ffffff"
          },
          dualOutput:true
        },
        scale: {
          type: "string",
          component: "dropdown",
          ref: "scale",
          label: "Scale (Axis)",
          options: (d, e) => {
            return e.properties.picassoprops.componentsDef.axis.filter(item => item.dockeditemtype == 'axis').map((item, index) => {
              let scale = e.properties.picassoprops.scalesDef.filter(sc => sc.scalename == item.axisscale && sc.scaletype == "linear");
              if(scale.length == 1){
                return {
                  value: item.axisscale+"|"+item.axisdock,
                  label: item.axisscale + " (" + item.axisdock + ")"
                }
              }else{
                return null;
              }
            }).filter(item => item != null);
          }
        },
        align:{
          type:"number",
          component:"slider",
          label:"Align",
          ref:"align",
          defaultValue:1,
          min:0,
          max:1,
          step:0.1
        },
        valign:{
          type:"number",
          component:"slider",
          label:"V Align",
          ref:"valign",
          defaultValue:1,
          min:0,
          max:1,
          step:0.1
        },
        linestrokewidth:{
          type:"number",
          component:"slider",
          label:"Line Width",
          ref:"linestrokewidth",
          defaultValue:1,
          min:1,
          max:5,
          step:1
        },
        linestrokeopacity:{
          type:"number",
          component:"slider",
          label:"Line Opacity",
          ref:"lineopacity",
          defaultValue:1,
          min:0,
          max:1,
          step:0.1
        },
        backgroundwidth:{
          type:"number",
          component:"slider",
          label:"Border Width",
          ref:"borderwidth",
          defaultValue:1,
          min:1,
          max:5,
          step:1
        },
        backgroundopacity:{
          type:"number",
          component:"slider",
          label:"Background Opacity",
          ref:"backgroundopacity",
          defaultValue:0.5,
          min:0,
          max:1,
          step:0.1
        }
      }
    },
    hypercubeSize: {
      label: "Hypercube Size",
      type: "items",
      items: {
        content: {
          type: "items",
          show: (d) => {
            var vc = bp.isVersionGreater(d.createdVersion, "0.2.2");
            return vc;
          },
          items: {
            hqlimit: {
              type: "boolean",
              ref: "picassoprops.cube.limit",
              label: "Limit Cube Size",
              defaultValue: false
            },
            hqtop: {
              type: "number",
              ref: "picassoprops.cube.top",
              label: "Top",
              defaultValue: 0,
              show: (a) => {return a.picassoprops.cube.limit}
            },
            hqleft: {
              type: "number",
              ref: "picassoprops.cube.left",
              label: "Left",
              defaultValue: 0,
              show: (a) => {return a.picassoprops.cube.limit}
            },
            hqwidth: {
              type: "number",
              ref: "picassoprops.cube.width",
              label: "Width",
              defaultValue: 0,
              show: (a) => {return a.picassoprops.cube.limit}
            },
            hqheight: {
              type: "number",
              ref: "picassoprops.cube.height",
              label: "Height",
              defaultValue: 0,
              show: (a) => {return a.picassoprops.cube.limit}
            },
          }
        },
        info: {
          type: "string",
          component: "text",
          label: "These settings will only work on a new charts created after version 0.2.2",
          show: (d) => {
            var vc = bp.isVersionGreater(d.createdVersion, "0.2.2");
            return !vc;
          }
        },
      }
    }
  }
};

export default addons;
