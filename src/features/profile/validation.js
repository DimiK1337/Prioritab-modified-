//src/features/profile/validation.js

window.Prioritab = window.Prioritab || {};
window.Prioritab.profile = window.Prioritab.profile || {};

window.Prioritab.profile.validation = (() => {
  const isPlainObject = (value) => {
    return (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value)
    );
  };

  const validateProfile = (profile) => {
    const {
      PROFILE_MAGIC,
      PROFILE_SCHEMA_VERSION,
    } = window.Prioritab.profile.actions;

    if (!isPlainObject(profile)) {
      return {
        valid: false,
        error: 'Profile must be a JSON object.',
      };
    }

    if (profile.magic !== PROFILE_MAGIC) {
      return {
        valid: false,
        error: 'This is not a Priority Tab profile.',
      };
    }

    if (profile.schemaVersion !== PROFILE_SCHEMA_VERSION) {
      return {
        valid: false,
        error: `Unsupported profile version: ${profile.schemaVersion}`,
      };
    }

    if (!isPlainObject(profile.storage)) {
      return {
        valid: false,
        error: 'Profile is missing its storage object.',
      };
    }

    if (!isPlainObject(profile.storage.sync)) {
      return {
        valid: false,
        error: 'Profile storage.sync must be an object.',
      };
    }

    if (!isPlainObject(profile.storage.local)) {
      return {
        valid: false,
        error: 'Profile storage.local must be an object.',
      };
    }

    return {
      valid: true,
      error: null,
    };
  };

  return {
    validateProfile,
  };
})();
