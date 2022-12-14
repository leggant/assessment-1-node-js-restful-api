export default function mwUser(req, res, next) {
  console.log("hit mwUser");
  return next();
}
