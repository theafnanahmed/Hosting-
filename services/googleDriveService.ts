
/**
 * Google Drive API Helpers for Drive-Native Hosting
 * Handles folder creation, multi-file uploads, and public permissions.
 */

export const createDriveFolder = async (folderName: string, accessToken: string, parentId?: string) => {
    // Create Folder
    const metadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentId ? [parentId] : []
    };

    const response = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(metadata)
    });

    const folder = await response.json();

    // Note: To make it hostable, the folder needs 'reader' permission for 'anyone'
    // This requires an additional API call in a real production environment:
    // POST https://www.googleapis.com/drive/v3/files/{folderId}/permissions
    
    return folder;
};

export const uploadFileToDrive = async (file: File, folderId: string, accessToken: string) => {
    const metadata = {
        name: file.name,
        parents: [folderId],
        // Set proper MIME type for web hosting
        mimeType: file.type || 'text/plain'
    };

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', file);

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        body: formData
    });

    return await response.json();
};

/**
 * Batch upload for faster deployment
 */
export const deployFilesToDrive = async (files: File[], folderId: string, accessToken: string, onProgress: (count: number) => void) => {
    const promises = files.map(async (file, index) => {
        const result = await uploadFileToDrive(file, folderId, accessToken);
        onProgress(index + 1);
        return result;
    });
    return Promise.all(promises);
};

export const getProjectFilesFromDrive = async (folderId: string, accessToken: string) => {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(id,name,webViewLink)`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    return await response.json();
};
