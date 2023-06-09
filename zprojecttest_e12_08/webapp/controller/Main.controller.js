sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/viz/ui5/data/FlattenedDataset",
    "sap/viz/ui5/controls/common/feeds/FeedItem"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,FlattenedDataset,FeedItem) {
        "use strict";

        return Controller.extend("zprojectteste1208.controller.Main", {
            onInit: function () {
                this._setChartInView();
                
                this._setChartInController();
            },
            _setChartInView : function(){
                var oData = {
                    list : [
                        {name : '국어', rate :'100', cost : '10'},
                        {name : '영어', rate :'50', cost : '20'},
                        {name : '수학', rate :'80', cost : '30'},
                        {name : '도덕', rate :'80', cost : '60'},
                        {name : '체육', rate :'70', cost : '44'},
                    ],                    
                };
                this.getView().setModel(new JSONModel(oData),"view");

                // popover와 연동
                this.byId("idViewPopover").connect(this.byId("idViewChart").getVizUid());
            },
            _setChartInController : function(){   
                
                // dataset
                var oData  = {
                    sales : [ 
                        {product : "Jackets", amount : "65"},
                        {product : "Shirts", amount : "70"},
                        {product : "Pants", amount : "85"},
                        {product : "Coats", amount : "92"},
                        {product : "Purse", amount : "15"},
                    ]
                }
                this.getView().setModel(new JSONModel(oData),"cont");

                // 차트 컨트롤 세팅
                var oChart = this.byId("idConChart");
                var oColDataSet = new FlattenedDataset({
                    dimensions : [{name : 'Product', value : '{cont>product}'}],
                    measures : [{name : 'Amount', value : '{cont>amount}'}],
                    data : {
                        path : "cont>/sales" //cont 모델의 sales를 바라봄
                    }
                });

                oChart.setDataset(oColDataSet);

                // feedItem 
                var oFeedValuesAxis = new FeedItem({
                    type : "Measure",
                    uid : "valueAxis",
                    values : ["Amount"]
                });
                var oFeedCategory = new FeedItem({
                    type : "Dimension",
                    uid : "categoryAxis",
                    values : ["Product"]
                });
                oChart.addFeed(oFeedValuesAxis);
                oChart.addFeed(oFeedCategory);

                // VizFrame 프로퍼티 추가
                oChart.setVizProperties({
                    title : { 
                        text : "Sales Data",
                        plotArea : {colorPalette:['#FFBBBB']}    
                    },

                })
            }
        }); // extend
    }); // define
