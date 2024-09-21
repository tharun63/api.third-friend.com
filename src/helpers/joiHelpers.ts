
import dataFormatConstants from "../constants/dataFormatConstants"
import { CustomError } from "../interfaces/customError"

const stringErrorHandler = (errors, label?, message?, refKey?) => {
  
  errors.forEach(err => {
    switch (err.type) {
      case 'any.empty':
        err.message = `"${label || err.path}" is Required!`
        break
      case 'any.required':
        err.message = `"${label || err.path}" is Required!`
        break
      case 'string.base':
        err.message = `Invalid "${label || err.path}"`
        break
      case 'string.email':
        err.message = `Invalid "${label || err.path}"`
        break
      case 'string.min':
        err.message = `"${label || err.path}" length must be at least ${err.context.limit} characters long`
        break
      case 'string.max':
        err.message = `${label || err.path} length should be less than or equal to ${err.context.limit}`
        break
      case 'string.regex.base':
        err.message = `Invalid "${label || err.path}"`
        err.type = 'string.InvalidFormat'
        break
      case 'date.isoDate':
        err.message = `Invalid date format of "${label || err.path}"`
        break
      case 'date.less':
        err.message = `"${label || err.path}" not be a Future Date`
        break
      case 'any.allowOnly':
        err.message = `${label} is not valid`
        break;
      case 'any.invalid':
        err.message = `${label} is not valid`
        if (message) {
          err.message = message
        }
        if (err.path == 'new_password' && refKey == 'current_password') {
          err.message = 'New Password and Current Password should not same'
        }
        break;
      case 'object.min':
        err.message = `${label} is Required!`
        break;
      default:
        break
    }
  })
  return errors
}

const numberErrorHandler = (errors, label?) => {
  errors.forEach(err => {
    switch (err.type) {
      case 'any.empty':
        err.message = `"${label || err.path}" is Required!`
        break
      case 'any.required':
        err.message = `"${label || err.path}" is Required!`
        break
      case 'number.base':
        err.message = `${label || err.path} should be a valid Number.`
        break
      case 'number.integer':
        err.message = `${label || err.path} should be a valid Integer.`
        break
      case 'number.infinity':
        err.message = `.${label || err.path} should be a finite Number.`
        break
      case 'number.greater':
        err.message = `${label || err.path} should be greater than ${err.context.limit}`
        break
      case 'number.less':
        err.message = `${label || err.path} should be less than ${err.context.limit}`
        break
      case 'number.max':
        err.message = `${label || err.path} should be less than or equal to ${err.context.limit}`
        break
      case 'number.min':
        err.message = `${label || err.path} should be greater than or equal to ${err.context.limit}`
        break
      case 'number.multiple':
        err.message = `${label || err.path} should be multiple of ${err.context.multiple}`
        break
      case 'number.precision':
        err.message = `${label || err.path} should have ${err.context.limit} precision.`
        break
      case 'number.negative':
        err.message = `${label || err.path} should be a Negative Number.`
        break
      case 'number.positive':
        err.message = `${label || err.path} should be a Positive Number.`
        break
      case 'number.port':
        err.message = `${err.path} should be a port number.`
        break
      case 'number.unsafe':
        err.message = `${label || err.path} is not within the safe range of JavaScript numbers.`
        break
      default:
        break
    }
  })
  return errors
}



const objectErrorHandler = (errors, label?) => {
  errors.forEach(err => {
    switch (err.type) {
      case 'any.empty':
        err.message = `"${err.path}" is Required!`
        break
      case 'any.required':
        err.message = `"${err.path}" is Required!`
        break
      default:
        break;
    }
  })
}

const nandErrorHandler = errors => {
  errors.forEach(err => {
    switch (err.type) {
      case 'object.nand':
        err.message = `"${err.context.main}" Should not be used along with ${err.context.peers}!`
        break
      default:
        break
    }
  })
  return errors
}

function objectId(Joi) {
  if (!(Joi && Joi.isJoi)) {
    throw new Error('Joi Object Must be passed')
  }
  return function objectId() {
    const ObjectIdPattern = /^[0-9a-fA-F]{24}$/
    return Joi.string().regex(ObjectIdPattern)
  }
};

function time(Joi) {
  if (!(Joi && Joi.isJoi)) {
    throw new Error('Joi Object Must be passed')
  }
  return function time() {
    const timeRegex = /^([0-1]\d|2[0-3])?[0-3]\d?:[0-5]\d$/
    return Joi.string().regex(timeRegex).error(errors => {
      errors.forEach(err => {
        switch (err.type) {
          case 'any.empty':
            err.message = `"${err.path}" is Required!`
            break
          case 'any.required':
            err.message = `"${err.path}" is Required!`
            break
          case 'string.base':
            err.message = `Invalid value of "${err.path}"`
            break
          case 'string.regex.base':
            err.message = `Invalid value of ${err.path}. ${err.context.key} should be in HH:mm format.`
            err.type = 'string.InvalidFormat'
            break
          default:
            break
        }
      })
      return errors
    })
  }
}
function name(Joi) {
  if (!(Joi && Joi.isJoi)) {
    throw new Error('Joi Object Must be passed')
  }
  return function name() {
    const nameRegex = dataFormatConstants.NAME_REGEX
    return Joi.string().regex(nameRegex).error(errors => {
      errors.forEach(err => {
        switch (err.type) {
          case 'any.empty':
            err.message = `"${err.path}" is Required!`
            break
          case 'any.required':
            err.message = `"${err.path}" is Required!`
            break
          case 'string.base':
            err.message = `Invalid value of "${err.path}"`
            break
          case 'string.regex.base':
            err.message = `Invalid Entry!.${err.path} Can contain only Alphabets & Spaces`
            err.type = 'string.InvalidFormat'
            break
          default:
            break
        }
      })
      return errors
    })
  }
}

