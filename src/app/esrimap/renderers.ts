const redPolygon = {
    type: 'simple',
    symbol: {
      type: 'simple-fill',  // autocasts as new SimpleFillSymbol()
      color: 'transparent',
      style: 'solid',
      outline: {  // autocasts as new SimpleLineSymbol()
        color: 'red',
        width: 2
      }
    }
  }

  export {redPolygon}