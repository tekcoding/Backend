import CONFIG from "../utils/config.js";
import { connect } from "../../db/mongodb.js";

const certificateCollection = CONFIG.CERTIFICATE_COLLECTION;

export const getCertificate = async (req, res) => {
    const {certId} = req.params;
    const { db } = await connect();
    try {
        const cert = await db.collection(certificateCollection).findOne({ "courseDetails.certificateID": certId });
        if(cert){
            return res.status(200).json({success:true, data: {courseDetails: cert.courseDetails, userName: cert.userName}});
        }
        return res.status(200).json({ success: false, message: "Certificate not exist!"});
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}