//src/features/profile/events.js

window.Prioritab = window.Prioritab || {};
window.Prioritab.profile = window.Prioritab.profile || {};

window.Prioritab.profile.events = (() => {
  const setProfileMessage = (message, isError = false) => {
    const messageElement =
      document.querySelector('#profile-message');

    if (!messageElement) {
      throw new Error(
        'Required profile element #profile-message was not found.'
      );
    }

    messageElement.textContent = message;
    messageElement.dataset.status =
      isError ? 'error' : 'success';
  };

  const bindProfileEvents = ({
    exportProfile,
    importProfile,
    validateProfile,
  }) => {
    const exportButton =
      document.querySelector('#export-profile-button');

    const importButton =
      document.querySelector('#import-profile-button');

    const importFileInput =
      document.querySelector('#import-profile-input');

    if (!exportButton) {
      throw new Error(
        'Required profile element #export-profile-button was not found.'
      );
    }

    if (!importButton) {
      throw new Error(
        'Required profile element #import-profile-button was not found.'
      );
    }

    if (!importFileInput) {
      throw new Error(
        'Required profile element #import-profile-input was not found.'
      );
    }

    exportButton.addEventListener('click', () => {
      exportProfile();
      setProfileMessage('Profile exported.');
    });

    importButton.addEventListener('click', () => {
      importFileInput.click();
    });

    importFileInput.addEventListener('change', () => {
      const file = importFileInput.files[0];

      if (!file) {
        return;
      }

      const reader = new FileReader();

      reader.addEventListener('load', () => {
        try {
          const profile = JSON.parse(reader.result);

          const validationResult =
            validateProfile(profile);

          if (!validationResult.valid) {
            setProfileMessage(
              validationResult.error,
              true
            );

            return;
          }

          const confirmed = window.confirm(
            'Importing this profile will replace your current Priority Tab tasks and settings. Continue?'
          );

          if (!confirmed) {
            setProfileMessage('Profile import cancelled.');
            return;
          }

          setProfileMessage('Importing profile...');

          importProfile(
            profile,

            () => {
              setProfileMessage(
                'Profile imported successfully. Reloading...'
              );

              window.location.reload();
            },

            (error) => {
              console.error(
                'Profile import failed:',
                error
              );

              setProfileMessage(
                'Profile import failed.',
                true
              );
            }
          );
        }
        catch (error) {
          console.error(
            'Could not parse profile:',
            error
          );

          setProfileMessage(
            'Could not parse this JSON file.',
            true
          );
        }
        finally {
          importFileInput.value = '';
        }
      });

      reader.readAsText(file);
    });
  };

  return {
    bindProfileEvents,
  };
})();
