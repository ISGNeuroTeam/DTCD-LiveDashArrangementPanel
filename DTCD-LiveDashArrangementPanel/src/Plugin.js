import {
  ExtensionPlugin,
  LogSystemAdapter,
  EventSystemAdapter,
} from './../../DTCD-SDK';

import pluginMeta from './Plugin.Meta';
import PluginComponent from './PluginComponent.vue';

export class LiveDashArrangementPanel extends ExtensionPlugin {

  static getRegistrationMeta () {
    return pluginMeta;
  }

  static getExtensionInfo () {
    return { type: 'panel' };
  }

  constructor (guid, selector, liveDashGUID, layoutList) {
    super();

    const logSystem = new LogSystemAdapter(guid, pluginMeta.name);
    logSystem.debug(`Start of ${pluginMeta.name} creation`);

    const eventSystem = new EventSystemAdapter();
    const { default: VueJS } = this.getDependence('Vue');
    const data = { guid, liveDashGUID, layoutList, logSystem, eventSystem };

    new VueJS({
      data: () => data,
      render: h => h(PluginComponent),
    }).$mount(selector);

    logSystem.debug(`End of ${pluginMeta.name} creation`);
    logSystem.info(`${pluginMeta.name} initialization complete`);
  }

}
