<template>
  <div class="container">
    <button class="expand" @click="isExpanded = !isExpanded">
      <span v-if="isExpanded" :key="'expanded'">
        <i class="fas fa-chevron-right" />
      </span>
      <span v-else :key="'notExpanded'">
        <i class="fas fa-chevron-left" />
      </span>
    </button>
    <div v-if="isExpanded" class="content">
      <select v-model="selectedLayout">
        <option
          v-for="layout in sortedLayoutList"
          :key="layout"
          :value="layout"
          v-text="layout.toUpperCase()"
        />
      </select>
      <div v-if="isError" class="error" :title="errorText">
        <i class="fas fa-exclamation-circle" />
      </div>
      <button class="apply" :disabled="isMorphing" @click="applyArrangement" v-text="'Apply'" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PluginComponent',
  data: self => ({
    // root
    guid: self.$root.guid,
    logSystem: self.$root.logSystem,
    layoutList: self.$root.layoutList,
    eventSystem: self.$root.eventSystem,
    //component
    isError: false,
    isExpanded: false,
    isMorphing: false,
    errorText: '',
    selectedLayout: 'hierarchic',
  }),
  computed: {
    sortedLayoutList() {
      return this.layoutList.sort();
    },
  },
  methods: {
    applyArrangement() {
      this.logSystem.debug(`Trying to apply ${this.selectedLayout} layout`);
      this.isError = false;
      this.isMorphing = true;
      this.eventSystem.publishEvent('ApplyArrangement', {
        layoutType: this.selectedLayout,
      });
    },

    applyFinishHandler(event) {
      const { status, layoutType, message } = event.args;
      if (status === 'failed') {
        this.isError = true;
        this.errorText = `Cannot apply ${layoutType} layout: ${message}`;
      }
      this.isMorphing = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  background-color: #fff;
  border: thin solid rgba(0, 0, 0, 0.5);
  padding: 10px;
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 1;
  transition: 0.3s;

  .expand {
    width: 30px;
    height: 30px;
  }

  .content {
    flex: 1 0;
    display: flex;
    justify-content: space-between;
    margin-left: 15px;

    .error {
      display: flex;
      align-items: center;
      padding: 0 10px;
      color: red;
    }

    .apply {
      padding: 4px;
    }
  }
}
</style>
