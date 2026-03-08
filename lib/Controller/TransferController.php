<?php
namespace OCA\Transfer\Controller;

use OCP\AppFramework\Attributes\NoAdminRequired;
use OCP\AppFramework\Attributes\NoCSRFRequired;
use OCP\BackgroundJob\IJobList;
use OCP\IRequest;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;

use OCA\Transfer\BackgroundJob\TransferJob;
use OCA\Transfer\Service\TransferService;

class TransferController extends Controller {
	private string $userId;
	private IJobList $jobList;
	private TransferService $service;

	public function __construct(
		string $AppName,
		IRequest $request,
		IJobList $jobList,
		TransferService $service,
		string $UserId
	) {
		parent::__construct($AppName, $request);
		$this->userId = $UserId;
		$this->jobList = $jobList;
		$this->service = $service;
	}

	#[NoAdminRequired]
	#[NoCSRFRequired]
	public function transfer(string $path, string $url, string $hashAlgo, string $hash): DataResponse {
		$this->jobList->add(TransferJob::class, [
			'userId'   => $this->userId,
			'path'     => $path,
			'url'      => $url,
			'hashAlgo' => $hashAlgo,
			'hash'     => $hash,
		]);

		return new DataResponse(true, Http::STATUS_OK);
	}
}
