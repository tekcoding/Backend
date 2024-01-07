
const getDateIST = () => {
    const totalSec = Date.now()+(5*60*60 + 30*60)*1000;
    const date = new Date(totalSec);
    return date;
}

export default getDateIST;