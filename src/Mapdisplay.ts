
import { Component, QueryEvents, IQuerySuccessEventArgs, Initialization, ComponentOptions, IResultsComponentBindings } from 'coveo-search-ui';

import { Feature, Map, View } from 'ol';

import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import GeoJson from 'ol/format/GeoJSON';
import { Extent } from 'ol/extent';
import Projection from 'ol/proj/Projection';
import Geometry from 'ol/geom/Geometry';
import OSM from 'ol/source/OSM';

export interface MapdisplayOptions
{
  projection: string;
}

const fields = [
    '@coordinates',
    '@filename'
];

export class Mapdisplay extends Component {
    static ID = 'Mapdisplay';

    /**
     * The options for the component
     * @componentOptions
     */
    static options: MapdisplayOptions = {
      projection: ComponentOptions.buildStringOption(),
    };

    vectorLayer: VectorLayer;
    map : Map;
    baseProjectionStr : string = "EPSG:3857";
    baseProjection : Projection;

    constructor(
        public element: HTMLElement,
        public options: MapdisplayOptions,
        bindings?: IResultsComponentBindings
    ) {
        super(element, Mapdisplay.ID, bindings);

        this.options = ComponentOptions.initComponentOptions(element, Mapdisplay, options);
        if (this.options.projection != this.baseProjectionStr)
          this.baseProjectionStr = this.options.projection;

        this.baseProjection = new Projection ({
          code : this.baseProjectionStr
        })

        this.generateMap();

        this.bind.onRootElement(QueryEvents.deferredQuerySuccess, (successEvent: IQuerySuccessEventArgs) => this.handleDeferredQuerySuccess(successEvent));
    }

    private handleDeferredQuerySuccess (successEvent: IQuerySuccessEventArgs) {
      this.vectorLayer.getSource().clear();

      for (var result of successEvent.results.results) {
        if (result.raw.geometry != null) {
          let feature : Feature = this.generateFeatureFromResult(result);
          if (result.raw.projection != null && result.raw.projection != this.baseProjection) {
            let geo : Geometry = feature.getGeometry();

            let originproj : Projection  = new Projection ({
              code : result.raw.projection
            })

            feature.setGeometry(geo.transform(originproj, this.baseProjection));
          }

          this.vectorLayer.getSource().addFeature(feature);
        }
      }

      if (this.vectorLayer.getSource().getFeatures().length > 0)
        this.recenterMap();
    }

    private recenterMap () {
      var extent : Extent = this.vectorLayer.getSource().getExtent();
      this.map.getView().fit(extent, {duration: 500});
    }

    private generateFeatureFromResult (result) : Feature {     
      var reader : GeoJson = new GeoJson(); 
      var feature : Feature = reader.readFeature(JSON.parse(result.raw.geometry));
      feature.set("type", result.raw.documenttype);
      return feature;
    } 

    private generateBaseLayer () : TileLayer [] { 
      var layers: TileLayer [] = [];

      if (this.baseProjection.getCode() == "EPSG:4326") {
        layers.push(new TileLayer({
          source: new TileWMS({
            url: 'https://ahocevar.com/geoserver/wms',
            params: {
              'LAYERS': 'ne:NE1_HR_LC_SR_W_DR',
              'TILED': true,
            }
          })
        }))
      }
      else {
        layers.push(
          new TileLayer({
            source: new OSM()
          })
        );
      } 

      return layers;
    }

    private generateFeatureStyle () {
      var styles = {
        'Country': new Style({
          fill: new Fill({
            color: 'rgba(56, 168, 0, 0.8)',
            
          }),
          stroke: new Stroke({
            color: 'rgba(110, 110, 110, 1)',
            width: 0,
          }),
        }),
        'City': new Style({
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({color: '#FFFFFF'}),
            stroke: new Stroke({color: '#ff0000', width: 2}),
          }),
        })
      };

      return styles;
    } 
    
    private generateMap () {
      this.map = new Map({
        view: new View({
          projection: this.baseProjection.getCode(),
          center: [0, 0],
          zoom: 2,
          minZoom: 2,
          maxZoom: 6
        }),
        target: this.element,
        layers: this.generateBaseLayer()
      });

      var styles = this.generateFeatureStyle();

      this.vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: []
        }),
        style: function (feature) {
          return styles[feature.get('type')];
        }
      });
      this.map.addLayer(this.vectorLayer);
    }

}

Initialization.registerAutoCreateComponent(Mapdisplay);
Initialization.registerComponentFields(Mapdisplay.ID, fields); 