const logMiddleware = (req,res,next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    next();
}

module.exports = logMiddleware;