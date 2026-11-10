const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('Role', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  libelle: { type: DataTypes.STRING(100), allowNull: false },
  description: DataTypes.TEXT,
}, { tableName: 'roles' });

const Department = sequelize.define('Department', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  libelle: { type: DataTypes.STRING(150), allowNull: false },
  actif: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'departments' });

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING(150), unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  nom: { type: DataTypes.STRING(100), allowNull: false },
  prenom: { type: DataTypes.STRING(100), allowNull: false },
  role_id: { type: DataTypes.INTEGER, allowNull: false },
  department_id: DataTypes.INTEGER,
  actif: { type: DataTypes.BOOLEAN, defaultValue: true },
  last_login_at: DataTypes.DATE,
}, { tableName: 'users' });

const Fournisseur = sequelize.define('Fournisseur', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING(255), allowNull: false },
  code: DataTypes.STRING(50),
  actif: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'fournisseurs' });

const Projet = sequelize.define('Projet', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING(255), allowNull: false },
  code: DataTypes.STRING(50),
  actif: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'projets' });

const BcContrat = sequelize.define('BcContrat', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  numero: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  type_contrat: DataTypes.ENUM('CONTRAT_A_COMMANDE', 'CONTRAT_FERME', 'CONTRAT_EN_PREPARATION'),
  date_creation: DataTypes.DATEONLY,
}, { tableName: 'bc_contrats' });

const Phase = sequelize.define('Phase', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code: { type: DataTypes.ENUM('ELABORATION', 'EXECUTION', 'LIVRE'), unique: true, allowNull: false },
  libelle: { type: DataTypes.STRING(50), allowNull: false },
  ordre: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'phases' });

const Step = sequelize.define('Step', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  numero: DataTypes.INTEGER,
  libelle: { type: DataTypes.STRING(200), allowNull: false },
  phase_id: DataTypes.INTEGER,
  consigne: DataTypes.TEXT,
  department_id: DataTypes.INTEGER,
  actif: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'steps' });

const EventType = sequelize.define('EventType', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code: { type: DataTypes.ENUM('AVANCEMENT', 'PROBLEME', 'RELANCE', 'ATTENTE', 'PHASE_FINALE'), unique: true, allowNull: false },
  libelle: { type: DataTypes.STRING(50), allowNull: false },
  couleur: DataTypes.STRING(20),
}, { tableName: 'event_types' });

const Jalon = sequelize.define('Jalon', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  libelle: { type: DataTypes.STRING(200), allowNull: false },
}, { tableName: 'jalons' });

const Parameter = sequelize.define('Parameter', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  key: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  value: { type: DataTypes.STRING(255), allowNull: false },
  description: DataTypes.STRING(255),
}, { tableName: 'parameters' });

const Dossier = sequelize.define('Dossier', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  reference: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  department_id: { type: DataTypes.INTEGER, allowNull: false },
  bc_contrat_id: DataTypes.INTEGER,
  type_dossier: DataTypes.ENUM('BON_DE_COMMANDE', 'CONTRAT_SANS_BC', 'CONTRAT_EN_PREPARATION'),
  equipement: DataTypes.STRING(255),
  fournisseur_id: DataTypes.INTEGER,
  projet_id: DataTypes.INTEGER,
  anciennes_references: DataTypes.TEXT,
  type_reception: DataTypes.ENUM('COURRIER', 'MAIL', 'COURRIER_ET_MAIL'),
  date_courrier: DataTypes.DATEONLY,
  date_mail: DataTypes.DATEONLY,
  date_emission: DataTypes.DATEONLY,
  delai_fournisseur_jours: DataTypes.INTEGER,
  statut_saisi: DataTypes.ENUM('CONTRAT_EN_PREPARATION', 'EN_COURS', 'EN_TRANSIT', 'EN_DOUANE', 'BLOQUE', 'LIVRE', 'CLOTURE'),
  date_livraison_reelle: DataTypes.DATEONLY,
  observations: DataTypes.TEXT,
  date_signature_client: DataTypes.DATEONLY,
  delai_contractuel_client: DataTypes.INTEGER,
  archived_at: DataTypes.DATE,
  archive_motif: DataTypes.TEXT,
  created_by: DataTypes.INTEGER,
}, {
  tableName: 'dossiers',
  indexes: [
    { fields: ['department_id'] },
    { fields: ['statut_saisi'] },
    { fields: ['fournisseur_id'] },
  ],
});

