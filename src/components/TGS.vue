<template>
  <div>
    <h1>TGSシリーズ抵抗計算</h1>
    <svg width="640px" height="480px" viewBox="0 0 640 480">
      <g stroke="black" stroke-width="2" fill="none">
        <line x1="20" x2="240" y1="20" y2="20" />
        <line x1="80" x2="80" y1="20" y2="120" />
        <rect x="60" y="120" width="40" height="80" />
        <g transform="translate(80, 160)" text-anchor="middle" stroke="none" fill="black">
        <text x="0" y="-5" dominant-baseline="baseline">{{ (rn1 / 1000).toFixed(2) }}</text>
        <text x="0" y="+5" dominant-baseline="hanging">kΩ</text>
        </g>
        <line x1="80" x2="80" y1="200" y2="260" />
        <rect x="60" y="260" width="40" height="80" />
        <g transform="translate(80, 300)" text-anchor="middle" stroke="none" fill="black">
        <text x="0" y="-5" dominant-baseline="baseline">{{ (rn2 / 1000).toFixed(2) }}</text>
        <text x="0" y="+5" dominant-baseline="hanging">kΩ</text>
        </g>
        <line x1="80" x2="80" y1="340" y2="400" />
        <line x1="20" x2="400" y1="400" y2="400" />

        <line x1="240" x2="240" y1="20" y2="180" />
        <circle cx="220" cy="100" r="60" />
        <line x1="240" x2="240" y1="180" y2="250" />
        <rect x="220" width="40" y="250" height="80" />
        <g transform="translate(240, 290)" text-anchor="middle" stroke="none" fill="black">
        <text x="0" y="-5" dominant-baseline="baseline">{{ (rt / 1000).toFixed(2) }}</text>
        <text x="0" y="+5" dominant-baseline="hanging">kΩ</text>
        </g>
        <line x1="240" x2="240" y1="330" y2="400" />
        <line x1="240" x2="400" y1="180" y2="180" />
        <line x1="400" x2="400" y1="180" y2="200" />
        <rect x="380" width="40" y="200" height="80" />
        <g transform="translate(400, 240)" text-anchor="middle" stroke="none" fill="black">
        <text x="0" y="-5" dominant-baseline="baseline">{{ (ra1 / 1000).toFixed(2) }}</text>
        <text x="0" y="+5" dominant-baseline="hanging">kΩ</text>
        </g>
        <line x1="400" x2="400" y1="280" y2="300" />
        <rect x="380" width="40" y="300" height="80" />
        <g transform="translate(400, 340)" text-anchor="middle" stroke="none" fill="black">
        <text x="0" y="-5" dominant-baseline="baseline">{{ (ra2 / 1000).toFixed(2) }}</text>
        <text x="0" y="+5" dominant-baseline="hanging">kΩ</text>
        </g>
        <line x1="400" x2="400" y1="380" y2="400" />

        <circle cx="80" cy="230" r="5" fill="black" />
        <line x1="40" x2="80" y1="230" y2="230" />

        <circle cx="400" cy="290" r="5" fill="black" />
        <line x1="400" x2="440" y1="290" y2="290" />
      </g>
      <g stroke="none" fill="black">
        <text x="10" y="10">Vcc</text>
        <foreignObject
          requiredExtensions="http://www.w3.org/1999/xhtml"
          x="10"
          y="25"
          width="60"
          height="30"
        >
          <label style="text-align: left;">
            <input type="number" v-model="vcc" step="0.1" style="width: 3em" v-on:input="calc" />V
          </label>
        </foreignObject>
        <text x="10" y="420">GND</text>
        <text x="300" y="100">Sensor</text>
        <foreignObject
          requiredExtensions="http://www.w3.org/1999/xhtml"
          x="290"
          y="110"
          width="200"
          height="150"
        >
          <label>
            初期抵抗値
            <input type="number" v-model="kRs" step="0.1" style="width: 4em" v-on:input="calc" />kΩ
          </label><br />
          <label>測定レンジ x
            <input type="number" v-model="range" step="0.1" style="width: 4em" v-on:input="calc" />
          </label><br />
          <label>最大定格電力<input type="number" v-model="mMaxPower" step="1" style="width: 3.5em;" v-on:input="calc" readonly />mW</label>
        </foreignObject>
        <text x="20" y="220">ADC(-)</text>
        <text x="450" y="290">ADC(+)</text>
        <foreignObject
          requiredExtensions="http://www.w3.org/1999/xhtml"
          x="420"
          y="300"
          width="120"
          height="150"
        >
          <label>測定レンジ<br />±
            <input type="number" v-model="v_range" step="0.1" style="width: 4em" readonly v-on:input="calc" />V
          </label>
          </foreignObject>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: "TGS",
  computed: {
    kRs: {
      get: function () { return this.rs / 1000; },
      set: function (value) { this.rs = value * 1000; },
    },
    mMaxPower: {
      get: function () { return this.max_power * 1000; },
      set: function (value) { this.rmax_power = value / 1000; },
    },
  },
  data: () => ({
    vcc: 5,
    rs: 20000,
    range: 0.1,
    max_power: 0.015,

    v_range: 2.048,

    rn1: 0,
    rn2: 0,

    rt: 0,
    ra1: 0,
    ra2: 0,
  }),
  methods: {
    calc: function () {
      const rmin = this.vcc * this.vcc / this.max_power;
      this.rt = rmin * 2;
      const Imin = this.vcc / (this.rs + rmin) / 2;
      const Imax = this.vcc / (this.rs * this.range + rmin) / 2;
      this.ra2 = this.v_range * 0.85 / (Imax - Imin);
      this.ra1 = this.rt - this.ra2;

      const pn = 0.01;
      const In = pn / this.vcc;
      const vn = Imin * this.ra2;
      this.rn2 = vn / In;
      this.rn1 = (this.vcc - vn) / In;
    },
  },
  mounted: function () {
    this.calc();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
