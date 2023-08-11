import { RectNode, RectNodeModel } from '@logicflow/core'

// 自定义节点的 model
// 自定义节点的 view
class CxygzlRectView extends RectNode {}


class CxygzlRectModel extends RectNodeModel {
	setAttributes() {
		// 读取数据属性的 properties.color，并根据其值设置样式属性 stroke
		let properties = this.properties;
		var status=properties.status;
 		super.setStyle("stroke","grey")
		if(status==1){
			//进行中
			super.setStyle("stroke","green")

		}
		if(status==2){
			//已结束
			super.setStyle("stroke","blue")

		}
		if(status==3){
			//已撤销
			super.setStyle("stroke","red")

		}
		this.width=100
		this.radius=5
		this.height=50
	}
}

export {CxygzlRectModel,CxygzlRectView}

// lf.register({
// 	type: 'customNodeType',
// 	view: View,
// 	model: Model,
// });