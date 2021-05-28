<template>
  <div class="container">
    <button class="expand" @click="isExpanded = !isExpanded">
      <div v-if="isExpanded" :key="'expanded'">
        <i class="fas fa-chevron-right"/>
      </div>
      <div v-else :key="'notExpanded'">
        <i class="fas fa-chevron-left"/>
      </div>
    </button>
    <div v-if="isExpanded" class="content">
      <select v-model="selectedLayout">
        <option
          v-for="layout in layoutList"
          :key="layout"
          :value="layout"
          v-text="layout.toUpperCase()"
        />
      </select>
      <div v-if="isError" class="error" :title="errorText">
        <i class="fas fa-exclamation-circle"/>
      </div>
      <button
        class="apply"
        :disabled="isMorphing"
        @click="morphLayout"
        v-text="'Apply'"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PluginComponent',
  data: (self) => ({
    // root
    logSystem: self.$root.logSystem,
    graphComponent: self.$root.graphComponent,
    layoutsMap: {
      'hierarchic': self.$root.yFiles.HierarchicLayout,
      'organic': self.$root.yFiles.OrganicLayout,
      'tree': self.$root.yFiles.TreeLayout,
      'orthogonal': self.$root.yFiles.OrthogonalLayout,
      'balloon': self.$root.yFiles.BalloonLayout,
      'circular': self.$root.yFiles.CircularLayout,
      'radial': self.$root.yFiles.RadialLayout,
    },
    //component
    isError: false,
    isExpanded: true,
    isMorphing: false,
    errorText: '',
    selectedLayout: 'hierarchic',
  }),
  computed: {
    layoutList () {
      return Object.keys(this.layoutsMap).sort();
    },
  },
  methods: {
    async morphLayout () {
      try {
        this.isError = false;
        this.isMorphing = true;
        await this.graphComponent.morphLayout({
          layout: this.createLayout(),
          morphDuration: '1s',
        });
      } catch (error) {
        this.isError = true;
        this.errorText = `Cannot apply ${this.selectedLayout} layout: ${error.message}`;
      } finally {
        this.isMorphing = false;
      }
    },

    createLayout () {
      const layout = new this.layoutsMap[this.selectedLayout]();
      if (layout instanceof this.layoutsMap['organic']) {
        layout.minimumNodeDistance = 50;
      }
      return layout;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  background-color: #fff;
  border: thin solid rgba(0, 0, 0, .5);
  padding: 10px;
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 1;
  transition: .3s;

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