const Event = sequelize.define('Event', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  dossier_id: { type: DataTypes.INTEGER, allowNull: false },
  date_event: { type: DataTypes.DATEONLY, allowNull: false },
  step_id: DataTypes.INTEGER,
  event_type_id: { type: DataTypes.INTEGER, allowNull: false },
  intervenant: DataTypes.STRING(150),
  detail: { type: DataTypes.TEXT, allowNull: false },
  probleme_impact: DataTypes.TEXT,
  jalon_id: DataTypes.INTEGER,
  created_by: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'events' });

const Action = sequelize.define('Action', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  dossier_id: { type: DataTypes.INTEGER, allowNull: false },
  event_id: DataTypes.INTEGER,
  description: { type: DataTypes.TEXT, allowNull: false },
  responsable_id: { type: DataTypes.INTEGER, allowNull: false },
  date_echeance: { type: DataTypes.DATEONLY, allowNull: false },
  date_realisation: DataTypes.DATEONLY,
  statut: { type: DataTypes.ENUM('A_FAIRE', 'EN_COURS', 'FAITE'), defaultValue: 'A_FAIRE' },
  observations: DataTypes.TEXT,
  origine: DataTypes.STRING(100),
  closed_by: DataTypes.INTEGER,
}, { tableName: 'actions' });

const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: DataTypes.INTEGER,
  entity_type: { type: DataTypes.STRING(50), allowNull: false },
  entity_id: DataTypes.INTEGER,
  action: { type: DataTypes.STRING(50), allowNull: false },
  old_values: DataTypes.JSON,
  new_values: DataTypes.JSON,
  ip_address: DataTypes.STRING(45),
}, { tableName: 'audit_logs', updatedAt: false });

const ImportBatch = sequelize.define('ImportBatch', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  filename: { type: DataTypes.STRING(255), allowNull: false },
  status: { type: DataTypes.ENUM('PREVIEW', 'COMMITTED', 'FAILED'), defaultValue: 'PREVIEW' },
  report_json: DataTypes.JSON,
  rows_imported: { type: DataTypes.INTEGER, defaultValue: 0 },
  rows_rejected: { type: DataTypes.INTEGER, defaultValue: 0 },
  created_by: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'import_batches', updatedAt: false });

Department.hasMany(User, { foreignKey: 'department_id' });
User.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

Department.hasMany(Dossier, { foreignKey: 'department_id' });
Dossier.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });

Dossier.belongsTo(BcContrat, { foreignKey: 'bc_contrat_id', as: 'bcContrat' });
BcContrat.hasMany(Dossier, { foreignKey: 'bc_contrat_id', as: 'dossiers' });

Dossier.belongsTo(Fournisseur, { foreignKey: 'fournisseur_id', as: 'fournisseur' });
Dossier.belongsTo(Projet, { foreignKey: 'projet_id', as: 'projet' });
Dossier.belongsTo(User, { foreignKey: 'created_by', as: 'createur' });

Dossier.hasMany(Event, { foreignKey: 'dossier_id', as: 'events' });
Event.belongsTo(Dossier, { foreignKey: 'dossier_id' });
Event.belongsTo(Step, { foreignKey: 'step_id', as: 'step' });
Event.belongsTo(EventType, { foreignKey: 'event_type_id', as: 'eventType' });
Event.belongsTo(Jalon, { foreignKey: 'jalon_id', as: 'jalon' });
Event.belongsTo(User, { foreignKey: 'created_by', as: 'auteur' });

Dossier.hasMany(Action, { foreignKey: 'dossier_id', as: 'actions' });
Action.belongsTo(Dossier, { foreignKey: 'dossier_id' });
Action.belongsTo(Event, { foreignKey: 'event_id', as: 'sourceEvent' });
Action.belongsTo(User, { foreignKey: 'responsable_id', as: 'responsable' });
Action.belongsTo(User, { foreignKey: 'closed_by', as: 'cloturePar' });

Step.belongsTo(Phase, { foreignKey: 'phase_id', as: 'phase' });
Phase.hasMany(Step, { foreignKey: 'phase_id', as: 'steps' });

AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize, Role, Department, User, Fournisseur, Projet, BcContrat,
  Phase, Step, EventType, Jalon, Parameter, Dossier, Event, Action,
  AuditLog, ImportBatch,
};