const VALID_IMAGE_FILE_MIME_TYPE = "image";
const VALID_IMAGE_FILE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

const VALID_VIDEO_FILE_MIME_TYPE = "video";
const VALID_VIDEO_FILE_EXTENSIONS = ["mkv", "mp4", "x-matroska"];
const EMPTY_STRING = "";

const MAXIMUM_IMAGE_FILE_SIZE = 2 * 1024 * 1024;

function getFileExtension(file) {
    if (!file) {
        return EMPTY_STRING;
    }

    // The mime type will look like: image/png, then split the "/"
    // we take the last item in the split result.
    const mimeTypeSplit = file.type.split("/");
    const fileExtension = mimeTypeSplit[mimeTypeSplit.length - 1];

    return fileExtension;
}

function isImageFile(file) {
    if (!file) {
        return false;
    }

    const mimeType = file.type;

    if (!mimeType.includes(VALID_IMAGE_FILE_MIME_TYPE)) {
        return false;
    }

    const fileExtension = getFileExtension(file);

    if (VALID_IMAGE_FILE_EXTENSIONS.includes(fileExtension)) {
        return true;
    }

    return false;
}

function isVideoFile(file) {
    if (!file) {
        return false;
    }

    const mimeType = file.type;

    if (!mimeType.includes(VALID_VIDEO_FILE_MIME_TYPE)) {
        return false;
    }

    const fileExtension = getFileExtension(file);

    if (VALID_VIDEO_FILE_EXTENSIONS.includes(fileExtension)) {
        return true;
    }

    return false;
}

function isImageFileExceedMaximumSize(imageFile, maximumFileSize) {
    if (maximumFileSize) {
        return imageFile.size > maximumFileSize;
    }

    return imageFile.size > MAXIMUM_IMAGE_FILE_SIZE;
}

function asFile(file) {
    return file;
}

function asFiles(files) {
    return files;
}

const FileHelper = {
    getFileExtension: getFileExtension,
    isImageFile: isImageFile,
    isVideoFile,
    isImageFileExceedMaximumSize: isImageFileExceedMaximumSize,
    asFile: asFile,
    asFiles: asFiles,
};

export { FileHelper };