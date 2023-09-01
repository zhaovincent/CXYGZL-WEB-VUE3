import {FlowVO} from "../flow/types";

/**
 * 菜单查询参数类型
 */
export interface Group {
	groupName?: string;
}

/**
 * 菜单视图对象类型
 */
export interface GroupVO {
	/**
	 * 子菜单
	 */
	items?: FlowVO[];

	/**
	 * 菜单ID
	 */
	id?: string;
	/**
	 * 菜单名称
	 */
	name?: string;

}
