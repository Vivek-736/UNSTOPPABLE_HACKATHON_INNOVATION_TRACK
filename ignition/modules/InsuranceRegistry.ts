// eslint-disable-next-line @typescript-eslint/no-require-imports
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
module.exports = buildModule("InsuranceRegistry", (m: any) => {
  const blockPass = m.contract("InsuranceRegistry");
  return { blockPass };
});