export const emailRe = /^.+@.+\..+$/;

// Validating URLs with regular expressions is a fool's errand, it's too complicated.
// That said, for the purposes of this demo it's ok to do some very limited checks:
// accept something like https://foo/bar
export const urlRe = /^https:\/\/.+\/.+$/;

export const inputCls = error =>
  `form-control form-control-lg ${error ? 'is-invalid' : 'is-valid'}`;

export const haveErrors = ({ errors, serverErrors }) => {
  if (serverErrors && Object.values(serverErrors).length > 0) {
    return true;
  }

  // errors object contains properties keyed by field name so we cannot just check for
  // object being empty. Need to look into the values.
  for (const error of Object.values(errors)) {
    if (error) {
      return true;
    }
  }

  return false;
};
