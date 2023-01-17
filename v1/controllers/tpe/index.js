const { 
  SignUp,
  SignIn,
  ForgotPassword,
  ResetPassword,
  IdentityDocuments,
  VerifyStatus,
  getDocuments,
  SendEMAILActivationCode,
  ActivationCode,
  ResendResetPasswordCode,
  ResendSMSActivationCode,
  ResendEMAILActivationCode,
  PasswordVerificationCode
 } = require('./auth')

const { UpdatePasswrod, CompanyDocs, CollaboratorDocs, getCollaborators } = require('./administration')

const { getFinanceDocuments, addFinanceDoc,getTransaction,getBanks,addBank,getJournal } = require('./finance')

module.exports = {
  SignUp,
  SignIn,
  ForgotPassword,
  ResetPassword,
  IdentityDocuments,
  VerifyStatus,
  getDocuments,
  ActivationCode,
  SendEMAILActivationCode,
  ResendResetPasswordCode,
  ResendSMSActivationCode,
  ResendEMAILActivationCode,
  PasswordVerificationCode,
  getFinanceDocuments,
  addFinanceDoc,
  UpdatePasswrod,
  CompanyDocs,
  getTransaction,
  getBanks,
  addBank,
  CollaboratorDocs,
  getCollaborators,
  getJournal
}