<template>
  <div>
    <!-- -->
    <button @click="exportWord(1, {id: '123123'})">exportWord</button>
    <button @click="exportPdf(1, {id: '123123'})">exportPdf</button>
  </div>
</template>

<script>
import docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import JSZipUtils from "jszip-utils";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import "../assets/simfang-normal.js";//最先生成的字体js文件
// var docxConverter = require('docx-pdf');

export default {
  name: 'TestTemDoc',

  data() {
    return {
      
    };
  },

  mounted() {
    
  },

  methods: {
    exportWord(index, row) {
      // 读取并获得模板文件的二进制内容
      JSZipUtils.getBinaryContent(
        "/outputValue.docx",
        function (error, content) {
          // 抛出异常
          if (error) {
            throw error;
          }

          // 创建一个PizZip实例，内容为模板的内容
          let zip = new PizZip(content);
          // 创建并加载docxtemplater实例对象
          let doc = new docxtemplater().loadZip(zip);
          // 设置模板变量的值，对象的键需要和模板上的变量名一致，值就是你要放在模板上的值
          let docxData = {
            id: row.id,
            alarmPeopleName: row.alarmPeopleName,
            alarmPosition: row.alarmPosition,
            alarmGis: row.alarmGis,
            alarmPhone: row.alarmPhone,
            alarmTime: row.alarmTime,
            alarmRemark: row.alarmRemark,
            handelPeople: row.handelPeople,
            handlePhone: row.handlePhone,
            statusName: row.statusName,
            alarmLevel: row.alarmLevel,
            handleTime: row.handleTime ? row.handleTime : "",
            handleResult: row.handleResult ? row.handleResult : "",
          };
          doc.setData({
            ...docxData,
          });

          try {
            // 用模板变量的值替换所有模板变量
            doc.render();
          } catch (error) {
            // 抛出异常
            let e = {
              message: error.message,
              name: error.name,
              stack: error.stack,
              properties: error.properties,
            };
            console.log(JSON.stringify({ error: e }));
            throw error;
          }

          // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
          let out = doc.getZip().generate({
            type: "blob",
            mimeType:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          // 将目标文件对象保存为目标类型的文件，并命名
          saveAs(out, `警情信息${row.id}.pdf`);
        }
      );
    },

    exportPdf(index, row) {
      console.log(html2canvas);
      const doc = new jsPDF();
      doc.setFont("simfang");
      // var pageWidth = Math.floor(
      //   doc.internal.pageSize.width || doc.internal.pageSize.getWidth()
      // );
      // var pageHeight = Math.floor(
      //   doc.internal.pageSize.height || doc.internal.pageSize.getHeight()
      // );
      // html2canvas(document.getElementById("chart-total"), {
      //   background: "#ffffff",
      //   dpi: 140,
      // }).then((canvas) => {
        // doc.addImage(canvas, 0, 0, pageWidth - 30, pageHeight - 90);
        const data = [
          { name: "编号", data: row.id, bz: '接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述' },
          { name: "报警人员", data: row.alarmPeopleName },
          { name: "报警位置", data: row.alarmPosition },
          { name: "位置GIS", data: row.alarmGis },
          { name: "报警电话", data: row.alarmPhone },
          { name: "报警时间", data: row.alarmTime },
          { name: "报警详情", data: row.alarmRemark },
          { name: "处理人员", data: row.handelPeople },
          { name: "处理人电话", data: row.handlePhone },
          { name: "处理状态", data: row.statusName },
          { name: "告警级别", data: row.alarmLevel },
          { name: "处理时间", data2: row.id },
          { name: "处理结果", data: row.handleResult },
        ];
        const header = [
          { header: "参数名", dataKey: "name" },
          { header: "参数说明", dataKey: "data1" },
          { header: "参数类型", dataKey: "data3" },
          { header: "出参/入参", dataKey: "data2" },
          { header: "必填", dataKey: "data" },
          { header: "备注", dataKey: "bz" },
        ];
        
        [1,2].forEach((element, idx) => {
          this.autoTable(doc, header, data, idx)
        });
        // this.example(doc)

        // const pageSize = doc.getNumberOfPages();
        
        doc.setLineWidth(0.3);
        doc.setFontSize(12);
        doc.save(`1.pdf`);
      // });
    },

    autoTable(doc, header, data, idx) {
      console.log(doc.autoTableEndPosY() + (idx ? 110 : 10))

      doc.autoTable(
        // ['接口名称（交易代码）', '涉及角色:角色', '涉及角色:角色'], 
        // [
        //   ['涉及角色:角色'],
        //   ['涉及系统:系统'],
        //   ['接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述']
        // ], 
        {
          startY: doc.autoTableEndPosY() + (idx ? 110 : 10) > 300 ? doc.autoTableEndPosY() + (idx ? 110 : 10) - 300 : doc.autoTableEndPosY() + (idx ? 110 : 10),
          theme: "plain",
          // theme: "grid",
        //表格全局样式
        styles: {
          fillColor: [255, 255, 255], //背景色
          font: "simfang", //字体，如果不配置，中文仍会乱码
          textColor: [0, 0, 0], //字体颜色
          halign: "left", // 文字水平布局left, center, right
          valign: "middle", //垂直布局
          overflow: 'linebreak'
        },
        head: [
          [
            {
              content: '接口名称',
              styles: { halign: 'left'},
            },
            {
              content: '涉及角色:角色',
              styles: { halign: 'left'},
            },
            {
              content: '涉及系统:系统',
              styles: { halign: 'left'},
            },
          ],
        ],
        columnStyles: { 
          0: { cellWidth: 60 },
          1: { cellWidth: 60 },
          2: { cellWidth: 60 },
        },
        body: [
          [{
            colSpan: 1,
            content: '请求方式',
            styles: { valign: 'middle', halign: 'left' },
          },
          {
            colSpan: 1,
            content: '参数2',
            styles: { valign: 'middle', halign: 'left' },
          },
          {
            colSpan: 1,
            content: '参数3',
            styles: { valign: 'middle', halign: 'left' },
          }],  
          [{
            colSpan: 3,
            content: '接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述接口描述',
            styles: { valign: 'middle', halign: 'left', fillColor: [230, 230, 230] },
          }]
        ]
      });
       
      doc.autoTable(header, data, {
          theme: "grid", // 主题
          //表格全局样式
          drawRow: function () {
            doc.setFontStyle("bold");
            doc.setFontSize(10);
          },
          styles: {
            fillColor: [255, 255, 255], //背景色
            font: "simfang", //字体，如果不配置，中文仍会乱码
            textColor: [0, 0, 0], //字体颜色
            halign: "center", // 文字水平布局left, center, right
            valign: "middle", //垂直布局
            overflow: 'linebreak'
          },
          //表头样式配置
          headStyles: {
            fillColor: [220, 220, 220],
            lineColor: 200,
            lineWidth: 0.5,
          },
          //列的样式，key值对应header的dataKey
          columnStyles: {
            bz: { columnWidth: 35 },
          },
        });

        doc.addImage('https://th.bing.com/th/id/R.748160bf925a7acb3ba1c9514bbc60db?rik=AYY%2bJ9WcXYIMgw&riu=http%3a%2f%2fseopic.699pic.com%2fphoto%2f50017%2f0822.jpg_wh1200.jpg&ehk=CMVcdZMU6xxsjVjafO70cFcmJvD62suFC1ytk8UuAUk%3d&risl=&pid=ImgRaw&r=0','JPEG', 50, doc.autoTableEndPosY()+10, 100, 100)
        if (doc.autoTableEndPosY()+110 > 300) {
          doc.addPage()
          doc.addImage('https://th.bing.com/th/id/R.748160bf925a7acb3ba1c9514bbc60db?rik=AYY%2bJ9WcXYIMgw&riu=http%3a%2f%2fseopic.699pic.com%2fphoto%2f50017%2f0822.jpg_wh1200.jpg&ehk=CMVcdZMU6xxsjVjafO70cFcmJvD62suFC1ytk8UuAUk%3d&risl=&pid=ImgRaw&r=0','JPEG', 50, doc.autoTableEndPosY()+10 - 300, 100, 100)
        }
      },

    example(doc) {
      // var doc = new jsPDF()
      // doc.text('Nested tables', 14, 16)

      var nestedTableHeight = 100
      var nestedTableCell = {
        content: '',
        // Dynamic height of nested tables are not supported right now
        // so we need to define height of the parent cell
        styles: { minCellHeight: 100 },
      }
      doc.autoTable({
        theme: 'grid',
        head: [['2019', '2020']],
        body: [[nestedTableCell]],
        foot: [['2019', '2020']],
        // startY: 20,
        didDrawCell: function (data) {
          if (data.row.index === 0 && data.row.section === 'body') {
            doc.addImage('https://th.bing.com/th/id/R.748160bf925a7acb3ba1c9514bbc60db?rik=AYY%2bJ9WcXYIMgw&riu=http%3a%2f%2fseopic.699pic.com%2fphoto%2f50017%2f0822.jpg_wh1200.jpg&ehk=CMVcdZMU6xxsjVjafO70cFcmJvD62suFC1ytk8UuAUk%3d&risl=&pid=ImgRaw&r=0','JPEG', doc.autoTableEndPosY(), 100, 100, 100)
          }
        },
        styles: {
          fillColor: [255, 255, 255], //背景色
          font: "simfang", //字体，如果不配置，中文仍会乱码
          textColor: [0, 0, 0], //字体颜色
          halign: "left", // 文字水平布局left, center, right
          valign: "middle", //垂直布局
          overflow: 'linebreak'
        },
      })

      return doc
    }
  }
};
</script>

<style scoped>
/* @font-face {
  font-family: "simfang";
  src: url("../assets/simfang.ttf");
} */
</style>