function email(Joi) {
  if (!(Joi && Joi.isJoi)) {
    throw new Error('Joi Object Must be passed')
  }

  return function email() {
    return Joi.string().email({ minDomainAtoms: 2 }).lowercase().required().error(errors => {
      errors.forEach(err => {
        switch (err.type) {
          case 'any.empty':
            err.message = 'Email is Mandatory!'
            break
          case 'any.required':
            err.message = 'Email is Mandatory!'
            break
          case 'string.email':
            err.message = 'Invalid Email'
            break
          default:
            break
        }
      })
      return errors
    })
  }
}

const dateErrorHandler = (errors, label, dependentFieldLabel = "") => {
  errors.forEach(err => {
    switch (err.type) {
      case 'any.empty':
        err.message = (label || err.path) + ' is Required!'
        break
      case 'any.required':
        err.message = (label || err.path) + ' is Required!'
        break
      case 'date.min':
        err.message = (label || err.path) + ' is should not before ' + dependentFieldLabel
        break
      case 'date.max':
        err.message = (label || err.path) + ' is should not after ' + dependentFieldLabel
        break
      default:
        err.message = "Invalid " + (label || err.path)

        break
    }
  })
  return errors
}


const arrayErrorHandler = (errors, label?, required = false) => {
  errors.forEach(err => {
    switch (err.type) {
      case 'any.empty':
        err.message = `${label || err.path}  are Required!`
        break
      case 'any.required':
        err.message = `${label || err.path} are Required!`
        break
      case 'array.min':
        if (required) {
          err.message = `${label || err.path} is Required!`
        } else {
          err.message = `${label || err.path} are Required!`
        }
        break
      case 'array.max':
        if (required) {
          err.message = `${label || err.path} maximum limit reached!`
        } else {
          err.message = `${label || err.path} maximum limit reached!`
        }
        break
      case 'string.regex.base':
        err.message = `Invalid "${label || err.path}"`
        err.type = 'string.InvalidFormat'
        break
      default:
        err.message = `Invalid  ${label || err.path}!`
        break
    }
  })
  return errors
}

const booleanErrorHandler = (errors, label?) => {
  errors.forEach((err) => {
    switch (err.type) {
      case 'any.empty':
        err.message = `"${label || err.path}" is Required!`;
        break;
      case 'any.required':
        err.message = `"${label || err.path}" is Required!`;
        break;
      default:
        err.message = `Invalid "${label || err.path}"`;
        break;
    }
  });
  return errors;
};

const refErrorHandler = (errors, label?, refKey?) => {
  errors.forEach((err) => {
    switch (err.type) {
      case 'any.empty':
        err.message = `"${label || err.path}" is Required!`;
        break;
      case 'any.required':
        err.message = `"${label || err.path}" is Required!`;
        break;
      case 'any.allowOnly':
        err.message = `"${label || err.path}" must be same as ${refKey}!`;
        break;
      default:
        err.message = `Invalid "${label || err.path}"`;
        break;
    }
  });
  return errors;
};

const checkListMandatoryError = (checkList) => {
  const err = new CustomError()
  err.message = 'Please select any one of the options.'
  err.status = 422
  err.errorCode = 'SELECT_ANY_ONE_OPTION'
  let detailsMap = {

  }
  if (checkList.length < 1) {
    let error = {
      key: 'toxicology_ereq_form',
      message: 'Please selcect one of the details',
      type: 'Required',
      path: 'toxicology_ereq_form'
    }
    detailsMap['toxicology_ereq_form'] = error;
    err.errors = {
      original: checkList,
      details: Object.values(detailsMap)
    }
    throw err;
  }
}




const duplicateResourceError = (body, key, message) => {

  // wa are matching 422 error with JOI Error response

  const err = new CustomError()
  err.message = message
  err.status = 422
  err.errorCode = 'DUPLICATE_RESOURCE'
  let errorDetailsMap: any = {
  }


  let errObject = {
    key,
    message,
    type: 'duplicate',
    path: key
  }
  errorDetailsMap[key] = errObject;

  err.errors = {
    original: body,
    details: Object.values(errorDetailsMap)
  }
  return err
}



export {
  stringErrorHandler,
  numberErrorHandler,
  objectId,
  time,
  email,
  name,
  nandErrorHandler,
  dateErrorHandler,
  arrayErrorHandler,
  objectErrorHandler,
  booleanErrorHandler,
  refErrorHandler,
  checkListMandatoryError,
  duplicateResourceError
}
