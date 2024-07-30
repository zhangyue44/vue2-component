
// 经纬度转换成三角函数中度分表形式
    rad (d) {
      return d * Math.PI / 180.0
    },
    // 根据经纬度计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
    // getDistance (lat1, lng1, lat2, lng2) {
    //   const radLat1 = this.rad(lat1)
    //   const radLat2 = this.rad(lat2)
    //   const a = radLat1 - radLat2
    //   const b = this.rad(lng1) - this.rad(lng2)
    //   let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    //       Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
    //   s = s * 6378.137 // EARTH_RADIUS;
    //   s = Math.round(s * 10000) / 10000 * 1000 // 输出为m
    //   return s
    // },
    getDistance (lat1, lng1, lat2, lng2) {
      var radLat1 = lat1 * Math.PI / 180.0
      var radLat2 = lat2 * Math.PI / 180.0
      var a = radLat1 - radLat2
      var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0
      var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
      s = s * 6378.137// EARTH_RADIUS;
      s = Math.round(s * 10000) / 10000 * 1000
      return s
    },
