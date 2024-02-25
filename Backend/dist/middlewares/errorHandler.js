export default (err, req, res, next) => {
    const errStatus = err.statusCode || 500;
    let errMsg = err.message || "Something went wrong";
    if (err.name === "CastError")
        errMsg = "Invalid Id";
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        error: errMsg,
    });
};
