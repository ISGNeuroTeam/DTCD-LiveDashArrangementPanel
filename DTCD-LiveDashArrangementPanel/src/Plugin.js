import { ExtensionPlugin, LogSystemAdapter } from './../../DTCD-SDK';
import pluginMeta from './Plugin.Meta';
import PluginComponent from './PluginComponent.vue';

export class LiveDashArrangementPanel extends ExtensionPlugin {

  static getRegistrationMeta () {
    return pluginMeta;
  }

  static getExtensionInfo () {
    return { type: 'panel' };
  }

  constructor (guid, selector, graphComponent) {
    super();

    const logSystem = new LogSystemAdapter(guid, pluginMeta.name);

    const { default: VueJS } = this.getDependence('Vue');
    const { default: yFiles } = this.getDependence('yFiles');
    const data = { yFiles, logSystem, graphComponent };

    new VueJS({
      data: () => data,
      render: h => h(PluginComponent),
    }).$mount(selector);
  }

}
