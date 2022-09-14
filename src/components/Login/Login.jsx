import React from 'react';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import auth from '../../firebase.init';
import Spinner from '../Spinner/Spinner';
const Login = () => {
  const [signInWithGoogle, gUser, gLoading, gError] = useSignInWithGoogle(auth);
  const { register, formState: { errors }, handleSubmit } = useForm();
  const [
    signInWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(auth);
  let navigate = useNavigate();
  let location = useLocation();
  let from = location.state?.from?.pathname || "/";
  const onSubmit = (data) => {
    console.log(data)
    signInWithEmailAndPassword(data.email, data.password);
  };
  if (gUser || user) {
    navigate(from, { replace: true });
  }
  if( gLoading || loading){
    return <Spinner></Spinner>
  }

  let signInError;
  if (error || gError) {
    if (error.code === 'auth/user-not-found') {
      signInError = <p className=' text-center pb-2 text-red-500'><small>User not Found!</small></p>
    }
    else
    signInError = <p className=' text-red-500'><small>{error?.message || gError?.message}</small></p>
    
  }
  return (
    <div className=' h-screen flex justify-center items-center'>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body ">
          <h2 className=" card-title justify-center">Log In</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* email field */}
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full max-w-xs"
                {...register("email", {
                  required: {
                    value: true,
                    message: ' Email is required*'
                  },
                  pattern: {
                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message:' Enter valid email'
                  }
                })}

              />
              <label className="label">
                {errors.email?.type === 'required' && <span className="label-text-alt text-red-500">{errors.email.message}</span>}
                {errors.email?.type === 'pattern' && <span className="label-text-alt text-red-500">{errors.email.message}</span>}
              </label>
            </div>
            {/* password field */}
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered w-full max-w-xs"
                {...register("password", {
                  required: {
                    value: true,
                    message: ' password is required*'
                  },
                  minLength: {
                    value: 6,
                    message:' Minimum 6 character needed*'
                  }
                })}

              />
              <label className="label">
                {errors.password?.type === 'required' && <span className="label-text-alt text-red-500">{errors.password.message}</span>}
                {errors.password?.type === 'minLength' && <span className="label-text-alt text-red-500">{errors.password.message}</span>}
              </label>
              </div>
              {signInError}
            <input
              className=' btn  w-full' type="submit" />
          </form>
          <p className=' text-center'><small>Haven't registered yet? <Link className=' text-success ' to='/signup' >Sign up here</Link></small></p>
          <div className="divider">OR</div>
          <button
            onClick={()=> signInWithGoogle()}
            className="btn btn-outline">CONTINUE WITH GOOGLE</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
