const SENHA_ADMIN = process.env.ADMIN_SENHA || 'admin123';

function verificarAuth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token || token !== `Bearer ${SENHA_ADMIN}`) {
    return res.status(401).json({ erro: 'Acesso não autorizado' });
  }
  next();
}
module.exports = { verificarAuth };