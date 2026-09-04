//src/features/profile/index.js

window.Prioritab = window.Prioritab || {};
window.Prioritab.profile = window.Prioritab.profile || {};

window.Prioritab.profile.index = (() => {
  const init = () => {
    const { exportProfile, importProfile } = window.Prioritab.profile.actions;
    const { validateProfile } = window.Prioritab.profile.validation;
    const { bindProfileEvents } = window.Prioritab.profile.events;

    bindProfileEvents({
      exportProfile,
      importProfile,
      validateProfile,
    });
  };

  return {
    init,
  };
})();
