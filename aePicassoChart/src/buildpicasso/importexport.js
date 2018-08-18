import charttemplate_bar from '../templates/bar.json';
import charttemplate_line from '../templates/line.json';
import charttemplate_bubblegrid from '../templates/bubblegrid.json';
import charttemplate_scatter from '../templates/scatter.json';

var charts = {};
charts['bar'] = charttemplate_bar;
charts['line'] = charttemplate_line;
charts['bubble-grid'] = charttemplate_bubblegrid;
charts['scatter'] = charttemplate_scatter;


var exportChart = function(picassoprops) {
  console.log("Export Chart Spec");
  var expDate = new Date(Date.now());
  var specout = {
    info: {
      version: "0.1",
      exportDate: expDate.toISOString()
    },
    chartspec: {
      scales: picassoprops.scalesDef,
      components: picassoprops.componentsDef
    }
  };
  var json = JSON.stringify(specout);

  var datestring = ("0" + expDate.getDate()).slice(-2) + "-" + ("0" + (expDate.getMonth() + 1)).slice(-2) + "-" +
    expDate.getFullYear() + "_" + ("0" + expDate.getHours()).slice(-2) + ("0" + expDate.getMinutes()).slice(-2);


  download("picassocomposer_" + datestring + ".json", json);
};

var download = function(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

var importChart = function(chartspec, picassoprops, save) {
  //TODO: This will be to import the chart from an archive file
  console.log(chartspec);
  if (chartspec != 'custom') {
    try {
      //var response = JSON.parse(charts[chartspec]);
      var response = charts[chartspec];
      if (save) {
        picassoprops.scalesDef = response.chartspec.scales;
        picassoprops.componentsDef = response.chartspec.components;
      }
    } catch (e) {
      console.log(e);
    }

  }
};

export {exportChart, importChart}
