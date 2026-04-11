import { BaseSDK } from "../base";
import { fileRetrieveEndpoint, videoGenerateEndpoint, videoTaskEndpoint } from "../../client/endpoints";
import { FileRetrieveResponse, VideoRequest, VideoResponse, VideoTaskResponse } from "../../types/api";
import { ModelPartial } from "..";
import { toDataUri } from "../../commands/vision/describe";
import { poll } from "../../polling/poll";
import { downloadFile } from "../../files/download";

export interface VideoAsyncGenerateRequest extends ModelPartial<VideoRequest> {
  async?: boolean;
  pollInterval?: number;
  timeout?: number;
}

export interface VideoDownloadRequest {
  fileId: string;
  outPath: string;
}

export class VideoSDK extends BaseSDK {
  async generate(request: VideoAsyncGenerateRequest & { async: true }): Promise<{taskId: string}>;
  async generate(request: ModelPartial<VideoAsyncGenerateRequest>): Promise<VideoResponse>;
  async generate(request: VideoAsyncGenerateRequest): Promise<VideoResponse | {taskId: string}> {
    const body = {
      ...request,
      model: request.model ?? "MiniMax-Hailuo-2.3",
      first_frame_image: request.first_frame_image && await toDataUri(request.first_frame_image),
    } as VideoRequest

    const url = videoGenerateEndpoint(this.config.baseUrl);

    const res = await this.requestJson<VideoResponse>({
      url,
      method: "POST",
      body,
    });

    const taskId = res.task_id;
    if (request.async) {
      return {taskId};
    }

    const taskUrl = videoTaskEndpoint(this.config.baseUrl, taskId);
    const result = await poll<VideoTaskResponse>(this.config, {
      url: taskUrl,
      intervalSec: request.pollInterval ?? 5,
      timeoutSec: request.timeout ?? this.config.timeout,
      isComplete: (d) => (d as VideoTaskResponse).status === 'Success',
      isFailed: (d) => (d as VideoTaskResponse).status === 'Failed',
      getStatus: (d) => (d as VideoTaskResponse).status,
    });

    return result;
  }

  async getTask({taskId}: {taskId: string}): Promise<VideoTaskResponse> {
    const url = videoTaskEndpoint(this.config.baseUrl, taskId);
    return await this.requestJson<VideoTaskResponse>({ url });
  }

  async download(request: VideoDownloadRequest) {
    const url = fileRetrieveEndpoint(this.config.baseUrl, request.fileId);
    const fileInfo = await this.requestJson<FileRetrieveResponse>({ url });
    const downloadUrl = fileInfo.file?.download_url;
    if (!downloadUrl) {
      throw new Error('No download URL available for this file.');
    }
    const { size } = await downloadFile(downloadUrl, request.outPath, { quiet: true });
    return {
      size,
      save: request.outPath,
      downloadUrl,
    }
  }
}
