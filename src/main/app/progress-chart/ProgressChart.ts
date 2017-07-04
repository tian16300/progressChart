
import './index.css';
var template = require('./index.hbs');
var count = 0, timer = null;
interface INodes {
  container?: JQuery;
  circlebox?: JQuery;
  minCircle?: JQuery;
  midCircle?: JQuery;
  maxCircle?: JQuery;
  num?: JQuery;
  unit?: JQuery;
  title?: JQuery;
}
class ProgressChart {
  parentDiv: any;
  params: any;
  static generatedId = () => {
    count++;
    return "ProgressChart" + '_' + count;
  };
  moduleId = ProgressChart.generatedId();
  $dom: JQuery | null = null;
  $nodes: any = {};
  timer: any = null;
  max = 2;
  value:any = 0;
  step = 1;
  run = 0;
  speed = 1;
  _params: any = {};
  constructor(parent:any,options:any){
     this.parentDiv=parent;
     this.params=options||{};
     this.init();
  }
  init() {
    if (!this.$dom) {
      this.process();
      this.wrapper();
      //设置字体样式
      this.setFontsStyle();
      this.setBordersColor();
      this.setCircleSize();
      this.setTextVertical();
      this.setValue();   
    }

  }
  process() {
    var dfs = {};
    var params = $.extend({}, dfs, this.params);
    this._params = params;
    this.max = <number>(this._params.total || this.max);
    this.value = (this._params.value || this.value);
    this.speed = this._params.speed || this.speed;

  }
  wrapper() {
    let params = this._params || {}, $parent: any;
    var $dom = $(template(params));
    this.$dom = $dom;
    $dom.attr("id", this.moduleId);
    this.get$Nodes();
    if ($.trim(this.parentDiv) != "" && typeof this.parentDiv == 'string') {
      $parent = $('#' + this.parentDiv);
    } else if (!$.isPlainObject(this.parentDiv)) {
      $parent = this.parentDiv;
    }
    if ($parent) {
      $parent.append($dom);
    }
  }
  get$Nodes() {
    if (this.$dom) {
      this.$nodes.circlebox = $('.circleProgress-box', this.$dom);
      this.$nodes.maxCircle = $('.circleProgress_wrapper.max', this.$dom);
      this.$nodes.main = {};
      this.$nodes.main.left = $('.circleProgress_wrapper.max .leftcircle', this.$dom);
      this.$nodes.main.right = $('.circleProgress_wrapper.max .rightcircle', this.$dom);
    }
  }
  setCircleSize() {
    //设置宽度
    let width = this.$dom.innerWidth(), height = this.$dom.height() - $('.text-name', this.$dom).height() - 20;
    let w = Math.min(width, height);
    this.$nodes.circlebox.css({ width: w + "px", height: w + "px" });
  }
  //设置边框颜色
  setBordersColor() {
    let theme = this._params.theme || {};
    let sColor = theme.solidBorderColor, aColor = theme.activeColor
    $('.solid-circle', this.$dom).css("border-color", sColor);
    $('.dotted-circle', this.$dom).css("border-color", aColor);
    //最外圆边框宽度 变化 左侧圆
    $('.max .leftcircle', this.$dom).css('border-left-color', aColor);
    $('.max .leftcircle', this.$dom).css('border-bottom-color', aColor);
    //右侧圆
    $('.max .rightcircle', this.$dom).css('border-top-color', aColor);
    $('.max .rightcircle', this.$dom).css('border-right-color', aColor);
  }
  //设置字体样式
  setFontsStyle() {
    //数字样式
    let numberStyle = this._params.numberStyle || {};
    $('.num', this.$dom).css(numberStyle);
    //单位样式
    let unitStyle = this._params.unitStyle || {};
    $('.unit', this.$dom).css(unitStyle);
    //指标名称样式
    let titleStyle = this._params.titleStyle || {};
    $('.text-name', this.$dom).css(titleStyle);

  }
  setTextVertical() {
    var $text = $(".text_wrapper", this.$dom).eq(0), h =$('.num', $text).eq(0).outerHeight() * 0.5 ;
    $text.css("margin-top", "-" + h+'px');
  }
  setValue(value?: any, max?: any) {
    //转数据
    if (typeof value != "undefined" || value != null)
      value = <number>value;
    if (typeof max != "undefined" || max != null)
      max = <number>max;
    if (max === 0)
      max = 1;
    
    //判断
    if (max && max != this.max) {
      this.resetCircle();
    }
    if (value && value < this.value) {
      this.resetCircle();
    }
    if (!max && !value) {
      this.resetCircle();
    }
    if(value==null){
       this.resetCircle();
       this.showValue('--');
       return false;
    }

    this.value = value || this.value;
    this.getDecimal(this.value);
    this.max = max || this.max;
    this.speed = this.value / this.speed;
    this.timer = this.startRun();
  }
  getDecimal(value:number){
    try{
      let temp=value.toString().split(".");
      if(temp.length>1){
         this._params.decimal=temp[1].length;

      }else{
        //取整
        this._params.decimal=0;
      }
    }catch(e){
      console.log(e);

    }
    

  }
  //圆复位
  resetCircle() {
    if (this.timer)
      window.cancelAnimationFrame(this.timer);
    this.$nodes.main.right.css("transform", 'rotate(-135deg)');
    this.$nodes.main.left.css("transform", 'rotate(-135deg)');
    this.run = 0;
  }
  //圆变化
  startRun() {
    this.run = this.run + this.speed;
    if (this.run < this.value) {
      this.showValue();
      this.transFormCircle(this.run);
      //未到达percent
      this.timer = window.requestAnimationFrame(()=>{
        this.startRun();
      } );
    } else if (this.run >= this.value) {
      this.run = parseFloat(this.value);
      this.showValue();
      this.transFormCircle(this.run);
      window.cancelAnimationFrame(this.timer);
    }

    return this.timer;
  }
  showValue(text?:any) {
    let decimal = this._params.decimal || 0;
    let value = this.run;
    let t_value=(<number>value).toFixed(decimal);
    if(text)
    $('.num', this.$dom).eq(0).text(text);
    else{
       $('.num', this.$dom).eq(0).text(t_value);
    }
  }
  update(opts: any) {
    var unit = opts.unit || this._params.unit,
      title = opts.title || this._params.title,
      value = opts.value || this.value,
      max = opts.max || this.max;
    this._params.decimal = opts.decimal || this._params.decimal || 0;
    this.speed = value / this._params._speed;
    //转
    $('.text-name', this.$dom).eq(0).text(title);
    $('.unit', this.$dom).eq(0).text(unit);
    if(opts.value==null){
      this.setValue(null, max);
    }else{
       this.setValue(value, max);
    }
    
  }
  transFormCircle(run: any) {
    let rDeg = -135 + run * (360 / this.max);
    let lDeg = -135 + (run - this.max * 0.5) * (360 / this.max);
    if (run <= this.max * 0.5) {
      //右半圆画
      this.$nodes.main.right.css("transform", 'rotate(' + rDeg + 'deg)');
    } else if (run >= this.max * 0.5) {
      //右半圆不动 左半圆画
      this.$nodes.main.right.css("transform", 'rotate(45deg)');
      this.$nodes.main.left.css("transform", 'rotate(' + lDeg + 'deg)');
    }
  }
  resize(){
      this.setCircleSize();
      this.setTextVertical();
      this.setValue();
  }
  destroy() {
    window.cancelAnimationFrame(this.timer);
    this.$dom.remove();
  }
}
export {ProgressChart};