<template>
  <div class="mapContainer">
    <div id="containerMap" ref="map" />
    <van-popup
      v-model="show"
      position="bottom"
      :style="{ 'max-height': '30%' }"
      :overlay="false"
      duration="0"
    >
      <div v-if="orderList.length > 1" class="popup-div-title">{{ orderList.length }}个工单</div>
      <div class="popup-div-content">
        <order-card
          v-for="(cardItem, index) in orderList"
          :key="cardItem.id"
          :info="cardItem"
          :class="{ border: index !== orderList.length - 1 }"
          @fresh="fresh"
          @feedback="singleFeedback(cardItem)"
          @dispatch="$emit('dispatch', cardItem)"
          @click.native="$emit('goDetail', cardItem)"
        />
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getMapRangeOrderList } from "../../../api/index.js";
import AMapLoader from "@amap/amap-jsapi-loader";
import he1 from "../../../images/mapimg/he1.svg";
import OrderCard from "./OrderCard.vue";

export default {
  components: { OrderCard },
  data() {
    return {
      loading: false,
      mapCenter: [120.21660543439623, 30.20913115497448],
      show: false,
      orderList: [],
    };
  },
  created() {
    this.map = null;
    this.AMap = null;
    this.pointMarkers = null;
    this.pointObj = {};
    this.search = {};
  },
  beforeDestroy() {
    if (this.map) {
      this.map.destroy();
    }
    this.map = null;
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      AMapLoader.load({
        key: "8ef066343a4df9c072b744552f486168",
        version: "1.4.15",
        plugin: [],
      })
        .then((AMap) => {
          this.AMap = AMap;
          this.map = new AMap.Map("containerMap", {
            zoom: 12,
            zooms: [3, 18],
            expandZoomRange: true,
            showIndoorMap: false,
            touchZoom: true,
            viewMode: "2D",
            center:
              this.search.longitude && this.search.latitude
                ? [Number(this.search.longitude), Number(this.search.latitude)]
                : this.mapCenter,
          });
          // AMap.ToolBar this.map.addControl(new this.AMap.ToolBar())
          AMap.plugin(["AMap.MarkerClusterer", ""]);
          this.map.on("complete", () => {
            this.getList();
          });
          this.map.on("moveend", this.moveend);
          this.map.on("click", this.mapClick);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setSearch(obj) {
      this.search = { ...obj };
    },
    async getList(search) {
      if (search) this.search = { ...search };
      try {
        const ps = this.map.getBounds();
        const oldCenter = this.map.getCenter();
        const oldZoom = this.map.getZoom();
        const obj = {
          ...this.search,
          longitude: this.search.longitude || this.mapCenter[0],
          latitude: this.search.latitude || this.mapCenter[1],
          wsLng: ps.southwest.R,
          enLng: ps.northeast.R,
          wsLat: ps.southwest.Q,
          enLat: ps.northeast.Q,
          catalogId: this.$route.params.catalogId,
          listType: this.$route.params.listType,
        };
        const { data } = await getMapRangeOrderList(obj);
        const newCenter = this.map.getCenter();
        const newZoom = this.map.getZoom();
        if (
          !(
            oldZoom === newZoom &&
            oldCenter.lng === newCenter.lng &&
            oldCenter.lat === newCenter.lat
          )
        )
          return;
        if (data?.length) {
          this.pointRendering(data);
        } else {
          this.clearMapList();
        }
      } catch (err) {
        console.log(err);
      }
    },
    clearMapList() {
      if (this.pointMarkers) {
        this.pointObj = {};
        this.pointMarkers.setMarkers([]);
      }
    },
    pointRendering(list) {
      const pauseObj = {};
      list.map((v) => {
        pauseObj[v.id] = true;
        let marker = null;
        if (this.pointObj[v.id]) return marker;
        marker = new this.AMap.Marker({
          position: [Number(v.longitude), Number(v.latitude)],
          anchor: "bottom-center",
          offset: new this.AMap.Pixel(0, 0),
          extData: { ...v },
        });
        marker.on("click", this.pointClick);
        this.pointObj[v.id] = marker;
        return marker;
      });
      Object.keys(this.pointObj).forEach((k) => {
        if (!pauseObj[k]) {
          delete this.pointObj[k];
        }
      });
      if (!this.pointMarkers) {
        this.pointMarkers = new this.AMap.MarkerClusterer(this.map, Object.values(this.pointObj), {
          maxZoom: 16,
          zoomOnClick: false,
          styles: [
            {
              url: he1,
              size: new this.AMap.Size(25, 25),
              offset: new this.AMap.Pixel(-12, -22),
              textColor: "#fff",
            },
          ],
        });
        this.pointMarkers.on("click", this.pointHeClick);
      } else {
        this.pointMarkers.setMarkers(Object.values(this.pointObj));
      }
    },
    fresh() {
      this.pointObj = {};
      this.moveend();
    },
    // 反馈
    singleFeedback(cardItem) {
      this.$emit("singleFeedback", cardItem);
    },
    moveend() {
      this.getList();
      this.show = false;
    },
    mapClick(e) {
      this.show = false;
    },
    pointHeClick(e) {
      this.orderList = e.markers.reduce((pre, cur) => {
        pre.push(cur.getExtData());
        return pre;
      }, []);
      this.$nextTick(() => {
        this.show = true;
      });
    },
    pointClick(e) {
      this.orderList = [e.target.getExtData()];
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.mapContainer {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  #containerMap {
    width: 100%;
    height: 100%;
  }
}
.popup-div-title {
  flex-shrink: 0;
  padding: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
::v-deep .van-popup {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.12);
  .popup-div-title {
    flex-shrink: 0;
  }
  .popup-div-content {
    flex: 1;
    overflow-y: auto;
    .border {
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }
  }
}
</style>
