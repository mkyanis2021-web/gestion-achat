require('dotenv').config();
const bcrypt = require('bcryptjs');
const {
  sequelize, Role, Department, User, Fournisseur, Projet,
  Phase, Step, EventType, Jalon, Parameter,
} = require('../models');

async function run() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connecté à MySQL');

    await sequelize.sync({ alter: true });
    console.log('✅ Tables synchronisées');

    const roles = await Role.bulkCreate([
      { code: 'ADMIN_TECH', libelle: 'Administrateur technique' },
      { code: 'ADMIN_FONC', libelle: 'Administrateur fonctionnel' },
      { code: 'AGENT', libelle: "Agent d'achat" },
      { code: 'CHEF_SERVICE', libelle: 'Chef de service' },
      { code: 'CHEF_DEPT', libelle: 'Chef de département' },
      { code: 'DIRECTEUR', libelle: 'Directeur / Chef de division' },
      { code: 'LECTEUR', libelle: 'Lecteur' },
    ], { ignoreDuplicates: true, returning: true });
    console.log('✅ Rôles');

    const departments = await Department.bulkCreate([
      { code: 'APPRO_INT', libelle: 'Appro International' },
      { code: 'APPRO_LOCAL', libelle: 'Appro Local' },
      { code: 'MOYENS_GEN', libelle: 'Moyens Généraux' },
    ], { ignoreDuplicates: true, returning: true });
    console.log('✅ Départements');

    const phases = await Phase.bulkCreate([
      { code: 'ELABORATION', libelle: '① Élaboration', ordre: 1 },
      { code: 'EXECUTION', libelle: '② Exécution', ordre: 2 },
      { code: 'LIVRE', libelle: '③ Livré', ordre: 3 },
    ], { ignoreDuplicates: true, returning: true });
    console.log('✅ Phases');

    await EventType.bulkCreate([
      { code: 'AVANCEMENT', libelle: 'Avancement', couleur: '#22c55e' },
      { code: 'PROBLEME', libelle: 'Problème', couleur: '#ef4444' },
      { code: 'RELANCE', libelle: 'Relance', couleur: '#f59e0b' },
      { code: 'ATTENTE', libelle: 'Attente', couleur: '#6b7280' },
      { code: 'PHASE_FINALE', libelle: 'Phase Finale', couleur: '#3b82f6' },
    ], { ignoreDuplicates: true });
    console.log('✅ Types événement');

    await Jalon.bulkCreate([
      { code: 'EMISSION_BC', libelle: 'Émission du BC' },
      { code: 'EMISSION_CONTRAT', libelle: 'Émission du contrat' },
      { code: 'RECEPTION_DEMANDE', libelle: 'Réception de la demande' },
      { code: 'LIVRAISON', libelle: 'Livraison' },
    ], { ignoreDuplicates: true });
    console.log('✅ Jalons');

    await Parameter.bulkCreate([
      { key: 'OBJECTIF_ELABORATION_JOURS', value: '30', description: 'Objectif élaboration' },
      { key: 'SEUIL_JAUNE_JOURS', value: '7', description: 'Seuil jaune→rouge' },
      { key: 'PRE_ALERTE_PCT', value: '80', description: 'Pré-alerte %' },
      { key: 'RETARD_SEVERE_JOURS', value: '30', description: 'Retard sévère' },
      { key: 'INACTIVITE_FAIBLE_JOURS', value: '7', description: 'Inactivité faible' },
      { key: 'INACTIVITE_FORTE_JOURS', value: '14', description: 'Inactivité forte' },
      { key: 'PROBLEMES_FAIBLE', value: '1', description: 'Seuil problèmes faible' },
      { key: 'PROBLEMES_FORT', value: '3', description: 'Seuil problèmes fort' },
    ], { ignoreDuplicates: true });
    console.log('✅ Paramètres');

    const elab = phases.find(p => p.code === 'ELABORATION').id;
    const exec = phases.find(p => p.code === 'EXECUTION').id;
    const stepsData = [
      [1, 'Réception de la demande', elab, 'Saisir la date de courrier ou de mail'],
      [2, 'Consultation des fournisseurs', elab, null],
      [3, 'Envoi de lettre de consultation', elab, null],
      [4, 'Jour du dépôt de la consultation', elab, null],
      [5, 'Ouverture des plis', elab, null],
      [6, "Réception du PV d'évaluation de la commission CSO", elab, null],
      [7, 'Élaboration du contrat', elab, null],
      [8, 'Signature des achats', elab, null],
      [9, 'Signature de contrôle de gestion', elab, null],
      [10, 'Signature de la division', elab, null],
      [11, 'Signature de la DG', elab, null],
      [12, 'Émission du BC / Notification du contrat', elab, 'Fin phase ①'],
      [13, 'Prédomiciliation', exec, null],
      [14, 'Ouverture LC', exec, null],
      [15, 'Domiciliation bancaire', exec, null],
      [16, 'Documents', exec, null],
      [17, 'Paiement', exec, null],
      [18, 'Suivi fournisseur', exec, null],
      [19, 'Livraison des équipements', exec, 'Fin phase ②'],
      [null, 'Établissement BC', null, 'Étape complémentaire'],
      [null, "Équipement en cours d'envoi", null, 'Étape complémentaire'],
    ];
    if ((await Step.count()) === 0) {
      await Step.bulkCreate(stepsData.map(s => ({
        numero: s[0], libelle: s[1], phase_id: s[2], consigne: s[3],
      })));
    }
    console.log('✅ Étapes');

    await Fournisseur.bulkCreate([
      { nom: 'Siemens' }, { nom: 'Schneider Electric' },
      { nom: 'ABB' }, { nom: 'Legrand' },
    ], { ignoreDuplicates: true });
    await Projet.bulkCreate([
      { nom: 'Projet Alpha' }, { nom: 'Projet Beta' }, { nom: 'Projet Gamma' },
    ], { ignoreDuplicates: true });
    console.log('✅ Fournisseurs + Projets');

    const adminRole = roles.find(r => r.code === 'ADMIN_TECH');
    const agentRole = roles.find(r => r.code === 'AGENT');
    const approInt = departments.find(d => d.code === 'APPRO_INT');

    if (!(await User.findOne({ where: { email: 'admin@appro.dz' } }))) {
      await User.create({
        email: 'admin@appro.dz',
        password_hash: await bcrypt.hash('Admin@123', 10),
        nom: 'Admin', prenom: 'Système',
        role_id: adminRole.id, department_id: approInt.id,
      });
    }
    if (!(await User.findOne({ where: { email: 'agent@appro.dz' } }))) {
      await User.create({
        email: 'agent@appro.dz',
        password_hash: await bcrypt.hash('Agent@123', 10),
        nom: 'Benali', prenom: 'Karim',
        role_id: agentRole.id, department_id: approInt.id,
      });
    }

    console.log('\n🎉 Seed terminé !');
    console.log('  Admin : admin@appro.dz / Admin@123');
    console.log('  Agent : agent@appro.dz / Agent@123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur seed :', err);
    process.exit(1);
  }
}

run();