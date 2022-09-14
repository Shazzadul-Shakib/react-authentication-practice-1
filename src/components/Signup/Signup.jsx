import React from 'react';
import { useCreateUserWithEmailAndPassword, useSignInWithGoogle, useUpdateProfile } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import auth from '../../firebase.init';
import Spinner from '../Spinner/Spinner';

const Signup = () => {
  const [signInWithGoogle, gUser, gLoading, gError] = useSignInWithGoogle(auth);
  const { register, formState: { errors }, handleSubmit } = useForm();
  const [
    createUserWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useCreateUserWithEmailAndPassword(auth);
  const [updateProfile, updating, upError] = useUpdateProfile(auth);
  const navigate = useNavigate();

  const onSubmit = async data => {
    await createUserWithEmailAndPassword(data.email, data.password);
    await updateProfile({ displayName : data.name});
    console.log('Updated profile');
    navigate('/special');
  };
  if (gUser || user) {
     console.log(user || gUser);
  }
  if( gLoading || loading || updating ){
    return <Spinner></Spinner>
  }

  let signUpError;
  if (error || gError || upError) {
    if (error.code === 'auth/user-not-found') {
      signUpError = <p className=' text-center pb-2 text-red-500'><small>User not Found!</small></p>
    }
    else
    signUpError = <p className=' text-red-500'><small>{error?.message || gError?.message}</small></p>
    
  }
  return (
    <div className=' h-screen flex justify-center items-center'>
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body ">
        <h2 className=" card-title justify-center">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* email field */}
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">User Name</span>
              </label>
            <input
              type="name"
              placeholder="Enter your name"
              className="input input-bordered w-full max-w-xs"
              {...register("name", {
                required: {
                  value: true,
                  message: ' Name is required*'
                }
              })}

            />
            <label className="label">
              {errors.name?.type === 'required' && <span className="label-text-alt text-red-500">{errors.name.message}</span>}
            </label>
          </div>
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
            {signUpError}
          <input
            className=' btn  w-full' type="submit" value='Sign Up' />
        </form>
        <p className=' text-center'><small>Already have an account? <Link className=' text-success ' to='/login' >Please login here</Link></small></p>
        <div className="divider">OR</div>
        <button
          onClick={()=> signInWithGoogle()}
          className="btn btn-outline">CONTINUE WITH GOOGLE</button>
      </div>
    </div>
  </div>
  );
};

export default Signup;