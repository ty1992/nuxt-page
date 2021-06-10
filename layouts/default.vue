<template>
 <div>
   <m-header/>
   <nuxt />
   <m-footer/>
 </div>
</template>

<script>
import MHeader from './header.vue'
import MFooter from './footer.vue'
export default {
  components: {
    MHeader,
    MFooter
  },
  data () {
    return {
    };
  },
}
</script>