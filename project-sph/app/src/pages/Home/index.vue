<template>
  <div>
    <!--三级联动全局组件-->
    <TypeNav />
    <ListContainer />
    <TodayRecommend />
    <Rank />
    <Like />
    <Floor v-for="(floor,index) in floorList" :key="floor.id" :list="floor" />
    <Brand/>
  </div>
</template>

<script>
import ListContainer from "@/pages/Home/ListContainer";
import TodayRecommend from "@/pages/Home/TodayRecommend";
import { mapState } from "vuex";
import Rank from "@/pages/Home/Rank";
import Like from "@/pages/Home/Like";
import Floor from "@/pages/Home/Floor";
import Brand from "@/pages/Home/Brand";

export default {
  name: 'Home',
  components: {
    ListContainer,
    TodayRecommend,
    Rank,
    Like,
    Floor,
    Brand
  },
  //派发一个action，获取floor的数据
  mounted() {
    this.$store.dispatch("getFloorList");
  },
  computed:{
    ...mapState({
      floorList:state=>state.Home.floorList
    })
  }
}
</script>

<style scoped>

</style>