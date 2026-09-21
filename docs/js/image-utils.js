// Shared by every page that lets a user upload a photo (edit-account, create-event, index).
// Resizes the image down to maxDimension on its longest side and re-encodes it as a
// JPEG at the given quality before it's stored as base64 - phone photos can be several
// MB, which easily blows past localStorage's ~5-10MB quota once a few are saved.
function compressImage(file, maxDimension = 1024, quality = 0.75) {
    return new Promise((resolve) => {
        if (!file) return resolve(null)

        const objectUrl = URL.createObjectURL(file)
        const img = new Image()

        img.onload = () => {
            let { width, height } = img
            if (width > maxDimension || height > maxDimension) {
                if (width > height) {
                    height = Math.round(height * (maxDimension / width))
                    width = maxDimension
                } else {
                    width = Math.round(width * (maxDimension / height))
                    height = maxDimension
                }
            }

            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            canvas.getContext('2d').drawImage(img, 0, 0, width, height)

            URL.revokeObjectURL(objectUrl)
            resolve(canvas.toDataURL('image/jpeg', quality))
        }

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl)
            resolve(null)
        }

        img.src = objectUrl
    })
}
