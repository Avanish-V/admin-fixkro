import { apiClient } from "./apiClient";

export const uploadFile = async (file: File, folder: string = "general"): Promise<string> => {
    // 1. Get extension and content type
    const extension = file.name.split('.').pop() || "bin";
    const contentType = file.type || "application/octet-stream";

    // 2. Request presigned URL from backend
    const presignedResponse = await apiClient.get<{uploadUrl: string, publicUrl: string}>(
        `/files/presigned-put-url?folder=${folder}&extension=${extension}&contentType=${encodeURIComponent(contentType)}`
    );

    if (!presignedResponse.ok || !presignedResponse.data.data) {
        throw new Error(presignedResponse.data.error?.message || "Failed to initiate file upload");
    }

    const { uploadUrl, publicUrl } = presignedResponse.data.data;

    // 3. Upload directly to S3 via PUT
    const s3Response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
            "Content-Type": contentType
        },
        body: file
    });

    if (!s3Response.ok) {
        throw new Error(`Failed to upload to S3: ${s3Response.statusText}`);
    }

    // 4. Return the final public URL
    return publicUrl;
};
