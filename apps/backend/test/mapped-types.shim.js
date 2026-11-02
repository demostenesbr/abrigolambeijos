// @nestjs/mapped-types v12 is ESM-only (uses import.meta), which Jest's CommonJS runtime cannot load.
// Update DTOs only need inheritance for unit tests, so a minimal stand-in is enough.
const inherit = (Base) => class extends Base {};

module.exports = {
  PartialType: inherit,
  PickType: inherit,
  OmitType: inherit,
  IntersectionType: (A) => class extends A {},
};
