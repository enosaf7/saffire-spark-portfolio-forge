
import AuthFormContainer from './AuthFormContainer';

// This file acts as a bridge to maintain backward compatibility
// with existing imports that use AuthForm
const AuthForm = () => {
  return <AuthFormContainer />;
};

export default AuthForm;
