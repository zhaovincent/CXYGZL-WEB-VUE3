import { reactive } from 'vue'
// 引入全部图标
// import * as Icons from "@element-plus/icons"

// 按需引入图标
import {
	CloseBold,
	Close,
	Plus,AlarmClock,
	Star,ChatLineSquare,
	Delete,Calendar,
	UserFilled,StarFilled,ArrowDown,
	Finished,
	Loading,ShoppingBag,
	Connection,Position,Back,
	Edit,
	EditPen,CirclePlusFilled,
	Money,Timer,
	OfficeBuilding,CirclePlus,
	Select,
	More,
	Picture,RemoveFilled,
	User,
	Upload,
	FolderOpened,
	CollectionTag,
	FirstAidKit
} from '@element-plus/icons-vue'

const dictIcon = reactive({
	'CloseBold': CloseBold,
	'Close': Close,
	'ChatLineSquare': ChatLineSquare,
	'Calendar': Calendar,
	'CirclePlusFilled': CirclePlusFilled,
	'ArrowDown': ArrowDown,
	'EditPen': EditPen,
	'RemoveFilled': RemoveFilled,
	'CirclePlus': CirclePlus,
	'Timer': Timer,
	'Position': Position,
	'ShoppingBag': ShoppingBag,
	'Back': Back,
	'Delete': Delete,
	'StarFilled': StarFilled,
	'AlarmClock': AlarmClock,
	'Picture': Picture,
	'More': More,
	'FirstAidKit': FirstAidKit,
	'User': User,
	'OfficeBuilding': OfficeBuilding,
	'CollectionTag': CollectionTag,
	'Upload': Upload,
	'Plus': Plus,
	'Finished': Finished,
	'Select': Select,
	'Money': Money,
	'Star': Star,
	'UserFilled': UserFilled,
	'Loading': Loading,
	'Connection': Connection,
	'Edit': Edit,
	'FolderOpened': FolderOpened
})

const installIcon = (app) => {
	// 便于模板获取
	app.config.globalProperties.$icon = dictIcon
	// 使用全部图标
	// app.config.globalProperties.$icon = Icons
}

export default installIcon
