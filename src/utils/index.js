export function getDaysBetween(date1,date2){
  var  startDate = Date.parse(date1);
  var  endDate = Date.parse(date2);
  if (startDate>endDate){
      return 0;
  }
  if (startDate==endDate){
      return 1;
  }
  var days=(endDate - startDate)/(1*24*60*60*1000);
  return  days;
}
// 转二进制流用的  没用
export function fixdata(data) { //文件流转BinaryString
  var o = "",
  l = 0,
  w = 10240;
  for(; l < data.byteLength / w; ++l) 
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
  return o;
}

export function numFilter(val, fix = 2) {
  if (val !== 0) {
    val = Number(val) // 字符串转为数字，目标数据为数字可不转
    val = '' + val.toFixed(2) // 保留两位小数并转为字符串
    let int = val.slice(0, fix * -1 - 1) // 获取整数
    let ext = val.slice(fix * -1 - 1) // 获取到小数
    int = int.split('').reverse().join('') // 翻转整数
    let temp = '' // 临时变量
    for (let i = 0; i < int.length; i++) {
      temp += int[i]
      if ((i + 1) % 3 === 0 && i !== int.length - 1) {
        temp += ',' // 每隔3个数字拼接一个逗号
      }
    }
    temp = temp.split('').reverse().join('') // 加完逗号之后翻转
    temp = temp + ext // 整数小数拼接
    return temp // 返回
  } else {
    return val
  }
}