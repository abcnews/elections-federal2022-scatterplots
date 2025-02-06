const fs = require('fs');

const WA = require('./WA.json');
const NSW = require('./NSW.json');
const VIC = require('./VIC.json');

const prev = require('./public/geographics/2022.json');
const electorates = require('./public/2022results.json').data.electorates;

const prevWithStates = prev.features.map(e => ({
  ...e,
  properties: { ...e.properties, State: electorates.find(x => x.name === e.properties.Elect_div).state } 
}));

const REDISTRICTED = ['wa', 'nsw', 'vic'];

const final = [
  ...prevWithStates.filter(e => REDISTRICTED.indexOf(e.properties.State) === -1),

  ...WA.features.map(e => ({
    ...e,
    properties: { ...e.properties, State: 'wa' } 
  })),
    
  ...NSW.features.map(e => ({
    ...e,
    properties: { ...e.properties, State: 'nsw' } 
  })),

  ...VIC.features.map(e => ({
    ...e,
    properties: { ...e.properties, State: 'vic' } 
  })),
];

fs.writeFileSync(`${__dirname}/public/geographics/2025.json`, JSON.stringify({
  ...prev,
  features: final,
}));
