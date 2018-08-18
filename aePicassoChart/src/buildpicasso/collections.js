//Create Collection
var createCollections = function(hypercube) {
  //Create Collection Array
  var collectionArray = [];

  var collection = {
    key: 'hypercubeCollection',
    data: {
      extract: {
        props: {

        }
      }
    }
  };

  //needs to support multiple dimensions in next phase
  hypercube.qDimensionInfo.forEach((d, i) => {
    if(i == 0){
      collection.data.extract.field = 'qDimensionInfo/' + i;
      //collection.data.extract.trackBy = (v) => {return v.qElemNumber;};
    }
    collection.data.extract.props['d' + i] = {
      field: 'qDimensionInfo/' + i,

    }; //trackBy: (v) => {return v.qElemNumber;}


  });
  hypercube.qMeasureInfo.forEach((m, i) => {
    collection.data.extract.props['m' + i] = {
      field: 'qMeasureInfo/' + i
    };
  });

  collectionArray.push(collection);
  //console.log(collectionArray);
  return collectionArray;

};


export default createCollections;
