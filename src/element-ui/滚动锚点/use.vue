<template>
  <div class="cross-container-c">
    <commonAnchor v-if="visible" :list="anchorList" container="cross-container-c" />
    <div v-for="item in tableData" :key="item.indicatorCode">
      <div v-if="item.indicatorCode === 'faceAlive'" id="cross-h-1" class="item">
        <div class="header">
          <span class="icon"></span>
          <span>活跃性</span>
        </div>
        <div class="content">
          <div class="content-item">
            <div class="label">抓拍总量</div>
            <div class="des">指定日期的人脸抓拍数据总量（默认今日）</div>
          </div>
          <div class="content-item">
            <div class="label">抓拍机活跃</div>
            <div class="des">抓拍机当日有接收到人脸数据</div>
          </div>
          <div class="content-item">
            <div class="label">抓拍机不活跃</div>
            <div class="des">抓拍机当日未接收到人脸数据</div>
          </div>
          <div class="content-item">
            <div class="label">抓拍机数据少</div>
            <div class="des">
              抓拍机当日人脸数据少于<CommonInput
                v-model="item.dataLessNum"
                :max="9999"
                :edit="edit"
                unit="张"
              />
            </div>
          </div>
          <div class="content-item">
            <div class="label">无数据上传时长</div>
            <div class="des">
              抓拍机无抓拍数据上报的时长，超过<CommonInput
                v-model="item.noDataOverHour"
                :max="24"
                :edit="edit"
                unit="小时"
              />为异常，反之正常
            </div>
          </div>
          <div class="content-item">
            <div class="label">抓拍机活跃率</div>
            <div class="des">活跃抓拍机数/抓拍机总数*100%</div>
          </div>
        </div>
      </div>
      <div v-else-if="item.indicatorCode === 'faceStable'" id="cross-h-2" class="item">
        <div class="header">
          <span class="icon"></span>
          <span>稳定性</span>
        </div>
        <div class="content">
          <div class="content-item">
            <div class="label">周同比</div>
            <div class="des">
              本周同时段和上周同时段的人脸抓拍数据量对比。同比超过±<CommonInput
                v-model="item.stableNormalRate"
                :edit="edit"
                unit="%"
              />则认为骤升/骤降，反之则为正常
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="item.indicatorCode === 'faceVqd'" id="cross-h-3" class="item">
        <div class="header">
          <span class="icon"></span>
          <span>图像质量（抽检）</span>
        </div>
        <div class="content">
          <div class="content-item">
            <div class="label">检测规则</div>
            <div class="des">
              从<CommonInput
                v-model="item.vqdCheckMinHour"
                :max="24"
                :edit="edit"
                unit="点"
              />至<CommonInput
                v-model="item.vqdCheckMaxHour"
                :max="24"
                :edit="edit"
                unit="点"
              />每<CommonInput
                v-model="item.vqdCheckEverHour"
                :max="24"
                :edit="edit"
                unit="小时"
              />抽检一次，每次抽检<CommonInput
                v-model="item.vqdCheckEverPic"
                :max="9999"
                :edit="edit"
                unit="张"
              />图片
            </div>
          </div>
          <div class="content-item">
            <div class="label">抓拍机图像质量正常</div>
            <div class="des">
              抓拍机图像质量正常率≥<CommonInput
                v-model="item.vqdNormalRate"
                :edit="edit"
                unit="%"
              />则该抓拍机图像质量正常，反之异常。<br />（1）
              抽检的人脸数据，不存在出信号丢失、图像模糊、图片偏亮、图像过暗、黑白图像、图像偏色、噪声干扰、条纹干扰、对比度、树叶遮挡、异物遮挡、场景变换任一异常，则视为图像质量正常，反之异常
            </div>
          </div>
          <div class="content-item">
            <div class="label">抓拍机图像质量正常率</div>
            <div class="des">质量正常的图像数÷抽检图像数 *100%</div>
          </div>
          <div class="content-item">
            <div class="label">区域图像质量正常率</div>
            <div class="des">图像质量正常抓拍机数÷抓拍机总数 *100%</div>
          </div>
        </div>
      </div>
      <div v-else-if="item.indicatorCode === 'faceBigPicture'" id="cross-h-4" class="item">
        <div class="header">
          <span class="icon"></span>
          <span>大图可用（抽检）</span>
        </div>
        <div class="content">
          <div class="content-item">
            <div class="label">检测规则</div>
            <div class="des">
              从<CommonInput
                v-model="item.bigPicCheckMinHour"
                :max="24"
                :edit="edit"
                unit="点"
              />至<CommonInput
                v-model="item.bigPicCheckMaxHour"
                :max="24"
                :edit="edit"
                unit="点"
              />每<CommonInput
                v-model="item.bigPicCheckEverHour"
                :max="24"
                :edit="edit"
                unit="小时"
              />抽检一次，每次抽检<CommonInput
                v-model="item.bigPicCheckEverPic"
                :max="9999"
                :edit="edit"
                unit="张"
              />图片
            </div>
          </div>
          <div class="content-item">
            <div class="label">抓拍机大图正常</div>
            <div class="des">
              抓拍机大图可用率≥<CommonInput
                v-model="item.bigPictureSuccessRate"
                :edit="edit"
                unit="%"
              />则该抓拍机大图正常，反之异常。<br />
              抽检的人脸数据，满足以下所有条件视为大图可用。<br />
              （1） 人脸场景大图URL可以访问；<br />
              （2） 人脸场景大图内有人脸小图<br />
              （3） 人脸场景大图标注抓拍时间或抓拍地点
            </div>
          </div>
          <div class="content-item">
            <div class="label">抓拍机大图可用率</div>
            <div class="des">大图可用的图像数÷抽检图像数*100%</div>
          </div>
          <div class="content-item">
            <div class="label">区域大图可用率</div>
            <div class="des">大图正常抓拍机数÷抓拍机总数 *100%</div>
          </div>
        </div>
      </div>
      <div v-else-if="item.indicatorCode === 'faceSmallPicture'" id="cross-h-5" class="item">
        <div class="header">
          <span class="icon"></span>
          <span>小图可用（抽检）</span>
        </div>
        <div class="content">
          <div class="content-item">
            <div class="label">检测规则</div>
            <div class="des">
              从<CommonInput
                v-model="item.smallPicCheckMinHour"
                :max="24"
                :edit="edit"
                unit="点"
              />至<CommonInput
                v-model="item.smallPicCheckMaxHour"
                :max="24"
                :edit="edit"
                unit="点"
              />每<CommonInput
                v-model="item.smallPicCheckEverHour"
                :max="24"
                :edit="edit"
                unit="小时"
              />抽检一次，每次抽检<CommonInput
                v-model="item.smallPicCheckEverPic"
                :max="9999"
                :edit="edit"
                unit="张"
              />图片
            </div>
          </div>
          <div class="content-item">
            <div class="label">抓拍机小图正常</div>
            <div class="des">
              抓拍机小图可用率≥<CommonInput
                v-model="item.smallPictureSuccessRate"
                :edit="edit"
                unit="%"
              />则该抓拍机大图正常，反之异常。<br />
              抽检的人脸小图数据，URL可以访问，视为小图可用。
            </div>
          </div>
          <div class="content-item">
            <div class="label">抓拍机小图可用率</div>
            <div class="des">小图可用的图像数÷抽检图像数*100%</div>
          </div>
          <div class="content-item">
            <div class="label">区域小图可用率</div>
            <div class="des">小图正常抓拍机数÷抓拍机总数 *100%</div>
          </div>
        </div>
      </div>
      <div v-else-if="item.indicatorCode === 'faceTimely'" id="cross-h-6" class="item">
        <div class="header">
          <span class="icon"></span>
          <span>上传及时</span>
        </div>
        <div class="content">
          <div class="content-item">
            <div class="label">抓拍机上传及时</div>
            <div class="des">
              抓拍机上传及时率≥<CommonInput
                v-model="item.timelySuccessRate"
                :edit="edit"
                unit="%"
              />则该抓拍机上传及时，反之不及时。<br />（1）
              接收的人脸数据从抓拍到接收的延迟≤<CommonInput
                v-model="item.uploadDelaySec"
                :max="60"
                :edit="edit"
                unit="秒"
              />该条数据上传及时，反之不及时
            </div>
          </div>
          <div class="content-item">
            <div class="label">抓拍机上传及时率</div>
            <div class="des">上传及时的图像数÷图像总数*100%</div>
          </div>
          <div class="content-item">
            <div class="label">区域上传及时率</div>
            <div class="des">上传及时抓拍机数÷有过车数据的抓拍机数 *100%</div>
          </div>
        </div>
      </div>
      <div v-else-if="item.indicatorCode === 'faceClock'" id="cross-h-7" class="item">
        <div class="header">
          <span class="icon"></span>
          <span>时钟准确</span>
        </div>
        <div class="content">
          <div class="content-item">
            <div class="label">抓拍机时钟准确</div>
            <div class="des">
              抓拍机时钟准确率≥<CommonInput
                v-model="item.clockSuccessRate"
                :edit="edit"
                unit="%"
              />则该抓拍机时钟准确，反之不准确。<br />（1）
              接收的人脸数据抓拍时间晚于接收时间≤<CommonInput
                v-model="item.clockReciveSec"
                :max="60"
                :edit="edit"
                unit="秒"
              />则该条数据认为时钟准确
            </div>
          </div>
          <div class="content-item">
            <div class="label">抓拍机时钟准确率</div>
            <div class="des">时钟准确的图像数÷图像总数 *100%</div>
          </div>
          <div class="content-item">
            <div class="label">区域时钟准确率</div>
            <div class="des">时钟准确抓拍机数÷有人脸数据的抓拍机数 *100%</div>
          </div>
        </div>
      </div>
      <div v-else-if="item.indicatorCode === 'faceQualified'" id="cross-h-8" class="item">
        <div class="header">
          <span class="icon"></span>
          <span>图片合格（抽检）</span>
        </div>
        <div class="content">
          <div class="content-item">
            <div class="label">抓拍机数据有效</div>
            <div class="des">
              抓拍机图片合格率≥<CommonInput
                v-model="item.picQualifiedRate"
                :edit="edit"
                unit="%"
              />则该抓拍机图片合格，反之不合格。<br />
              （1） 抽检的人脸小图中只有一个人脸，该条数据认为合格。<br />
              （2） 抽检的人脸小图中包含不止一个人脸，该条数据认为不合格
            </div>
          </div>
          <div class="content-item">
            <div class="label">抓拍机数据有效率</div>
            <div class="des">数据有效的图像数÷图像总数 *100%</div>
          </div>
          <div class="content-item">
            <div class="label">区域数据有效率</div>
            <div class="des">数据有效抓拍机数÷有人脸数据的抓拍机数 *100%</div>
          </div>
        </div>
      </div>
      <div v-else-if="item.indicatorCode === 'faceDataEffect'" id="cross-h-9" class="item">
        <div class="header">
          <span class="icon"></span>
          <span>图片有效</span>
        </div>
        <div class="content">
          <div class="content-item">
            <div class="label">抓拍机数据有效</div>
            <div class="des">
              抓拍机图片有效率≥<CommonInput
                v-model="item.dataEffectRate"
                :edit="edit"
                unit="%"
              />则该抓拍机数据有效，反之无效。<br />
              （1）
              接收的人脸数据小图中人脸清晰度、瞳距、俯仰角等综合评分高于或等于0.4分的，该条数据认为有效。<br />
              （2）
              接收的人脸数据对小图进行解析，未能检测到人脸的，或者小图中人脸清晰度、瞳距、俯仰角等综合评分低于0.4分，该条数据认为无效。
            </div>
          </div>
          <div class="content-item">
            <div class="label">抓拍机数据有效率</div>
            <div class="des">数据有效的图像数÷图像总数 *100%</div>
          </div>
          <div class="content-item">
            <div class="label">区域数据有效率</div>
            <div class="des">数据有效抓拍机数÷有人脸数据的抓拍机数 *100%</div>
          </div>
        </div>
      </div>
      <div v-else-if="item.indicatorCode === 'faceDataUnique'" id="cross-h-10" class="item">
        <div class="header">
          <span class="icon"></span>
          <span>数据唯一</span>
        </div>
        <div class="content">
          <div class="content-item">
            <div class="label">抓拍机数据唯一</div>
            <div class="des">
              抓拍机数据唯一率≥<CommonInput
                v-model="item.dataUniqueRate"
                :edit="edit"
                unit="%"
              />则该抓拍机数据唯一，反之不唯一。<br />
              1）
              接收的人脸数据设备编号、人脸评分、抓拍时间重复的人脸抓拍数据不重复的，该条数据认为唯一。<br />
              （2）
              接收的人脸数据设备编号、人脸评分、抓拍时间重复的人脸抓拍数据有重复的，该条数据认为不唯一
            </div>
          </div>
          <div class="content-item">
            <div class="label">抓拍机数据唯一率</div>
            <div class="des">数据唯一的图像数÷图像总数 *100%</div>
          </div>
          <div class="content-item">
            <div class="label">区域数据唯一率</div>
            <div class="des">数据唯一抓拍机数÷有人脸数据的抓拍机数 *100%</div>
          </div>
        </div>
      </div>
      <div v-else-if="item.indicatorCode === 'faceDataRelation'" id="cross-h-11" class="item">
        <div class="header">
          <span class="icon"></span>
          <span>数据关联</span>
        </div>
        <div class="content">
          <div class="content-item">
            <div class="label">未上报卡口</div>
            <div class="des">上传的人脸数据中关联的卡口与已有卡口信息不匹配</div>
          </div>
          <div class="content-item">
            <div class="label">未上报抓拍机</div>
            <div class="des">上传的人脸数据中关联的抓拍机与已有抓拍机信息不匹配</div>
          </div>
          <div class="content-item">
            <div class="label">未上报数据</div>
            <div class="des">未上报抓拍机产生的人脸数据总量</div>
          </div>
          <div class="content-item">
            <div class="label">抓拍机上报率</div>
            <div class="des">已上报抓拍机数÷抓拍机总数 *100%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommonInput from "@/pages/cross/bayonet/components/CommonInput.vue";
