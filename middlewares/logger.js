//Membuat logger sederhana
//menangani error 404

const log = (req, res, next) => {
    console.log(new Date().toLocaleDateString(), " => ", req.method, req.originalUrl)
    next();
}

module.exports = log;
