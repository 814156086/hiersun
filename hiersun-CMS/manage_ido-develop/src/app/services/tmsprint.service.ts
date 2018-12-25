import { Injectable } from '@angular/core';
declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class TmsprintService {

  constructor() { }
  publicprint(){
    var oPop = window.open('', 'oPop');
    var str = '<!DOCTYPE html>'
    str += '<html>'
    str += '<head>'
    str += '<meta charset="utf-8">'
    str += '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">'
    str += '<style>';
    str += 'body{font-size:14px;line-height:26px;width:80%;margin:30px auto;}table{border-collapse:collapse;margin-top:10px;width:100%}table tr td,table tr th{border:1px solid #ccc;font-size:14px;text-align:center;line-height:36px;}.PageNext{page-break-after:always;}#ordermoney{float:right;}.logo{background: url(https://img.ido-love.com/pc.png) no-repeat 0 0;cursor: pointer; width: 96px;height: 40px;background-position: -332px -18px;display: block; margin: 0 auto;}.tel{margin-top:20px}';
    str += '</style>';
    str += '</head>'
    str += '<body>'
    str += $("#print").html();
    str += '</body>'
    str += '</html>'
    oPop.document.write(str);
    setTimeout(function () {
      oPop.print();
      oPop.close();
    }, 1500)
  }
  publicprint2(){
    var oPop = window.open('', 'oPop');
    var str = '<!DOCTYPE html>'
    str += '<html>'
    str += '<head>'
    str += '<meta charset="utf-8">'
    str += '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">'
    str += '<style>';
    str += 'body{font-size:14px;line-height:26px;width:80%;margin:30px auto;}table{border-collapse:collapse;margin-top:10px;width:100%}table tr td,table tr th{border:1px solid #ccc;font-size:14px;text-align:center;line-height:36px;}.PageNext{page-break-after:always;}#ordermoney{float:right;}.logo{background: url(https://img.ido-love.com/pc.png) no-repeat 0 0;cursor: pointer; width: 96px;height: 40px;background-position: -332px -18px;display: block; margin: 0 auto;}.tel{margin-top:20px}';
    str += '</style>';
    str += '</head>'
    str += '<body>'
    str += $("#print2").html();
    str += '</body>'
    str += '</html>'
    oPop.document.write(str);
    setTimeout(function () {
      oPop.print();
      oPop.close();
    }, 1500)
  }
};
