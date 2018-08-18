import initialProperties from './initial-properties.js';
import support from './support.js';
import template from './template.html';
import definition from './definition.js';
import controller from './controller.js';
import paint from './paint.js';
import resize from './resize.js';
import localCSS from './style.scss';
import picasso from 'picasso.js';
import pq from 'picasso-plugin-q';
import bp from './buildpicasso.js';

export default window.define(['qlik'], function(qlik) {

  picasso.use(pq);
  console.info("Picasso Version: " + picasso.version);
  console.info("Picasso Designer Version: %s",VERSION);

  return {
    initialProperties: initialProperties,
    support:support,
    template: template,
    definition: definition,
    controller: controller,
    paint: paint,
    /*resize: resize*/
  }
})
