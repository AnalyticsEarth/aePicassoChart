

let tooltipdata = function(data, hypercube){
  let iout = {lines:[], key:data.value};
    if(typeof data.end == "undefined"){
      //Loop through Dimensions
      for(let d = 0; d < 5; d++){
        if(typeof data["d"+d] != 'undefined'){
          let cubeobj = hypercube.qDimensionInfo[data["d"+d].source.field.split("/")[1]];
          iout.lines.push({title:cubeobj.qFallbackTitle, label:data["d"+d].label, field:data["d"+d].source.field, show:cubeobj.showintooltip});
        }else{
          break;
        }
      }

      //Loop through Measures
      for(let m = 0; m < 5; m++){
        if(typeof data["m"+m] != 'undefined'){
          let cubeobj = hypercube.qMeasureInfo[data["m"+m].source.field.split("/")[1]];
          iout.lines.push({title:cubeobj.qFallbackTitle, label:data["m"+m].label, field:data["m"+m].source.field, show:cubeobj.showintooltip});
        }else{
          break;
        }
      }

    }else{
      //Special case for box layer
      //Dimension
      let src = data.source.field.split("/");
      let cubeobj_dim = hypercube[src[0]][src[1]];
      iout.lines.push({title:cubeobj_dim.qFallbackTitle, label:data.label, field:data.source.field, show:cubeobj_dim.showintooltip});

      //Box Start
      if(typeof data.start.source != 'undefined'){
        let src = data.start.source.field.split("/");
        let cubeobj = hypercube[src[0]][src[1]];
        iout.lines.push({title:cubeobj.qFallbackTitle, label:data.start.label, field:data.start.source.field, show:cubeobj.showintooltip});
      }

      //Box End
      if(typeof data.end.source != 'undefined'){
        let src = data.end.source.field.split("/");
        let cubeobj = hypercube[src[0]][src[1]];
        iout.lines.push({title:cubeobj.qFallbackTitle, label:data.end.label, field:data.end.source.field, show:cubeobj.showintooltip});
      }

      //Add More here for wiskers and mean.

    }
  return iout;
}

let rendertooltip = function(h, data){
  //Conform data to distilled list
  //console.log(data);
  for(var i = data.length - 1; i >= 0; i--){
    //console.log(i);
    var f = data.filter((obj) => {return obj.key == data[i].key});
    //console.log(f);
    if(f.length > 1){
      //Remove this item from the list as we wont need it
      //console.log("Removing: " + i);
      data.splice(i,1);
    }
  }

  //console.log(data);

  let out = [];
  out.push(h('div',{style:{fontWeight:'bold', fontSize:'1.2em', paddingBottom:'10px', textAlign:'center' }}, `${data[0].lines[0].label}`));

  let item1 = data[0].lines.map(e => {
    if(e.show || typeof e.show == 'undefined'){
      return h('div',{style:{fontWeight:'bold'}}, [`${e.title}:`, h('span',{style:{fontWeight:'normal',float:'right',paddingLeft:'10px'}},`${e.label}`)]);
    }

  });

  out.push.apply(out,item1);

  return out;

}

let createTooltip = function(hypercube){

  var tooltip = {
      key: 'tooltip-key',
      type: 'tooltip',
      displayOrder:100,
      settings:{
        content:({h, data}) => {return rendertooltip(h, data);},
        extract:({node, resources}) => {return tooltipdata(node.data, hypercube);},
        appendTo: document.body,
        afterShow:({element}) => {element.style.zIndex = 1000; }
      }
    };

    return [tooltip];
}

export default createTooltip;
