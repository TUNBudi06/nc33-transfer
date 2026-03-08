import axios from '@nextcloud/axios'
import { showInfo, showError } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'

/**
 * @param {string} path - Destination path on the server
 * @param {string} url - Source URL to download from
 * @param {string} hashAlgo - Hash algorithm (md5/sha1/sha256/sha512) or empty string
 * @param {string} hash - Expected checksum or empty string
 */
export async function enqueueTransfer(path, url, hashAlgo, hash) {
	try {
		await axios.post(
			generateUrl('/apps/transfer/transfer'),
			{ path, url, hashAlgo, hash },
		)
		showInfo(t('transfer', 'The upload is queued and will begin processing soon.'))
	} catch (error) {
		console.error('[transfer] enqueueTransfer failed', error)
		const status = error?.response?.status
		if (status) {
			showError(t(
				'transfer',
				'Failed to add the upload to the queue. The server responded with status code {statusCode}.',
				{ statusCode: status },
			))
		} else {
			showError(t('transfer', 'Failed to add the upload to the queue.'))
		}
	}
}
