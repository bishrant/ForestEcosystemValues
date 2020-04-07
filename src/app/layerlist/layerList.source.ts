const layerInfo = {
  boundaries: {
    visible: true,
    opacity: 0,
    name: "Boundaries",
    radio: false,
    subLayers: [
      {
        id: 1,
        name: "East Texas",
        visible: false,
      },
      {
        id: 2,
        name: "Counties",
        visible: true,
      },
      {
        id: 3,
        name: "Urban Areas",
        visible: false,
      },
      {
        id: 4,
        name: "Water Resource Region",
        visible: false,
      },
      {
        id: 5,
        name: "Ecoregion",
        visible: false,
      },
    ],
  },
  forest: {
    visible: false,
    opacity: 0,
    name: "Forest",
    radio: false,
    subLayers: [
      {
        id: 7,
        visible: true,
        name: "Forest",
      },
    ],
  },
  fev: {
    visible: true,
    opacity: 0,
    name: "Forest Ecosystem Values",
    radio: true,
    visibleSubLayer: 11,
    subLayers: [
      {
        id: 11,
        visible: true,
        name: "Annual Total Value",
      },
      {
        id: 12,
        visible: false,
        name: "Air Quality",
      },
      {
        id: 13,
        visible: false,
        name: "Biodiversity",
      },
      {
        id: 14,
        visible: false,
        name: "Carbon",
      },
      {
        id: 15,
        visible: false,
        name: "Cultural",
      },
      {
        id: 16,
        visible: false,
        name: "Watershed",
      },
    ],
  },
};

export { layerInfo };
