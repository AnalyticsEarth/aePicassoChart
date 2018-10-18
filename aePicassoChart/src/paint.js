import picasso from 'picasso.js';
import pq from 'picasso-plugin-q';
import bp from './buildpicasso.js';

var qlik = window.require('qlik');

var createPicassoWithStyle = function(self, layout, qTheme) {
  //Default Theme
  var style = {
    '$font-family': '"QlikView Sans", sans-serif',
  };

  //Font
  try {
    if (!layout.picassoprops.theme.fontauto) {
      style['$font-family'] = layout.picassoprops.theme.fontfamily;
    }
  } catch (err) {

  }

  //Font Size
  try {
    if (!layout.picassoprops.theme.fontsizeauto) {
      if (typeof layout.picassoprops.theme.fontsize == 'undefined') {
        //Set Nothing
      } else {
        style['$font-size'] = layout.picassoprops.theme.fontsize + "px";
      }
    } else {
      if (qTheme != null) style['$font-size'] = qTheme.getStyle('fontSize', '', '');
    }
  } catch (err) {
    if (qTheme != null) style['$font-size'] = qTheme.getStyle('fontSize', '', '');
  }

  //Font Size Large
  try {
    if (!layout.picassoprops.theme.fontsizeauto) {
      if (typeof layout.picassoprops.theme.fontsizelarge == 'undefined') {
        //Set Nothing
      } else {
        style['$font-size--l'] = layout.picassoprops.theme.fontsizelarge + "px";
      }
    } else {
      if (qTheme != null) style['$font-size--l'] = qTheme.getStyle('object', 'legend.title', 'fontSize');
    }
  } catch (err) {
    if (qTheme != null) style['$font-size--l'] = qTheme.getStyle('object', 'legend.title', 'fontSize');
  }

  //Font Color
  try {
    if (!layout.picassoprops.theme.fontcolorauto) {
      if (typeof layout.picassoprops.theme.fontcolor == 'undefined') {
        //Set Nothing
      } else {
        style['$font-color'] = layout.picassoprops.theme.fontcolor.color;
      }
    } else {
      if (qTheme != null) style['$font-color'] = qTheme.getStyle('object', 'label.name', 'color');
    }
  } catch (err) {
    if (qTheme != null) style['$font-color'] = qTheme.getStyle('object', 'label.name', 'color');
  }


  if (qTheme != null) {
    //style['$font-color'] = qTheme.getStyle('object','label.name','color');

    style['$guide-color'] = qTheme.getStyle('object', 'grid.line.major', 'color');
    style['$shape'] = {
      fill: qTheme.getStyle('dataColors', '', 'primaryColor'),
      strokeWidth: 0,
      stroke: qTheme.getStyle('dataColors', '', 'primaryColor')
    };
  }
  //console.log(style);
  self.pic = picasso({
    renderer: {
      prio: ['canvas']
    },
    style: style
  });
};


var redrawChart = function($element, layout, self, first) {

  if (qlik.navigation.getMode() == 'edit' || first) {

    var collectionsDef = bp.createCollections(layout.qHyperCube);
    var scalesDef = bp.createScales(layout.picassoprops.scalesDef);
    var componentsDef = bp.createComponents(layout.picassoprops, layout.qHyperCube); //We need more than just the componentsdef so send whole picassoprops
    var interactionsDef = bp.interactionsSetup({}, layout.picassoprops);


    var settings = {
      collections: collectionsDef,
      scales: scalesDef,
      components: componentsDef,
      interactions: interactionsDef
    };
    //console.log(JSON.stringify(settings));

    /*****************************************************************************************************
    /*** Having to recreate the chart as when updating the settings the line layer does not refresh (might be bug in picasso)
    /*****************************************************************************************************/

    self.chart = self.pic.chart({
      element: $element.find('.lrp')[0],
      settings: settings
    });

    self.chartBrush = bp.enableSelectionOnFirstDimension(self, self.chart, 'highlight', layout);
  }
};

var updateData = function(layout, self, getNewData) {
  //console.log(self);
  var size = {};
  try {
    size = {
      qTop: layout.picassoprops.cube.top,
      qLeft: layout.picassoprops.cube.left,
      qWidth: layout.picassoprops.cube.width,
      qHeight: layout.picassoprops.cube.height
    };

    if (!layout.picassoprops.cube.limit) {
      //If limit is switched off, then use hypercube size
      size.qTop = 0;
      size.qLeft = 0;
      size.qWidth = layout.qHyperCube.qSize.qcx;
      size.qHeight = layout.qHyperCube.qSize.qcy;
    }

  } catch (err) {
    size = {
      qTop: 0,
      qLeft: 0,
      qWidth: layout.qHyperCube.qSize.qcx,
      qHeight: layout.qHyperCube.qSize.qcy
    };
  }

  //console.log(size);
  if (getNewData) {

    self.backendApi.getData([size]).then(function(qdp) {
      if (layout.qHyperCube.qDataPages.length > 1) {
        //Keep the latest qDataPages
        layout.qHyperCube.qDataPages.splice(0, layout.qHyperCube.qDataPages.length - 1);
      }

      //layout.qHyperCube.qDataPages.length = 1;
      self.chart.update({
        data: [{
          type: 'q',
          key: 'qHyperCube',
          data: layout.qHyperCube
        }]
      });
    });
  } else {
    self.chart.update({
      data: [{
        type: 'q',
        key: 'qHyperCube',
        data: layout.qHyperCube
      }]
    });
  }
  console.log("Data");
  console.log(self.chart.dataset(0));
};

export default function($element, layout) {
  var self = this;
  bp.setProps(layout);
  //Theme Processing
  var app = qlik.currApp(this);
  console.log(app.theme);
  try{
    var theme = app.theme.getApplied().then(function(qtheme) {
      if (typeof layout.theme == 'undefined') layout.theme = qtheme;
      if (layout.theme.id != qtheme.id || bp.props == null) {
        layout.theme = qtheme;
        bp.setProps(layout);
        //console.log(qtheme.getStyle('object', 'label.name', 'color'));
        console.log(qtheme);
        createPicassoWithStyle(self, layout, qtheme);
        redrawChart($element, layout, self, true);
        updateData(layout, self, true, true);

      }

    });
  }catch(e){
    console.log("Could not load theme");
  }

  /*this.backendApi.setCacheOptions({
    enabled: false
  });*/

  layout.picassoprops.fieldOptions = bp.optionsListForFields(layout.qHyperCube);
  console.log(layout);

  var first = false;
  if (typeof this.chart == 'undefined') {

    //if()

    //$element.empty();
    //$element.html('<div class="lrp" style="height:100%;position:relative;"></div>');

    var style = {
      '$font-family': '"QlikView Sans", sans-serif',
      '$font-color': "#ff0000"
    };

    self.pic = picasso({
      style: style
    });


    /*self.chart = self.pic.chart({
      element: $element.find('.lrp')[0]
    });*/
    first = true;


  }
  createPicassoWithStyle(self, layout, null);
  redrawChart($element, layout, self, first);
  updateData(layout, self, true);



  return new Promise(function(resolve, reject) {
    if (self.chartBrush.isActive) self.chartBrush.end();
    resolve(layout);
    self.chart.update({
      data: [{
        type: 'q',
        key: 'qHyperCube',
        data: layout.qHyperCube
      }]
    });
  })
}
