const { AuditLog } = require('../models');

async function logAudit(user_id, entity_type, entity_id, action, old_values, new_values, ip_address) {
  try {
    await AuditLog.create({
      user_id, entity_type, entity_id, action,
      old_values: old_values || null,
      new_values: new_values || null,
      ip_address: ip_address || null,
    });
  } catch (e) {
    console.error('Audit log error:', e.message);
  }
}

module.exports = { logAudit };