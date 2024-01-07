import ImageKit from "imagekit";
import CONFIG from "../utils/config.js";

const certificate_folder = CONFIG.IK_CERTFICATE_FOLDER
const imagekit = new ImageKit({
    publicKey: CONFIG.IK_PUBLIC_KEY,
    privateKey: CONFIG.IK_PRIVATE_KEY,
    urlEndpoint: `https://ik.imagekit.io/${CONFIG.IK_NAME}/`
});

const uploadCertificate = async (image, id, year, month) => {
    const result = await new Promise((resolve, reject) => {
        imagekit.upload({
            file: image,
            fileName: `${id}.jpg`,
            folder: `${certificate_folder}/${year}/${month}/`
        }, (error, result) => {
            if (error) {
                reject(new Error("Image Upload Failed!"));
            } else {
                resolve(result);
            }
        });
    });

    if (result.error) {
        throw new Error("Image Upload Failed!");
    } else {
        return result.url;
    }
}

export default uploadCertificate;