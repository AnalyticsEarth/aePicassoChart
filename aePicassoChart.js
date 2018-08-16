define([
    'qlik',
    './aePicassoChart-properties',
    './node_modules/picasso.js/dist/picasso',
    './node_modules/picasso-plugin-q/dist/picasso-q',
    './buildpicasso'
  ],
  function(qlik, properties, picasso, pq, bp) {

    picasso.use(pq)
    //picasso.renderer.prio(["canvas"]);
    console.log("Picasso Version: " + picasso.version);
    console.log("Picasso Designer Version: 0.2.3");
    picasso.style = {
      fontFamily: '"QlikView Sans", sans-serif'
    };



    var redrawChart = function($element, layout, self, first) {

      if (qlik.navigation.getMode() == 'edit' || first) {

        var collectionsDef = bp.createCollections(layout.qHyperCube);
        var scalesDef = bp.createScales(layout.picassoprops.scalesDef);
        var componentsDef = bp.createComponents(layout.picassoprops, layout.qHyperCube); //We need more than just the componentsdef so send whole picassoprops
        var interactionsDef = bp.interactionsSetup({});


        var settings = {
          collections: collectionsDef,
          scales: scalesDef,
          components: componentsDef,
          interactions: interactionsDef
        };

        /*****************************************************************************************************
        /*** Having to recreate the chart as when updating the settings the line layer does not refresh (might be bug in picasso)
        /*****************************************************************************************************/

        self.chart = picasso.chart({
          element: $element.find('.lrp')[0],
          settings
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

        self.backendApi.getData([size]).then(qdp => {
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
    };

    return {
      initialProperties: {
        qHyperCubeDef: {
          qDimensions: [],
          qMeasures: [],
          qInitialDataFetch: [{
            qTop: 0,
            qLeft: 0,
            qWidth: 3,
            qHeight: 3333
          }]
        },
        selections: 'CONFIRM',
        createdVersion: '0.2.2',
        picassoprops: {
          scalesDef: [],
          reflines: [],
          cube: {},
          componentsDef: {
            axis: [],
            layers: []
          }
        }
      },
      support: {
        snapshot: true,
        export: true,
        exportData: true,
        viewData: true
      },
      definition: properties,
      template: '<div class="lrp" style="height:100%;position:relative;"></div>',
      paint: function($element, layout) {
        var self = this;
        bp.setProps(layout);
        //Theme Processing
        var app = qlik.currApp(this);
        var theme = app.theme.getApplied().then(function(qtheme) {
          if (typeof layout.theme == 'undefined') layout.theme = qtheme;
          if (layout.theme.id != qtheme.id || bp.props == null) {
            layout.theme = qtheme;
            bp.setProps(layout);
            redrawChart($element, layout, self, true);
            updateData(layout, self, true, true);
          }

        });

        /*this.backendApi.setCacheOptions({
          enabled: false
        });*/

        layout.picassoprops.fieldOptions = bp.optionsListForFields(layout.qHyperCube);
        //console.log(layout);

        var first = false;
        if (typeof this.chart == 'undefined') {

          //if()

          $element.empty();
          $element.html('<div class="lrp" style="height:100%;position:relative;"></div>');

          self.chart = picasso.chart({
            element: $element.find('.lrp')[0]
          });
          first = true;


        }

        //redrawChart($element, layout, self, first);
        //updateData(layout, self, true);



        return new Promise((resolve, reject) => {
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
    }
  })
