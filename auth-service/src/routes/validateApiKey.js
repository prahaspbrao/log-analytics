const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (req, res) => {
  const { apiKey } = req.body;

  if (!apiKey) {
    return res.status(400).json({ valid: false });
  }

  const key = await prisma.apiKey.findUnique({
    where: { apiKey }
  });

  if (!key || !key.isActive) {
    return res.status(401).json({ valid: false });
  }

  res.json({
    valid: true,
    serviceName: key.serviceName
  });
};
