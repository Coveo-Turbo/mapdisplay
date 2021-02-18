# mapdisplay

https://search.cloud.coveo.com/pages/coveoprofessionalservicesbi4l69nl/demopsmapdisplay#t=Countries&sort=relevancy

Simple Demo Component to display GeoJson features using the Openlayers Library
https://openlayers.org/

Coveo Org source with demo data: 
https://platform.cloud.coveo.com/admin/#coveoprofessionalservicesbi4l69nl/content/sources/edit/GENERIC_REST/coveoprofessionalservicesbi4l69nl-sqpohznwxeh565skbpbyjrcnim/configuration/

For this demo, a collection of GeoJson feature has been indexed individualy as Coveo items and the geometic infomation has been place in a field called "geometry". The projection code of the features has also been places in a field called "projection". This demo uses "EPSG:4326" or "EPSG:3857" as available examples but most projection systems can be used.
https://geojson.org/

Upon initialization, a map is rendered on the dom in a predefined projection.

The map listens to deferredQuerySuccess events and check the return list of elements, if the geometry field is present, it will update the map with the geometry information in the projection of the base map.

If the geometry is in a different projection code than the view of the map, the Openlayers library will transform the geometry to match the view of the map.

Feature Styles can be modified in the method generateFeatureStyle.

The two default base layers are free data from https://ahocevar.com (wms service) and https://www.openstreetmap.org/ (OOTB Openlayers layer)


Disclaimer: This component was built by the community at large and is not an official Coveo JSUI Component. Use this component at your own risk.

## Getting Started

1. Install the component into your project.

```
npm i @coveops/mapdisplay
```

2. Use the Component or extend it

Typescript:

```javascript
import { mapdisplay, ImapdisplayOptions } from '@coveops/mapdisplay';
```

Javascript

```javascript
const mapdisplay = require('@coveops/mapdisplay').mapdisplay;
```

3. You can also expose the component alongside other components being built in your project.

```javascript
export * from '@coveops/mapdisplay'
```

4. Or for quick testing, you can add the script from unpkg

```html
<script src="https://unpkg.com/@coveops/mapdisplay@latest/dist/index.min.js"></script>
```

> Disclaimer: Unpkg should be used for testing but not for production.

5. Include the component in your template as follows:

Place the component in your markup:

```html
<div class="CoveoMapdisplay" data-projection="EPSG:3857" style="width: 90%; height: 400px; display: block; position: relative; margin: auto;"></div>
```

# Parameters

The base projection to use for the map, choices are "EPSG:4326" or "EPSG:3857", default is "EPSG:3857"

usage examples: 

```html
<div class="Coveomapdisplay" data-projection="EPSG:4326"></div>
```


```html
<div class="Coveomapdisplay" data-projection="EPSG:3857"></div>
```

## Extending

Extending the component can be done as follows:

```javascript
import { mapdisplay, ImapdisplayOptions } from "@coveops/mapdisplay";

export interface IExtendedmapdisplayOptions extends ImapdisplayOptions {}

export class Extendedmapdisplay extends mapdisplay {}
```

## Contribute

1. Clone the project
2. Copy `.env.dist` to `.env` and update the COVEO_ORG_ID and COVEO_TOKEN fields in the `.env` file to use your Coveo credentials and SERVER_PORT to configure the port of the sandbox - it will use 8080 by default.
3. Build the code base: `npm run build`
4. Serve the sandbox for live development `npm run serve`

## Usefull commands

npm i : install the dependencies

npm run build : builds the project

npm run serve : serves on the localhost post devifned in .env

./node_modules/.bin/coveops create:page mapdisplay : creates a page called "mapdisplay"

./node_modules/.bin/coveops deploy : deploys a page to the coveo platform, .env defaults this to mapdisplay
