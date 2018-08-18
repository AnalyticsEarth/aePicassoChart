import bp from './buildpicasso.js';
import propertySettings from './propertiespanel/propertysettings/index.js';
import {showForProperty, labelForProperty, objForConditionalProp, objForProp} from './propertiespanel/functions.js';

import data from './propertiespanel/sections/data.js';
import templates from './propertiespanel/sections/templates.js';
import axisandscale from './propertiespanel/sections/axisandscale.js';
import layers from './propertiespanel/sections/layers.js';
import sorting from './propertiespanel/sections/sorting.js';
import addons from './propertiespanel/sections/addons.js';
import appearance from './propertiespanel/sections/appearance.js';
import about from './propertiespanel/sections/about.js';

export default {
  type: "items",
  component: "accordion",
  items: {
    data,
    templates,
    axisandscale,
    layers,
    sorting,
    addons,
    appearance,
    about
  }
}
