<template>
    <div class="data-process-wrapper">
        <div class="loading" v-if="loaded === false">
            <span>正在加载</span>
        </div>
        <div class="loaded" v-if="loaded === true">
            <div class="have-data" v-if="haveData === true">
		        <slot></slot>
            </div>
            <div class="none-data" v-if="haveData === false">
                没有相关数据
            </div>
        </div>

    </div>    
</template>

<script>
export default {
  props: {
    loaded: {
      type: Boolean,
      default: false
    },
    haveData: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style lang="stylus" scoped>
.data-process-wrapper {
    width: 100%;
    height: 100%;

    .loading {
        width: 100%;
        height: 50vh;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.5rem;
        color: #666;
    }

    .loaded {
        width: 100%;
        height: 100%;

        .have-data {
            width: 100%;
            height: 100%;
        }

        .none-data {
            width: 100%;
            height: 50vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.5rem;
            color: #666;
        }
    }
}
</style>