import commonAnchor from "@/pages/cross/bayonet/components/commonAnchor.vue";

export default {
  components: { CommonInput, commonAnchor },
  props: {
    visible: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    tableData: { type: Array, default: () => [] },
  },
  data() {
    return {
      anchorList: [
        { href: "#cross-h-1", title: "活跃性" },
        { href: "#cross-h-2", title: "稳定性" },
        { href: "#cross-h-3", title: "图像质量（抽检）" },
        { href: "#cross-h-4", title: "大图可用（抽检）" },
        { href: "#cross-h-5", title: "小图可用（抽检）" },
        { href: "#cross-h-6", title: "上传及时" },
        { href: "#cross-h-7", title: "时钟准确" },
        { href: "#cross-h-8", title: "图片合格（抽检）" },
        { href: "#cross-h-9", title: "图片有效" },
        { href: "#cross-h-10", title: "数据唯一" },
        { href: "#cross-h-11", title: "数据关联" },
      ],
    };
  },
};
</script>

<style scoped lang="scss">
.cross-container-c {
  width: 100%;
  height: 100%;
  padding: 12px 12px 0px 12px;
  overflow-y: auto;
}
.item {
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.7);
  .header {
    line-height: 32px;
    font-size: 16px;
    .icon {
      display: inline-block;
      background-color: #176cff;
      width: 6px;
      height: 12px;
      margin-right: 8px;
    }
  }
  .content {
    font-size: 14px;
    &-item {
      display: flex;
      border: 1px solid rgba(0, 0, 0, 0.12);
      overflow: hidden;
      margin-top: -1px;
      .label {
        width: 200px;
        flex-shrink: 0;
        padding: 8px 12px 8px 12px;
        display: flex;
        align-items: center;
        border-right: 1px solid rgba(0, 0, 0, 0.12);
        background-color: #f5f5f5;
      }
      .des {
        flex: 1;
        padding: 8px 12px 8px 12px;
      }
    }
  }
}
</style>
