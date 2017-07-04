import './main.less';
import { ProgressChart } from './progress-chart';
let box = $('#box').eq(0);
let m = new ProgressChart(box, {
  //保留小数位
  "decimal": "0",
  //转速 参数
  "speed": "50"
});
 m.setValue(20, 50);
