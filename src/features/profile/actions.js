//src/features/profile/actions.js

window.Prioritab = window.Prioritab || {};
window.Prioritab.profile = window.Prioritab.profile || {};

window.Prioritab.profile.actions = (() => {
  const PROFILE_MAGIC = 'PRIORITAB_PROFILE';
  const PROFILE_SCHEMA_VERSION = 1;

  const downloadProfile = (profile) => {
    const json = JSON.stringify(profile, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = 'priority-tab-profile.json';

    document.body.append(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  };

  const exportProfile = () => {
    const browser = window.browser ?? window.chrome;

    browser.storage.sync.get(null, (syncStorage) => {
      browser.storage.local.get(null, (localStorage) => {
        const profile = {
          magic: PROFILE_MAGIC,
          schemaVersion: PROFILE_SCHEMA_VERSION,
          exportedAt: new Date().toISOString(),

          storage: {
            sync: syncStorage,
            local: localStorage,
          },
        };

        console.log("profile", profile)
        downloadProfile(profile);
      });
    });
  };

  const importProfile = (profile, onComplete, onError) => {
    const browser = window.browser ?? window.chrome;

    browser.storage.sync.clear(() => {
      if (browser.runtime.lastError) {
        onError(browser.runtime.lastError);
        return;
      }

      browser.storage.sync.set(profile.storage.sync, () => {
        if (browser.runtime.lastError) {
          onError(browser.runtime.lastError);
          return;
        }

        browser.storage.local.clear(() => {
          if (browser.runtime.lastError) {
            onError(browser.runtime.lastError);
            return;
          }

          browser.storage.local.set(profile.storage.local, () => {
            if (browser.runtime.lastError) {
              onError(browser.runtime.lastError);
              return;
            }

            onComplete();
          });
        });
      });
    });
  };

  return {
    PROFILE_MAGIC,
    PROFILE_SCHEMA_VERSION,
    exportProfile,
    importProfile,
  };
})();
