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
      console.log(picasso.version);
      picasso.style = {fontFamily:'"QlikView Sans", sans-serif'};

      return {
        initialProperties: {
          qHyperCubeDef: {
            qDimensions: [],
            qMeasures: [],
            qInitialDataFetch: [{
              qTop: 0,
              qLeft: 0,
              qWidth: 6,
              qHeight: 1666
            }]
          },
          selections: 'CONFIRM',
          picassoprops: {
            scalesDef: [],
            componentsDef: {
              axis: [],
              layers: []
            }
          }
        },
        support: {
          snapshot: true,
          export: true,
          exportData: true
        },
        definition: properties,
        template: '<div class="lrp" style="height:100%;position:relative;"></div>',
        paint: function($element, layout) {


          layout.picassoprops.fieldOptions = bp.optionsListForFields(layout.qHyperCube);
          //console.log(layout);

          var first = false;
          if (typeof this.chart == 'undefined') {
            $element.empty();
            $element.html('<div class="lrp" style="height:100%;position:relative;"></div>');

            this.chart = picasso.chart({
              element: $element.find('.lrp')[0]
            });
            first = true;


          }

          if (qlik.navigation.getMode() == 'edit' || first) {

            var collectionsDef = bp.createCollections(layout.qHyperCube);
            var scalesDef = bp.createScales(layout.picassoprops.scalesDef);
            var componentsDef = bp.createComponents(layout.picassoprops, layout.qHyperCube); //We need more than just the componentsdef so send whole picassoprops
            var interactionsDef = bp.interactionsSetup({});
            //console.log(scalesDef);
            var settings = {
              collections: collectionsDef,
              scales: scalesDef,
              components: componentsDef,
              interactions: interactionsDef
            };
            //console.log(settings);
            //console.log(JSON.stringify(settings));

            /*****************************************************************************************************
            /*** Having to recreate the chart as when updating the settings the line layer does not refresh (might be bug in picasso)
            /*****************************************************************************************************/

            //var x = this.chart.update({settings:settings});
            this.chart = picasso.chart({
              element: $element.find('.lrp')[0],
              settings
            });
            //console.log(x);


            this.chartBrush = bp.enableSelectionOnFirstDimension(this, this.chart, 'highlight', layout);


          }

            return new Promise((resolve, reject) => {
              if (this.chartBrush.isActive) this.chartBrush.end();
              resolve(layout);
              this.chart.update({
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
