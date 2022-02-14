import { ExtensionPlugin, LogSystemAdapter, EventSystemAdapter } from './../../DTCD-SDK';

import pluginMeta from './Plugin.Meta';
import PluginComponent from './PluginComponent.vue';

export class LiveDashArrangementPanel extends ExtensionPlugin {
  static getRegistrationMeta() {
    return pluginMeta;
  }

  static getExtensionInfo() {
    return { type: 'panel' };
  }

  constructor(guid, selector, layoutList) {
    super();

    const logSystem = new LogSystemAdapter('0.4.0', guid, pluginMeta.name);
    logSystem.debug(`Start of ${pluginMeta.name} creation`);

    const eventSystem = new EventSystemAdapter('0.3.0', guid);
    const { default: VueJS } = this.getDependence('Vue');
    const data = { guid, layoutList, logSystem, eventSystem };

    this.vue = new VueJS({
      data: () => data,
      render: h => h(PluginComponent),
    }).$mount(selector);

    logSystem.debug(`End of ${pluginMeta.name} creation`);
    logSystem.info(`${pluginMeta.name} initialization complete`);
  }

  applyFinishHandler(event) {
    const component = this.vue.$children[0];
    return component.applyFinishHandler(event);
  }
}
