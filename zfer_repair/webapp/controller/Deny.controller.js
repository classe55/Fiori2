
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,Filter,MessageBox,MessageToast) {
        "use strict";
        var sReprid = '';
        return Controller.extend("ER.zferrepair.controller.Deny", {
          formatter: {
            dateTime: function (oDate) {
              let  oDateTimeInstance =
                sap.ui.core.format.DateFormat.getDateTimeInstance({
                  pattern: "yyyy-MM-dd",
                });
              return oDateTimeInstance.format(oDate);
            }
          },
          onInit: function () {
            // 라우터 이벤트 등록
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter
              .getRoute("RouteDeny")
              .attachPatternMatched(this._onPatternMatched, this);
            this._defaultSet();   
            var sEmpId ;         

          },
          _defaultSet: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oModel = this.getOwnerComponent().getModel();
            this.oDenyTable = this.byId("idMatTable");
          },
          _onPatternMatched: function (oEvent) {
            const oModel = this.getView().getModel();
            const oArgs = oEvent.getParameter("arguments");
            sReprid = oArgs.ReprId;
            
            // form 채우기
            var sEmpPath = "/EmployeeSet('" + oArgs.Approvalid + "')";
            oModel.read(sEmpPath, {
              success: function (oReturn) {
                this.byId("EmpInfo").setText( "사번 : " + oReturn.Employeeid );
                this.byId("idDept").setText("부서 : " + oReturn.Branchname + " " + oReturn.Deptname );
                this.byId("idName").setText("이름 : " + oReturn.Name + " " + oReturn.Rankname );
                this.byId("idTel").setText(oReturn.Telno.substr(0, 3) + "-"+oReturn.Telno.substr(3, 4) + "-" +oReturn.Telno.substr(7, 5));
                this.byId("idEmail").setText(oReturn.Email);
                
                if(_rootPath){
                  this.byId("idLoginImage").setSrc(_rootPath+'/img/'+oReturn.Sapid+'.png');
                }else{
                  this.byId("idLoginImage").setSrc('/img/'+oReturn.Sapid+'.png');
                }

              }.bind(this),
              error: function () {
                sap.m.MessageToast.show("Error!");
              },
            });
          
            var sDenyPath = "/Repair_DenySet('" + oArgs.Reprid + "')";
            this.oModel.getProperty(sDenyPath);
            oModel.read(sDenyPath,{
              success : function(oReturn){
                console.log(oReturn);
                this.byId("idReprid").setText(oReturn.Reprid);                
                this.byId("idInspectid").setText(oReturn.Inspectid);                
                var formattedDate = this.formatter.dateTime(oReturn.Appdate); // 날짜 포맷 변경
                this.byId("idAppdate").setText(formattedDate);
                this.byId("idReprdescArea").setValue(oReturn.Reprdesc);
                this.byId("idReturndesc").setText(oReturn.Returndesc);                
              }.bind(this)
            })
          },
          // handleFullScreen: function () {

          //   var sDenyPath = "/Repair_DenySet('" + sReprid + "')";
          //   this.oModel.getProperty(sDenyPath);
          //   this.oModel.read(sDenyPath,{
          //     success : function(oReturn){
          //       var sID = oReturn.Approvalid;
          //     }.bind(this)
          //   })


          //   this.oRouter.navTo("RouteDeny", {
          //     layout: sap.f.LayoutType.BeginColumnFullScree,
          //     Reprid: this.getView().byId('idReprid').getText(),
          //     Approvalid: sID
          //   });
          // },
          handleClose: function () {
            this.oRouter.navTo("RouteMain", {layout: sap.f.LayoutType.BeginColumnFullScreen   });

          },

          onRegister: function () {
            var sId = this.byId('idReprid').getText();
            var sDesc = this.byId('idReprdescArea').getValue();
            var that = this;

            if(!sDesc){
              MessageBox.error('재상신 내용을 입력해주세요!');
              return;
            }

            var reqData = {
              Reprid: sId,
              Reprdesc: sDesc,
            }; 
            var sUpdatePath = "/Repair_DenySet('" + sId + "')";
            this.oModel.update(sUpdatePath, reqData, {
              success: function () {
               
                MessageBox.confirm("재상신하시겠습니까?", {
                  title: "재상신 등록",
                  actions: [MessageBox.Action.YES],
                  emphasizedAction: MessageBox.Action.YES,
                  onClose: function (oAction) {
                    if (oAction == "YES") {
                      MessageBox.show("재상신되었습니다.");
                      that.oRouter.navTo("RouteMain", {layout: sap.f.LayoutType.BeginColumnFullScreen   });
                    }       
                  }
                });          
              },
              error: function () {
                MessageBox.show("실패 ~!~!");
              }              
            });
            // that.oRouter.navTo("RouteMain", {layout: sap.f.LayoutType.BeginColumnFullScreen   });
          },
          handleLiveChange : function(oEvent){
            var sValue = oEvent.getParameter("value");
            this.byId("liveRepr").setText(sValue);

          }
          ,
          onDetailBtnPress: function () {// 지금 안씀
            var aSelectedIndices = this.oDenyTable.getSelectedIndices();
            var oSelectedRow = this.oDenyTable
              .getContextByIndex(aSelectedIndices)
              .getObject();
            console.log(oSelectedRow);

            var oDialog = this.byId("Dialog");

            if (oDialog) {
              this.byId("DenyText").setValue(
                this.sChangedText || oSelectedRow.Reprdesc
              );
              oDialog.open();
              return;
            }

            this.loadFragment({
              name: "ER.zferrepair.view.fragment.deny",
            }).then(
              function (oDialog) {
                this.byId("DenyText").setValue(
                  this.sChangedText || oSelectedRow.Reprdesc
                );
                oDialog.open();
              }.bind(this)
            );
          },
          onClose: function (oEvent) {
            var oDialog = oEvent.getSource().getParent();
            this.sChangedText = this.byId("DenyText").getValue(); // 닫을 때 변경 후 텍스트를 저장함.
            oDialog.close();
          },
          onEdit : function(oEvent) {
            if(!this.getView().byId('idReprdescArea').getEnabled()){
              this.getView().byId('idReprdescArea').setEnabled(true);
              MessageToast.show('상신 내용을 수정해주세요!');
            }else{
            this.getView().byId('idReprdescArea').setEnabled(false);  
            MessageToast.show('상신 내용 수정 \r\n  완료되었습니다.');
            }    
          },

        });
    });