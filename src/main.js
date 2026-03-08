import { createApp, ref } from 'vue'
import { addNewFileMenuEntry, Permission } from '@nextcloud/files'
import { translate, translatePlural } from '@nextcloud/l10n'
import Transfer from './Transfer.vue'
import TransferSvg from '@mdi/svg/svg/cloud-upload.svg'

// Mount the modal component into the DOM
const vueMountElement = document.createElement('div')
document.body.append(vueMountElement)

const app = createApp(Transfer)
app.config.globalProperties.t = translate
app.config.globalProperties.n = translatePlural

const transferInstance = app.mount(vueMountElement)

// Register the "Upload by link" entry in the Files new-file menu
addNewFileMenuEntry({
	id: 'transfer',
	displayName: translate('transfer', 'Upload by link'),
	iconSvgInline: TransferSvg,
	order: -1,

	// Only show in folders where the user can create files
	enabled: (context) => (context.permissions & Permission.CREATE) !== 0,

	handler(context) {
		transferInstance.open(context)
	},
})
